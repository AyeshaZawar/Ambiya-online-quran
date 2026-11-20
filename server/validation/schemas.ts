import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Valid email address is required'),
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120),
});

export const changeEmailSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newEmail: z.string().trim().email('Valid new email is required'),
  confirmNewEmail: z.string().trim().email('Please confirm your new email address'),
});

export const confirmPasswordChangeSchema = z.object({
  otpOrToken: z.string().trim().min(4, 'Verification code or token is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Please confirm your new password'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Valid email address is required'),
});

export const resetPasswordSchema = z.object({
  email: z.string().trim().email('Valid email address is required'),
  otpOrToken: z.string().trim().min(4, 'Verification code or token is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Please confirm your new password'),
});

export const websiteContentUpdateSchema = z.object({
  heading: z.string().trim().max(250).optional(),
  introParagraph: z.string().trim().max(2000).optional(),
  paragraphs: z.array(z.string().trim().min(1)).max(10).optional(),
  steps: z.array(z.string().trim().min(1)).max(10).optional(),
  imageUrl: z.string().trim().max(1000).optional().default(''),
  imageCaption: z.string().trim().max(300).optional(),
});

export const testimonialSchema = z.object({
  quote: z.string().trim().min(5, 'Quote is required').max(1500),
  author: z.string().trim().min(2, 'Author/label is required').max(150),
  location: z.string().trim().max(150).nullable().optional(),
  order: z.number().int().min(0).optional(),
});

export const aboutCourseCardSchema = z.object({
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().min(4).max(500),
  tag: z.string().trim().min(1).max(30),
  iconName: z.string().trim().min(1).max(50).default('BookOpen'),
  order: z.number().int().min(0).optional(),
});

export const eligibilityCardSchema = z.object({
  num: z.string().trim().min(1).max(20),
  heading: z.string().trim().max(160).optional().default(''),
  description: z.string().trim().min(4).max(500),
  iconName: z.string().trim().min(1).max(50).default('Baby'),
  order: z.number().int().min(0).optional(),
});

export const courseSchema = z.object({
  title: z.string().trim().min(2).max(120),
  badge: z.string().trim().min(1).max(60),
  tag: z.string().trim().min(1).max(60),
  description: z.string().trim().min(4).max(800),
  suitableFor: z.string().trim().min(4).max(500),
  learningPoints: z.array(z.string().trim().min(1)).min(1).max(12),
  iconName: z.string().trim().min(1).max(50).default('BookOpen'),
  popular: z.boolean().default(false),
  isActive: z.boolean().default(true),
  order: z.number().int().min(0).optional(),
});

export const pricingPlanSchema = z.object({
  planName: z.string().trim().min(2).max(120),
  subtitle: z.string().trim().max(180).optional().default(''),
  daysPerWeek: z.string().trim().min(1).max(60),
  daysPerMonth: z.string().trim().max(60).optional().default(''),
  classesPerMonth: z.string().trim().min(1).max(60),
  classDuration: z.string().trim().min(1).max(60),
  monthlyPrice: z.number().min(0),
  currency: z.string().trim().min(1).max(10).default('GBP'),
  currencySymbol: z.string().trim().min(1).max(5).default('£'),
  billingPeriod: z.string().trim().min(1).max(30).default('month'),
  description: z.string().trim().min(4).max(600),
  features: z.array(z.string().trim().min(1)).min(1).max(15),
  isPopular: z.boolean().default(false),
  popularBadgeText: z.string().trim().max(60).default('Most Popular'),
  ctaText: z.string().trim().min(2).max(80).default('Start 1-Week Free Trial'),
  footnoteText: z.string().trim().max(160).default('No credit card required · Cancel anytime'),
  order: z.number().int().min(0).optional(),
});

export const reorderSchema = z.object({
  orderedIds: z.array(z.string().min(1)).min(1),
});

export const contactInfoSchema = z.object({
  cardTitle: z.string().trim().min(2).max(120),
  addressLocation: z.string().trim().min(2).max(300),
  globalAvailabilityTitle: z.string().trim().min(2).max(120),
  globalAvailabilityText: z.string().trim().min(2).max(600),
  whatsappTitle: z.string().trim().min(2).max(120),
  whatsappNumber: z.string().trim().max(80).optional().default(''),
  whatsappText: z.string().trim().min(2).max(600),
  emailTitle: z.string().trim().min(2).max(120),
  emailAddress: z.string().trim().email('Valid academy contact email is required'),
  emailText: z.string().trim().min(2).max(600),
  ctaButtonText: z.string().trim().min(2).max(80),
  headerDescription: z.string().trim().min(5).max(800),
});

export const registrationSettingsSchema = z.object({
  hours: z.array(z.string().trim().min(1).max(10)),
  minutes: z.array(z.string().trim().min(1).max(10)),
  durations: z.array(z.string().trim().min(1).max(60)),
  daysPerWeekOptions: z.array(z.string().trim().min(1).max(60)),
  daysPerMonthOptions: z.array(z.string().trim().min(1).max(60)),
  allowTimeSelection: z.boolean().optional().default(true),
  allowDurationSelection: z.boolean().optional().default(true),
  allowWeeklySelection: z.boolean(),
  allowMonthlySelection: z.boolean(),
});

export const blogSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(220),
  excerpt: z.string().trim().min(10, 'Excerpt must be at least 10 characters').max(600),
  featuredImage: z.string().trim().min(1, 'Featured image is required'),
  gradient: z.string().trim().optional(),
  readTime: z.string().trim().min(2).max(50).default('4 min read'),
  content: z.array(z.string().trim().min(1)).min(1, 'At least one content paragraph is required'),
  status: z.enum(['published', 'draft']).default('draft'),
  order: z.number().int().min(0).optional(),
});

export const trialRegistrationCreateSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name is required').max(150),
  selectedCourse: z.string().trim().min(2, 'Course selection is required').max(150),
  courseId: z.string().optional().nullable(),
  mobileNumber: z.string().trim().min(5, 'WhatsApp / Mobile number is required').max(60),
  email: z.string().trim().email('Valid email address is required'),
  classTime: z
    .object({
      hour: z.string().trim().max(10).optional().default(''),
      minute: z.string().trim().max(10).optional().default(''),
      period: z.enum(['AM', 'PM']).optional().default('PM'),
      formatted: z.string().trim().max(30).optional().default('Not specified'),
    })
    .optional(),
  classDuration: z.string().trim().max(60).optional().default('Not specified'),
  selectedDays: z.string().trim().max(80).optional().default('Not specified'),
  scheduleType: z.enum(['weekly', 'monthly']).default('weekly'),
  message: z.string().trim().max(2000).optional().default(''),
});

export const contactInquiryCreateSchema = z.object({
  name: z.string().trim().min(2, 'Your name is required').max(150),
  email: z.string().trim().email('Valid email address is required'),
  phone: z.string().trim().max(60).optional().default(''),
  subject: z.string().trim().min(2, 'Subject is required').max(180),
  message: z.string().trim().min(5, 'Message is required').max(4000),
});
