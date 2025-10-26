const express = require("express");
const productRouter = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Product = require("../model/productModel");

productRouter.get("/products/feed", authMiddleware, async (req, res) => {
  try {
    let { page = 1, limit = 20 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;
    const totalProducts = await Product.countDocuments();

    const products = await Product.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-specifications");

    res.status(200).json({
      message: "Success",
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      pageSize: limit,
      products,
    });
  } catch (error) {
    console.error("Error fetching product feed:", error);
    res.status(500).json({
      message: "Server error while fetching product feed",
    });
  }
});

productRouter.get("/products/filter", authMiddleware, async (req, res) => {
  try {
    const {
      mainCategory,
      department,
      targetGroup,
      productType,
      page = 1,
      limit = 30,
      sort = "createdAt",
      order = "desc",
    } = req.query;

    const filters = {};

    if (mainCategory) {
      filters.mainCategory = { $regex: mainCategory, $options: "i" };
    }

    if (department) {
      filters.department = { $regex: department, $options: "i" };
    }

    if (targetGroup) {
      filters.targetGroup = { $regex: targetGroup, $options: "i" };
    }

    if (productType) {
      filters.productType = { $regex: productType, $options: "i" };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === "asc" ? 1 : -1;

    const products = await Product.find(filters)
      .sort({ [sort]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit))
      .select("-specifications");

    const total = await Product.countDocuments(filters);

    res.status(200).json({
      message: "Successful",
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Error in /filter:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = productRouter;
