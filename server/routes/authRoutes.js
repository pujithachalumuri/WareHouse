const express = require('express');
const {
  register, login, getMe, updateProfile, validate,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { requireDb } = require('../utils/requireDb');
const router = express.Router();

router.post('/register', requireDb(register));
router.post('/login', requireDb(login));
router.get('/me', protect, requireDb(getMe));
router.put('/profile', protect, requireDb(updateProfile));
router.post('/validate', requireDb(validate));

module.exports = router;
