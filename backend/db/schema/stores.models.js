import mongoose from "mongoose";


const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ownername: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String, // ✅ fixed typo
    required: false,
  },
  category: {
    type: String,
    enum: {
      values: [
  'salon',
  'counselling',
  'physiotherapy',
  'dental clinic',
  'spa',
  'legal consultant',
  'nutritionist',
  'diagnostic center',
  'veterinary clinic',
  'home cleaning',
  'appliance repair',
  'driving school',
  'photography studio',
  'makeup artist',
  'tattoo studio',
  'massage therapy',
  'astrology',
],
      message: "`{VALUE}` is not a valid category",
    },
    required: true,
  },
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
    updatedAt: Date,
  },

  rating: {
    type: Number,
    default: 4.3
  },

  reviews: {
    type: [String],
    default: []
  },

  description: {
    type: String,
    required: true
  },

});

const Store = mongoose.model('Store', storeSchema);

export default Store;
