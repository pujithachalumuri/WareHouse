const express = require('express');
const {
  register, login, googleLogin, getMe, updateProfile, validate,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { requireDb } = require('../utils/requireDb');
const router = express.Router();

router.post('/register', requireDb(register));
router.post('/login', requireDb(login));
router.post('/google', requireDb(googleLogin));
router.get('/me', protect, requireDb(getMe));
router.put('/profile', protect, requireDb(updateProfile));
router.post('/validate', requireDb(validate));

module.exports = router;
