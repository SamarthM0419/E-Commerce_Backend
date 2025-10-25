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

module.exports = productRouter;
