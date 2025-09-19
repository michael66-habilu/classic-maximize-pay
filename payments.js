const express = require('express');
const Payment = require('../models/Payment');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create Payment
router.post('/', authMiddleware, async (req, res) => {
  try {
    const payment = new Payment({ ...req.body, userId: req.user._id });
    const saved = await payment.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get User Payments
router.get('/', authMiddleware, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;