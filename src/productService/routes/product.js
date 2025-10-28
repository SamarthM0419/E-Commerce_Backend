const express = require("express");
const productRouter = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Product = require("../model/productModel");
const { getCache, setCache } = require("../config/redisCache");

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

productRouter.get("/search/products", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      mainCategory,
      department,
      targetGroup,
      productType,
      page = 1,
      limit = 20,
    } = req.query;

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    const cacheKey = `search:${title || ""}:${mainCategory || ""}:${
      department || ""
    }:${targetGroup || ""}:${
      productType || ""
    }:page=${pageNumber}:limit=${pageSize}`;

    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        message: "SuccessFul (from cache)",
        ...cachedData,
        fromCache: true,
      });
    }

    const filter = {};
    if (title) filter.title = { $regex: title, $options: "i" };
    if (mainCategory) filter.mainCategory = mainCategory;
    if (department) filter.department = department;
    if (targetGroup) filter.targetGroup = targetGroup;
    if (productType) filter.productType = productType;

    if (Object.keys(filter).length === 0) {
      return res.status(400).json({
        message: "Please provide at least one search parameter.",
      });
    }

    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / pageSize);

    const products = await Product.find(filter)
      .skip(skip)
      .limit(pageSize)
      .select("-specifications");

    const response = {
      message: "Successful",
      total,
      page: pageNumber,
      totalPages,
      count: products.length,
      data: products,
      fromCache: false,
    };

    await setCache(cacheKey, response, 1500);
    res.status(200).json(response);
  } catch (err) {
    console.error("Search API Error:", err);
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
});

productRouter.get("/sort/products", authMiddleware, async (req, res) => {
  try {
    const {
      sortBy = "price.final",
      order = "asc",
      page = 1,
      size = 20,
      limit = 30
    } = req.query;

    let pageNumber = parseInt(page);
    let pageSize = parseInt(size);
    const skip = (pageNumber - 1) * pageSize;

    const sortFields = sortBy.split(",");
    const orderFields = order.split(",");

    const sortObj = {};
    sortFields.forEach((field, index) => {
      const sortOrder = orderFields[index] === "desc" ? -1 : 1;
      sortObj[field.trim()] = sortOrder;
    });

    const products = await Product.find({})
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .select("-specifications");

    const total = await Product.countDocuments();
    const totalPages = Math.ceil(total / pageSize);

    res.status(200).json({
      message: "Successful",
      sortBy: sortObj,
      total,
      page: pageNumber,
      totalPages,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Sort API Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = productRouter;
