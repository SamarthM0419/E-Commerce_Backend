const express = require("express");
const paymentRouter = express.Router();
const Payment = require("../models/payment");
const authMiddleware = require("../middleware/authMiddleware");
const axios = require("axios");
const { getServiceUrl } = require("../config/serviceUrls");

const ORDER_SERVICE_URL = getServiceUrl("order");

paymentRouter.post("/payment/initiate", authMiddleware, async (req, res) => {
  try {
    const { orderId, paymentMethod } = req.body;
    const userId = req.user._id;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    console.log("Using ORDER_SERVICE_URL:", ORDER_SERVICE_URL);

    const orderRes = await axios.get(`${ORDER_SERVICE_URL}/orders/${orderId}`, {
      headers: {
        Authorization: req.token,
      },
    });

    const order = orderRes.data.order;
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const payment = await Payment.create({
      orderRefId: orderId,
      userRefId: userId,
      amount: order.totalAmount,
      paymentMethod: paymentMethod || "mock",
      status: "initiated",
    });

    res.status(201).json({
      message: "Payment initiated successfully",
      payment,
    });
  } catch (err) {
    console.error(
      "Error initiating payment:",
      err.response?.data || err.message
    );
    res.status(500).json({ message: "Failed to initiate payment" });
  }
});

paymentRouter.patch(
  "/admin/payment/verify/:paymentId",
  authMiddleware,
  async (req, res) => {
    try {
      if (req.user.role !== "admin" && req.user.role !== "vendor") {
        return res
          .status(403)
          .json({ message: "Access denied: Admin or Vendor only" });
      }

      const { paymentId } = req.params;
      const { status, transactionId } = req.body;

      if (!["success", "failed"].includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status. Use 'success' or 'failed'." });
      }

      const payment = await Payment.findById(paymentId);
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }

      payment.status = status;
      if (transactionId) payment.transactionId = transactionId;
      await payment.save();

      if (status === "success") {
        const ORDER_SERVICE_URL = getServiceUrl("order");

        await axios.patch(
          `${ORDER_SERVICE_URL}/order/${payment.orderRefId}/updateStatus`,
          { status: "paid" },
          { headers: { Authorization: req.token } }
        );
      }

      res.status(200).json({
        message: `Payment marked as ${status} successfully`,
        payment,
      });
    } catch (err) {
      console.error("Error verifying payment:", err.message);
      res.status(500).json({ message: "Failed to verify payment" });
    }
  }
);

module.exports = paymentRouter;
