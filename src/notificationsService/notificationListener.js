require("dotenv").config();
const { connectRedisDB } = require("utils");
const startUserListeners = require("./listerners/userEventListeners");
const startVendorListeners = require("./listerners/vendorListeners");
const startPaymentListeners = require("./listerners/paymentListeners");

const startNotificationService = async () => {
  await connectRedisDB();
  console.log("🚀 Notification Service connected to Redis");

  startUserListeners();
  startVendorListeners();
  startPaymentListeners(); 
};

startNotificationService();

