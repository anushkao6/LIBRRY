import mongoose from 'mongoose';

const fineSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  issueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  returnDate: {
    type: Date,
  },
  daysOverdue: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending',
  },
  paidAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Fine', fineSchema);

