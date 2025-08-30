const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const addressSchema = new mongoose.Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: Number, required: true },
  },
  { _id: false }
);

const authSchema = new mongoose.Schema(
  {
    emailId: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email Address");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password");
        }
      },
    },

    firstName: { type: String, required: true },
    lastName: { type: String },
    role: {
      type: String,
      enum: ["customer", "vendor", "admin"],
      default: "customer",
    },

    phoneNo: {
      type: String,
      unique: true,
      validate(value) {
        if (!validator.isMobilePhone(value, "any")) {
          throw new Error("Invalid phone number");
        }
      },
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
    photoUrl: {
      type: String,
      default:
        "https://t3.ftcdn.net/jpg/03/46/83/96/240_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo Url");
        }
      },
    },
    gender: {
      type: String,
      enum: ["male", "female", "prefer not to say"],
    },
  },
  {
    timestamps: true,
  }
);

authSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

authSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isPasswordValid;
};

module.exports = mongoose.model("Auth", authSchema);
