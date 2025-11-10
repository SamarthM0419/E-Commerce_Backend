const express = require("express");
const paymentRouter = express.Router();
const Payment = require("../models/payment");
const authMiddleware = require("../middleware/authMiddleware");
const axios = require("axios");
const { getServiceUrl } = require("../config/serviceUrls");
const { publish } = require("utils");
const { mongoose } = require("mongoose");

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
        message: `Payment marked as ${status}`,
        payment,
      });

      const eventPayload = {
        type: status === "success" ? "payment.success" : "payment.failed",
        data: {
          userEmail: payment.userRefId.email,
          userName: payment.userRefId.name,
          orderId: payment.orderRefId,
          amount: payment.amount,
          transactionId: payment.transactionId,
          timestamp: new Date().toISOString(),
        },
      };

      await publish("payment-events", eventPayload);
      console.log(`Published ${eventPayload.type} event`);
    } catch (err) {
      console.error("Error verifying payment:", err.message);
      res.status(500).json({ message: "Failed to verify payment" });
    }
  }
);

paymentRouter.get("/admin/payments", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "vendor") {
      return res
        .status(403)
        .json({ message: "Access denied: Admin or Vendor only" });
    }

    const { status, method } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (method) filter.paymentMethod = method;

    const payments = await Payment.find(filter)
      .populate("userRefId", "name email")
      .populate("orderRefId", "status totalPrice")
      .sort({ createdAt: -1 })
      .select(
        "_id orderRefId userRefId amount paymentMethod status transactionId createdAt updatedAt"
      );

    if (payments.length === 0)
      return res.status(404).json({ message: "No payments found" });

    res.status(200).json({
      total: payments.length,
      payments,
    });
  } catch (err) {
    console.error("Error fetching payments:", err.message);
    res.status(500).json({ message: "Failed to retrieve payments" });
  }
});

paymentRouter.get("/payment/:paymentId", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "vendor") {
      return res
        .status(403)
        .json({ message: "Access denied: Admin or Vendor only" });
    }

    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      res.status(404).json({ message: "Payment history was not found" });
    }

    res.status(200).json({ message: "Payment Found Successfully", payment });
  } catch (err) {
    console.error("Error fetching payment:", err.message);
    res.status(500).json({ message: "Failed to fetch payment details" });
  }
});

paymentRouter.get(
  "/payment/history/:userRefId",
  authMiddleware,
  async (req, res) => {
    try {
      const { userRefId } = req.params;
      const userObjectId = new mongoose.Types.ObjectId(userRefId);

      const payments = await Payment.find({ userRefId: userObjectId });
      if (!payments || payments.length === 0) {
        return res
          .status(404)
          .json({ message: "No payment history found for this user" });
      }
      res.status(200).json({
        message: "User payment history retrieved successfully",
        total: payments.length,
        payments,
      });
    } catch (err) {
      console.error("Error fetching payments:", err.message);
      res.status(500).json({ message: "Failed to fetch user payments" });
    }
  }
);


module.exports = paymentRouter;
