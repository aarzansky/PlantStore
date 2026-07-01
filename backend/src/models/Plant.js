const mongoose = require('mongoose');

const PlantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Plant name is required'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Pots', 'Outdoor Plants', 'Plant Care', 'Aquatic Plants', 
           'Creepers', 'Succulents', 'Fruits', 'Indoor Plants', 'Flowering Plants'],
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Plant', PlantSchema);