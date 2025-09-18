const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const { connectVendorDB } = require("./config/vendorDatabase");
const app = express();
app.use(express.json());
app.use(cookieParser());

const vendorRouter = require("./routes/vendorRoutes");

app.use("/", vendorRouter);

connectVendorDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Vendor Service running on port ${process.env.PORT}`);
    });
  })
  .catch((err) =>
    console.error(`Vendor Service unable to connect to database`, err.message)
  );
