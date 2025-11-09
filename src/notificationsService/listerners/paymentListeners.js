const { subscribe } = require("utils");
const sendEmail = require("../services/notificationServices");
const {
  paymentSuccess,
  paymentFailure,
} = require("../templates/paymentStatusTemplate");

const startPaymentListeners = async () => {
  console.log("💸 Payment event listener active...");

  subscribe("payment:success", async (data) => {
    console.log("✅ Received payment success event:", data);

    const subject = `🎉 Payment Successful & Order Confirmed (#${data.orderId})`;
    const html = paymentSuccess({
      userName: data.userName,
      orderId: data.orderId,
      transactionId: data.transactionId,
      amount: data.amount,
    });

    await sendEmail(data.userEmail, subject, html);
    console.log(`📨 Success email sent to ${data.userEmail}`);
  });

  subscribe("payment:failed", async (data) => {
    console.log("❌ Received payment failure event:", data);

    const subject = `⚠️ Payment Failed for Order #${data.orderId}`;
    const html = paymentFailure({
      userName: data.userName,
      orderId: data.orderId,
      amount: data.amount,
    });

    await sendEmail(data.userEmail, subject, html);
    console.log(` Failure email sent to ${data.userEmail}`);
  });
};

module.exports = startPaymentListeners;
