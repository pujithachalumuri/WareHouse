const Review = require('../models/Review');
const Warehouse = require('../models/Warehouse');

const createReview = async (req, res) => {
  try {
    const { warehouseId, vendorId, security, cleanliness, accessibility, facilities, overall, comment, targetType } = req.body;
    const rating = {
      security: Number(security) || 0,
      cleanliness: Number(cleanliness) || 0,
      accessibility: Number(accessibility) || 0,
      facilities: Number(facilities) || 0,
      overall: Number(overall) || 0,
    };
    const review = await Review.create({
      reviewerId: req.user._id,
      revieweeId: vendorId || null,
      warehouseId,
      targetType: targetType || 'warehouse',
      ...rating,
      comment: comment || '',
    });
    if (targetType !== 'customer') {
      // update warehouse rating
      const all = await Review.find({ warehouseId, targetType: 'warehouse' });
      const avg = all.length ? all.reduce((s, r) => s + r.overall, 0) / all.length : rating.overall;
      const wh = await Warehouse.findById(warehouseId);
      if (wh) {
        wh.rating = Math.round(avg * 10) / 10;
        wh.ratingCount = all.length;
        await wh.save();
      }
    }
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getReviewsForWarehouse = async (req, res) => {
  try {
    const reviews = await Review.find({ warehouseId: req.params.id, targetType: 'warehouse' })
      .populate('reviewerId', 'name profileImage');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createReview, getReviewsForWarehouse };
