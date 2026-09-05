const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri || uri.includes('USERNAME') || uri === '') {
    throw new Error('MONGO_URI is not configured. Set it in server/.env (see .env.example for Atlas).');
  }
  const conn = await mongoose.connect(uri, {});
  console.log(`MongoDB connected: ${conn.connection.host}`);
  return conn;
};

module.exports = connectDB;

module.exports.isDbConnected = () =>
  mongoose.connection.readyState === 1;
