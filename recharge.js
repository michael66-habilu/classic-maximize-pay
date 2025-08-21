const express = require('express');
const router = express.Router();

// Mock recharge requests
const rechargeRequests = [];
let requestIdCounter = 1;

// @route   POST api/recharge
// @desc    Create recharge request
// @access  Public
router.post('/', (req, res) => {
    try {
        const { amount, method, transactionId } = req.body;
        
        if (!amount || !method || !transactionId) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        const request = {
            id: requestIdCounter++,
            amount,
            method,
            transactionId,
            status: 'pending',
            createdAt: new Date()
        };
        
        rechargeRequests.push(request);
        
        res.json({
            message: 'Recharge request submitted successfully',
            request
        });
        
    } catch (error) {
        console.error('Recharge error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET api/recharge/history
// @desc    Get recharge history
// @access  Public
router.get('/history', (req, res) => {
    res.json({
        count: rechargeRequests.length,
        requests: rechargeRequests
    });
});

module.exports = router;