const mongoose = require("mongoose");

const wishlistItemSchema = new mongoose.Schema({
  productRefId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
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
