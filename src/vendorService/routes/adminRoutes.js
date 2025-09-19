const express = require("express");
const Vendor = require("../models/vendorModel");
const authMiddleware = require("../middleware/authMiddleware");

const adminRouter = express.Router();

adminRouter.get("/admin/requests", authMiddleware, async (req, res) => {
  try {
    const role = req.user.role;
    if (role !== "admin") {
      return res
        .status(403)
        .json({ message: "Unauthorized Access. Admins Only" });
    }

    const findAllVendors = await Vendor.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "All vendor's requests fetched successfully!!!",
      data: findAllVendors,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

adminRouter.patch(
  "/admin/approval/:id/accept",
  authMiddleware,
  async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        res.status(403).json({ message: "Unauthorized Access . Admin's only" });
      }
      const vendorId = req.params.id;
      console.log(vendorId);

      const vendorUpdate = await Vendor.findByIdAndUpdate(
        vendorId,
        { status: "approved" },
        { new: true }
      );

      if (!vendorUpdate) {
        return res.status(404).json({ message: "Vendor not present" });
      }

      res
        .status(200)
        .json({ message: "Vendor Updated successfully", vendorUpdate });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = adminRouter;
