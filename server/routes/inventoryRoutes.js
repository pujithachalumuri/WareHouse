const express = require('express');
const { getMyInventory, createItem, updateItem, deleteItem } = require('../controllers/inventoryController');
const { protect } = require('../middleware/auth');
const { requireDb } = require('../utils/requireDb');
const router = express.Router();

router.get('/mine', protect, requireDb(getMyInventory));
router.post('/', protect, requireDb(createItem));
router.put('/:id', protect, requireDb(updateItem));
router.delete('/:id', protect, requireDb(deleteItem));

module.exports = router;
