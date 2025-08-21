const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('./backend/config');

// Import routes with correct paths
const authRoutes = require('./backend/routes/auth');
const rechargeRoutes = require('./backend/routes/recharge');
const withdrawRoutes = require('./backend/routes/withdraw');
const investmentRoutes = require('./backend/routes/investment');
const affiliateRoutes = require('./backend/routes/affiliate');
const adminRoutes = require('./backend/routes/admin');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Serve HTML files with proper MIME type
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/forgot', (req, res) => {
    res.sendFile(path.join(__dirname, 'forgot.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

app.get('/recharge', (req, res) => {
    res.sendFile(path.join(__dirname, 'recharge.html'));
});

app.get('/withdraw', (req, res) => {
    res.sendFile(path.join(__dirname, 'withdraw.html'));
});

app.get('/transaction', (req, res) => {
    res.sendFile(path.join(__dirname, 'transaction.html'));
});

app.get('/account', (req, res) => {
    res.sendFile(path.join(__dirname, 'account.html'));
});

app.get('/investment', (req, res) => {
    res.sendFile(path.join(__dirname, 'investment.html'));
});

app.get('/affiliate', (req, res) => {
    res.sendFile(path.join(__dirname, 'affiliate.html'));
});

app.get('/orders', (req, res) => {
    res.sendFile(path.join(__dirname, 'orders.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/recharge', rechargeRoutes);
app.use('/api/withdraw', withdrawRoutes);
app.use('/api/investment', investmentRoutes);
app.use('/api/affiliate', affiliateRoutes);
app.use('/api/admin', adminRoutes);

// Database connection
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Frontend available at: http://localhost:${PORT}`);
});

module.exports = app;