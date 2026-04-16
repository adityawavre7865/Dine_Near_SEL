const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hotel name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    address: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop',
    },
    cuisine: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    openingTime: {
      type: String,
      default: '08:00',
    },
    closingTime: {
      type: String,
      default: '22:00',
    },
    phone: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Hotel', hotelSchema);
