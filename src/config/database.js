const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://dbUser:dbpassword@mp.0debpti.mongodb.net/"
  );
};

module.exports = connectDb;


