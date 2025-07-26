import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },

    provider: {
      type: String,
      enum: ["stripe", "razorpay", "cash", "test"],
      default: "stripe",
    },

    stripePaymentIntentId: {
      type: String,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      enum: ["INR", "USD"],
      default: "INR",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "payment_successful",
        "payment_failed",
        "refund_initiated",
        "refund_successful",
      ],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
