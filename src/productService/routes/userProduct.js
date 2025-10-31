const express = require("express");
const userRouter = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Product = require("../model/productModel");
const { setCache, getCache } = require("../config/redisCache");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const storage = multer.memoryStorage();
const upload = multer({ storage });

userRouter.get("/product/findById", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.query;

    const product = await Product.findById(productId).select("-specifications");
    if (!product) {
      return res.status(404).json({ message: "Product not Found" });
    }

    res.status(200).json({
      message: "Product retrieval Successful",
      data: product,
    });
  } catch (err) {
    console.error("Find By Id API Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

userRouter.post("/product/addProduct", authMiddleware, async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
});

module.exports = userRouter;
