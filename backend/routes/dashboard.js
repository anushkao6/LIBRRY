import express from 'express';
import Book from '../models/Book.js';
import User from '../models/User.js';
import Issue from '../models/Issue.js';
import Fine from '../models/Fine.js';
import Payment from '../models/Payment.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics (Admin only)
// @access  Private (Admin only)
router.get('/', protect, admin, async (req, res) => {
  try {
    // Total Books
    const totalBooks = await Book.countDocuments();

    // Total Members
    const totalMembers = await User.countDocuments({ role: 'member' });

    // Issued Books
    const issuedBooks = await Issue.countDocuments({ status: 'issued' });

    // Pending Returns (books with due date passed but not returned)
    const now = new Date();
    const pendingReturns = await Issue.countDocuments({
      status: 'issued',
      dueDate: { $lt: now },
    });

    // Total Fines Collected
    const finesStats = await Fine.aggregate([
      {
        $group: {
          _id: null,
          totalCollected: {
            $sum: {
              $cond: [{ $eq: ['$status', 'paid'] }, '$amount', 0],
            },
          },
          totalPending: {
            $sum: {
              $cond: [{ $eq: ['$status', 'pending'] }, '$amount', 0],
            },
          },
        },
      },
    ]);

    const totalFinesCollected = finesStats[0]?.totalCollected || 0;
    const totalFinesPending = finesStats[0]?.totalPending || 0;

    // Books by Category
    const booksByCategory = await Book.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Recent Issues (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentIssues = await Issue.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Popular Books (most issued)
    const popularBooks = await Issue.aggregate([
      {
        $group: {
          _id: '$bookId',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const popularBooksDetails = await Book.find({
      _id: { $in: popularBooks.map((b) => b._id) },
    }).select('title author coverImage');

    // Monthly Revenue (from payments)
    const monthlyPayments = await Payment.aggregate([
      {
        $match: {
          status: 'success',
          createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m', date: '$createdAt' },
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      overview: {
        totalBooks,
        totalMembers,
        issuedBooks,
        pendingReturns,
        totalFinesCollected,
        totalFinesPending,
      },
      charts: {
        booksByCategory,
        recentIssues,
        popularBooks: popularBooksDetails.map((book, index) => ({
          ...book.toObject(),
          issueCount: popularBooks[index]?.count || 0,
        })),
        monthlyPayments,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

