import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },

    appointmentDate: {
      type: Date,
      required: true,
    },

    // Option A: Store as object with start/end times
    appointmentTime: {
      start: {
        type: String, // e.g., "11:00 am"
        required: true,
      },
      end: {
        type: String, // e.g., "12:00 pm"
        required: true,
      }
    },

    // Option B: Alternative - store as full datetime
    // appointmentStartTime: {
    //   type: Date,
    //   required: true,
    // },
    // appointmentEndTime: {
    //   type: Date,
    //   required: true,
    // },

    status: {
      type: String,
      enum: ["pending", "scheduled", "delivering", "completed", "cancelled"],
      default: "pending",
    },

    cancellationReason: {
      type: String,
    },

    notes: {
      type: String,
    },

    paymentIntentId: {
      type: String,
    },

    checkoutSessionId: {
      type: String,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "succeeded", "failed", "refunded", "partial_refund"],
      default: "pending",
    },

    amountPaid: {
      type: Number,
    },

    currency: {
      type: String,
      default: "usd",
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;