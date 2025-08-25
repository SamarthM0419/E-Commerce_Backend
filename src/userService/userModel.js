const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    authId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Auth",
    },
    firstName: { type: String, required: true },
    lastName: { type: String },
    phoneNo: { type: String, unique: true },
    emailId: {
      type: String,
      unique: true,
    },
    addresses: {
      type: [addressSchema],
      validate: {
        validator: function (val) {
          return val.length <= 3;
        },
        message: "Can store up to 3 addresses",
      },
      default: [],
    },
    role: {
      type: String,
      enum: ["customer", "vendor", "admin"],
      default: "customer",
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

const addressSchema = new mongoose.Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: number, required: true },
  },
  { _id: false }
);

module.exports = mongoose.model("User", userSchema);
