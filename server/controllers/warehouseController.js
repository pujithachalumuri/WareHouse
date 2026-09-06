const Warehouse = require('../models/Warehouse');
const Review = require('../models/Review');

// @route GET /api/warehouses ?location,space,price,max,type,security,etc
const getWarehouses = async (req, res) => {
  try {
    const query = { status: 'active' };
    const { location, minSpace, maxPrice, storageType, warehouseType } = req.query;

    if (location) query.location = new RegExp(location, 'i');

    const whs = await Warehouse.find(query)
      .populate('ownerId', 'name email phone company rating')
      .limit(Number(req.query.limit) || 50);

    let result = whs;
    if (minSpace) result = result.filter((w) => w.availableSpace >= Number(minSpace));
    if (maxPrice) result = result.filter((w) => w.price <= Number(maxPrice));
    if (storageType) result = result.filter((w) => w.storageType === storageType);
    if (warehouseType) result = result.filter((w) => w.warehouseType === warehouseType);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/warehouses/public
const getPublicWarehouses = async (req, res) => {
  try {
    const whs = await Warehouse.find({ status: 'active' })
      .populate('ownerId', 'name company')
      .limit(Number(req.query.limit) || 50);
    res.json(whs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/warehouses/mine  (owner's warehouses)
const getMyWarehouses = async (req, res) => {
  try {
    const whs = await Warehouse.find({ ownerId: req.user._id });
    res.json(whs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/warehouses/:id
const getWarehouseById = async (req, res) => {
  try {
    const wh = await Warehouse.findById(req.params.id).populate('ownerId', 'name email phone company profileImage');
    if (!wh) return res.status(404).json({ message: 'Warehouse not found' });
    const reviews = await Review.find({ warehouseId: wh._id, targetType: 'warehouse' })
      .populate('reviewerId', 'name profileImage');
    res.json({ warehouse: wh, reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/warehouses
const createWarehouse = async (req, res) => {
  try {
    const data = req.body;
    if (req.user.role !== 'owner' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only warehouse owners can list warehouses' });
    }
    const wh = await Warehouse.create({
      ownerId: req.user._id,
      name: data.name,
      location: data.location,
      address: data.address || '',
      description: data.description || '',
      totalSpace: data.totalSpace,
      availableSpace: data.availableSpace,
      price: data.price,
      minimumDuration: data.minimumDuration || 1,
      storageType: data.storageType || 'Dry Storage',
      warehouseType: data.warehouseType || 'Partial',
      facilities: data.facilities || [],
      security: data.security || [],
      images: data.images || [],
      verificationStatus: 'verified',
    });
    res.status(201).json(wh);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PUT /api/warehouses/:id
const updateWarehouse = async (req, res) => {
  try {
    const wh = await Warehouse.findById(req.params.id);
    if (!wh) return res.status(404).json({ message: 'Warehouse not found' });
    if (req.user.role !== 'admin' && wh.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this warehouse' });
    }
    const allowed = ['name', 'location', 'address', 'description', 'totalSpace', 'availableSpace', 'price', 'minimumDuration', 'storageType', 'warehouseType', 'facilities', 'security', 'images', 'availableFrom', 'availableTo'];
    allowed.forEach((f) => {
      if (req.body[f] !== undefined) wh[f] = req.body[f];
    });
    await wh.save();
    res.json(wh);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PUT /api/warehouses/:id/verify  (admin)
const verifyWarehouse = async (req, res) => {
  try {
    const wh = await Warehouse.findById(req.params.id);
    if (!wh) return res.status(404).json({ message: 'Warehouse not found' });
    wh.verificationStatus = req.body.verificationStatus || 'verified';
    if (req.body.status) wh.status = req.body.status;
    await wh.save();
    res.json(wh);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route DELETE /api/warehouses/:id
const deleteWarehouse = async (req, res) => {
  try {
    const wh = await Warehouse.findById(req.params.id);
    if (!wh) return res.status(404).json({ message: 'Warehouse not found' });
    if (req.user.role !== 'admin' && wh.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await wh.deleteOne();
    res.json({ message: 'Warehouse removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getWarehouses,
  getPublicWarehouses,
  getMyWarehouses,
  getWarehouseById,
  createWarehouse,
  updateWarehouse,
  verifyWarehouse,
  deleteWarehouse,
};
