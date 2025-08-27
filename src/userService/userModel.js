const mongoose = require("mongoose");
const validator = require("validator");

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
    photoUrl: {
      type: String,
      default:
        "https://t3.ftcdn.net/jpg/03/46/83/96/240_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg",
      validate(value) {
        if (!validator.isURL) {
          throw new Error("Invalid Photo Url");
        }
      },
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    role: {
      type: String,
      enum: ["customer", "vendor", "admin"],
      default: "customer",
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
