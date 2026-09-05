const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const { faceHash, verifyFace } = require('../utils/faceHash');
const {
  isValidIndianPhone,
  normalizePhone,
  validatePassword,
} = require('../utils/validation');

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

    if (!isValidIndianPhone(phone)) {
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

    let face = {};
    if (faceImage) {
      try {
        const hash = await faceHash(faceImage);
        face = { faceHash: hash, faceImage, faceEnabled: true };
      } catch (err) {
        return res
          .status(400)
          .json({ message: 'Could not read the face photo. Please upload a clear image of your face.', field: 'faceImage' });
      }
    } else {
      return res
        .status(400)
        .json({ message: 'Face verification photo is required for registration.', field: 'faceImage' });
    }

    const user = await User.create({
      name,
      email,
      phone: normalizePhone(phone),
      password,
      role: validRole,
      profileImage: req.body.profileImage || '',
      company: req.body.company || '',
      accountVerified: true,
      ...face,
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
      return res
        .status(401)
        .json({ message: `This account is a ${user.role === 'owner' ? 'Warehouse Owner' : 'Customer'} account. Please use the correct tab.` });
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

module.exports = { register, login, getMe, updateProfile, validate, generateToken };
