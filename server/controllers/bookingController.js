const Booking = require('../models/Booking');
const Warehouse = require('../models/Warehouse');
const User = require('../models/User');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');
const AccessLog = require('../models/AccessLog');
const { PLATFORM_FEE_PERCENT, DEPOSIT_PERCENT } = require('../utils/pricing');

const calculate = (space, price, months) => {
  const spaceRent = space * price * months;
  const deposit = Math.round(spaceRent * (DEPOSIT_PERCENT / 100));
  const platformFee = Math.round(spaceRent * (PLATFORM_FEE_PERCENT / 100));
  return { spaceRent, deposit, platformFee, totalAmount: spaceRent + deposit + platformFee };
};

const logAccess = async ({ userId, userName, warehouseId, warehouseName, accessType }) => {
  await AccessLog.create({
    userId,
    userName,
    warehouseId,
    warehouseName,
    accessType,
    status: 'granted',
    method: 'face',
  });
};

// @route POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { warehouseId, spaceRequired, startDate, endDate } = req.body;
    const wh = await Warehouse.findById(warehouseId);
    if (!wh) return res.status(404).json({ message: 'Warehouse not found' });
    if (spaceRequired > wh.availableSpace) {
      return res.status(400).json({ message: `Requested space (${spaceRequired} sq.ft) exceeds available (${wh.availableSpace})` });
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24 * 30)));
    const pricing = calculate(spaceRequired, wh.price, months);
    const booking = await Booking.create({
      customerId: req.user._id,
      warehouseId: wh._id,
      ownerId: wh.ownerId,
      spaceRequired,
      startDate: start,
      endDate: end,
      ...pricing,
      status: 'pending',
    });
    // reduce available space (reserve)
    wh.availableSpace = Math.max(0, wh.availableSpace - spaceRequired);
    await wh.save();
    // notify owner
    await Notification.create({
      userId: wh.ownerId,
      title: 'New booking request',
      message: `${req.user.name} requested ${spaceRequired} sq.ft at ${wh.name}`,
      type: 'booking-request',
    });
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/bookings/mine  (customer)
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.user._id })
      .populate('warehouseId', 'name location price images')
      .populate('ownerId', 'name phone company');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/bookings/owner  (owner receives requests)
const getOwnerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ ownerId: req.user._id })
      .populate('customerId', 'name phone company profileImage')
      .populate('warehouseId', 'name location price images');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/bookings/:id
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customerId', 'name email phone company profileImage')
      .populate('ownerId', 'name email phone company profileImage')
      .populate('warehouseId');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PUT /api/bookings/:id/status  (owner accept/reject, customer cancel)
const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    const { status } = req.body;
    const activeStatuses = ['approved', 'active', 'completed', 'cancelled', 'rejected'];
    if (!activeStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status' });

    if (status === 'approved' && req.user.role !== 'owner' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only the owner can approve bookings' });
    }
    if (status === 'rejected' && req.user.role !== 'owner' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only the owner can reject bookings' });
    }
    if (status === 'cancelled' && req.user.role !== 'customer' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only the customer can cancel bookings' });
    }

    if (['cancelled', 'rejected'].includes(status)) {
      // restore space
      const wh = await Warehouse.findById(booking.warehouseId);
      if (wh) wh.availableSpace = wh.availableSpace + booking.spaceRequired;
      await wh.save();
    }

    booking.status = status;
    if (status === 'approved' || status === 'active') booking.agreementGenerated = true;
    await booking.save();

    const wh = await Warehouse.findById(booking.warehouseId);
    const whName = wh ? wh.name : 'the warehouse';
    const user = await User.findById(booking.customerId);

    if (status === 'active') {
      await logAccess({ userId: booking.customerId, userName: user?.name || 'Customer', warehouseId: booking.warehouseId, warehouseName: whName, accessType: 'entry' });
    }
    if (status === 'completed') {
      await logAccess({ userId: booking.customerId, userName: user?.name || 'Customer', warehouseId: booking.warehouseId, warehouseName: whName, accessType: 'exit' });
    }

    // notify customer
    await Notification.create({
      userId: booking.customerId,
      title:
        status === 'approved'
          ? 'Booking approved'
          : status === 'rejected'
          ? 'Booking rejected'
          : status === 'cancelled'
          ? 'Booking cancelled'
          : 'Booking updated',
      message: `Your booking at ${whName} is now ${status}`,
      type: status === 'approved' ? 'booking-approved' : status === 'rejected' ? 'booking-rejected' : 'system',
    });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PUT /api/bookings/:id/request-paid  (customer requests to mark as paid)
const requestPaid = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (String(booking.customerId) !== String(req.user._id)) {
      return res.status(403).json({ message: 'You can only request payment for your own bookings' });
    }
    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'This booking is already marked as paid' });
    }
    booking.paidRequested = true;
    booking.paidRequestedAt = new Date();
    await booking.save();
    let whName = booking.warehouseId && booking.warehouseId.name ? booking.warehouseId.name : 'your warehouse';
    if (!booking.warehouseId || !booking.warehouseId.name) {
      const w = await Warehouse.findById(booking.warehouseId);
      if (w) whName = w.name;
    }
    await Notification.create({
      userId: booking.ownerId,
      title: 'Payment confirmation requested',
      message: `${req.user.name} has marked this booking as paid at ${whName}. Please confirm the payment to update it to PAID.`,
      type: 'payment-reminder',
    });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PUT /api/bookings/:id/paid  (owner/admin mark as paid/unpaid)
