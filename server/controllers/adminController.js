const User = require('../models/User');
const Warehouse = require('../models/Warehouse');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Complaint = require('../models/Complaint');
const Review = require('../models/Review');

const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const customers = await User.countDocuments({ role: 'customer' });
    const owners = await User.countDocuments({ role: 'owner' });
    const totalWarehouses = await Warehouse.countDocuments();
    const pendingVerification = await Warehouse.countDocuments({ verificationStatus: 'pending' });
    const totalBookings = await Booking.countDocuments();
    const activeBookings = await Booking.countDocuments({ status: 'active' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const payments = await Payment.find({ status: 'completed' });
    const revenue = payments.reduce((s, p) => s + p.amount, 0);
    const warehouses = await Warehouse.find();
    const totalAvailableSpace = warehouses.reduce((s, w) => s + w.availableSpace, 0);
    const totalOccupiedSpace = warehouses.reduce((s, w) => s + (w.totalSpace - w.availableSpace), 0);
    const openComplaints = await Complaint.countDocuments({ status: { $ne: 'resolved' } });
    res.json({
      totalUsers, customers, owners, totalWarehouses, pendingVerification,
      totalBookings, activeBookings, completedBookings, revenue, totalAvailableSpace,
      totalOccupiedSpace, openComplaints, totalReviews: await Review.countDocuments(),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.status = req.body.status || user.status;
    if (req.body.role) user.role = req.body.role;
    await user.save();
    res.json({ ...user.toObject(), password: undefined });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllWarehouses = async (req, res) => {
  try {
    const whs = await Warehouse.find().populate('ownerId', 'name email').sort({ createdAt: -1 });
    res.json(whs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('customerId', 'name email')
      .populate('ownerId', 'name')
      .populate('warehouseId', 'name location')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('customerId', 'name')
      .populate('warehouseId', 'name')
      .populate('bookingId')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateComplaint = async (req, res) => {
  try {
    const c = await Complaint.findById(req.params.id);
    if (!c) return res.status(404).json({ message: 'Complaint not found' });
    c.status = req.body.status || c.status;
    c.resolution = req.body.resolution || '';
    await c.save();
    res.json(c);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('reviewerId', 'name')
      .populate('warehouseId', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getStats, getUsers, updateUserStatus, getAllWarehouses,
  getAllBookings, getAllPayments, getAllComplaints, updateComplaint, getAllReviews,
};
