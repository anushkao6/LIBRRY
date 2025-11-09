# Fix MongoDB Duplicate Key Error

## Problem
Error: `E11000 duplicate key error collection: test.payments index: transactionId_1 dup key: { transactionId: null }`

## Solution

### Option 1: Run the Fix Script (Recommended)
```bash
cd backend
node fix-mongodb-index.js
```

### Option 2: Manual Fix in MongoDB

**Using MongoDB Shell:**
```javascript
use test  // or your database name
db.payments.dropIndex("transactionId_1")
```

**Using MongoDB Compass:**
1. Open MongoDB Compass
2. Connect to your database
3. Go to `payments` collection
4. Click on "Indexes" tab
5. Find `transactionId_1` index
6. Click the trash icon to delete it

### Option 3: Drop and Recreate Collection (Last Resort)
```javascript
// WARNING: This will delete all payment data
db.payments.drop()
```

## What Was Fixed

1. **Removed `transactionId` field** from Payment model (not needed for dummy payments)
2. **Removed the problematic index** that was causing duplicate key errors
3. **Kept only `reference` index** which is unique and properly indexed

## After Fix

The payment system will work without the duplicate key error. All payments will use the `reference` field for uniqueness, which is generated uniquely for each payment.

