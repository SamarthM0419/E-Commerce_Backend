const mongoose = require("mongoose");

const connectUserDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_USER_URI);
    console.log("Connected to User database successfully...");
  } catch (err) {
    console.log("Couldn't connect to User database....");
  }
};

module.exports = connectUserDb;