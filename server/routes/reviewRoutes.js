const express = require('express');
const { createReview, getReviewsForWarehouse } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const { requireDb } = require('../utils/requireDb');
const router = express.Router();

router.post('/', protect, requireDb(createReview));
router.get('/warehouse/:id', requireDb(getReviewsForWarehouse));

module.exports = router;
