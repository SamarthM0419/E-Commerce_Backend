const express = require("express");
const connectUserDb = require("./userDatabase");
require("dotenv").config();

const app = express();

connectUserDb()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`User Service running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error("User DB connection failed:", err.message));
