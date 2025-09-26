const express = require("express");
const Vendor = require("../models/vendorModel");
const authMiddleware = require("../middleware/authMiddleware");
const { publish } = require("utils");
const vendorRouter = express.Router();

vendorRouter.post("/apply", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    if (userRole !== "customer") {
      return res
        .status(403)
        .json({ message: "Only customers can apply to become vendors" });
    }

    const {
      businessName,
      contactName,
      contactEmail,
      contactPhone,
      address,
      bankDetails,
      taxInfo,
    } = req.body;

    const existingVendor = await Vendor.findOne({ userId });
    if (existingVendor) {
      return res.status(400).json({ message: "Vendor profile already exists" });
    }

    const vendor = new Vendor({
      userId,
      businessName,
      contactName,
      contactEmail,
      contactPhone,
      address,
      bankDetails,
      taxInfo,
      status: "pending",
    });

    const savedVendor = await vendor.save();

    await publish("vendor:applied", {
      vendorId: savedVendor._id,
      businessName,
      contactName,
      contactEmail,
      contactPhone,
      status: savedVendor.status,
      appliedAt: new Date(),
    });

    res.status(201).json({
      message: `${contactName} application submitted successfully!`,
      vendor: savedVendor,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = vendorRouter;
