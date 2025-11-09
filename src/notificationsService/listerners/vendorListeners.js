const { subscribe } = require("utils");
const sendEmail = require("../services/notificationServices");
const {
  vendorApplicationReceived,
  vendorAccepted,
  vendorRejected,
} = require("../templates/vendorEmailTemplates");

const startVendorListeners = async () => {
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
      html = vendorAccepted({ contactName, businessName });
    } else {
      subject = `Your vendor application for ${businessName} was rejected`;
      html = vendorRejected({
        firstName: contactName,
        businessName,
        rejectionReason,
      });
    }

    await sendEmail(contactEmail, subject, html);
  });
};

module.exports = startVendorListeners;
