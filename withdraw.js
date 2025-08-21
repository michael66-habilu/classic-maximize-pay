const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const WithdrawRequest = require('../models/WithdrawRequest');
const { check, validationResult } = require('express-validator');

// @route   POST api/withdraw
// @desc    Create withdraw request
// @access  Private
router.post('/', [
    auth,
    [
        check('amount', 'Amount is required').isNumeric(),
        check('bankInfo', 'Bank information is required').exists()
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { amount, bankInfo } = req.body;

    try {
        // Check user balance
        const user = await User.findById(req.user.id);
        if (user.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        // Create withdraw request
        const withdrawRequest = new WithdrawRequest({
            user: req.user.id,
            amount,
            bankInfo
        });

        await withdrawRequest.save();

        // Deduct from user balance (will be reversed if rejected)
        user.balance -= amount;
        await user.save();

        res.json(withdrawRequest);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET api/withdraw/history
// @desc    Get user's withdraw history
// @access  Private
router.get('/history', auth, async (req, res) => {
    try {
        const withdrawHistory = await WithdrawRequest.find({ user: req.user.id })
            .sort({ createdAt: -1 });

        res.json(withdrawHistory);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;