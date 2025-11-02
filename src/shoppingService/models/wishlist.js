const mongoose = require("mongoose");

const wishlistItemSchema = new mongoose.Schema({
  productRefId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  title: { type: String },
  final_price: { type: Number },
  image: { type: String },
  brand: { type: String },
  rating: { type: Number },
  category: { type: String },
  mainCategory: { type: String },
  department: { type: String },
  targetGroup: { type: String },
  productType: { type: String },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
    unique: true,
    required: true,
  },
  items: [wishlistItemSchema],
});

module.exports = mongoose.model("Wishlist", wishlistSchema);
