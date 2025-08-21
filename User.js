const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
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
    referralCode: {
        type: String,
        unique: true
    },
    bankInfo: {
        name: String,
        phone: String,
        bank: String
    }
}, {
    timestamps: true
});

// Create model
const User = mongoose.model('User', UserSchema);

module.exports = User;