const express = require("express");
const WishlistRouter = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Wishlist = require("../models/wishlist");
const axios = require("axios");

WishlistRouter.post(
  "/wishlist/addProduct",
  authMiddleware,
  async (req, res) => {
    try {
      const userId = req.user._id;
      const { productRefId } = req.body;

      const PRODUCT_SERVICE_URL =
        process.env.PRODUCT_SERVICE_URL || "http://localhost:5003";

      const productRes = await axios.get(
        `${PRODUCT_SERVICE_URL}/product/findById`,
        { params: { productId: productRefId } }
      );

      const product = productRes.data.data;

      const productSnapshot = {
        productRefId,
        title: product.title,
        final_price: product.final_price,
        image: product.images?.[0],
        brand: product.brandName,
        mainCategory: product.mainCategory,
        department: product.department,
        targetGroup: product.targetGroup,
        rating: product.rating,
        category: product.categoryPath,
      };

      let wishlist = await Wishlist.findOne({ userId });

      if (!wishlist) {
        wishlist = new Wishlist({ userId, items: [productSnapshot] });
      } else {
        const alreadyInWishlist = wishlist.items.some(
          (item) => item.productRefId.toString() === productRefId
        );
        if (alreadyInWishlist)
          return res
            .status(200)
            .json({ message: "Product already in wishlist" });

        wishlist.items.push(productSnapshot);
      }

      await wishlist.save();
      res.status(200).json({ message: "Product added to wishlist", wishlist });
    } catch (err) {
      res.status(500).json({ message: "Server Error", error: err.message });
    }
  }
);


module.exports = WishlistRouter;
