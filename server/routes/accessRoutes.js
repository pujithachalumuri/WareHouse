const express = require('express');
const { verifyAccess, getMyAccessLogs } = require('../controllers/accessController');
const { protect } = require('../middleware/auth');
const { requireDb } = require('../utils/requireDb');
const router = express.Router();

router.post('/verify', protect, requireDb(verifyAccess));
router.get('/logs', protect, requireDb(getMyAccessLogs));

module.exports = router;
