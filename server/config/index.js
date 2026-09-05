require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || 'smartwarehouse_secret_key_change_me_2026',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
};
