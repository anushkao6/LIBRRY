import express from 'express';
import {
  getFines,
  getFine,
  markFineAsPaid,
} from '../controllers/fineController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getFines);
router.get('/:id', getFine);
router.put('/:id/pay', admin, markFineAsPaid);

export default router;

