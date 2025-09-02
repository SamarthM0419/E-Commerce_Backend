const express = require("express");
const { userAuth } = require("../middlewares/authMiddleware");
const { validateEditProfileData } = require("../utils/validation");
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({ data: user, message: "Successful" });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      return res.status(400).json({
        message: "Invalid Edit request",
      });
    }

    const loggedInUser = req.user;
    if (!validator.isEmail(req.body.emailId)) {
      res.status(200).json({ message: "Invalid EmailId" });
    }

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    return res.status(200).json({
      message: `${loggedInUser.firstName} , your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = profileRouter;
