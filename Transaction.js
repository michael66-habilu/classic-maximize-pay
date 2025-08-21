const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['recharge', 'withdraw', 'investment', 'earning'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    method: {
        type: String,
        required: function() {
            return this.type === 'recharge';
        }
    },
    bank: {
        type: String,
        required: function() {
            return this.type === 'withdraw';
        }
    },
    transactionId: {
        type: String,
        required: function() {
            return this.type === 'recharge';
        }
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'completed'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Transaction', TransactionSchema);