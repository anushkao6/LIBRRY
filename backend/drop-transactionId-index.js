/**
 * Script to drop the problematic transactionId index from MongoDB
 * Run this ONCE to fix the duplicate key error
 * 
 * Usage:
 * node drop-transactionId-index.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dropIndex = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('payments');

    // Get all indexes
    const indexes = await collection.indexes();
    console.log('\n📋 Current indexes:');
    indexes.forEach(idx => {
      console.log(`  - ${idx.name}: ${JSON.stringify(idx.key)}`);
    });

    // Try to drop transactionId index if it exists
    const indexNames = indexes.map(idx => idx.name);
    
    if (indexNames.includes('transactionId_1')) {
      try {
        await collection.dropIndex('transactionId_1');
        console.log('\n✅ Successfully dropped transactionId_1 index');
      } catch (error) {
        console.log('\n⚠️  Error dropping index:', error.message);
      }
    } else {
      console.log('\nℹ️  transactionId_1 index does not exist (already removed)');
    }

    // Also try to drop any other transactionId related indexes
    for (const index of indexes) {
      if (index.name.includes('transactionId') && index.name !== 'transactionId_1') {
        try {
          await collection.dropIndex(index.name);
          console.log(`✅ Dropped ${index.name} index`);
        } catch (error) {
          console.log(`⚠️  Could not drop ${index.name}:`, error.message);
        }
      }
    }

    // Verify indexes after cleanup
    const updatedIndexes = await collection.indexes();
    console.log('\n📋 Updated indexes:');
    updatedIndexes.forEach(idx => {
      console.log(`  - ${idx.name}: ${JSON.stringify(idx.key)}`);
    });

    console.log('\n✅ Index cleanup completed successfully!');
    console.log('💡 You can now restart your backend server.');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

dropIndex();

