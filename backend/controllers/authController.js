import User from '../models/User.js';
import Payment from '../models/Payment.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user (Admin or Member)
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { username, email, password, role, paymentMethod, paymentDetails } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Admin registration is FREE
    if (role === 'admin') {
      // Check if admin already exists (only one admin allowed)
      const existingAdmin = await User.findOne({ role: 'admin' });
      if (existingAdmin) {
        return res.status(400).json({ 
          message: 'Admin user already exists. Only one admin account is allowed.' 
        });
      }

      // Create admin user (no payment required)
      const user = await User.create({
        username,
        email,
        password,
        role: 'admin',
      });

      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      // Member registration requires ₹200 payment
      const memberFee = 200;
      
      // Process member registration payment (dummy payment)
      if (!paymentMethod) {
        return res.status(400).json({ 
          message: 'Member registration requires payment. Please select a payment method.',
          memberFee 
        });
      }

      // Create member user first
      const user = await User.create({
        username,
        email,
        password,
        role: 'member',
      });

      // Create dummy payment record (always success)
      // Generate unique reference to avoid duplicate key errors
      let reference;
      let payment;
      let attempts = 0;
      const maxAttempts = 5;

      // Try to create payment with unique reference
      while (attempts < maxAttempts) {
        try {
          reference = `MEMBER-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
          payment = await Payment.create({
            userId: user._id,
            amount: memberFee,
            reference,
            status: 'success', // Dummy payment - always success
            description: 'Member Registration Fee',
            paymentMethod,
            paymentDetails: paymentDetails || {},
          });
          break; // Success, exit loop
        } catch (error) {
          if (error.code === 11000 && error.keyPattern?.reference) {
            // Duplicate reference, try again
            attempts++;
            if (attempts >= maxAttempts) {
              throw new Error('Failed to create payment. Please try again.');
            }
            // Wait a bit before retrying
            await new Promise(resolve => setTimeout(resolve, 100));
          } else {
            throw error; // Other error, rethrow
          }
        }
      }

      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
        payment: {
          reference: payment.reference,
          amount: payment.amount,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check for user
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

