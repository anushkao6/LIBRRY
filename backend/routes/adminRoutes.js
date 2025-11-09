import express from 'express';
import { getDashboardStats } from '../controllers/adminController.js';
import { addBook, updateBook, deleteBook } from '../controllers/bookController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(admin);

router.get('/dashboard', getDashboardStats);

// Book management routes
router.post('/books', addBook);
router.put('/books/:id', updateBook);
router.delete('/books/:id', deleteBook);

export default router;

