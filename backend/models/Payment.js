import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  reference: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending',
  },
  description: {
    type: String,
    trim: true,
  },
  paymentMethod: {
    type: String,
    enum: ['upi', 'cash', 'card'],
    default: 'cash',
  },
  paymentDetails: {
    type: mongoose.Schema.Types.Mixed,
  },
}, {
  timestamps: true,
});

// Index for reference (unique)
paymentSchema.index({ reference: 1 }, { unique: true });

// Prevent transactionId index from being created
// If the index exists, it will cause errors - use drop-transactionId-index.js to remove it
paymentSchema.pre('save', function(next) {
  // Ensure no transactionId field exists
  if (this.transactionId !== undefined) {
    delete this.transactionId;
  }
  next();
});

export default mongoose.model('Payment', paymentSchema);

