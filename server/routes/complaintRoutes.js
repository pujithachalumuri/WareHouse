const express = require('express');
const { createComplaint, getMyComplaints } = require('../controllers/complaintController');
const { protect } = require('../middleware/auth');
const { requireDb } = require('../utils/requireDb');
const router = express.Router();

router.post('/', protect, requireDb(createComplaint));
router.get('/mine', protect, requireDb(getMyComplaints));

module.exports = router;
