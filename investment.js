const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Investment = require('../models/Investment');
const { check, validationResult } = require('express-validator');

// Investment plans data
const investmentPlans = [
    { id: 1, min: 20000, max: 200000, days: 5, profitRate: 2.432 },
    { id: 2, min: 35000, max: 400000, days: 10, profitRate: 5 },
    { id: 3, min: 150000, max: 650000, days: 12, profitRate: 18 },
    { id: 4, min: 400000, max: 1000000, days: 20, profitRate: 24 },
    { id: 5, min: 600000, max: 100000000, days: 30, profitRate: 45 }
];

// @route   GET api/investment/plans
// @desc    Get investment plans
// @access  Public
router.get('/plans', (req, res) => {
    res.json(investmentPlans);
});

// @route   POST api/investment
// @desc    Create investment
// @access  Private
router.post('/', [
    auth,
    [
        check('planId', 'Plan ID is required').isNumeric(),
        check('amount', 'Amount is required').isNumeric()
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { planId, amount } = req.body;

    try {
        // Get plan details
        const plan = investmentPlans.find(p => p.id === parseInt(planId));
        if (!plan) {
            return res.status(400).json({ message: 'Invalid plan ID' });
        }

        // Check amount range
        if (amount < plan.min || amount > plan.max) {
            return res.status(400).json({ 
                message: `Amount must be between ${plan.min} and ${plan.max} for this plan`
            });
        }

        // Check user balance
        const user = await User.findById(req.user.id);
        if (user.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        // Calculate end date
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + plan.days);

        // Create investment
        const investment = new Investment({
            user: req.user.id,
            planId,
            amount,
            endDate,
            profitRate: plan.profitRate
        });

        // Deduct from user balance
        user.balance -= amount;
        await user.save();
        await investment.save();

        res.json(investment);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET api/investment
// @desc    Get user's investments
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const investments = await Investment.find({ user: req.user.id })
            .sort({ startDate: -1 });

        res.json(investments);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST api/investment/:id/claim
// @desc    Claim investment profit
// @access  Private
router.post('/:id/claim', auth, async (req, res) => {
    try {
        const investment = await Investment.findById(req.params.id);
        if (!investment) {
            return res.status(404).json({ message: 'Investment not found' });
        }

        // Check if investment belongs to user
        if (investment.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Check if investment is completed
        if (investment.status !== 'completed') {
            return res.status(400).json({ message: 'Investment not yet completed' });
        }

        // Check if profit already claimed
        if (investment.profitClaimed) {
            return res.status(400).json({ message: 'Profit already claimed' });
        }

        // Calculate profit
        const profit = (investment.amount * investment.profitRate) / 100;

        // Update user balance
        const user = await User.findById(req.user.id);
        user.balance += profit;
        user.totalProfit += profit;
        await user.save();

        // Update investment
        investment.profitClaimed = true;
        await investment.save();

        res.json({ message: 'Profit claimed successfully', amount: profit });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;