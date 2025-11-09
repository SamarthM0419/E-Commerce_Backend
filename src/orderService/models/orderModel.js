const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userRefId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      productRefId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      title: { type: String, required: true },
      image: { type: String },
      quantity: { type: Number, required: true },
      priceAtPurchase: { type: Number, required: true },
      mainCategory: { type: String },
      department: { type: String },
      targetGroup: { type: String },
    },
  ],
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    fullName: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    phone: String,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending",
  },
  orderStatus: {
    type: String,
    enum: ["placed", "confirmed", "shipped", "delivered", "cancelled", "paid"],
    default: "placed",
  },
  paymentRefId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
  },
  placedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
