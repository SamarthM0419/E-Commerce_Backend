require("dotenv").config();
const mailTransporter = require("../config/mailConfig");

const sendEmail = async (to, subject, html) => {
  try {
    const emailInfo = await mailTransporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    console.log(emailInfo.messageId);
    return emailInfo;
  } catch (error) {
    console.error(" Email sending failed:", error.message);
  }
};

module.exports = sendEmail;
