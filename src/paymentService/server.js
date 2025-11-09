const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const { connectPaymentDatabase } = require("./config/paymentDatabase");
const { connectRedisDB } = require("utils");
const app = express();
app.use(cookieParser());
app.use(express.json());

const paymentRouter = require("./routes/payment");
app.use("/", paymentRouter);

(async () => {
  await connectRedisDB();
})();

connectPaymentDatabase()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Payment service running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Payment Service unable to connect to database", err.message);
  });
