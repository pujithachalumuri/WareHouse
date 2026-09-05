const express = require('express');
const { getMyNotifications, markRead, createNotification } = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');
const { requireDb } = require('../utils/requireDb');
const router = express.Router();

router.get('/mine', protect, requireDb(getMyNotifications));
router.put('/read', protect, requireDb(markRead));
router.post('/', protect, requireDb(createNotification));

module.exports = router;
