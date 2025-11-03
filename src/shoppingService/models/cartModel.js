const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productRefId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  title: { type: String, required: true },
  image: { type: String },
  quantity: {
    type: Number,
    min: 1,
    default: 1,
  },
  priceAtAddedTime: {
    type: Number,
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
  mainCategory: String,
  department: String,
  targetGroup: String,
});

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      unique: true,
      required: true,
    },
    items: [cartItemSchema],
    totalAmount: {
      type: Number,
      default: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

cartSchema.pre("save", function (next) {
  this.totalAmount = this.items.reduce(
    (sum, item) => sum + item.priceAtAddedTime * item.quantity,
    0
  );
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model("Cart", cartSchema);
