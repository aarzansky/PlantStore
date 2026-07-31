const mongoose = require('mongoose');

const PlantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Plant name is required'],
  },
  // A plant can belong to more than one category (e.g. ['Succulents', 'Discounts']).
  // Categories themselves live in their own collection (see models/Category.js)
  // and are managed from the admin panel.
  categories: {
    type: [String],
    required: [true, 'At least one category is required'],
    validate: {
      validator: (value) => Array.isArray(value) && value.length > 0,
      message: 'At least one category is required',
    },
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  imageUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800',
  },
  stock: {
    type: Number,
    default: 10,
    min: 0,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  discountPercent: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Plant', PlantSchema);