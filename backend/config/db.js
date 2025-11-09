import mongoose from 'mongoose';

// Track connection status
let isConnected = false;

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI is not defined in .env file');
      console.log('⚠️  Server will start but database operations will fail');
      isConnected = false;
      return;
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    isConnected = true;
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
      isConnected = false;
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
      isConnected = false;
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
      isConnected = true;
    });
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('⚠️  Server will start but database operations will fail');
    console.log('💡 Please check your MONGO_URI in the .env file');
    isConnected = false;
  }
};

// Check if database is connected
export const checkDBConnection = () => {
  return isConnected && mongoose.connection.readyState === 1;
};

export default connectDB;

