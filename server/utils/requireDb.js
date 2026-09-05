const { isDbConnected } = require('../config/db');

// Wraps a controller to return a friendly 503 when Mongo isn't connected.
const requireDb =
  (handler) =>
  async (req, res, next) => {
    try {
      if (!isDbConnected()) {
        return res
          .status(503)
          .json({ message: 'Database not connected. Configure MONGO_URI in server/.env and run "npm run seed".', dbOffline: true });
      }
      return await handler(req, res, next);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };

module.exports = { requireDb };
