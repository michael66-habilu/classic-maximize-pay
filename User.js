const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    referralCode: {
        type: String,
        unique: true
    },
    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    bankInfo: {
        name: String,
        phone: String,
        bank: String
    },
    balance: {
        type: Number,
        default: 0
    },
    totalProfit: {
        type: Number,
        default: 0
    },
    dailyEarnings: {
        type: Number,
        default: 0
    },
    weeklyEarnings: {
        type: Number,
        default: 0
    },
    monthlyEarnings: {
        type: Number,
        default: 0
    },
    yearlyEarnings: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        
        // Generate referral code if not exists
        if (!this.referralCode) {
            this.referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        }
        
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);