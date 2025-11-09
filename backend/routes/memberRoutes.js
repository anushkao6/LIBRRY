import express from 'express';
import {
  issueBook,
  returnBook,
  getMyIssues,
  getMyFines,
  payFine,
} from '../controllers/memberController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All member routes require authentication
router.use(protect);

router.post('/issue', issueBook);
router.post('/return', returnBook);
router.get('/issues', getMyIssues);
router.get('/fines', getMyFines);
router.post('/fines/:id/pay', payFine);

export default router;

