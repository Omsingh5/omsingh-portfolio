// ============================================================
// Omsingh Rajput — Portfolio Backend
// Node.js + Express.js + JWT Auth + RBAC + MongoDB Atlas
// REST API Design · Role-Based Access Control
// ============================================================

// ─── server.js (Entry Point) ──────────────────────────────────
/*
  SETUP:
    npm init -y
    npm install express mongoose jsonwebtoken bcryptjs cors dotenv express-rate-limit helmet morgan

  .env:
    PORT=5000
    MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/portfolio
    JWT_SECRET=your_super_secret_key_here
    JWT_EXPIRE=7d
    JWT_REFRESH_SECRET=your_refresh_secret
    CLIENT_URL=http://localhost:3000

  START:
    node server.js
*/

import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import authRoutes  from "./routes/auth.js";
import userRoutes  from "./routes/users.js";
import menuRoutes  from "./routes/menu.js";
import orderRoutes from "./routes/orders.js";
import adminRoutes from "./routes/admin.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;
const dist = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../frontend/dist",
);

// ── Security middleware ────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "10kb" }));
app.use(morgan("dev"));

// ── Rate limiting ──────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: "Too many requests. Please try again later." },
});
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { error: "Too many auth attempts. Please wait." },
});
app.use("/api", limiter);
app.use("/api/v1/auth/login",    authLimiter);
app.use("/api/v1/auth/register", authLimiter);

if (fs.existsSync(dist)) {
  app.use(express.static(dist));
}

// ── Health check ───────────────────────────────────────────────
app.get("/health", (_, res) => res.json({
  status: "✅ API is running",
  timestamp: new Date().toISOString(),
  version: "1.0.0",
}));

// ── Mount Routes ───────────────────────────────────────────────
app.use("/api/v1/auth",   authRoutes);
app.use("/api/v1/users",  userRoutes);
app.use("/api/v1/menu",   menuRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/admin",  adminRoutes);

// Portfolio pages, then unknown API routes
app.use((req, res) => {
  const indexPath = path.join(dist, "index.html");
  if (req.method === "GET" && !req.path.startsWith("/api") && fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.status(404).json({ error: `Route ${req.originalUrl} not found.` });
});

// Global error handler
app.use(errorHandler);

// Listen first so Render has an open port even when Atlas is unreachable.
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));

if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("✅ MongoDB Atlas connected");
  }).catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
} else {
  console.log("MONGO_URI is not set. Database routes are unavailable.");
}

export default app;


// ============================================================
// middleware/auth.js — JWT Authentication + RBAC
// ============================================================
/*
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ── Verify JWT ─────────────────────────────────────────────────
export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. Token required." });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password -__v");
    if (!req.user) return res.status(401).json({ error: "User no longer exists." });
    if (req.user.tokenVersion !== decoded.tokenVersion) {
      return res.status(401).json({ error: "Token invalidated. Please log in again." });
    }
    next();
  } catch (err) {
    const msg = err.name === "TokenExpiredError" ? "Token expired." : "Invalid token.";
    res.status(401).json({ error: msg });
  }
};

// ── Role-Based Access Control ──────────────────────────────────
// Roles: "customer" | "rider" | "admin"
export const authorize = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "Not authenticated." });
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      error: `Access forbidden. Required: [${roles.join(", ")}], your role: ${req.user.role}`,
    });
  }
  next();
};
*/


// ============================================================
// models/User.js — Mongoose Schema (MongoDB Atlas)
// ============================================================
/*
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name:     { type: String, required: [true, "Name is required"], trim: true, maxlength: 80 },
  email:    { type: String, required: [true, "Email is required"], unique: true, lowercase: true,
              match: [/^\S+@\S+\.\S+$/, "Invalid email format"] },
  password: { type: String, required: true, minlength: 6, select: false },
  role:     { type: String, enum: ["customer", "rider", "admin"], default: "customer" },
  phone:    { type: String },
  address: {
    street: String, city: String, state: String, pincode: String,
    coordinates: { lat: Number, lng: Number },
  },
  loyaltyPoints: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  tokenVersion: { type: Number, default: 0 }, // for JWT invalidation
  lastLogin: Date,
}, { timestamps: true });

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};

// Generate JWT
userSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role, tokenVersion: this.tokenVersion },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "7d" }
  );
};

export default mongoose.model("User", userSchema);
*/


