const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');

// @route   GET api/affiliate
// @desc    Get affiliate data
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('referralCode');
        
        // In a real app, you would calculate team counts and earnings
        const affiliateData = {
            referralCode: user.referralCode,
            teamOne: {
                count: 5,
                earnings: 15000
            },
            teamTwo: {
                count: 12,
                earnings: 3600
            },
            teamThree: {
                count: 25,
                earnings: 2500
            }
        };

        res.json(affiliateData);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET api/affiliate/team/:level
// @desc    Get team members by level
// @access  Private
router.get('/team/:level', auth, async (req, res) => {
    try {
        // In a real app, you would query the database for team members
        // This is a simplified version for demo
        const teamMembers = [
            { username: 'user1', phone: '255123456789', joinedDate: new Date() },
            { username: 'user2', phone: '255987654321', joinedDate: new Date() }
        ];

        res.json(teamMembers);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;