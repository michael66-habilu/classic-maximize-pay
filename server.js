const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

// Load environment variables
require('dotenv').config();

// Manually create config object
const config = {
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/classic-maximize-pay',
    jwtSecret: process.env.JWT_SECRET || 'fallback_secret_key_change_in_production_2024',
    adminUsername: process.env.ADMIN_USERNAME || 'admin',
    adminPassword: process.env.ADMIN_PASSWORD || 'admin123'
};

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Import and use routes with error handling
try {
    // Auth routes
    const authRoutes = require('./backend/routes/auth');
    app.use('/api/auth', authRoutes);
    console.log('✅ Auth routes loaded successfully');
} catch (error) {
    console.error('❌ Error loading auth routes:', error.message);
}

try {
    // Recharge routes
    const rechargeRoutes = require('./backend/routes/recharge');
    app.use('/api/recharge', rechargeRoutes);
    console.log('✅ Recharge routes loaded successfully');
} catch (error) {
    console.error('❌ Error loading recharge routes:', error.message);
}

try {
    // Withdraw routes
    const withdrawRoutes = require('./backend/routes/withdraw');
    app.use('/api/withdraw', withdrawRoutes);
    console.log('✅ Withdraw routes loaded successfully');
} catch (error) {
    console.error('❌ Error loading withdraw routes:', error.message);
}

try {
    // Investment routes
    const investmentRoutes = require('./backend/routes/investment');
    app.use('/api/investment', investmentRoutes);
    console.log('✅ Investment routes loaded successfully');
} catch (error) {
    console.error('❌ Error loading investment routes:', error.message);
}

try {
    // Affiliate routes
    const affiliateRoutes = require('./backend/routes/affiliate');
    app.use('/api/affiliate', affiliateRoutes);
    console.log('✅ Affiliate routes loaded successfully');
} catch (error) {
    console.error('❌ Error loading affiliate routes:', error.message);
}

try {
    // Admin routes
    const adminRoutes = require('./backend/routes/admin');
    app.use('/api/admin', adminRoutes);
    console.log('✅ Admin routes loaded successfully');
} catch (error) {
    console.error('❌ Error loading admin routes:', error.message);
}

// Serve HTML pages
const htmlPages = [
    '/', '/register', '/login', '/forgot', '/home', '/recharge',
    '/withdraw', '/transaction', '/account', '/investment',
    '/affiliate', '/orders', '/admin'
];

htmlPages.forEach(page => {
    const filePath = page === '/' ? 'index.html' : `${page}.html`;
    
    app.get(page, (req, res) => {
        // Check if file exists
        if (fs.existsSync(path.join(__dirname, filePath))) {
            res.sendFile(path.join(__dirname, filePath));
        } else {
            res.status(404).send('Page not found');
        }
    });
});

console.log('✅ HTML routes configured');

// Database connection
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('✅ MongoDB connected successfully');
})
.catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⚠️  Continuing without database connection');
});

// Basic health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Server error:', err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ message: 'API endpoint not found' });
});

// 404 handler for HTML routes
app.use((req, res) => {
    if (req.url.startsWith('/api/')) {
        res.status(404).json({ message: 'API endpoint not found' });
    } else {
        res.status(404).sendFile(path.join(__dirname, 'index.html'));
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('🚀 Server started successfully');
    console.log(`📍 Port: ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
    console.log('📋 Available pages:');
    htmlPages.forEach(page => {
        console.log(`   ${page} -> ${page === '/' ? 'index.html' : page + '.html'}`);
    });
});

module.exports = app;