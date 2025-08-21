require('dotenv').config();

const config = {
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/classic-maximize-pay',
    jwtSecret: process.env.JWT_SECRET || 'fallback_secret_key_change_in_production_2024',
    adminUsername: process.env.ADMIN_USERNAME || 'Malula_04',
    adminPassword: process.env.ADMIN_PASSWORD || 'Deo2024',
    emailUser: process.env.EMAIL_USER || '',
    emailPassword: process.env.EMAIL_PASSWORD || '',
    nodeEnv: process.env.NODE_ENV || 'development'
};

// Validate required environment variables
if (!process.env.MONGO_URI) {
    console.warn('⚠️  MONGO_URI is not set. Using default local database.');
}

if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'fallback_secret_key_change_in_production_2024') {
    console.warn('⚠️  JWT_SECRET is not set or using default. Please set a strong secret in production.');
}

module.exports = config;