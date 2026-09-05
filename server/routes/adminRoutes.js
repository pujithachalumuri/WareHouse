const express = require('express');
const {
  getStats, getUsers, updateUserStatus, getAllWarehouses, getAllBookings,
  getAllPayments, getAllComplaints, updateComplaint, getAllReviews,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const { requireDb } = require('../utils/requireDb');
const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/stats', requireDb(getStats));
router.get('/users', requireDb(getUsers));
router.put('/users/:id', requireDb(updateUserStatus));
router.get('/warehouses', requireDb(getAllWarehouses));
router.get('/bookings', requireDb(getAllBookings));
router.get('/payments', requireDb(getAllPayments));
router.get('/complaints', requireDb(getAllComplaints));
router.put('/complaints/:id', requireDb(updateComplaint));
router.get('/reviews', requireDb(getAllReviews));

module.exports = router;
