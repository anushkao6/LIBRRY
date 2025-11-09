import express from 'express';
import Payment from '../models/Payment.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Generate random reference
const generateReference = () => {
  return `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

// @route   POST /api/payment/process
// @desc    Simulate payment processing
// @access  Private
router.post('/process', protect, async (req, res) => {
  try {
    const { amount, description, paymentMethod, paymentDetails } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Please provide a valid amount' });
    }

    if (!paymentMethod || !['upi', 'cash', 'card'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Please provide a valid payment method (upi, cash, or card)' });
    }

    const reference = generateReference();

    // Simulate payment processing based on method
    // UPI and Card: usually success, Cash: always success
    let status = 'success';
    if (paymentMethod === 'upi' || paymentMethod === 'card') {
      status = Math.random() > 0.2 ? 'success' : 'pending';
    }

    const payment = await Payment.create({
      userId: req.user._id,
      amount,
      reference,
      status,
      description: description || 'Library service payment',
      paymentMethod,
      paymentDetails: paymentDetails || {},
    });

    res.status(201).json({
      message: 'Payment processed',
      payment: {
        _id: payment._id,
        amount: payment.amount,
        reference: payment.reference,
        status: payment.status,
        description: payment.description,
        paymentMethod: payment.paymentMethod,
        createdAt: payment.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/payment/status/:reference
// @desc    Get payment status
// @access  Private
router.get('/status/:reference', protect, async (req, res) => {
  try {
    const payment = await Payment.findOne({
      reference: req.params.reference,
      userId: req.user._id,
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({
      reference: payment.reference,
      status: payment.status,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      createdAt: payment.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/payment/history/:userId
// @desc    Get payment history
// @access  Private
router.get('/history/:userId', protect, async (req, res) => {
  try {
    // Ensure user can only access their own history
    if (req.params.userId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const payments = await Payment.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/payment/verify
// @desc    Simulate payment verification
// @access  Private
router.post('/verify', protect, async (req, res) => {
  try {
    const { reference } = req.body;

    if (!reference) {
      return res.status(400).json({ message: 'Please provide a payment reference' });
    }

    const payment = await Payment.findOne({
      reference,
      userId: req.user._id,
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Simulate verification (update status if pending)
    if (payment.status === 'pending') {
      payment.status = Math.random() > 0.2 ? 'success' : 'failed';
      await payment.save();
    }

    res.json({
      verified: true,
      reference: payment.reference,
      status: payment.status,
      amount: payment.amount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

