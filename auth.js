const jwt = require('jsonwebtoken');
const config = require('../config');

// Middleware to verify JWT for regular users
const auth = (req, res, next) => {
    // Get token from header
    const token = req.header('x-auth-token') || req.header('Authorization')?.replace('Bearer ', '');

    // Check if no token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error('Token verification error:', err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Middleware to verify JWT for admin users
const adminAuth = (req, res, next) => {
    // Get token from header
    const token = req.header('x-auth-token') || req.header('Authorization')?.replace('Bearer ', '');

    // Check if no token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        
        // Check if user is admin (you need to implement this check based on your user model)
        if (decoded.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        
        req.admin = decoded.user;
        next();
    } catch (err) {
        console.error('Admin token verification error:', err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = { auth, adminAuth };