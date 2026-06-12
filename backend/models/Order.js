import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerId:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  riderId:     { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [{
    menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" },
    name: String, qty: Number, price: Number,
  }],
  status: {
    type: String,
    enum: ["pending","confirmed","preparing","out_for_delivery","delivered","cancelled"],
    default: "pending",
  },
  payment:        { method: { type: String, enum: ["upi","card","cash"] } },
  couponCode:     String,
  discountAmount: { type: Number, default: 0 },
  loyaltyPoints:  { type: Number, default: 0 },
  riderLocation:  { lat: Number, lng: Number, updatedAt: Date },
  deliveryAddress: { street: String, city: String, pincode: String,
    coordinates: { lat: Number, lng: Number } },
  totalAmount: { type: Number, required: true },
}, { timestamps: true });

orderSchema.index({ customerId: 1, createdAt: -1 });
orderSchema.index({ riderId: 1, status: 1 });

export default mongoose.model("Order", orderSchema);