/**
 * Script to set all books to available=true
 * Run this once to fix existing books
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from './models/Book.js';

dotenv.config();

const fixBooks = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Update all books to be available
    const result = await Book.updateMany(
      {},
      { $set: { availability: true } }
    );

    console.log(`\n✅ Updated ${result.modifiedCount} books to available=true`);
    console.log(`📚 Total books: ${result.matchedCount}`);
    
    await mongoose.connection.close();
    console.log('✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

fixBooks();

