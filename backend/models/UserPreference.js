const mongoose = require('mongoose');

const userPreferenceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    favoriteHotels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
      },
    ],
    favoriteItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
      },
    ],
    dietaryPreferences: {
      type: [String],
      enum: ['veg', 'non-veg', 'vegan', 'gluten-free'],
      default: [],
    },
    preferredCuisines: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('UserPreference', userPreferenceSchema);