// ============================================================
// models/Order.js — Full Order Schema with GPS + Coupon + RBAC
// ============================================================
/*
import mongoose from "mongoose";

const coordSchema = new mongoose.Schema(
  { lat: { type: Number, required: true }, lng: { type: Number, required: true } },
  { _id: false }
);

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  riderId:    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
  items: [{
    menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" },
    name:  String, qty: Number, price: Number, isVeg: Boolean,
  }],
  status: {
    type: String,
    enum: ["pending","confirmed","preparing","out_for_delivery","delivered","cancelled"],
    default: "pending",
  },
  payment: { method: { type: String, enum: ["upi","card","cash"] }, status: { type: String, enum: ["pending","paid","failed"], default: "pending" } },
  couponCode:     { type: String, uppercase: true },
  discountAmount: { type: Number, default: 0 },
  loyaltyPoints:  { type: Number, default: 0 },
  riderLocation:  { ...coordSchema.obj, updatedAt: Date },  // Polled by Leaflet.js every 15s
  deliveryAddress: {
    label: String, street: String, city: String, pincode: String,
    coordinates: coordSchema,
  },
  scheduledAt:  Date,
  subtotal:     { type: Number, required: true },
  totalAmount:  { type: Number, required: true },
  aiSuggested:  { type: Boolean, default: false },
}, { timestamps: true });

// Compound indexes for optimised queries
orderSchema.index({ customerId: 1, createdAt: -1 });
orderSchema.index({ riderId: 1, status: 1 });
orderSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("Order", orderSchema);
*/


// ============================================================
// routes/auth.js — Register, Login, Refresh
// ============================================================
/*
import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// POST /api/v1/auth/register
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: "Email already registered." });
    const user = await User.create({ name, email, password, role: role || "customer" });
    const token = user.generateToken();
    res.status(201).json({ success: true, token, user: { id: user._id, name, email, role: user.role } });
  } catch (err) { next(err); }
});

// POST /api/v1/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required." });
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials." });
    }
    if (!user.isActive) return res.status(403).json({ error: "Account deactivated." });
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });
    const token = user.generateToken();
    res.json({ success: true, token, user: { id: user._id, name: user.name, email, role: user.role, loyaltyPoints: user.loyaltyPoints } });
  } catch (err) { next(err); }
});

// GET /api/v1/auth/me — get current user
router.get("/me", authenticate, (req, res) => {
  res.json({ success: true, user: req.user });
});

export default router;
*/


