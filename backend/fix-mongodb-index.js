/**
 * Script to fix MongoDB duplicate key error
 * Run this once to drop the problematic transactionId index
 * 
 * Usage:
 * node fix-mongodb-index.js
 * 
 * Or run in MongoDB shell:
 * db.payments.dropIndex("transactionId_1")
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const fixIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('payments');

    // Get all indexes
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes);

    // Try to drop transactionId index if it exists
    try {
      await collection.dropIndex('transactionId_1');
      console.log('✅ Dropped transactionId_1 index');
    } catch (error) {
      if (error.code === 27) {
        console.log('ℹ️  transactionId_1 index does not exist (already removed)');
      } else {
        console.log('⚠️  Error dropping index:', error.message);
      }
    }

    // Verify indexes
    const updatedIndexes = await collection.indexes();
    console.log('Updated indexes:', updatedIndexes);

    console.log('✅ Index fix completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

fixIndex();

