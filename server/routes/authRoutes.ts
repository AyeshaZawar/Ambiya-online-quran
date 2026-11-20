import { Router } from 'express';
import {
  loginAdmin,
  logoutAdmin,
  getAdminProfile,
  updateAdminProfile,
  changeAdminEmail,
  requestPasswordChangeOtp,
  confirmPasswordChange,
  forgotPassword,
  resetPassword,
} from '../controllers/authController';
import { requireAdmin } from '../middleware/auth';
import { authRateLimiter, verificationRateLimiter } from '../middleware/rateLimit';

const router = Router();

router.post('/login', authRateLimiter, loginAdmin);
router.post('/logout', logoutAdmin);
router.post('/forgot-password', verificationRateLimiter, forgotPassword);
router.post('/reset-password', authRateLimiter, resetPassword);

router.get('/me', requireAdmin, getAdminProfile);
router.put('/profile', requireAdmin, updateAdminProfile);
router.post('/change-email', requireAdmin, changeAdminEmail);
router.post(
  '/request-password-change',
  requireAdmin,
  verificationRateLimiter,
  requestPasswordChangeOtp
);
router.post('/confirm-password-change', requireAdmin, confirmPasswordChange);

export default router;
