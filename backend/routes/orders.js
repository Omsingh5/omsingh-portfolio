import express from "express";
import Order from "../models/Order.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Customer: place order
router.post("/", authenticate, authorize("customer"), async (req, res, next) => {
  try {
    const order = await Order.create({ ...req.body, customerId: req.user._id });
    res.status(201).json({ success: true, order });
  } catch (err) { next(err); }
});

// Customer: my orders
router.get("/my", authenticate, authorize("customer"), async (req, res, next) => {
  try {
    const orders = await Order.find({ customerId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (err) { next(err); }
});

// GPS tracking — Leaflet.js polls this every 15s
router.get("/:id/track", authenticate, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .select("status riderLocation deliveryAddress customerId");
    if (!order) return res.status(404).json({ error: "Order not found." });
    if (req.user.role === "customer" && !order.customerId.equals(req.user._id)) {
      return res.status(403).json({ error: "Forbidden." });
    }
    res.json({ success: true, status: order.status, riderLocation: order.riderLocation });
  } catch (err) { next(err); }
});

// Rider: update GPS
router.put("/:id/location", authenticate, authorize("rider"), async (req, res, next) => {
  try {
    const { lat, lng } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { riderLocation: { lat, lng, updatedAt: new Date() } },
      { new: true }
    );
    res.json({ success: true, riderLocation: order.riderLocation });
  } catch (err) { next(err); }
});

// Admin: all orders
router.get("/", authenticate, authorize("admin"), async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })
      .populate("customerId", "name email").populate("riderId", "name");
    res.json({ success: true, count: orders.length, orders });
  } catch (err) { next(err); }
});

export default router;