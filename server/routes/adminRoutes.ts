import { Router } from 'express';
import { requireAdmin } from '../middleware/auth';
import {
  getAllWebsiteContent,
  updateWebsiteSection,
  listTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  listAboutCourseCards,
  createAboutCourseCard,
  updateAboutCourseCard,
  deleteAboutCourseCard,
  listEligibilityCards,
  createEligibilityCard,
  updateEligibilityCard,
  deleteEligibilityCard,
  reorderEligibilityCards,
  listCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  reorderCourses,
  listPricingPlans,
  createPricingPlan,
  updatePricingPlan,
  deletePricingPlan,
  reorderPricingPlans,
  getContactInformation,
  updateContactInformation,
  getRegistrationSettings,
  updateRegistrationSettings,
} from '../controllers/adminContentController';
import {
  listAllBlogs,
  createBlog,
  updateBlog,
  setBlogStatus,
  deleteBlog,
} from '../controllers/blogController';
import {
  listTrialRegistrations,
  deleteTrialRegistration,
  listContactInquiries,
  toggleInquiryReadStatus,
  deleteContactInquiry,
} from '../controllers/submissionsController';

const router = Router();

router.use(requireAdmin);

// Website Content Sections (home_hero, home_why_study, about_welcome)
router.get('/content', getAllWebsiteContent);
router.put('/content/:section', updateWebsiteSection);

// Testimonials
router.get('/testimonials', listTestimonials);
router.post('/testimonials', createTestimonial);
router.put('/testimonials/:id', updateTestimonial);
router.delete('/testimonials/:id', deleteTestimonial);

// About Us - What We Teach Course Overview Cards
router.get('/about-courses', listAboutCourseCards);
router.post('/about-courses', createAboutCourseCard);
router.put('/about-courses/:id', updateAboutCourseCard);
router.delete('/about-courses/:id', deleteAboutCourseCard);

// About Us - Who Can Join Eligibility Cards
router.get('/eligibility-cards', listEligibilityCards);
router.post('/eligibility-cards', createEligibilityCard);
router.put('/eligibility-cards/reorder', reorderEligibilityCards);
router.put('/eligibility-cards/:id', updateEligibilityCard);
router.delete('/eligibility-cards/:id', deleteEligibilityCard);

// Courses Page (and Registration Form active course sync)
router.get('/courses', listCourses);
router.post('/courses', createCourse);
router.put('/courses/reorder', reorderCourses);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);

// Pricing Page
router.get('/pricing-plans', listPricingPlans);
router.post('/pricing-plans', createPricingPlan);
router.put('/pricing-plans/reorder', reorderPricingPlans);
router.put('/pricing-plans/:id', updatePricingPlan);
router.delete('/pricing-plans/:id', deletePricingPlan);

// Contact Information
router.get('/contact-info', getContactInformation);
router.put('/contact-info', updateContactInformation);

// Registration Form Selectable Options
router.get('/registration-settings', getRegistrationSettings);
router.put('/registration-settings', updateRegistrationSettings);

// Blog Management (Single source of truth)
router.get('/blogs', listAllBlogs);
router.post('/blogs', createBlog);
router.put('/blogs/:id', updateBlog);
router.patch('/blogs/:id/status', setBlogStatus);
router.delete('/blogs/:id', deleteBlog);

// Users & Messages — Section A: Free Trial Registrations
router.get('/registrations', listTrialRegistrations);
router.delete('/registrations/:id', deleteTrialRegistration);

// Users & Messages — Section B: Contact Inquiries
router.get('/inquiries', listContactInquiries);
router.patch('/inquiries/:id/read', toggleInquiryReadStatus);
router.delete('/inquiries/:id', deleteContactInquiry);

export default router;
