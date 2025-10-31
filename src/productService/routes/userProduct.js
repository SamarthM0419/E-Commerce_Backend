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

userRouter.post(
  "/product/addProduct",
  authMiddleware,
  upload.array("images"),

  async (req, res) => {
    try {
      const { role } = req.user;
      if (!["admin", "vendor"].includes(role)) {
        return res.status(403).json({ message: "Unauthorized Access" });
      }
      console.log(req.body);
      const {
        product_id,
        title,
        product_description,
        initial_price,
        discount,
        final_price,
        mainCategory,
        department,
        targetGroup,
        productType,
        categoryPath,
        seller_name,
        seller_information,
      } = req.body;

      const imageUrls = [];
      for (const file of req.files) {
        const imageUrl = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "products" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          uploadStream.end(file.buffer);
        });
        imageUrls.push(imageUrl);
      }

      const product = new Product({
        product_id,
        title,
        product_description,
        initial_price,
        discount,
        final_price,
        mainCategory,
        department,
        targetGroup,
        productType,
        categoryPath,
        seller_name,
        seller_information,
        images: imageUrls,
      });

      await product.save();
      res.status(201).json({ message: "Product added successfully", product });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error", error });
    }
  }
);

userRouter.delete(
  "/product/deleteById/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const { role } = req.user;
      if (!["admin", "vendor"].includes(role)) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      const id = req.params.id.trim();

      const product = await Product.findById(req.params.id);
      if (!product)
        return res.status(404).json({ message: "Product not found" });

      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error", error });
    }
  }
);

module.exports = userRouter;
