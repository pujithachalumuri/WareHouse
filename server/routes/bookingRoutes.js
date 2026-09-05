const express = require('express');
const {
  createBooking, getMyBookings, getOwnerBookings, getBookingById, updateBookingStatus, recordPayment, togglePaid, requestPaid,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const { requireDb } = require('../utils/requireDb');
const router = express.Router();

router.post('/', protect, requireDb(createBooking));
router.get('/mine', protect, requireDb(getMyBookings));
router.get('/owner', protect, requireDb(getOwnerBookings));
router.post('/:id/pay', protect, requireDb(recordPayment));
router.put('/:id/request-paid', protect, requireDb(requestPaid));
router.put('/:id/paid', protect, requireDb(togglePaid));
router.put('/:id/status', protect, requireDb(updateBookingStatus));
router.get('/:id', protect, requireDb(getBookingById));

module.exports = router;
