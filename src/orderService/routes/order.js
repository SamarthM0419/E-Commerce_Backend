const express = require("express");
const orderRouter = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Order = require("../models/orderModel");
const axios = require("axios");

orderRouter.post("/order/createFromCart", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const { shippingAddress } = req.body;

    const CART_SERVICE_URL =
      "http://localhost:5004" || process.env.CART_SERVICE_URL;

    const cartResponse = await axios.get(
      `${CART_SERVICE_URL}/cart/getProducts`,
      {
        headers: {
          Authorization: req.token,
        },
      }
    );

    const cart = cartResponse.data;
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    const order = await Order.create({
      userRefId: userId,
      items: cart.items.map((item) => ({
        productRefId: item.id,
        title: item.title,
        image: item.image,
        quantity: item.quantity,
        priceAtPurchase: item.price,
        mainCategory: item.mainCategory,
        department: item.department,
        targetGroup: item.targetGroup,
      })),
      totalAmount: cart.totalAmount,
      shippingAddress: shippingAddress,
    });

    await axios.delete(`${CART_SERVICE_URL}/cart/clear`, {
      headers: { Authorization: req.token },
    });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

module.exports = orderRouter;
