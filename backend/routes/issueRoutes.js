import express from 'express';
import { getAllIssues } from '../controllers/issueController.js';
import { markBookReturned } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(admin);

router.get('/', getAllIssues);
router.put('/:id/return', markBookReturned);

export default router;

