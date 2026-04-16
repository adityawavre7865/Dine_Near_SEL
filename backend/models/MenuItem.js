const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snacks', 'beverages', 'desserts', 'other'],
      default: 'other',
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isVeg: {
      type: Boolean,
      default: true,
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
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);
