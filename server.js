const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = "classic-maximize-pay2025-26";

mongoose.connect("mongodb+srv://deogratiasmalulah_db_user:db_yMi96KdnOqlqklvm@classic-maximize-pay.y8aqkzt.mongodb.net/classic-maximize-pay?retryWrites=true&w=majority&appName=classic-maximize-pay", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ================== Schemas ==================
const userSchema = new mongoose.Schema({
  fullName: String,
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  phone: String,
  password: String,
  balance: { type: Number, default: 0 },
  totalProfit: { type: Number, default: 0 },
  dailyEarnings: { type: Number, default: 0 },
  investments: [],
  purchased: [],
  affiliateLink: String,
  team1: [],
  team2: [],
  team3: []
});

const adminSchema = new mongoose.Schema({
  username: String,
  password: String
});

const requestSchema = new mongoose.Schema({
  type: String, // recharge or withdraw
  userId: String,
  amount: Number,
  transactionId: String,
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});

const notificationSchema = new mongoose.Schema({
  content: String,
  date: String
});

const User = mongoose.model("User", userSchema);
const Admin = mongoose.model("Admin", adminSchema);
const Request = mongoose.model("Request", requestSchema);
const Notification = mongoose.model("Notification", notificationSchema);

// ================== Routes ==================

// ---- REGISTER ----
app.post("/api/register", async (req, res) => {
  const { fullName, username, email, phone, password } = req.body;
  if (!fullName || !username || !email || !phone || !password) return res.status(400).json({ msg: "All fields required" });
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({
    fullName, username, email, phone, password: hashed,
    affiliateLink: `https://bitabuy.com/register?ref=${username}`
  });
  try {
    await user.save();
    res.json({ msg: "Registration successful" });
  } catch (err) {
    res.status(400).json({ msg: "Username or email already exists" });
  }
});

// ---- LOGIN ----
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ msg: "User not found" });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ msg: "Incorrect password" });
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });
  res.json({ msg: "Login successful", token, username: user.username, userId: user._id });
});

// ---- GET USER INFO ----
app.get("/api/user/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(400).json({ msg: "User not found" });
  res.json(user);
});

// ---- INVESTMENT ----
app.post("/api/invest", async (req, res) => {
  const { userId, plan, amount, profit, investDate, claimDate } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(400).json({ msg: "User not found" });
  user.investments.push({ plan, amount, profit, investDate, claimDate, claimed: false });
  await user.save();
  res.json({ msg: "Investment saved" });
});

// ---- PURCHASE ----
app.post("/api/purchase", async (req, res) => {
  const { userId, name, price, transactionId } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(400).json({ msg: "User not found" });
  user.purchased.push({ name, price, transactionId, status: "Pending" });
  await user.save();
  res.json({ msg: "Purchase submitted, pending admin approval" });
});

// ---- REQUESTS (Recharge / Withdraw) ----
app.post("/api/request", async (req, res) => {
  const { type, userId, amount, transactionId } = req.body;
  const request = new Request({ type, userId, amount, transactionId });
  await request.save();
  res.json({ msg: "Request submitted" });
});

// ✅ GET RECHARGE HISTORY
app.get("/api/recharges/:userId", async (req, res) => {
  const recharges = await Request.find({ userId: req.params.userId, type: "recharge" }).sort({ createdAt: -1 });
  res.json(recharges);
});

// ✅ GET WITHDRAW HISTORY
app.get("/api/withdraws/:userId", async (req, res) => {
  const withdraws = await Request.find({ userId: req.params.userId, type: "withdraw" }).sort({ createdAt: -1 });
  res.json(withdraws);
});

// ---- ADMIN LOGIN ----
app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (!admin) return res.status(400).json({ msg: "Admin not found" });
  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.status(400).json({ msg: "Incorrect password" });
  const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: "1d" });
  res.json({ msg: "Admin login success", token });
});

