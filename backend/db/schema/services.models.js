import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    enum: ["USD", "INR"],
    required: true,
  },
  serviceTime: {
    type: Number, // in minutes
    required: true,
    min: 1,
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
  workingHours: {
    start: {
      type: Number,
      required: true,
      min: 0,
      max: 24,
    },
    end: {
      type: Number,
      required: true,
      min: 0,
      max: 24,
    },
  },
  imageUrl: {
    type: String,
  },

    rating: {
    type: Number,
    default: 4.3
  },

  reviews: {
    type: []
  },

  description: {
    type: String,
    required: true
  }
});

const Service = mongoose.model("Service", serviceSchema);
export default Service;
