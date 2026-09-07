const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');
const { JWT_SECRET } = require('../config');
const { faceHash, verifyFace } = require('../utils/faceHash');
const {
  isValidIndianPhone,
  normalizePhone,
  validatePassword,
} = require('../utils/validation');

let googleClient = null;
function getGoogleClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId || clientId.includes('YOUR_')) return null;
  if (!googleClient) googleClient = new OAuth2Client(clientId);
  return googleClient;
}

const generateToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });

const sanitize = (u) => {
  const o = u.toObject();
  delete o.password;
  return o;
};

// @route POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, phone, password, role, faceImage } = req.body;
    const validRole = ['customer', 'owner'].includes(role) ? role : 'customer';

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' });
    }

    if (phone && !isValidIndianPhone(phone)) {
      return res.status(400).json({
        message:
          'Enter a valid Indian phone number: +91 followed by 10 digits, first digit must be 6, 7, 8 or 9.',
        field: 'phone',
      });
    }

    const pwCheck = validatePassword(password);
    if (!pwCheck.valid) {
      return res.status(400).json({ message: pwCheck.message, field: 'password' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email,
      phone: phone ? normalizePhone(phone) : '',
      password,
      role: validRole,
      profileImage: req.body.profileImage || '',
      company: req.body.company || '',
      accountVerified: true,
    });

    res.status(201).json({ user: sanitize(user), token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (user.status === 'blocked') {
      return res.status(403).json({ message: 'Your account has been blocked by the admin' });
    }
    if (role && user.role !== role) {
      const label = user.role === 'owner' ? 'Warehouse Owner' : user.role === 'admin' ? 'Admin' : 'Customer';
      return res
        .status(401)
        .json({ message: `This account is a ${label} account. Please use the correct tab.` });
    }
    const ok = await user.matchPassword(password);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({ user: sanitize(user), token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ user: sanitize(req.user) });
};

// @route PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const fields = ['phone', 'company', 'address', 'businessType', 'bio', 'profileImage', 'name'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) user[f] = req.body[f];
    });
    if (req.body.phone !== undefined && !isValidIndianPhone(req.body.phone)) {
      return res.status(400).json({ message: 'Enter a valid Indian phone number (starts with 6/7/8/9).', field: 'phone' });
    }
    if (req.body.password !== undefined) {
      if (req.body.currentPassword === undefined || !(await user.matchPassword(req.body.currentPassword))) {
        return res.status(400).json({ message: 'Current password is incorrect.', field: 'currentPassword' });
      }
      const pwCheck = validatePassword(req.body.password);
      if (!pwCheck.valid) {
        return res.status(400).json({ message: pwCheck.message, field: 'password' });
      }
      user.password = req.body.password;
    }
    await user.save();
    res.json({ user: sanitize(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/auth/validate
const validate = async (req, res) => {
  const { phone, password } = req.body;
  const result = {};
  if (phone !== undefined) result.phone = isValidIndianPhone(phone);
  if (password !== undefined) result.password = validatePassword(password);
  res.json(result);
};

// @route POST /api/auth/google
const googleLogin = async (req, res) => {
  try {
    const { credential, role, name, email } = req.body;
    const googleClient = getGoogleClient();
    if (!googleClient) {
      return res.status(501).json({ message: 'Google sign-in is not configured yet.' });
    }
    if (!credential) {
      return res.status(400).json({ message: 'Missing Google credential.' });
    }

    let ticket;
    try {
      ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (err) {
      return res.status(401).json({ message: 'Could not verify Google sign-in.' });
    }
    const payload = ticket.getPayload();
    const gEmail = (payload.email || '').toLowerCase();
    if (!gEmail) return res.status(401).json({ message: 'No email returned by Google.' });

    let user = await User.findOne({ email: gEmail });
    const isNew = !user;
    if (!user) {
      const validRole = ['customer', 'owner'].includes(role) ? role : 'customer';
      user = await User.create({
        name: name || payload.name || gEmail.split('@')[0],
        email: gEmail,
        password: crypto.randomBytes(24).toString('hex'),
        phone: '',
        role: validRole,
        profileImage: payload.picture || '',
        company: '',
        accountVerified: true,
        googleId: payload.sub,
      });
    } else {
      if (user.status === 'blocked') {
        return res.status(403).json({ message: 'Your account has been blocked by the admin' });
      }
      if (role && user.role !== role) {
        return res.status(401).json({
          message: `This account is a ${user.role === 'owner' ? 'Warehouse Owner' : 'Customer'} account. Please use the correct tab.`,
        });
      }
      user.googleId = user.googleId || payload.sub;
      if (payload.picture && !user.profileImage) user.profileImage = payload.picture;
      await user.save();
    }

    res.json({ user: sanitize(user), token: generateToken(user._id), isNew });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login, getMe, updateProfile, validate, generateToken, googleLogin };
