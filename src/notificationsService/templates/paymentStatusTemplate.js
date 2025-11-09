module.exports = {
  paymentSuccess: ({ userName, orderId, transactionId, amount }) => {
    return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333;">
        <h2 style="color: #2ecc71;">🎉 Payment Successful!</h2>
        <p>Hey <b>${userName}</b>,</p>
        <p>We’re thrilled to let you know your payment of <b>₹${amount}</b> went through smoothly!</p>
        <p>Your order <b>#${orderId}</b> has been confirmed and is being prepared just for you. 🛍️</p>

        <div style="background: #f8f9fa; border-left: 4px solid #2ecc71; padding: 10px 15px; margin: 15px 0;">
          <p style="margin: 6px 0;">💳 <b>Transaction ID:</b> ${transactionId}</p>
          <p style="margin: 6px 0;">📦 <b>Status:</b> Order Placed</p>
        </div>

        <p>We’ll notify you once your order ships. You can relax — we’ve got this! 😄</p>

        <br/>
        <p>With gratitude,</p>
        <p><b>The Team</b></p>
      </div>
    `;
  },

  paymentFailure: ({ userName, orderId, amount, retryPaymentLink }) => {
    return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333;">
        <h2 style="color: #e74c3c;">❌ Payment Failed</h2>
        <p>Hi <b>${userName}</b>,</p>
        <p>We noticed your payment of <b>₹${amount}</b> for order <b>#${orderId}</b> didn’t go through.</p>
        
        <div style="background: #fff3f3; border-left: 4px solid #e74c3c; padding: 10px 15px; margin: 15px 0;">
          <p style="margin: 6px 0;">💳 <b>Status:</b> Payment Unsuccessful</p>
          <p style="margin: 6px 0;">⚠️ Don’t worry — your order hasn’t been processed yet.</p>
        </div>

        <p>You can retry your payment by visiting your orders page or contacting our support team for help.</p>
        
        </div>

        <br/>
        <p>We’re here to help you complete your purchase. 💬</p>
        <p><b>The Team</b></p>
      </div>
    `;
  },
};