// ---- APPROVE REQUEST ----
app.post("/api/admin/request/approve", async (req, res) => {
  const { requestId } = req.body;
  const request = await Request.findById(requestId);
  if (!request) return res.status(400).json({ msg: "Request not found" });
  request.status = "Approved";
  await request.save();
  res.json({ msg: "Request approved" });
});

// ---- REJECT REQUEST ----
app.post("/api/admin/request/reject", async (req, res) => {
  const { requestId } = req.body;
  const request = await Request.findById(requestId);
  if (!request) return res.status(400).json({ msg: "Request not found" });
  request.status = "Rejected";
  await request.save();
  res.json({ msg: "Request rejected" });
});

// ---- DAILY NOTIFICATIONS ----
app.post("/api/admin/notification", async (req, res) => {
  const { content, date } = req.body;
  const notif = new Notification({ content, date });
  await notif.save();
  res.json({ msg: "Notification saved" });
});

app.get("/api/admin/notification", async (req, res) => {
  const notifications = await Notification.find();
  res.json(notifications);
});

// GET all requests (optionally filter by type via query ?type=withdraw)
app.get("/api/requests", async (req, res) => {
  try {
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    const reqs = await Request.find(filter).sort({ createdAt: -1 });
    res.json(reqs);
  } catch (err) {
    console.error(err); res.status(500).json({ msg: "Server error" });
  }
});

// DELETE request by id
app.delete("/api/requests/:id", async (req, res) => {
  try {
    await Request.findByIdAndDelete(req.params.id);
    res.json({ msg: "Request deleted" });
  } catch (err) {
    console.error(err); res.status(500).json({ msg: "Server error" });
  }
});

// Admin: get all users
app.get("/api/admin/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err); res.status(500).json({ msg: "Server error" });
  }
});

// Admin task storage (simple)
const taskSchema = new mongoose.Schema({ text:String, createdAt:{type:Date, default:Date.now} });
const Task = mongoose.model("Task", taskSchema);
app.post("/api/admin/task", async (req,res)=>{
  const t = new Task({ text: req.body.text });
  await t.save();
  res.json({ msg:"Task saved" });
});
app.get("/api/admin/tasks", async (req,res)=>{
  const tasks = await Task.find().sort({createdAt:-1});
  res.json(tasks);
});

// Claim daily earnings
app.post("/api/claim-daily", async(req,res)=>{
  const {userId} = req.body;
  const user = await User.findById(userId);
  if(!user) return res.status(400).json({success:false, msg:"User not found"});

  const today = new Date().toDateString();
  if(user.lastDaily && user.lastDaily === today){
    return res.json({success:false, msg:"Already claimed today"});
  }

  const dailyAmount = 5000; // mfano, unaweza kubadilisha kulingana na logic yako
  user.dailyEarnings += dailyAmount;
  user.balance += dailyAmount;
  user.totalProfit += dailyAmount;
  user.lastDaily = today;

  await user.save();
  res.json({success:true, amount:dailyAmount, balance:user.balance});
});

// ---- CLAIM DAILY EARNINGS ----
app.post("/api/claim-daily", async (req,res)=>{
  const {userId} = req.body;
  if(!userId) return res.status(400).json({msg:"User ID required"});

  try {
    const user = await User.findById(userId);
    if(!user) return res.status(400).json({msg:"User not found"});

    if(user.dailyEarnings <= 0) return res.status(400).json({msg:"No daily earnings available to claim"});

    // Add daily earnings to balance
    user.balance += user.dailyEarnings;

    // Reset dailyEarnings to 0 after claim
    user.dailyEarnings = 0;

    await user.save();
    res.json({msg:"Daily earnings claimed successfully", balance:user.balance, dailyEarnings:user.dailyEarnings});
  } catch(err){
    console.error(err);
    res.status(500).json({msg:"Server error"});
  }
});
// ---- SERVER LISTEN ----
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));