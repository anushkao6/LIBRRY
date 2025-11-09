import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { checkDatabase } from '../middleware/dbCheck.js';

const router = express.Router();

router.post('/register', checkDatabase, register);
router.post('/login', checkDatabase, login);
router.get('/me', protect, getMe);

export default router;

