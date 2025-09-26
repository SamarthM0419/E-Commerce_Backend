module.exports = {
  vendorApply: ({ businessName, contactName, contactEmail, applicationDate }) => {
    return `
      <h2>🚀 New Vendor Application Alert!</h2>
      <p>Hello Admin,</p>
      <p>A new vendor has just applied to join our platform. Here are the details:</p>
      <ul>
        <li><b>Business Name:</b> ${businessName}</li>
        <li><b>Contact Name:</b> ${contactName}</li>
        <li><b>Contact Email:</b> ${contactEmail}</li>
        <li><b>Application Date:</b> ${applicationDate}</li>
      </ul>
      <p>Kindly review and approve or reject the application at your earliest convenience ✅</p>
      <br/>
      <p>Cheers,</p>
      <p><b>The Platform Team 🌟</b></p>
    `;
  },

  vendorApplicationReceived: ({ contactName, businessName }) => {
    return `
      <h2>🙌 Hi ${contactName},</h2>
      <p>Thank you for applying to become a vendor with us!</p>
      <p>Your application for <b>${businessName}</b> has been received and is currently under review.</p>
      <p>Our team will get back to you shortly with the next steps.</p>
      <br/>
      <p>Best regards,</p>
      <p><b>The Team 💼✨</b></p>
    `;
  },

  
  vendorAccepted: ({ firstName, businessName }) => {
    return `
      <h2>🎉 Congratulations ${firstName}!</h2>
      <p>Your vendor application for <b>${businessName}</b> has been approved!</p>
      <p>You're now officially part of our platform family. You can start listing your products and reach your customers right away.</p>
      <br/>
      <p>Welcome aboard,</p>
      <p><b>The Platform Team 💼✨</b></p>
    `;
  },

  vendorRejected: ({ firstName, businessName, rejectionReason }) => {
    return `
      <h2>Hi ${firstName},</h2>
      <p>Thank you for your interest in joining our platform as a vendor.</p>
      <p>We regret to inform you that your application for <b>${businessName}</b> was not approved at this time 😔</p>
      ${rejectionReason ? `<p><b>Reason:</b> ${rejectionReason}</p>` : ""}
      <p>Don't be discouraged! You can reach out to our support team for clarification or reapply in the future.</p>
      <br/>
      <p>Best wishes,</p>
      <p><b>The Platform Team 🌟</b></p>
    `;
  },
};
