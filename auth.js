const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Simple config
const config = {
    jwtSecret: process.env.JWT_SECRET || 'fallback_secret_2024'
};

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { fullName, username, email, phone, password } = req.body;

        console.log('Registration attempt:', { username, email });

        // Validation
        if (!fullName || !username || !email || !phone || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Check if user exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user
        const user = new User({
            fullName,
            username,
            email,
            phone,
            password: hashedPassword,
            referralCode: Math.random().toString(36).substring(2, 10).toUpperCase()
        });

        // Save to database
        await user.save();
        console.log('User saved to database:', user.username);

        // Create JWT token
        const token = jwt.sign(
            { 
                user: {
                    id: user._id,
                    username: user.username
                }
            },
            config.jwtSecret,
            { expiresIn: '30d' }
        );

        // Return success
        res.json({
            success: true,
            message: 'Registration successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                fullName: user.fullName
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error: ' + error.message 
        });
    }
});

// @route   POST api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        console.log('Login attempt:', { username });

        // Validation
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign(
            { 
                user: {
                    id: user._id,
                    username: user.username
                }
            },
            config.jwtSecret,
            { expiresIn: '30d' }
        );

        // Return success
        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                fullName: user.fullName,
                balance: user.balance
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error: ' + error.message 
        });
    }
});

// @route   GET api/auth/check
// @desc    Check if user is logged in
// @access  Public
router.get('/check', async (req, res) => {
    try {
        const token = req.header('x-auth-token');
        
        if (!token) {
            return res.json({ isLoggedIn: false });
        }

        const decoded = jwt.verify(token, config.jwtSecret);
        const user = await User.findById(decoded.user.id).select('-password');
        
        if (!user) {
            return res.json({ isLoggedIn: false });
        }

        res.json({
            isLoggedIn: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                fullName: user.fullName,
                balance: user.balance
            }
        });

    } catch (error) {
        res.json({ isLoggedIn: false });
    }
});

module.exports = router;