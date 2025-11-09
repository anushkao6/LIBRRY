import Fine from '../models/Fine.js';

// @desc    Get all fines (Admin) or user's fines (Member)
// @route   GET /api/fines
// @access  Private
export const getFines = async (req, res) => {
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
};

// @desc    Get single fine
// @route   GET /api/fines/:id
// @access  Private
export const getFine = async (req, res) => {
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
};

// @desc    Mark fine as paid (Admin only)
// @route   PUT /api/fines/:id/pay
// @access  Private (Admin only)
export const markFineAsPaid = async (req, res) => {
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
};

