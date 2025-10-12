const mongoose = require("mongoose");

const connectProductDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_PRODUCT_URI);
    console.log("Product Connection Successful...");
  } catch (err) {
    console.log("Couldn't connect to Vendor database....");
  }
};

module.exports = { connectProductDB };
