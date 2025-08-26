const express = require("express");
const connectAuthDb = require("./authDatabase");
require("dotenv").config();

const app = express();

app.post("/signup", (req, res) => {});

connectAuthDb()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Auth Service running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error("Auth DB connection failed:", err.message));
