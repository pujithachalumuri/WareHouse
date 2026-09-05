require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const warehouseRoutes = require('./routes/warehouseRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const accessRoutes = require('./routes/accessRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const adminRoutes = require('./routes/adminRoutes');

const { PORT, MONGO_URI } = require('./config');

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', dbConfigured: !!MONGO_URI && !MONGO_URI.includes('USERNAME') }));

app.use('/api/auth', authRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/access', accessRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Not found' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Server error' });
});

const start = async () => {
  if (!MONGO_URI || MONGO_URI.includes('USERNAME')) {
    console.warn('\n==================================================');
    console.warn(' WARNING: MONGO_URI is not configured.');
    console.warn(' The server will start, but database features require MongoDB.');
    console.warn(' 1) Create a free cluster at https://www.mongodb.com/cloud/atlas');
    console.warn(' 2) Copy server/.env.example to server/.env');
    console.warn(' 3) Fill in your MONGO_URI connection string.');
    console.warn(' 4) Restart the server.');
    console.warn('==================================================\n');
    app.listen(PORT, () => console.log(`API listening on port ${PORT} (DB not connected)`));
    return;
  }

  // Retry the database connection until it succeeds (Atlas can be flaky on some networks).
  let attempts = 0;
  while (mongoose.connection.readyState !== 1) {
    attempts++;
    try {
      await connectDB();
      break;
    } catch (err) {
      console.error(`Database connection attempt ${attempts} failed:`, err.message);
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
  app.listen(PORT, () => console.log(`API listening on port ${PORT} (DB connected)`));
};

if (require.main === module) {
  start();
}

module.exports = app;
