require("dotenv").config();
const { connectRedisDB, subscribe } = require("../utils/eventBus");
const sendEmail = require("./services/notificationServices");
const signUpTemplate = require("./templates/signupTemplates");
const profileUpdatedTemplate = require("./templates/profileUpdateTemplate");
const {
  vendorApplicationReceived,
  vendorAccepted,
  vendorRejected,
} = require("./templates/vendorEmailTemplates");

const startNotificationListener = async () => {
  await connectRedisDB();

  subscribe("user:signedUp", async (data) => {
    const subject = `👋 Hey ${data.firstName}, Your Shopping Adventure Starts Now!`;
    const html = signUpTemplate(data.firstName);

    await sendEmail(data.emailId, subject, html);
  });

  subscribe("user:profileUpdated", async (data) => {
    const subject = ` Profile Updated, ${data.firstName}`;
    const html = profileUpdatedTemplate(data.firstName);

    await sendEmail(data.emailId, subject, html);
  });

  subscribe("vendor:applied", async (data) => {
    const subject = `We've received your vendor application for ${data.businessName}`;
    const html = vendorApplicationReceived({
      contactName: data.contactName,
      businessName: data.businessName,
    });
    await sendEmail(data.contactEmail, subject, html);
  });

  subscribe("vendor:decision", async (data) => {
    const { contactName, contactEmail, businessName, status, rejectionReason } =
      data;

    let subject, html;
    if (status === "approved") {
      subject = `🎉 Congratulations! Your vendor application for ${businessName} is approved`;
      html = vendorAccepted({
        contactName,
        businessName,
      });
    } else if (status === "rejected") {
      subject = `Your vendor application for ${businessName} was rejected`;
      html = vendorRejected({
        firstName: contactName,
        businessName,
        rejectionReason,
      });
    }
    console.log(firstName);
    await sendEmail(contactEmail, subject, html);
  });
};

startNotificationListener();
