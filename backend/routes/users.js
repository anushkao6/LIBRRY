import express from 'express';
import User from '../models/User.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/admin/users
// @desc    Get all users (Admin only)
// @access  Private (Admin only)
router.get('/', protect, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role (Admin only)
// @access  Private (Admin only)
router.put('/:id/role', protect, admin, async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !['admin', 'member'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be admin or member' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({
      message: 'User role updated successfully',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

