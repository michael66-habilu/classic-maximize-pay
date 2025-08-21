const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');
const { generateOTP, storeOTP } = require('../utils/otp');
const emailService = require('../utils/email');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', [
    check('fullName', 'Full name is required').not().isEmpty(),
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('phone', 'Phone number is required').not().isEmpty(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, username, email, phone, password } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        user = new User({
            fullName,
            username,
            email,
            phone,
            password
        });

        await user.save();

        // Send welcome email
        emailService.sendWelcome(email, username);

        // Create and return JWT
        const payload = {
            user: {
                id: user.id,
                username: user.username
            }
        };

        jwt.sign(
            payload,
            config.jwtSecret,
            { expiresIn: '30d' },
            (err, token) => {
                if (err) throw err;
                res.json({ 
                    token, 
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        phone: user.phone,
                        fullName: user.fullName
                    } 
                });
            }
        );
    } catch (err) {
        console.error('Registration error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST api/auth/login
// @desc    Login user
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
        // Check if user exists
        let user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create and return JWT
        const payload = {
            user: {
                id: user.id,
                username: user.username
            }
        };

        jwt.sign(
            payload,
            config.jwtSecret,
            { expiresIn: '30d' },
            (err, token) => {
                if (err) throw err;
                res.json({ 
                    token, 
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        phone: user.phone,
                        fullName: user.fullName
                    } 
                });
            }
        );
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST api/auth/forgot-password
// @desc    Forgot password - send OTP
// @access  Public
router.post('/forgot-password', [
    check('username', 'Username is required').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Generate OTP
        const otp = generateOTP();
        
        // Store OTP
        storeOTP(username, otp);

        // Send OTP email
        emailService.sendOTP(user.email, username, otp);

        res.json({ 
            message: 'OTP sent successfully',
            // In production, don't send OTP in response
            otp: config.nodeEnv === 'development' ? otp : undefined 
        });
    } catch (err) {
        console.error('Forgot password error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST api/auth/reset-password
// @desc    Reset password with OTP
// @access  Public
router.post('/reset-password', [
    check('username', 'Username is required').not().isEmpty(),
    check('otp', 'OTP is required').not().isEmpty(),
    check('newPassword', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, otp, newPassword } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Verify OTP (you need to implement this function)
        const otpVerification = require('../utils/otp').verifyOTP(username, otp);
        if (!otpVerification.success) {
            return res.status(400).json({ message: otpVerification.message });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password reset successfully' });
    } catch (err) {
        console.error('Reset password error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;