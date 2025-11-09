import express from 'express';
import {
  getBooks,
  getBook,
  addBook,
  updateBook,
  deleteBook,
  rateBook,
} from '../controllers/bookController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getBooks);
router.get('/:id', getBook);
router.put('/:id/rate', protect, rateBook);

export default router;

