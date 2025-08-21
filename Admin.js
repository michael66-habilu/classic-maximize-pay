const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    dailyTask: {
        type: String,
        default: 'Share your invitation link with 3 friends today to claim your daily earnings.'
    },
    dailyNotification: {
        type: String,
        default: 'Welcome back! Have a great day investing with us!'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
AdminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
AdminSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Admin', AdminSchema);