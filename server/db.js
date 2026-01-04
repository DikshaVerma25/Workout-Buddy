const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/workout-buddy';

let isConnected = false;

async function connectDB() {
  if (isConnected) {
    console.log('✅ MongoDB already connected');
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      // These options are recommended for MongoDB Atlas
      // They're safe to use even if not needed
    });
    
    isConnected = true;
    console.log('✅ MongoDB connected successfully');
    console.log('Database:', mongoose.connection.name);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    isConnected = false;
    throw error;
  }
}

// Handle connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  isConnected = false;
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
  isConnected = false;
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
});

module.exports = { connectDB, mongoose };

