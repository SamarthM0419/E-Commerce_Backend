const mongoose = require("mongoose");

const authSchema = new mongoose.Schema({
  emailId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["customer", "vendor", "admin"],
    default: "customer",
  },
});

module.exports = mongoose.model("Auth", authSchema);
