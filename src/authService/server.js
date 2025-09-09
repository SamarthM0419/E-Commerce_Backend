const express = require("express");
const connectAuthDb = require("./config/authDatabase");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const { connectRedisDB } = require("../utils/eventBus");

const app = express();
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");

(async () => {
  await connectRedisDB();
})();

app.use("/", authRouter);
app.use("/", profileRouter);

connectAuthDb()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Auth Service running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error("Auth DB connection failed:", err.message));
