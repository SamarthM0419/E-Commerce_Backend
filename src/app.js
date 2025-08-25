const express = require("express");
const app = express();
const connectDb = require("./config/database");

connectDb()
  .then(() => {
    console.log("Database connection established...");
    app.listen(5000, () => {
      console.log("Server is successfully listening on port 5000.... ");
    });
  })
  .catch((err) => {
    console.log("Database connection unsucessful..." + err.message);
  });
