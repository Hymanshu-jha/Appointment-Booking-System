import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userName: String,
  email: String,
  password: String,
  phone: String,

  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0],
    },
    address: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  refreshToken: {
    type: String,
    default: undefined
  },
  isSeller: {
    type: Boolean
  },
  isBuyer: {
    type: Boolean
  },
  imageUrl: {
    type: String,
    required: false
  }
});

const User = mongoose.model('User', userSchema);

export default User;