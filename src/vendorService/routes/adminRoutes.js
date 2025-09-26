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
  "/admin/decision/:id/:action",
  authMiddleware,
  async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Unauthorized Access. Admins only" });
      }

      const { id, action } = req.params;
      const { rejectionReason } = req.body || {};

      let updateFields = {};

      if (action === "accept") {
        updateFields.status = "approved";
      } else if (action === "reject") {
        updateFields.status = "rejected";
        updateFields.rejectionReason =
          rejectionReason || "No reason provided for rejection.";
      } else {
        return res
          .status(400)
          .json({ message: "Invalid action. Use 'accept' or 'reject'." });
      }

      const vendorUpdate = await Vendor.findByIdAndUpdate(id, updateFields, {
        new: true,
      });

      if (!vendorUpdate) {
        return res.status(404).json({ message: "Vendor not found" });
      }

      res.status(200).json({
        message: `Vendor ${
          action === "accept" ? "approved" : "rejected"
        } successfully`,
        vendor: vendorUpdate,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

adminRouter.delete(
  "/admin/vendor/delete/:id",
  authMiddleware,
  async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        res.status(403).json({ message: "Unauthorized access!. Admin's only" });
      }
      const vendorIdToDelete = req.params.id;
      const vendorObj = await Vendor.findByIdAndDelete(vendorIdToDelete);

      if (!vendorObj) {
        res.status(404).json({ message: "Vendor not found" });
      }

      res.status(200).json({ message: "Vendor removed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

adminRouter.patch(
  "/admin/vendors/deactivate/:id",
  authMiddleware,
  async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        res
          .status(403)
          .json({ message: "Unauthorized Access!!! . Admin's only" });
      }
      const vendorIdToDeactivate = req.params.id;
      const vendorObj = await Vendor.findByIdAndUpdate(
        vendorIdToDeactivate,
        { isActive: false },
        { new: true }
      );

      if (!vendorObj) {
        res.status(404).json({ message: "Vendor not found" });
      }

      res
        .status(200)
        .json({ message: "Vendor deactivated successfully", data: vendorObj });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

adminRouter.get(
  "/admin/vendors/statuspending",
  authMiddleware,
  async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        res
          .status(403)
          .json({ message: "Unauthorized Access!!! . Admin's only" });
      }
      const vendorsPendingStatus = await Vendor.find({
        status: "pending",
        isActive: true,
      }).sort({ createdAt: -1 });

      if (vendorsPendingStatus.length === 0) {
        return res.status(200).json({
          message: "No pending vendor requests",
          vendors: [],
        });
      }

      res.status(200).json({
        message: "Vendors status pending list fetched successfully",
        count: vendorsPendingStatus.length,
        vendors: vendorsPendingStatus,
      });
    } catch (err) {
      res.status(500).json({
        message: "Server error",
        error: err.message,
      });
    }
  }
);

adminRouter.patch(
  "/admin/vendors/activate/:id",
  authMiddleware,
  async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        res
          .status(403)
          .json({ message: "Unauthorized Access!!! . Admin's only" });
      }
      const vendorIdToActivate = req.params.id;
      const vendorObj = await Vendor.findByIdAndUpdate(
        vendorIdToActivate,
        { isActive: true },
        { new: true }
      );

      if (!vendorObj) {
        res.status(404).json({ message: "Vendor not found" });
      }

      res
        .status(200)
        .json({ message: "Vendor Activated successfully", data: vendorObj });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = adminRouter;