// ============================================================
// routes/orders.js — Full RBAC Order Routes
// ============================================================
/*
import express from "express";
import Order from "../models/Order.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// ── CUSTOMER: Place order ──────────────────────────────────────
router.post("/", authenticate, authorize("customer"), async (req, res, next) => {
  try {
    const order = await Order.create({ ...req.body, customerId: req.user._id });
    res.status(201).json({ success: true, order });
  } catch (err) { next(err); }
});

// ── CUSTOMER: Get my orders ────────────────────────────────────
router.get("/my", authenticate, authorize("customer"), async (req, res, next) => {
  try {
    const orders = await Order.find({ customerId: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.menuItemId", "name image")
      .lean();
    res.json({ success: true, count: orders.length, orders });
  } catch (err) { next(err); }
});

// ── GPS TRACKING: Leaflet.js polls this every 15s ─────────────
router.get("/:id/track", authenticate, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .select("status riderLocation deliveryAddress customerId riderId")
      .lean();
    if (!order) return res.status(404).json({ error: "Order not found." });
    // RBAC: customer can only track their own order
    if (req.user.role === "customer" && !order.customerId.equals(req.user._id)) {
      return res.status(403).json({ error: "Forbidden." });
    }
    res.json({ success: true, status: order.status, riderLocation: order.riderLocation, deliveryAddress: order.deliveryAddress });
  } catch (err) { next(err); }
});

// ── RIDER: Update GPS location ─────────────────────────────────
router.put("/:id/location", authenticate, authorize("rider"), async (req, res, next) => {
  try {
    const { lat, lng } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { riderLocation: { lat, lng, updatedAt: new Date() } },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: "Order not found." });
    res.json({ success: true, riderLocation: order.riderLocation });
  } catch (err) { next(err); }
});

// ── ADMIN: Get all orders + analytics data ─────────────────────
router.get("/", authenticate, authorize("admin"), async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 })
        .skip((page - 1) * limit).limit(+limit)
        .populate("customerId", "name email")
        .populate("riderId", "name phone")
        .lean(),
      Order.countDocuments(filter),
    ]);
    res.json({ success: true, total, page: +page, orders });
  } catch (err) { next(err); }
});

export default router;
*/


// ============================================================
// routes/admin.js — Admin Analytics + CSV Export (RBAC: admin)
// ============================================================
/*
import express from "express";
import Order from "../models/Order.js";
import User from "../models/User.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// All admin routes require JWT + role: admin
router.use(authenticate, authorize("admin"));

// GET /api/v1/admin/analytics — Dashboard data for Chart.js
router.get("/analytics", async (req, res, next) => {
  try {
    const [totalOrders, totalRevenue, totalUsers, statusBreakdown, revenueByDay] =
      await Promise.all([
        Order.countDocuments(),
        Order.aggregate([{ $group: { _id: null, total: { $sum: "$totalAmount" } } }]),
        User.countDocuments({ role: "customer" }),
        Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
        Order.aggregate([
          { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, revenue: { $sum: "$totalAmount" }, orders: { $sum: 1 } } },
          { $sort: { _id: -1 } },
          { $limit: 30 },
        ]),
      ]);
    res.json({
      success: true,
      analytics: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalUsers,
        statusBreakdown,
        revenueByDay: revenueByDay.reverse(),
      },
    });
  } catch (err) { next(err); }
});

// GET /api/v1/admin/export/csv — CSV export for operations
router.get("/export/csv", async (req, res, next) => {
  try {
    const orders = await Order.find().populate("customerId", "name email").lean();
    const rows = [["Order ID","Customer","Email","Status","Amount","Payment","Date"]];
    orders.forEach(o => rows.push([
      o._id, o.customerId?.name, o.customerId?.email,
      o.status, o.totalAmount, o.payment?.method,
      new Date(o.createdAt).toLocaleDateString("en-IN"),
    ]));
    const csv = rows.map(r => r.join(",")).join("\n");
    res.header("Content-Type", "text/csv");
    res.header("Content-Disposition", 'attachment; filename="orders.csv"');
    res.send(csv);
  } catch (err) { next(err); }
});

export default router;
*/


// ============================================================
// middleware/errorHandler.js
// ============================================================
/*
export const errorHandler = (err, req, res, next) => {
  let status  = err.statusCode || 500;
  let message = err.message    || "Internal server error";

  // Mongoose validation error
  if (err.name === "ValidationError") {
    status  = 400;
    message = Object.values(err.errors).map(e => e.message).join(", ");
  }
  // Mongoose duplicate key
  if (err.code === 11000) {
    status  = 409;
    message = `Duplicate value for field: ${Object.keys(err.keyValue).join(", ")}`;
  }
  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    status = 400; message = `Invalid ${err.path}: ${err.value}`;
  }

  if (process.env.NODE_ENV === "development") console.error(err.stack);
  res.status(status).json({ success: false, error: message });
};
*/
