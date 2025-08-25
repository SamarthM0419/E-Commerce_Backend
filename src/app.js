const express = require("express");
const app = express();
require("./config/database");

app.listen(5000, () => {
  console.log("Server is successfully listening on port 5000.... ");
});
