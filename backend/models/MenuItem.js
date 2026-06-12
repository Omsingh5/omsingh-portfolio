import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: String,
  price:       { type: Number, required: true },
  category:    String,
  isVeg:       { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  image:       String,
}, { timestamps: true });

export default mongoose.model("MenuItem", menuItemSchema);