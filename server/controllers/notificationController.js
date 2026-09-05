const Notification = require('../models/Notification');

const getMyNotifications = async (req, res) => {
  try {
    const notes = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50);
    const unread = notes.filter((n) => !n.read).length;
    res.json({ notifications: notes, unread });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const markRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id }, { read: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createNotification = async (req, res) => {
  try {
    const note = await Notification.create({
      userId: req.body.userId,
      title: req.body.title,
      message: req.body.message || '',
      type: req.body.type || 'system',
    });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getMyNotifications, markRead, createNotification };
