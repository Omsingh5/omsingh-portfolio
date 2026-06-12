import express from "express";
import Order from "../models/Order.js";
import User from "../models/User.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();
router.use(authenticate, authorize("admin"));

router.get("/analytics", async (req, res, next) => {
  try {
    const [totalOrders, totalUsers, revenueData] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: "customer" }),
      Order.aggregate([{ $group: { _id: null, total: { $sum: "$totalAmount" } } }]),
    ]);
    res.json({ success: true, analytics: { totalOrders, totalUsers, totalRevenue: revenueData[0]?.total || 0 } });
  } catch (err) { next(err); }
});

router.get("/export/csv", async (req, res, next) => {
  try {
    const orders = await Order.find().populate("customerId", "name email").lean();
    const rows = [["Order ID","Customer","Email","Status","Amount","Date"]];
    orders.forEach(o => rows.push([o._id, o.customerId?.name, o.customerId?.email, o.status, o.totalAmount, new Date(o.createdAt).toLocaleDateString("en-IN")]));
    res.header("Content-Type","text/csv").header("Content-Disposition",'attachment; filename="orders.csv"').send(rows.map(r=>r.join(",")).join("\n"));
  } catch (err) { next(err); }
});

export default router;