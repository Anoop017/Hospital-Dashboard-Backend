import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
  getStats
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/stats', protect, authorize('admin'), getStats);

export default router; 