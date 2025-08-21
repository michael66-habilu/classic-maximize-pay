const mongoose = require('mongoose');

const InvestmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    planId: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: true
    },
    profitRate: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    },
    profitClaimed: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Investment', InvestmentSchema);