const express = require("express");
const { userAuth } = require("../middlewares/authMiddleware");
const { validateEditProfileData } = require("../utils/validation");
const Auth = require("../authModel");
const bcrypt = require("bcrypt");
const profileRouter = express.Router();
const { publish } = require("../../utils/eventBus.js");
const validator = require("validator");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({ data: user, message: "Profile Fetched Successful" });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      return res.status(400).json({ message: "Invalid Edit request" });
    }

    const loggedInUser = await Auth.findById(req.user._id);

    if (!loggedInUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.body.emailId && !validator.isEmail(req.body.emailId)) {
      return res.status(400).json({ message: "Invalid EmailId" });
    }

    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    await loggedInUser.save();

    if (loggedInUser.emailId) {
      await publish("user:profileUpdated", {
        emailId: loggedInUser.emailId,
        firstName: loggedInUser.firstName,
      });
    }

    return res.status(200).json({
      message: `${loggedInUser.firstName}, your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});


profileRouter.patch("/profile/changePassword", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.send(400).json({ message: "Old and New Passwords Required" });
    }

    const loggedInUser = req.user;
    const loggedInUserPassword = await Auth.findById(loggedInUser._id).select(
      "password"
    );

    const isMatch = await bcrypt.compare(
      oldPassword,
      loggedInUserPassword.password
    );
    if (!isMatch) {
      res.status(400).json({ message: "Incorrect Old password" });
    }

    const hashNewPassword = await bcrypt.hash(newPassword, 10);
    loggedInUser.password = hashNewPassword;
    await loggedInUser.save();

    res.status(200).json({ message: "Password Updated Successfully...." });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = profileRouter;
