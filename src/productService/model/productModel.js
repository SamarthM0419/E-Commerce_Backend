const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    product_id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    product_description: { type: String },
    rating: { type: Number, default: 0 },
    ratings_count: { type: Number, default: 0 },
    initial_price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    final_price: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    images: [{ type: String }],

    what_customers_said: { type: mongoose.Schema.Types.Mixed },
    seller_name: { type: String },
    sizes: { type: mongoose.Schema.Types.Mixed },
    seller_information: { type: String },
    more_offers: { type: mongoose.Schema.Types.Mixed },
    main_category: { type: String },
    department: { type: String },
    target_group: { type: String },
    product_type: { type: String },
    category_path: { type: String },
  },
  {
    timestamps: true,
  }
);

productSchema.index({
  title: "text",
  brand: "text",
  product_type: "text",
  category_path: "text",
});

module.exports = mongoose.model("Product", productSchema);
