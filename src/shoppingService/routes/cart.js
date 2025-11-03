const express = require("express");
const CartRouter = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Cart = require("../models/cartModel");
const axios = require("axios");

CartRouter.post("/cart/addProducts", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const { productRefId, quantity = 1 } = req.body;

    if (!productRefId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const productRes = await axios.get(
      `http://localhost:5003/product/findById`,
      {
        params: { productId: productRefId },
      }
    );

    const product = productRes.data.data;

    const productSnapshot = {
      productRefId,
      title: product.title,
      image: product.images?.[0],
      priceAtAddedTime: product.price?.final || product.final_price || 0,
      mainCategory: product.mainCategory,
      department: product.department,
      targetGroup: product.targetGroup,
    };

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ ...productSnapshot, quantity }],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.productRefId.toString() === productRefId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ ...productSnapshot, quantity });
      }
    }

    await cart.save();

    res
      .status(200)
      .json({ message: "Product added to cart successfully", cart });
  } catch (err) {
    console.error("Add to Cart Error:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

CartRouter.get("/cart/getProducts", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId }).lean();

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({
        message: "Your cart is empty",
        items: [],
        totalAmount: 0,
      });
    }

    res.status(200).json({
      message: "Cart fetched successfully",
      totalItems: cart.items.length,
      totalAmount: cart.totalAmount,
      items: cart.items.map((item) => ({
        id: item.productRefId,
        title: item.title,
        image: item.image,
        quantity: item.quantity,
        price: item.priceAtAddedTime,
        mainCategory: item.mainCategory,
        department: item.department,
        targetGroup: item.targetGroup,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

CartRouter.delete(
  "/cart/remove/:productRefId",
  authMiddleware,
  async (req, res) => {
    try {
      const userId = req.user._id;
      const { productRefId } = req.params;

      const cart = await Cart.findOne({ userId });
      if (!cart) return res.status(404).json({ message: "Cart not found" });

      const itemIndex = cart.items.findIndex(
        (item) => item.productRefId.toString() === productRefId
      );

      if (itemIndex === -1)
        return res.status(404).json({ message: "Product not found in cart" });

      cart.items.splice(itemIndex, 1);
      await cart.save();

      res.status(200).json({
        message: "Product removed from cart",
        cart,
      });
    } catch (err) {
      console.error("Remove Cart Product Error:", err.message);
      res.status(500).json({ message: "Server Error", error: err.message });
    }
  }
);

CartRouter.put("/cart/updateQuantity", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const { productRefId, quantity } = req.body;

    if (!productRefId || quantity <= 0) {
      return res
        .status(400)
        .json({ message: "Invalid productRefId or quantity" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (item) => item.productRefId.toString() === productRefId
    );

    if (!item)
      return res.status(404).json({ message: "Product not found in cart" });

    item.quantity = quantity;
    await cart.save();

    res.status(200).json({
      message: "Cart quantity updated successfully",
      cart,
    });
  } catch (err) {
    console.error("Update Quantity Error:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

CartRouter.delete("/cart/clear", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    cart.totalAmount = 0;

    await cart.save();

    res.status(200).json({ message: "Cart cleared successfully", cart });
  } catch (err) {
    console.error("Clear Cart Error:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

module.exports = CartRouter;
