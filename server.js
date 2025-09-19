// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Environment: Render will provide process.env.MONGODB_URI
const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/classic-maximize-pay';

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

// Simple schema: Example "Payment" (adjust fields to your needs)
const paymentSchema = new mongoose.Schema({
  senderName: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'TZS' },
  reference: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Payment = mongoose.model('Payment', paymentSchema);

// Routes
app.get('/', (req, res) => res.send('classic-maximize-pay backend is running'));

app.post('/api/payments', async (req, res) => {
  try {
    const p = new Payment(req.body);
    const saved = await p.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/payments', async (req, res) => {
  try {
    const items = await Payment.find().sort({ createdAt: -1 }).limit(100);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health endpoint
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));