const mongoose = require("mongoose");

const connectVendorDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_VENDOR_URI);
    console.log("Vendor database connected...");
  } catch (err) {
    console.log("Couldn't connect to Vendor database....");
  }
};

module.exports = { connectVendorDB };
