import express from 'express';
import Book from '../models/Book.js';
import Issue from '../models/Issue.js';
import Fine from '../models/Fine.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Fine calculation: ₹10 per day overdue
const FINE_PER_DAY = 10;
const ISSUE_DURATION_DAYS = 14; // Books issued for 14 days

// @route   GET /api/books
// @desc    Get all books with search
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { query, category } = req.query;
    let searchQuery = {};

    if (query) {
      searchQuery.$or = [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
      ];
    }

    if (category) {
      searchQuery.category = { $regex: category, $options: 'i' };
    }

    const books = await Book.find(searchQuery)
      .populate('addedBy', 'username')
      .sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/books/search
// @desc    Search books
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Please provide a search query' });
    }

    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { isbn: { $regex: query, $options: 'i' } },
      ],
    })
      .populate('addedBy', 'username')
      .sort({ createdAt: -1 });

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/books/:id
// @desc    Get single book
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('addedBy', 'username');
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/books
// @desc    Add new book
// @access  Private (Admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, author, isbn, coverImage, description, category } = req.body;

    if (!title || !author) {
      return res.status(400).json({ message: 'Please provide title and author' });
    }

    const book = await Book.create({
      title,
      author,
      isbn,
      coverImage: coverImage || 'https://via.placeholder.com/300x400?text=No+Cover',
      description,
      category,
      addedBy: req.user._id,
    });

    const populatedBook = await Book.findById(book._id).populate('addedBy', 'username');
    res.status(201).json(populatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/books/:id
// @desc    Update book
// @access  Private (Admin only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const { title, author, isbn, coverImage, description, category, availability } = req.body;

    book.title = title || book.title;
    book.author = author || book.author;
    book.isbn = isbn || book.isbn;
    book.coverImage = coverImage || book.coverImage;
    book.description = description || book.description;
    book.category = category || book.category;
    if (availability !== undefined) book.availability = availability;

    const updatedBook = await book.save();
    const populatedBook = await Book.findById(updatedBook._id).populate('addedBy', 'username');
    res.json(populatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/books/:id
// @desc    Delete book
// @access  Private (Admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await book.deleteOne();
    res.json({ message: 'Book removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/books/:id/rate
// @desc    Rate a book
// @access  Private
router.put('/:id/rate', protect, async (req, res) => {
  try {
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Please provide a valid rating (1-5)' });
    }

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user already rated
    const existingRating = book.ratings.find(
      (r) => r.userId.toString() === req.user._id.toString()
    );

    if (existingRating) {
      existingRating.rating = rating;
    } else {
      book.ratings.push({
        userId: req.user._id,
        rating,
      });
    }

    await book.save();
    const updatedBook = await Book.findById(book._id).populate('addedBy', 'username');
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/books/:id/issue
// @desc    Issue a book
// @access  Private (Member only)
router.post('/:id/issue', protect, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if book is available
    if (!book.availability) {
      return res.status(400).json({ message: 'Book is not available' });
    }

    // Check if user already has this book issued
    const existingIssue = await Issue.findOne({
      userId: req.user._id,
      bookId: book._id,
      status: 'issued',
    });

    if (existingIssue) {
      return res.status(400).json({ message: 'You already have this book issued' });
    }

    // Calculate due date (14 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + ISSUE_DURATION_DAYS);

    // Create issue record
    const issue = await Issue.create({
      userId: req.user._id,
      bookId: book._id,
      dueDate,
    });

    // Update book availability
    book.availability = false;
    await book.save();

    const populatedIssue = await Issue.findById(issue._id)
      .populate('userId', 'username email')
      .populate('bookId', 'title author');

    res.status(201).json({
      message: 'Book issued successfully',
      issue: populatedIssue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/books/:id/return
// @desc    Return a book
// @access  Private (Member only)
router.post('/:id/return', protect, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Find active issue
    const issue = await Issue.findOne({
      userId: req.user._id,
      bookId: book._id,
      status: 'issued',
    });

    if (!issue) {
      return res.status(400).json({ message: 'No active issue found for this book' });
    }

    // Update issue
    issue.returnDate = new Date();
    issue.status = 'returned';
    await issue.save();

    // Calculate fine if overdue
    let fineAmount = 0;
    let daysOverdue = 0;

    if (issue.returnDate > issue.dueDate) {
      daysOverdue = Math.ceil(
        (issue.returnDate - issue.dueDate) / (1000 * 60 * 60 * 24)
      );
      fineAmount = daysOverdue * FINE_PER_DAY;

      // Create or update fine record
      await Fine.findOneAndUpdate(
        { issueId: issue._id },
        {
          userId: req.user._id,
          bookId: book._id,
          issueId: issue._id,
          amount: fineAmount,
          dueDate: issue.dueDate,
          returnDate: issue.returnDate,
          daysOverdue,
          status: 'pending',
        },
        { upsert: true, new: true }
      );
    }

    // Update book availability
    book.availability = true;
    await book.save();

    const populatedIssue = await Issue.findById(issue._id)
      .populate('userId', 'username email')
      .populate('bookId', 'title author');

    res.json({
      message: 'Book returned successfully',
      issue: populatedIssue,
      fine: fineAmount > 0 ? {
        amount: fineAmount,
        daysOverdue,
        status: 'pending',
      } : null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/books/my-issues
// @desc    Get user's issued books
// @access  Private
router.get('/my-issues', protect, async (req, res) => {
  try {
    const issues = await Issue.find({ userId: req.user._id })
      .populate('bookId', 'title author coverImage category')
      .sort({ createdAt: -1 });

    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

