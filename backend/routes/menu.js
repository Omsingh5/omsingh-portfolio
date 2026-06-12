import express from "express";
import MenuItem from "../models/MenuItem.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/",         async (req, res, next) => { try { const items = await MenuItem.find({ isAvailable: true }); res.json({ success: true, items }); } catch (err) { next(err); } });
router.post("/",        authenticate, authorize("admin"), async (req, res, next) => { try { const item = await MenuItem.create(req.body); res.status(201).json({ success: true, item }); } catch (err) { next(err); } });
router.put("/:id",      authenticate, authorize("admin"), async (req, res, next) => { try { const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); res.json({ success: true, item }); } catch (err) { next(err); } });
router.delete("/:id",   authenticate, authorize("admin"), async (req, res, next) => { try { await MenuItem.findByIdAndDelete(req.params.id); res.json({ success: true, message: "Menu item deleted." }); } catch (err) { next(err); } });

export default router;