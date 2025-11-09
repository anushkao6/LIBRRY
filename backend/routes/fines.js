import express from 'express';
import Fine from '../models/Fine.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/fines
// @desc    Get all fines (Admin) or user's fines (Member)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};

    // Members can only see their own fines
    if (req.user.role !== 'admin') {
      query.userId = req.user._id;
    }

    const fines = await Fine.find(query)
      .populate('userId', 'username email')
      .populate('bookId', 'title author')
      .populate('issueId')
      .sort({ createdAt: -1 });

    res.json(fines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/fines/:id
// @desc    Get single fine
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const fine = await Fine.findById(req.params.id)
      .populate('userId', 'username email')
      .populate('bookId', 'title author')
      .populate('issueId');

    if (!fine) {
      return res.status(404).json({ message: 'Fine not found' });
    }

    // Members can only access their own fines
    if (req.user.role !== 'admin' && fine.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(fine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/fines/:id/pay
// @desc    Mark fine as paid (Admin only)
// @access  Private (Admin only)
router.put('/:id/pay', protect, admin, async (req, res) => {
  try {
    const fine = await Fine.findById(req.params.id);

    if (!fine) {
      return res.status(404).json({ message: 'Fine not found' });
    }

    fine.status = 'paid';
    fine.paidAt = new Date();
    await fine.save();

    const populatedFine = await Fine.findById(fine._id)
      .populate('userId', 'username email')
      .populate('bookId', 'title author');

    res.json({
      message: 'Fine marked as paid',
      fine: populatedFine,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/fines/stats/summary
// @desc    Get fine statistics (Admin only)
// @access  Private (Admin only)
router.get('/stats/summary', protect, admin, async (req, res) => {
  try {
    const totalFines = await Fine.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalPaid: {
            $sum: {
              $cond: [{ $eq: ['$status', 'paid'] }, '$amount', 0],
            },
          },
          totalPending: {
            $sum: {
              $cond: [{ $eq: ['$status', 'pending'] }, '$amount', 0],
            },
          },
          count: { $sum: 1 },
          paidCount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'paid'] }, 1, 0],
            },
          },
          pendingCount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'pending'] }, 1, 0],
            },
          },
        },
      },
    ]);

    const stats = totalFines[0] || {
      totalAmount: 0,
      totalPaid: 0,
      totalPending: 0,
      count: 0,
      paidCount: 0,
      pendingCount: 0,
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

