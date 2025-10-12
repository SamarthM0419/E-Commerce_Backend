const express = require("express");
const Vendor = require("../models/vendorModel");
const authMiddleware = require("../middleware/authMiddleware");
const { publish } = require("utils");
const { getCache, setCache } = require("../config/redisCache");

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

      publish("vendor:decision", {
        vendorId: vendorUpdate._id,
        businessName: vendorUpdate.businessName,
        contactEmail: vendorUpdate.contactEmail,
        contactName: vendorUpdate.contactName,
        status: vendorUpdate.status,
        rejectionReason: vendorUpdate.rejectionReason || null,
        updatedAt: new Date(),
      });

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
  "/admin/vendors/:id/:action",
  authMiddleware,
  async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Unauthorized Access. Admins only" });
      }

      const { id, action } = req.params;

      let isActive;
      if (action === "activate") {
        isActive = true;
      } else if (action === "deactivate") {
        isActive = false;
      } else {
        return res
          .status(400)
          .json({ message: "Invalid action. Use 'activate' or 'deactivate'." });
      }

      const vendorObj = await Vendor.findByIdAndUpdate(
        id,
        { isActive },
        { new: true }
      );

      if (!vendorObj) {
        return res.status(404).json({ message: "Vendor not found" });
      }

      res.status(200).json({
        message: `Vendor ${action}d successfully`,
        data: vendorObj,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

adminRouter.get("/admin/search", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Unauthorized Access. Admins only" });
    }

    const query = req.query.query?.trim();

    if (!query) {
      return res
        .status(400)
        .json({ message: "Empty search field is not allowed" });
    }

    const cacheKey = `vendors:search:${query.toLowerCase()}`;

    const cached = await getCache(cacheKey);
    if (cached) {
      console.log("Cache Hit");
      return res.json({ fromCache: true, data: cached });
    }

    console.log("Cache miss - DB Search");
    const results = await Vendor.find({
      $or: [
        { businessName: { $regex: query, $options: "i" } },
        { contactName: { $regex: query, $options: "i" } },
      ],
    });
    await setCache(cacheKey, results, 60);
    res.json({ fromCache: false, data: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = adminRouter;
