require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Warehouse = require('./models/Warehouse');
const Booking = require('./models/Booking');
const Inventory = require('./models/Inventory');
const Payment = require('./models/Payment');
const Agreement = require('./models/Agreement');
const Review = require('./models/Review');
const AccessLog = require('./models/AccessLog');
const Notification = require('./models/Notification');
const Complaint = require('./models/Complaint');

const IMAGES = {
  w1: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800', 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800'],
  w2: ['https://images.unsplash.com/photo-1553413077-190dd305871c?w=800', 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800'],
  w3: ['https://images.unsplash.com/photo-1553413077-190dd305871c?w=800'],
  w4: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800'],
  w5: ['https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800'],
};

const seed = async () => {
  await connectDB();
  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany(), Warehouse.deleteMany(), Booking.deleteMany(), Inventory.deleteMany(),
    Payment.deleteMany(), Agreement.deleteMany(), Review.deleteMany(), AccessLog.deleteMany(),
    Notification.deleteMany(), Complaint.deleteMany(),
  ]);

  // === USERS ===
  const admin = await User.create({ name: 'Platform Admin', email: 'admin@smartwarehouse.com', password: 'admin123', role: 'admin' });
  const owner1 = await User.create({ name: 'Rakesh Sharma', email: 'owner1@example.com', password: 'owner123', role: 'owner', phone: '+91 98765 43210', company: 'Sharma Logistics', accountVerified: true });
  const owner2 = await User.create({ name: 'Priya Patel', email: 'owner2@example.com', password: 'owner123', role: 'owner', phone: '+91 91234 56780', company: 'Patel Storage Hub', accountVerified: true });
  const owner3 = await User.create({ name: 'Amit Verma', email: 'owner3@example.com', password: 'owner123', role: 'owner', company: 'Verma Cold Chain' });
  const customer1 = await User.create({ name: 'Rohan Mehta', email: 'customer1@example.com', password: 'customer123', role: 'customer', company: 'Mehta E-Store' });
  const customer2 = await User.create({ name: 'Neha Gupta', email: 'customer2@example.com', password: 'customer123', role: 'customer', company: 'Gupta Retail' });
  const customer3 = await User.create({ name: 'Vikram Singh', email: 'customer3@example.com', password: 'customer123', role: 'customer', company: 'Singh Essentials' });

  console.log('Users created. Demo logins:');
  console.log('  Admin:    admin@smartwarehouse.com / admin123');
  console.log('  Owner:    owner1@example.com / owner123');
  console.log('  Customer: customer1@example.com / customer123');

  // === WAREHOUSES ===
  const w1 = await Warehouse.create({
    ownerId: owner1._id, name: 'Warehouse A - Bhiwandi Hub', location: 'Bhiwandi, Maharashtra',
    address: 'Plot 12, MIDC Bhiwandi', description: 'Large dry storage warehouse with excess capacity. Owner uses 7,000 of 10,000 sq.ft, listing the remaining 3,000 sq.ft.',
    totalSpace: 10000, availableSpace: 3000, price: 20, minimumDuration: 1,
    storageType: 'Dry Storage', warehouseType: 'Partial',
    facilities: ['CCTV', 'Parking', 'Loading/Unloading', 'Electricity', '24/7 Access'],
    security: ['24/7 Security Guard', 'CCTV Surveillance', 'Biometric Access'],
    images: IMAGES.w1, rating: 4.5, ratingCount: 8, verificationStatus: 'verified', status: 'active',
  });
  const w2 = await Warehouse.create({
    ownerId: owner2._id, name: 'Warehouse B - Peenya Storage', location: 'Peenya, Bengaluru',
    address: 'Sector 4, Peenya Industrial Area', description: 'Flexible warehouse space in Bengaluru. Ideal for e-commerce sellers and SMEs.',
    totalSpace: 5000, availableSpace: 2500, price: 25, minimumDuration: 1,
    storageType: 'Dry Storage', warehouseType: 'Shared',
    facilities: ['CCTV', 'Parking', 'Electricity', '24/7 Access'],
    security: ['CCTV Surveillance', 'Access Control', 'Fire Safety'],
    images: IMAGES.w2, rating: 4.2, ratingCount: 5, verificationStatus: 'verified', status: 'active',
  });
  const w3 = await Warehouse.create({
    ownerId: owner3._id, name: 'Warehouse C - Cold Chamber', location: 'Vile Parle, Mumbai',
    address: 'Unit 8, Vile Parle East', description: 'Controlled temperature storage for perishables.',
    totalSpace: 3000, availableSpace: 800, price: 60, minimumDuration: 2,
    storageType: 'Cold Storage', warehouseType: 'Partial',
    facilities: ['CCTV', 'Electricity', 'Refrigeration'],
    security: ['24/7 Security Guard', 'CCTV Surveillance', 'Temperature Monitoring'],
    images: IMAGES.w3, rating: 4.8, ratingCount: 6, verificationStatus: 'verified', status: 'active',
  });
  const w4 = await Warehouse.create({
    ownerId: owner1._id, name: 'Warehouse D - Gurugram Yard', location: 'Gurugram, Haryana',
    address: 'NH-8 Industrial Corridor', description: 'Open yard storage with high-capacity space for bulk goods.',
    totalSpace: 20000, availableSpace: 12000, price: 8, minimumDuration: 1,
    storageType: 'Open Yard', warehouseType: 'Full',
    facilities: ['Parking', 'Loading/Unloading'],
    security: ['Perimeter Fencing', 'Security Guard'],
    images: IMAGES.w4, rating: 3.9, ratingCount: 4, verificationStatus: 'pending', status: 'active',
  });
  const w5 = await Warehouse.create({
    ownerId: owner2._id, name: 'Warehouse E - Noida Tech Storage', location: 'Noida, Uttar Pradesh',
    address: 'Sector 62', description: 'Secure vault-style storage for high-value inventory.',
    totalSpace: 4000, availableSpace: 1200, price: 40, minimumDuration: 3,
    storageType: 'Secure Vault', warehouseType: 'Multi-tenant',
    facilities: ['CCTV', 'Electricity', '24/7 Access', 'Climate Control'],
    security: ['Biometric Access', 'CCTV Surveillance', '24/7 Guards', 'Alarm System'],
    images: IMAGES.w5, rating: 4.9, ratingCount: 9, verificationStatus: 'verified', status: 'active',
  });

  // === BOOKINGS ===
  const startToday = new Date();
  const start = new Date(startToday);
  start.setMonth(start.getMonth() - 1);
  const end = new Date(startToday);
  end.setMonth(end.getMonth() + 1);

  const b1 = await Booking.create({
    customerId: customer1._id, warehouseId: w1._id, ownerId: owner1._id,
    spaceRequired: 500, startDate: start, endDate: end,
    spaceRent: 20000, deposit: 2000, platformFee: 1000, totalAmount: 23000,
    status: 'active', agreementGenerated: true, paymentStatus: 'paid',
  });
  const b2 = await Booking.create({
    customerId: customer2._id, warehouseId: w2._id, ownerId: owner2._id,
    spaceRequired: 1000, startDate: start, endDate: end,
    spaceRent: 50000, deposit: 5000, platformFee: 2500, totalAmount: 57500,
    status: 'pending', agreementGenerated: false, paymentStatus: 'unpaid',
  });
  const b3 = await Booking.create({
    customerId: customer3._id, warehouseId: w3._id, ownerId: owner3._id,
    spaceRequired: 300, startDate: start, endDate: end,
    spaceRent: 36000, deposit: 3600, platformFee: 1800, totalAmount: 41400,
    status: 'approved', agreementGenerated: true, paymentStatus: 'partial',
  });
  const b4 = await Booking.create({
    customerId: customer1._id, warehouseId: w5._id, ownerId: owner2._id,
    spaceRequired: 200, startDate: new Date(startToday.getTime() - 60 * 86400000), endDate: startToday,
    spaceRent: 24000, deposit: 2400, platformFee: 1200, totalAmount: 27600,
    status: 'completed', agreementGenerated: true, paymentStatus: 'paid',
  });

  // === INVENTORY ===
  await Inventory.create([
    {
      customerId: customer1._id, warehouseId: w1._id, productName: 'Electronics Gadgets', sku: 'ELEC-001',
      category: 'Electronics', quantity: 350, rack: 'A-12', expiryDate: null, lowStockThreshold: 50, createdAt: new Date(),
    },
    {
      customerId: customer1._id, warehouseId: w1._id, productName: 'Apparel Stock', sku: 'APP-045',
      category: 'Fashion', quantity: 120, rack: 'B-03', expiryDate: null, lowStockThreshold: 40, createdAt: new Date(Date.now() - 5 * 86400000),
    },
    {
      customerId: customer2._id, warehouseId: w2._id, productName: 'Packaged Food', sku: 'FOOD-22',
      category: 'Groceries', quantity: 800, rack: 'C-01', expiryDate: new Date(startToday.getTime() + 25 * 86400000), lowStockThreshold: 200, createdAt: new Date(Date.now() - 2 * 86400000),
    },
  ]);

  // === PAYMENTS ===
  await Payment.create([
    { bookingId: b1._id, customerId: customer1._id, warehouseId: w1._id, amount: 23000, type: 'rent', method: 'online', status: 'completed' },
    { bookingId: b3._id, customerId: customer3._id, warehouseId: w3._id, amount: 20000, type: 'rent', method: 'online', status: 'completed' },
  ]);

  // === AGREEMENTS ===
  await Agreement.create({
    bookingId: b1._id, customerId: customer1._id, ownerId: owner1._id, warehouseId: w1._id,
    spaceRented: 500, startDate: start, endDate: end, rent: 20000, deposit: 2000, platformFee: 1000,
    terms: ['Payment of rent is due on the 1st of each month.', 'A security deposit of 10% applies.', 'The owner provides 24/7 access to authorized personnel.', 'Inventory must not exceed the rented space.', 'Either party may terminate with 30 days notice.'],
    signedByCustomer: true, signedByOwner: true, status: 'active',
  });

  // === REVIEWS ===
  await Review.create([
    { reviewerId: customer1._id, revieweeId: owner1._id, warehouseId: w1._id, targetType: 'warehouse', security: 5, cleanliness: 4, accessibility: 4, facilities: 5, overall: 5, comment: 'Great secure warehouse, easy access.' },
    { reviewerId: customer2._id, revieweeId: owner2._id, warehouseId: w2._id, targetType: 'warehouse', security: 4, cleanliness: 4, accessibility: 4, facilities: 4, overall: 4, comment: 'Flexible space, responsive owner.' },
  ]);

  // === ACCESS LOGS ===
  await AccessLog.create([
    { userId: customer1._id, userName: 'Rohan Mehta', warehouseId: w1._id, warehouseName: 'Warehouse A', accessType: 'entry', status: 'granted', method: 'face' },
    { userId: customer1._id, userName: 'Rohan Mehta', warehouseId: w1._id, warehouseName: 'Warehouse A', accessType: 'exit', status: 'granted', method: 'face' },
    { userId: customer2._id, userName: 'Neha Gupta', warehouseId: w2._id, warehouseName: 'Warehouse B', accessType: 'entry', status: 'granted', method: 'qr' },
  ]);

  // === NOTIFICATIONS ===
  await Notification.create([
    { userId: customer1._id, title: 'Booking approved', message: 'Your booking at Warehouse A is now approved.', type: 'booking-approved' },
    { userId: owner1._id, title: 'New booking request', message: 'Neha Gupta requested 1000 sq.ft at Warehouse B.', type: 'booking-request' },
    { userId: customer1._id, title: 'Low stock alert', message: 'Apparel Stock is below its threshold.', type: 'inventory-alert' },
    { userId: customer2._id, title: 'Payment reminder', message: 'Your rent payment for Warehouse B is due soon.', type: 'payment-reminder' },
  ]);

  // === COMPLAINTS ===
  await Complaint.create({
    userId: customer3._id, customerName: 'Vikram Singh', subject: 'Access issue', description: 'Face verification failed twice at the entrance.', relatedTo: 'Warehouse C', status: 'open',
  });

  console.log('\nSeed completed successfully!');
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
