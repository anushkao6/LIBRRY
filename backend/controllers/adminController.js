import User from '../models/User.js';
import Book from '../models/Book.js';
import Issue from '../models/Issue.js';
import Fine from '../models/Fine.js';
import Payment from '../models/Payment.js';

const FINE_PER_DAY = 10;
const MAX_DAYS_BEFORE_FINE = 10;

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
export const getDashboardStats = async (req, res) => {
  try {
    // Total Members
    const totalMembers = await User.countDocuments({ role: 'member' });

    // Total Books
    const totalBooks = await Book.countDocuments();

    // Total Issued Books
    const totalIssuedBooks = await Issue.countDocuments({ status: 'issued' });

    // Total Pending Fines
    const pendingFines = await Fine.aggregate([
      {
        $match: { status: 'pending' },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    // Total Fines Collected
    const collectedFines = await Fine.aggregate([
      {
        $match: { status: 'paid' },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    // Get all issued books with user details
    const issuedBooks = await Issue.find({ status: 'issued' })
      .populate('userId', 'username email')
      .populate('bookId', 'title author')
      .sort({ createdAt: -1 });

    // Get all fines with user details
    const allFines = await Fine.find()
      .populate('userId', 'username email')
      .populate('bookId', 'title author')
      .sort({ createdAt: -1 });

    // Calculate and create fines for overdue books (issued more than 10 days)
    const now = new Date();
    const overdueIssues = await Issue.find({ 
      status: 'issued',
    }).populate('bookId', 'title author');

    for (const issue of overdueIssues) {
      const issueDate = issue.issueDate || issue.createdAt;
      const daysSinceIssue = Math.ceil(
        (now - issueDate) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceIssue > MAX_DAYS_BEFORE_FINE) {
        const daysOverdue = daysSinceIssue - MAX_DAYS_BEFORE_FINE;
        const fineAmount = daysOverdue * FINE_PER_DAY;

        // Check if fine already exists
        const existingFine = await Fine.findOne({ issueId: issue._id });
        
        if (!existingFine) {
          // Create fine record
          await Fine.create({
            userId: issue.userId,
            bookId: issue.bookId._id,
            issueId: issue._id,
            amount: fineAmount,
            dueDate: issue.dueDate,
            daysOverdue,
            status: 'pending',
          });
        } else if (existingFine.status === 'pending') {
          // Update existing pending fine
          existingFine.amount = fineAmount;
          existingFine.daysOverdue = daysOverdue;
          await existingFine.save();
        }
      }
    }

    // Refresh fines data after calculation
    const updatedFines = await Fine.find()
      .populate('userId', 'username email')
      .populate('bookId', 'title author')
      .sort({ createdAt: -1 });

    const updatedPendingFines = await Fine.aggregate([
      {
        $match: { status: 'pending' },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      stats: {
        totalMembers,
        totalBooks,
        totalIssuedBooks,
        totalPendingFines: updatedPendingFines[0]?.total || 0,
        pendingFinesCount: updatedPendingFines[0]?.count || 0,
        totalFinesCollected: collectedFines[0]?.total || 0,
        collectedFinesCount: collectedFines[0]?.count || 0,
      },
      issuedBooks: issuedBooks.map(issue => {
        const issueObj = issue.toObject ? issue.toObject() : issue;
        return {
          ...issueObj,
          issueDate: issueObj.issueDate || issueObj.createdAt || new Date(),
        };
      }),
      fines: updatedFines.map(fine => fine.toObject()),
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: error.message || 'Failed to load dashboard data' });
  }
};

// @desc    Mark book as returned (Admin)
// @route   PUT /api/admin/issues/:id/return
// @access  Private (Admin only)
export const markBookReturned = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    if (issue.status === 'returned') {
      return res.status(400).json({ message: 'Book already returned' });
    }

    // Update issue
    issue.returnDate = new Date();
    issue.status = 'returned';
    await issue.save();

    // Calculate fine if overdue
    let fineAmount = 0;
    let daysOverdue = 0;

    const issueDate = issue.issueDate || issue.createdAt;
    const daysSinceIssue = Math.ceil(
      (issue.returnDate - issueDate) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceIssue > MAX_DAYS_BEFORE_FINE) {
      daysOverdue = daysSinceIssue - MAX_DAYS_BEFORE_FINE;
      fineAmount = daysOverdue * FINE_PER_DAY;

      // Create or update fine record
      await Fine.findOneAndUpdate(
        { issueId: issue._id },
        {
          userId: issue.userId,
          bookId: issue.bookId,
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

    const populatedIssue = await Issue.findById(issue._id)
      .populate('userId', 'username email')
      .populate('bookId', 'title author');

    res.json({
      message: 'Book marked as returned',
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

