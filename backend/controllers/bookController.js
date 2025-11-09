import Book from '../models/Book.js';

// @desc    Get all books
// @route   GET /api/books
// @access  Public
export const getBooks = async (req, res) => {
  try {
    const { query, category } = req.query;
    let searchQuery = {};

    if (query) {
      searchQuery.$or = [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { isbn: { $regex: query, $options: 'i' } },
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
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
export const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('addedBy', 'username');
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add new book
// @route   POST /api/admin/books
// @access  Private (Admin only)
export const addBook = async (req, res) => {
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
      availability: true, // Always available - books can be issued by multiple people
      addedBy: req.user._id,
    });

    const populatedBook = await Book.findById(book._id).populate('addedBy', 'username');
    res.status(201).json(populatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update book
// @route   PUT /api/admin/books/:id
// @access  Private (Admin only)
export const updateBook = async (req, res) => {
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
};

// @desc    Delete book
// @route   DELETE /api/admin/books/:id
// @access  Private (Admin only)
export const deleteBook = async (req, res) => {
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
};

// @desc    Rate a book
// @route   PUT /api/books/:id/rate
// @access  Private
export const rateBook = async (req, res) => {
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
};

