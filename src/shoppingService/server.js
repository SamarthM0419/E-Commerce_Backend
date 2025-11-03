const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const { connectShoppingDatabase } = require("./config/shoppingDatabase");

const app = express();
app.use(express.json());
app.use(cookieParser());

const WishlistRouter = require("./routes/wishlist");
const CartRouter = require("./routes/cart");

app.use("/", WishlistRouter);
app.use("/", CartRouter);

connectShoppingDatabase()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Shopping Service running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Shopping Service unable to connect to database", err.message);
  });
