const AccessLog = require('../models/AccessLog');
const Warehouse = require('../models/Warehouse');

// Simulated access verification endpoint
const verifyAccess = async (req, res) => {
  try {
    const { warehouseId, accessType } = req.body;
    const wh = warehouseId ? await Warehouse.findById(warehouseId) : null;
    const granted = Math.random() > 0.1; // simulate
    const log = await AccessLog.create({
      userId: req.user._id,
      userName: req.user.name,
      warehouseId: wh ? wh._id : undefined,
      warehouseName: wh ? wh.name : 'Unknown Warehouse',
      accessType: accessType || 'entry',
      status: granted ? 'granted' : 'denied',
      method: 'face',
    });
    res.json({ granted, log });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyAccessLogs = async (req, res) => {
  try {
    let logs;
    if (req.user.role === 'customer') {
      logs = await AccessLog.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50);
    } else if (req.user.role === 'owner') {
      const whs = await Warehouse.find({ ownerId: req.user._id }).select('_id');
      const ids = whs.map((w) => w._id);
      logs = await AccessLog.find({ warehouseId: { $in: ids } }).sort({ createdAt: -1 }).limit(100);
    } else {
      logs = await AccessLog.find().sort({ createdAt: -1 }).limit(200);
    }
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { verifyAccess, getMyAccessLogs };
