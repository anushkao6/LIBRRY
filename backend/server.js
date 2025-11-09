import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import fineRoutes from './routes/fineRoutes.js';
import issueRoutes from './routes/issueRoutes.js';
import paymentRoutes from './routes/payment.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database (non-blocking)
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); // This includes /api/admin/issues/:id/return
app.use('/api/member', memberRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/fines', fineRoutes);
app.use('/api/admin/issues', issueRoutes); // This is for GET /api/admin/issues
app.use('/api/payment', paymentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Server is running',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health\n`);
});

