const express = require("express");
const connectUserDb = require("./userDatabase");
const { userAuth } = require("../authService/authMiddleware");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());

app.get("/profile", userAuth, (req, res) => {

});

connectUserDb()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`User Service running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error("User DB connection failed:", err.message));
