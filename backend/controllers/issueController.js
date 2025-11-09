import Issue from '../models/Issue.js';

// @desc    Get all issues (Admin only)
// @route   GET /api/admin/issues
// @access  Private (Admin only)
export const getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate('userId', 'username email')
      .populate('bookId', 'title author coverImage category')
      .sort({ createdAt: -1 });

    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

