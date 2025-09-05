const nodeMailer = require("nodemailer");
require("dotenv").config();

const mailTransporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

module.exports = mailTransporter;
