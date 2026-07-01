const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Remove unsupported options - they're not needed in mongoose v9+
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;