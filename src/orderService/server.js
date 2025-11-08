const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const { connectOrderDatabase } = require("./config/orderDatabase");

const app = express();
app.use(cookieParser());
app.use(express.json());

const orderRouter = require("./routes/order");
app.use("/", orderRouter);

connectOrderDatabase()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Order service running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Order Service unable to connect to database", err.message);
  });
