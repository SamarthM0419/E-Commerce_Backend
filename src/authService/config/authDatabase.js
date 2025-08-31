const mongoose = require("mongoose");

const connectAuthDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_AUTH_URI);
    console.log("Auth database connected");
  } catch (err) {
    console.log("Couldn't connect to Auth database....");
  }
};

module.exports = connectAuthDb;
