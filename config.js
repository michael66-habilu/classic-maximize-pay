require('dotenv').config();

module.exports = {
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/classic-maximize-pay',
    jwtSecret: process.env.JWT_SECRET || 'fallback_secret_key_change_in_production',
    adminUsername: process.env.ADMIN_USERNAME || 'admin',
    adminPassword: process.env.ADMIN_PASSWORD || 'admin123'
};