import { Router } from 'express';
import {
  getPublicBootstrap,
  submitTrialRegistration,
  submitContactInquiry,
} from '../controllers/publicController';
import { publicSubmissionRateLimiter } from '../middleware/rateLimit';

const router = Router();

router.get('/bootstrap', getPublicBootstrap);
router.post('/trial-registrations', publicSubmissionRateLimiter, submitTrialRegistration);
router.post('/contact-inquiries', publicSubmissionRateLimiter, submitContactInquiry);

export default router;
