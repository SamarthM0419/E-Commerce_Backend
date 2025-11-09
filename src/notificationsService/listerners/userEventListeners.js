const { subscribe } = require("utils");
const sendEmail = require("../services/notificationServices");
const signUpTemplate = require("../templates/signupTemplates");
const profileUpdatedTemplate = require("../templates/profileUpdateTemplate");

const startUserListeners = async () => {
  subscribe("user:signedUp", async (data) => {
    const subject = `👋 Hey ${data.firstName}, Your Shopping Adventure Starts Now!`;
    const html = signUpTemplate(data.firstName);
    await sendEmail(data.emailId, subject, html);
  });

  subscribe("user:profileUpdated", async (data) => {
    const subject = `Profile Updated, ${data.firstName}`;
    const html = profileUpdatedTemplate(data.firstName);
    await sendEmail(data.emailId, subject, html);
  });
};

module.exports = startUserListeners;
