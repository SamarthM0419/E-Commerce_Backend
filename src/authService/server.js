const express = require("express");
const connectAuthDb = require("./authDatabase");
require("dotenv").config();
const Auth = require("./authModel");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());

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

connectAuthDb()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Auth Service running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error("Auth DB connection failed:", err.message));
