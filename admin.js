const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');
const Admin = require('../models/Admin');
const User = require('../models/User');
const RechargeRequest = require('../models/RechargeRequest');
const WithdrawRequest = require('../models/WithdrawRequest');
const { check, validationResult } = require('express-validator');

// @route   POST api/admin/login
// @desc    Admin login
// @access  Public
router.post('/login', [
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
        // Check if admin exists
        let admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create and return JWT
        const payload = {
            admin: {
                id: admin.id
            }
        };

        jwt.sign(
            payload,
            config.jwtSecret,
            { expiresIn: '30d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, admin });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET api/admin/dashboard
// @desc    Get admin dashboard data
// @access  Private (Admin)
router.get('/dashboard', async (req, res) => {
    try {
        // In a real app, you would calculate these from the database
        const dashboardData = {
            totalInvested: 5000000,
            totalWithdrawn: 2000000,
            remainingBalance: 3000000,
            users: [
                { username: 'user1', email: 'user1@example.com', phone: '255123456789', joinedDate: new Date(), status: 'active' },
                { username: 'user2', email: 'user2@example.com', phone: '255987654321', joinedDate: new Date(), status: 'active' }
            ],
            withdrawRequests: [
                { id: '1', username: 'user1', amount: 50000, bank: 'M-PESA', date: new Date(), status: 'pending' },
                { id: '2', username: 'user2', amount: 100000, bank: 'CRDB', date: new Date(), status: 'pending' }
            ],
            rechargeRequests: [
                { id: '1', username: 'user1', amount: 200000, method: 'M-PESA', transactionId: 'TX123456', date: new Date(), status: 'pending' },
                { id: '2', username: 'user2', amount: 300000, method: 'SELCOM', transactionId: 'TX654321', date: new Date(), status: 'pending' }
            ],
            currentTask: 'Share your invitation link with 3 friends today to claim your daily earnings.',
            currentNotification: 'Welcome back! Have a great day investing with us!'
        };

        res.json(dashboardData);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST api/admin/task
// @desc    Update daily task
// @access  Private (Admin)
router.post('/task', [
    check('message', 'Task message is required').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { message } = req.body;

    try {
        // In a real app, you would save this to the database
        res.json({ message: 'Daily task updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST api/admin/notification
// @desc    Update daily notification
// @access  Private (Admin)
router.post('/notification', [
    check('message', 'Notification message is required').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { message } = req.body;

    try {
        // In a real app, you would save this to the database
        res.json({ message: 'Daily notification updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST api/admin/recharge/:id/approve
// @desc    Approve recharge request
// @access  Private (Admin)
router.post('/recharge/:id/approve', async (req, res) => {
    try {
        // In a real app, you would update the request status and user balance
        res.json({ message: 'Recharge request approved successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST api/admin/recharge/:id/reject
// @desc    Reject recharge request
// @access  Private (Admin)
router.post('/recharge/:id/reject', async (req, res) => {
    try {
        // In a real app, you would update the request status
        res.json({ message: 'Recharge request rejected successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE api/admin/recharge/:id
// @desc    Delete recharge request
// @access  Private (Admin)
router.delete('/recharge/:id', async (req, res) => {
    try {
        // In a real app, you would delete the request
        res.json({ message: 'Recharge request deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST api/admin/withdraw/:id/approve
// @desc    Approve withdraw request
// @access  Private (Admin)
router.post('/withdraw/:id/approve', async (req, res) => {
    try {
        // In a real app, you would update the request status and process payment
        res.json({ message: 'Withdraw request approved successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST api/admin/withdraw/:id/reject
// @desc    Reject withdraw request
// @access  Private (Admin)
router.post('/withdraw/:id/reject', async (req, res) => {
    try {
        // In a real app, you would update the request status and refund user balance
        res.json({ message: 'Withdraw request rejected successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE api/admin/withdraw/:id
// @desc    Delete withdraw request
// @access  Private (Admin)
router.delete('/withdraw/:id', async (req, res) => {
    try {
        // In a real app, you would delete the request
        res.json({ message: 'Withdraw request deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;