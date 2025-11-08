const mongoose = require("mongoose");

const connectOrderDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_ORDER_URI);
    console.log("Connection Established with Order Database....");
  } catch (err) {
    console.log("Couldn't connect to Shopping  database....");
  }
};

module.exports = { connectOrderDatabase };
