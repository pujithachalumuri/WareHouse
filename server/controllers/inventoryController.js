const Inventory = require('../models/Inventory');

const getMyInventory = async (req, res) => {
  try {
    const items = await Inventory.find({ customerId: req.user._id }).populate('warehouseId', 'name location');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createItem = async (req, res) => {
  try {
    const item = await Inventory.create({
      customerId: req.user._id,
      warehouseId: req.body.warehouseId,
      productName: req.body.productName,
      sku: req.body.sku || '',
      category: req.body.category || '',
      quantity: req.body.quantity || 0,
      rack: req.body.rack || '',
      expiryDate: req.body.expiryDate || null,
      lowStockThreshold: req.body.lowStockThreshold || 0,
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.customerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const allowed = ['productName', 'sku', 'category', 'quantity', 'rack', 'expiryDate', 'warehouseId', 'lowStockThreshold'];
    allowed.forEach((f) => {
      if (req.body[f] !== undefined) item[f] = req.body[f];
    });
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.customerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await item.deleteOne();
    res.json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getMyInventory, createItem, updateItem, deleteItem };
