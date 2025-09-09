require("dotenv").config();
const { connectRedisDB, subscribe } = require("../utils/eventBus");
const sendEmail = require("./services/notificationServices");
const signUpTemplate = require("./templates/signupTemplates");

const startNotificationListener = async () => {
  await connectRedisDB();

  subscribe("user:signedUp", async (data) => {
    const subject = `👋 Hey ${data.firstName}, Your Shopping Adventure Starts Now!`;
    const html = signUpTemplate(data.firstName);

    await sendEmail(data.emailId, subject, html);
  });
};

startNotificationListener();
