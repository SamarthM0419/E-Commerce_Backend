const express = require("express");
const connectAuthDb = require("./authDatabase");
require("dotenv").config();
const Auth = require("./authModel");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new Auth({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res
      .status(201)
      .json({ message: "User registered successfully", userId: user._id });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      res.status(400).json({ message: "Invalid credentials" });
    }

    const user = await Auth.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Innvalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 24 * 3600000),
      });

      res.status(200).json({ message: "User login successful!!!" });
    } else {
      res.status(400).json({ message: "Login failed!!!" });
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

app.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.status(200).json({ message: "Logout SuccessFul!!" });
});

connectAuthDb()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Auth Service running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error("Auth DB connection failed:", err.message));