const togglePaid = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (req.user.role !== 'owner' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only the owner or admin can mark a booking as paid' });
    }
    if (req.user.role === 'owner' && String(booking.ownerId) !== String(req.user._id)) {
      return res.status(403).json({ message: 'You can only update your own bookings' });
    }
    const paid = req.body.paid !== undefined ? !!req.body.paid : booking.paymentStatus !== 'paid';
    booking.paymentStatus = paid ? 'paid' : 'unpaid';
    if (paid) {
      booking.paidRequested = false;
      booking.paidRequestedAt = null;
    }
    if (booking.status === 'approved' && paid) booking.status = 'active';
    await booking.save();
    if (paid && booking.status === 'active') {
      const w = await Warehouse.findById(booking.warehouseId);
      const c = await User.findById(booking.customerId);
      await logAccess({ userId: booking.customerId, userName: c?.name || 'Customer', warehouseId: booking.warehouseId, warehouseName: w?.name || 'the warehouse', accessType: 'entry' });
    }
    // notify customer
    await Notification.create({
      userId: booking.customerId,
      title: paid ? 'Payment confirmed' : 'Payment marked unpaid',
      message: `Your booking payment has been marked as ${paid ? 'PAID ✓' : 'unpaid'} by the owner.`,
      type: 'system',
    });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/bookings/:id/pay  (simulate payment)
const recordPayment = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    const amount = req.body.amount || booking.totalAmount;
    const payment = await Payment.create({
      bookingId: booking._id,
      customerId: booking.customerId,
      warehouseId: booking.warehouseId,
      amount,
      type: req.body.type || 'rent',
      method: req.body.method || 'online',
      status: 'completed',
    });
    booking.paymentStatus = 'paid';
    if (booking.status === 'approved') booking.status = 'active';
    await booking.save();
    if (booking.status === 'active') {
      const w = await Warehouse.findById(booking.warehouseId);
      const c = await User.findById(booking.customerId);
      await logAccess({ userId: booking.customerId, userName: c?.name || 'Customer', warehouseId: booking.warehouseId, warehouseName: w?.name || 'the warehouse', accessType: 'entry' });
    }
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PUT /api/bookings/:id/checkout  (customer/owner/admin mark booking as completed)
const checkoutBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    const isCustomer = String(booking.customerId) === String(req.user._id);
    const isOwner = String(booking.ownerId) === String(req.user._id);
    if (!isCustomer && !isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized for this booking' });
    }
    if (booking.status !== 'active') {
      return res.status(400).json({ message: 'Only active bookings can be checked out' });
    }
    booking.status = 'completed';
    await booking.save();
    const w = await Warehouse.findById(booking.warehouseId);
    if (w) {
      w.availableSpace = Math.min(w.totalSpace, w.availableSpace + booking.spaceRequired);
      await w.save();
    }
    const c = await User.findById(booking.customerId);
    await logAccess({ userId: booking.customerId, userName: c?.name || 'Customer', warehouseId: booking.warehouseId, warehouseName: w?.name || 'the warehouse', accessType: 'exit' });
    await Notification.create({
      userId: isCustomer ? booking.ownerId : booking.customerId,
      title: 'Rental completed',
      message: `The rental of ${w?.name || 'the warehouse'} has been checked out and is now completed.`,
      type: 'system',
    });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  getBookingById,
  updateBookingStatus,
  recordPayment,
  togglePaid,
  requestPaid,
  checkoutBooking,
  calculate,
};
