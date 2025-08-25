const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://dbUser:dbpassword@mp.0debpti.mongodb.net/"
  );
};

connectDb()
  .then(() => {
    console.log("Database connection established...");
  })
  .catch((err) => {
    console.log("Database connection unsucessful..." + err.message);
  });
