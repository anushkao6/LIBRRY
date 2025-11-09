import Issue from '../models/Issue.js';
import Fine from '../models/Fine.js';
import Book from '../models/Book.js';

// @desc    Issue a book
// @route   POST /api/member/issue
// @access  Private (Member only)
export const issueBook = async (req, res) => {
  try {
    const { bookId } = req.body;

    if (!bookId) {
      return res.status(400).json({ message: 'Please provide book ID' });
    }

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
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

    // Calculate due date (10 days from now)
    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 10);

    // Create issue record (books can be issued by multiple people)
    const issue = await Issue.create({
      userId: req.user._id,
      bookId: book._id,
      issueDate,
      dueDate,
    });

    // Don't update book availability - books can be issued by multiple people

    const populatedIssue = await Issue.findById(issue._id)
      .populate('userId', 'username email')
      .populate('bookId', 'title author coverImage category')
      .lean();

    res.status(201).json({
      message: 'Book issued successfully',
      issue: {
        ...populatedIssue,
        issueDate: populatedIssue.issueDate || populatedIssue.createdAt,
        _id: populatedIssue._id.toString(),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Return a book
// @route   POST /api/member/return
// @access  Private (Member only)
export const returnBook = async (req, res) => {
  try {
    const { bookId } = req.body;

    if (!bookId) {
      return res.status(400).json({ message: 'Please provide book ID' });
    }

    const book = await Book.findById(bookId);

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

    // Calculate fine if overdue (more than 10 days)
    let fineAmount = 0;
    let daysOverdue = 0;
    const FINE_PER_DAY = 10;
    const MAX_DAYS_BEFORE_FINE = 10;

    const daysSinceIssue = Math.ceil(
      (issue.returnDate - issue.issueDate) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceIssue > MAX_DAYS_BEFORE_FINE) {
      daysOverdue = daysSinceIssue - MAX_DAYS_BEFORE_FINE;
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

    // Don't update book availability - books remain available for others

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
};

// @desc    Get member's issued books
// @route   GET /api/member/issues
// @access  Private (Member only)
export const getMyIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ userId: req.user._id })
      .populate('bookId', 'title author coverImage category')
      .sort({ createdAt: -1 })
      .lean();

    // Ensure issueDate is set for all issues
    const issuesWithDates = issues.map(issue => ({
      ...issue,
      issueDate: issue.issueDate || issue.createdAt,
      _id: issue._id.toString(),
    }));

    res.json(issuesWithDates);
  } catch (error) {
    console.error('Get my issues error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get member's fines
// @route   GET /api/member/fines
// @access  Private (Member only)
export const getMyFines = async (req, res) => {
  try {
    const fines = await Fine.find({ userId: req.user._id })
      .populate('bookId', 'title author')
      .populate('issueId')
      .sort({ createdAt: -1 });

    const totalPending = fines
      .filter(f => f.status === 'pending')
      .reduce((sum, f) => sum + f.amount, 0);

    res.json({
      fines,
      totalPending,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Pay fine
// @route   POST /api/member/fines/:id/pay
// @access  Private (Member only)
export const payFine = async (req, res) => {
  try {
    const fine = await Fine.findById(req.params.id);

    if (!fine) {
      return res.status(404).json({ message: 'Fine not found' });
    }

    if (fine.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (fine.status === 'paid') {
      return res.status(400).json({ message: 'Fine already paid' });
    }

    fine.status = 'paid';
    fine.paidAt = new Date();
    await fine.save();

    res.json({
      message: 'Fine paid successfully',
      fine,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

