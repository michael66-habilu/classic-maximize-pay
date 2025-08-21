const express = require('express');
const router = express.Router();

// Mock withdraw requests
const withdrawRequests = [];
let requestIdCounter = 1;

// @route   POST api/withdraw
// @desc    Create withdraw request
// @access  Public
router.post('/', (req, res) => {
    try {
        const { amount, bankInfo } = req.body;

        if (!amount || !bankInfo) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const request = {
            id: requestIdCounter++,
            amount,
            bankInfo,
            status: 'pending',
            createdAt: new Date()
        };

        withdrawRequests.push(request);

        res.json({
            message: 'Withdraw request submitted successfully',
            request
        });

    } catch (error) {
        console.error('Withdraw error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET api/withdraw/history
// @desc    Get withdraw history
// @access  Public
router.get('/history', (req, res) => {
    res.json({
        count: withdrawRequests.length,
        requests: withdrawRequests
    });
});

module.exports = router;