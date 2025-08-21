module.exports = {
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/classic-maximize-pay',
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
    adminUsername: process.env.ADMIN_USERNAME || 'admin',
    adminPassword: process.env.ADMIN_PASSWORD || 'admin123'
};