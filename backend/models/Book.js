import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
}, { timestamps: true });

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a book title'],
    trim: true,
  },
  author: {
    type: String,
    required: [true, 'Please provide an author name'],
    trim: true,
  },
  isbn: {
    type: String,
    trim: true,
  },
  coverImage: {
    type: String,
    default: 'https://via.placeholder.com/300x400?text=No+Cover',
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    trim: true,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  ratings: [ratingSchema],
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Calculate average rating
bookSchema.virtual('averageRating').get(function () {
  if (this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
  return (sum / this.ratings.length).toFixed(1);
});

bookSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Book', bookSchema);

