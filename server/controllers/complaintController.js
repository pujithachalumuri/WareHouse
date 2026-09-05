const Complaint = require('../models/Complaint');

const createComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.create({
      userId: req.user._id,
      customerName: req.user.name,
      subject: req.body.subject,
      description: req.body.description || '',
      relatedTo: req.body.relatedTo || '',
    });
    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createComplaint, getMyComplaints };
