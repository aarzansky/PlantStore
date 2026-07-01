const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Plant = require('./models/Plant');
const connectDB = require('./config/db');

dotenv.config();

// Use the same connectDB function
connectDB();

const plants = [
  {
    name: 'Monstera Deliciosa',
    category: 'Indoor Plants',
    price: 45.99,
    description: 'Beautiful Swiss Cheese plant with large, fenestrated leaves.',
    imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800',
    stock: 15,
    rating: 4.8,
  },
  {
    name: 'Snake Plant',
    category: 'Indoor Plants',
    price: 29.99,
    description: 'Low-maintenance plant with striking vertical leaves.',
    imageUrl: 'https://images.unsplash.com/photo-1593482892290-f54927b5f3ae?w=800',
    stock: 20,
    rating: 4.5,
  },
  {
    name: 'Fiddle Leaf Fig',
    category: 'Indoor Plants',
    price: 65.99,
    description: 'Statement plant with large, glossy leaves.',
    imageUrl: 'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=800',
    stock: 8,
    rating: 4.2,
  },
  {
    name: 'Succulent Collection',
    category: 'Succulents',
    price: 24.99,
    description: 'Set of 5 different succulents in 2-inch pots.',
    imageUrl: 'https://images.unsplash.com/photo-1509423350716-8a4b3ad4c4c2?w=800',
    stock: 30,
    rating: 4.7,
  },
  {
    name: 'Peace Lily',
    category: 'Flowering Plants',
    price: 34.99,
    description: 'Elegant plant with dark green leaves and beautiful white flowers.',
    imageUrl: 'https://images.unsplash.com/photo-1593121925328-369cc8459c08?w=800',
    stock: 12,
    rating: 4.3,
  },
  {
    name: 'Bonsai Tree',
    category: 'Plant Care',
    price: 79.99,
    description: 'Chinese Elm Bonsai - a living art piece.',
    imageUrl: 'https://images.unsplash.com/photo-1522898463849-f34fb98a9a2d?w=800',
    stock: 5,
    rating: 4.9,
  },
  {
    name: 'Terracotta Pot Set',
    category: 'Pots',
    price: 19.99,
    description: 'Set of 3 classic terracotta pots.',
    imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800',
    stock: 25,
    rating: 4.0,
  },
  {
    name: 'Herb Garden Kit',
    category: 'Plant Care',
    price: 39.99,
    description: 'Complete kit with basil, mint, and cilantro seeds.',
    imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800',
    stock: 18,
    rating: 4.4,
  },
];

const seedDatabase = async () => {
  try {
    await Plant.deleteMany({});
    console.log('🗑️  Cleared existing plants');
    
    await Plant.insertMany(plants);
    console.log('✅ Plants seeded successfully!');
    
    const count = await Plant.countDocuments();
    console.log(`📊 Total plants in database: ${count}`);
    
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding:', error);
    process.exit(1);
  }
};

seedDatabase();