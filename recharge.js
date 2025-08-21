const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const RechargeRequest = require('../models/RechargeRequest');
const { check, validationResult } = require('express-validator');

// @route   POST api/recharge
// @desc    Create recharge request
// @access  Private
router.post('/', [
    auth,
    [
        check('amount', 'Amount is required').isNumeric(),
        check('method', 'Payment method is required').not().isEmpty(),
        check('transactionId', 'Transaction ID is required').not().isEmpty()
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { amount, method, transactionId } = req.body;

    try {
        // Create recharge request
        const rechargeRequest = new RechargeRequest({
            user: req.user.id,
            amount,
            method,
            transactionId
        });

        await rechargeRequest.save();

        res.json(rechargeRequest);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET api/recharge/history
// @desc    Get user's recharge history
// @access  Private
router.get('/history', auth, async (req, res) => {
    try {
        const rechargeHistory = await RechargeRequest.find({ user: req.user.id })
            .sort({ createdAt: -1 });

        res.json(rechargeHistory);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;