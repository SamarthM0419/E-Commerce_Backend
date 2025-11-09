const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    orderRefId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userRefId: { type: mongoose.Schema.Types.ObjectId, required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, default: "mock" },
    transactionId: String,
    status: {
      type: String,
      enum: ["initiated", "success", "failed"],
      default: "initiated",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
