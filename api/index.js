const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const mainApp = require('../server');

const dist = path.join(__dirname, '..', 'client', 'dist');
const frontend = express();

if (process.env.SERVE_CLIENT !== 'false') {
  frontend.use(express.static(dist));
  frontend.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(dist, 'index.html'));
    }
    next();
  });
}
frontend.use(mainApp);

let connecting = null;
function ensureDb() {
  if (mongoose.connection.readyState === 1) return Promise.resolve();
  if (!process.env.MONGO_URI) {
    return Promise.reject(new Error('MONGO_URI not configured on Vercel.'));
  }
  if (!connecting) {
    connecting = mongoose
      .connect(process.env.MONGO_URI)
      .then(() => mongoose.connection)
      .catch((err) => {
        connecting = null;
        throw err;
      });
  }
  return connecting;
}

module.exports = async (req, res) => {
  try {
    await ensureDb();
  } catch (err) {
    console.error('DB connect error:', err.message);
    return res.status(500).json({ message: 'Database not connected: ' + (err.message || 'unknown error') });
  }
  frontend(req, res);
};