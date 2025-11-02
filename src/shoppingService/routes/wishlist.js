const express = require("express");
const WishlistRouter = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Wishlist = require("../models/wishlist");

WishlistRouter.post(
  "/wishlist/addProduct",
  authMiddleware,
  async (req, res) => {
    try {
      const userId = req.user._id;
      const { productRefId } = req.body;

      let wishlist = await Wishlist.findOne({ userId });
      if (!wishlist) {
        wishlist = new Wishlist({ userId, items: [{ productRefId }] });
      } else {
        const alreadyExists = wishlist.items.some(
          (item) => item.productRefId.toString() === productRefId
        );
        if (!alreadyExists) wishlist.items.push({ productRefId });
      }

      await wishlist.save();
      res.status(200).json({ message: "Added to Wishlist", wishlist });
    } catch (err) {
      res.status(500).json({ message: "Server Error", error: err.message });
    }
  }
);

WishlistRouter.get(
  "/wishlist/getProducts",
  authMiddleware,
  async (req, res) => {
    try {
      const userId = req.user._id;
      const wishlist = await Wishlist.findOne({ userId })
        .populate({
          path: "items.productRefId",
          select:
            "title description rating price.final images category brandName",
        })
        .lean();
      if (!wishlist) {
        return res
          .status(200)
          .json({ messages: "No items in wishlist", items: [] });
      }
      const formatted = wishlist.items.map((item) => ({
        id: item.productId?._id,
        title: item.productId?.title,
        image: item.productId?.images?.[0],
        price: item.productId?.price.final,
        brand: item.productId?.brandName,
        category: item.productId?.category,
        rating: item.productId?.rating,
        addedAt: item.addedAt,
      }));
      res
        .status(200)
        .json({
          message: " Wishlist fetched Successfully",
          totalItems: formatted.length,
          items: formatted,
        });
    } catch (err) {
      res.status(500).json({ message: "Server Error", error: err.message });
    }
  }
);
module.exports = WishlistRouter;
