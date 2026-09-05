const express = require('express');
const {
  getWarehouses, getPublicWarehouses, getMyWarehouses, getWarehouseById,
  createWarehouse, updateWarehouse, verifyWarehouse, deleteWarehouse,
} = require('../controllers/warehouseController');
const { protect, authorize } = require('../middleware/auth');
const { requireDb } = require('../utils/requireDb');
const router = express.Router();

router.get('/public', requireDb(getPublicWarehouses));
router.get('/mine', protect, requireDb(getMyWarehouses));
router.get('/', requireDb(getWarehouses));
router.post('/', protect, authorize('owner', 'admin'), requireDb(createWarehouse));
router.get('/:id', requireDb(getWarehouseById));
router.put('/:id/verify', protect, authorize('admin'), requireDb(verifyWarehouse));
router.put('/:id', protect, requireDb(updateWarehouse));
router.delete('/:id', protect, requireDb(deleteWarehouse));

module.exports = router;
