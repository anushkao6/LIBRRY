import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI is not defined in .env file');
      console.log('⚠️  Server will start but database operations will fail');
      return;
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('⚠️  Server will start but database operations will fail');
    console.log('💡 Please check your MONGO_URI in the .env file');
  }
};

export default connectDB;

