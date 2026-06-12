import express from "express";
import User from "../models/User.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/",     authenticate, authorize("admin"), async (req, res, next) => { try { const users = await User.find().select("-password"); res.json({ success: true, count: users.length, users }); } catch (err) { next(err); } });
router.get("/:id",  authenticate, async (req, res, next) => { try { const user = await User.findById(req.params.id).select("-password"); if (!user) return res.status(404).json({ error: "User not found." }); res.json({ success: true, user }); } catch (err) { next(err); } });
router.put("/:id",  authenticate, async (req, res, next) => { try { const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password"); res.json({ success: true, user }); } catch (err) { next(err); } });

export default router;