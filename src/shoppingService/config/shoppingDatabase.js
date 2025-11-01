const mongoose = require("mongoose");

const connectShoppingDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_SHOPPING_URI);
    console.log("Shopping Database Connection Established....");
  } catch (err) {
    console.log("Couldn't connect to Shopping  database....");
  }
};

module.exports = { connectShoppingDatabase };
