const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const { connectProductDB } = require("./config/productDatabase");

const app = express();
app.use(express.json());
app.use(cookieParser());

connectProductDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Product Service running on port ${process.env.PORT}`);
    });
  })
  .catch((err) =>
    console.error(`Product Service unable to connect to database`, err.message)
  );
