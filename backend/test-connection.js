const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const testConnection = async () => {
  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    console.log('📡 Using URI:', process.env.MONGO_URI.replace(/\/\/.*@/, '//*****:*****@'));
    
    // Remove the unsupported options - they are no longer needed
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`📊 Connected to: ${mongoose.connection.host}`);
    console.log(`🗄️  Database: ${mongoose.connection.name}`);
    
    await mongoose.disconnect();
    console.log('✅ Disconnected successfully');
  } catch (error) {
    console.error('❌ Connection Failed:', error.message);
    console.error('📝 Error details:', error);
  }
};

testConnection()
  .then(() => {
    console.log('🏁 Test completed');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Unhandled error:', err);
    process.exit(1);
  });