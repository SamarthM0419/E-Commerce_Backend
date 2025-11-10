const express = require("express");
const orderRouter = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Order = require("../models/orderModel");
const axios = require("axios");
const { getServiceUrl } = require("../config/serviceUrls");

orderRouter.post("/order/createFromCart", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const { shippingAddress } = req.body;

    const CART_SERVICE_URL = getServiceUrl("cart");
    console.log(CART_SERVICE_URL);

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

orderRouter.get(
  "/order/getMyOrdersByOrderStatus",
  authMiddleware,
  async (req, res) => {
    try {
      const userId = req.user._id;
      let { status } = req.query;

      if (!status || status.trim() === "") {
        status = "placed";
      }

      const filter = { userRefId: userId };
      if (status) {
        filter.orderStatus = status;
      }

      const orders = await Order.find(filter).sort({ createdAt: -1 });

      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: "No Order Details Found" });
      }

      res.status(200).json({
        message: "Order details fetched successfully",
        totalOrders: orders.length,
        filterApplied: status || "none",
        data: orders,
      });
    } catch (err) {
      console.error("Error fetching user orders:", err);
      res.status(500).json({ message: "Failed to get Order details" });
    }
  }
);

orderRouter.patch(
  "/orders/:orderId/cancel",
  authMiddleware,
  async (req, res) => {
    try {
      const userId = req.user._id;
      const orderId = req.params.orderId;
      const { deleteAfterCancel } = req.body || {};

      const order = await Order.findOne({ _id: orderId, userRefId: userId });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      if (order.orderStatus === "cancelled") {
        return res.status(400).json({ message: "Order already cancelled" });
      }

      if (["shipped", "delivered"].includes(order.orderStatus)) {
        return res.status(400).json({ message: "Cannot cancel this order" });
      }

      order.orderStatus = "cancelled";
      await order.save();

      if (deleteAfterCancel) {
        await Order.deleteOne({ _id: orderId });
        return res.status(200).json({
          message: "Order cancelled and deleted successfully",
          orderId,
        });
      }

      res.status(200).json({
        message: "Order cancelled successfully",
        order,
      });
    } catch (err) {
      console.error("Error cancelling order:", err);
      res.status(500).json({ message: "Failed to cancel order" });
    }
  }
);

orderRouter.post("/orders/buyNow", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const { productRefId, quantity, shippingAddress } = req.body;

    if (!productRefId || !quantity || !shippingAddress) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const PRODUCT_SERVICE_URL = getServiceUrl("product");
    const productResponse = await axios.get(
      `${PRODUCT_SERVICE_URL}/product/findById`,
      {
        params: { productId: productRefId },
        headers: { Authorization: req.headers.authorization },
      }
    );

    const product = productResponse.data.data;
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const finalPrice = product.price?.final ?? product.price;
    if (typeof finalPrice !== "number") {
      return res
        .status(400)
        .json({ message: "Invalid product price structure" });
    }

    const totalAmount = finalPrice * quantity;

    const order = await Order.create({
      userRefId: userId,
      items: [
        {
          productRefId,
          title: product.title,
          image: product.image || product.thumbnail,
          quantity,
          priceAtPurchase: finalPrice,
          mainCategory: product.mainCategory || product.category,
          department: product.department || "General",
          targetGroup: product.targetGroup || "Unisex",
        },
      ],
      totalAmount,
      shippingAddress,
      orderStatus: "placed",
    });

    res.status(201).json({
      message: "Order placed successfully via Buy Now",
      order,
    });
  } catch (err) {
    console.error(
      "Error creating Buy Now order:",
      err.response?.data || err.message
    );
    res.status(500).json({ message: "Failed to create Buy Now order" });
  }
});

orderRouter.get("/orders/:orderId", authMiddleware, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await Order.findOne({
      _id: orderId,
      userRefId: userId,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order fetched successfully",
      order,
    });
  } catch (err) {
    console.error("Error fetching order by ID:", err.message);
    res.status(500).json({ message: "Failed to fetch order details" });
  }
});

orderRouter.patch(
  "/order/:orderId/updateStatus",
  authMiddleware,
  async (req, res) => {
    try {
      const { status } = req.body;
      const { orderId } = req.params;

      const order = await Order.findById(orderId);
      if (!order) return res.status(404).json({ message: "Order not found" });

      order.orderStatus = status;
      await order.save();

      res.status(200).json({
        message: "Order status updated successfully",
        order,
      });
    } catch (err) {
      console.error("Error updating order status:", err);
      res.status(500).json({ message: "Failed to update order status" });
    }
  }
);

module.exports = orderRouter;
