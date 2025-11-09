const mongoose = require("mongoose");

const connectPaymentDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_Payment_URI);
    console.log("Connection Established with Payment Database....");
  } catch (err) {
    console.log("Couldn't connect to Payment  database....");
  }
};

module.exports = { connectPaymentDatabase  };
