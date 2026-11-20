import { Request, Response, NextFunction } from 'express';
import { getDbStatus } from '../config/db';
import { WebsiteContent } from '../models/WebsiteContent';
import { AboutCourseCard } from '../models/AboutCourseCard';
import { EligibilityCard } from '../models/EligibilityCard';
import { Course } from '../models/Course';
import { PricingPlan } from '../models/PricingPlan';
import { Blog } from '../models/Blog';
import { Testimonial } from '../models/Testimonial';
import { ContactInformation } from '../models/ContactInformation';
import { RegistrationSettings } from '../models/RegistrationSettings';
import { TrialRegistration } from '../models/TrialRegistration';
import { ContactInquiry } from '../models/ContactInquiry';
import {
  DEFAULT_WEBSITE_CONTENT,
  DEFAULT_ABOUT_COURSE_CARDS,
  DEFAULT_ELIGIBILITY_CARDS,
  DEFAULT_COURSES,
  DEFAULT_PRICING_PLANS,
  DEFAULT_BLOGS,
  DEFAULT_TESTIMONIALS,
  DEFAULT_CONTACT_INFO,
  DEFAULT_REGISTRATION_SETTINGS,
} from '../config/defaultData';
import {
  trialRegistrationCreateSchema,
  contactInquiryCreateSchema,
} from '../validation/schemas';

export async function getPublicBootstrap(_req: Request, res: Response, next: NextFunction) {
  try {
    const dbStatus = getDbStatus();

    if (!dbStatus.connected) {
      res.json({
        source: 'fallback',
        websiteContent: DEFAULT_WEBSITE_CONTENT,
        aboutCourseCards: DEFAULT_ABOUT_COURSE_CARDS.map((c, idx) => ({ ...c, _id: `default-ac-${idx}` })),
        eligibilityCards: DEFAULT_ELIGIBILITY_CARDS.map((c, idx) => ({ ...c, _id: `default-el-${idx}` })),
        courses: DEFAULT_COURSES.map((c, idx) => ({ ...c, _id: `default-course-${idx}` })),
        pricingPlans: DEFAULT_PRICING_PLANS.map((p, idx) => ({ ...p, _id: `default-plan-${idx}` })),
        blogs: DEFAULT_BLOGS.map((b, idx) => ({ ...b, _id: `default-blog-${idx}` })),
        testimonials: DEFAULT_TESTIMONIALS.map((t, idx) => ({ ...t, _id: `default-test-${idx}` })),
        contactInfo: DEFAULT_CONTACT_INFO,
        registrationSettings: DEFAULT_REGISTRATION_SETTINGS,
      });
      return;
    }

    const [
      contentDocs,
      aboutCourseCards,
      eligibilityCards,
      courses,
      pricingPlans,
      blogs,
      testimonials,
      contactInfo,
      registrationSettings,
    ] = await Promise.all([
      WebsiteContent.find().lean(),
      AboutCourseCard.find().sort({ order: 1, createdAt: 1 }).lean(),
      EligibilityCard.find().sort({ order: 1, createdAt: 1 }).lean(),
      Course.find({ isActive: true }).sort({ order: 1, createdAt: 1 }).lean(),
      PricingPlan.find().sort({ order: 1, createdAt: 1 }).lean(),
      Blog.find({ status: 'published' }).sort({ order: 1, publishedAt: -1, createdAt: -1 }).lean(),
      Testimonial.find().sort({ order: 1, createdAt: 1 }).lean(),
      ContactInformation.findOne({ key: 'primary' }).lean(),
      RegistrationSettings.findOne({ key: 'primary' }).lean(),
    ]);

    const contentMap: Record<string, unknown> = { ...DEFAULT_WEBSITE_CONTENT };
    for (const doc of contentDocs) {
      contentMap[doc.section] = doc;
    }

    res.json({
      source: 'mongodb',
      websiteContent: contentMap,
      aboutCourseCards,
      eligibilityCards,
      courses,
      pricingPlans,
      blogs,
      testimonials,
      contactInfo: contactInfo || DEFAULT_CONTACT_INFO,
      registrationSettings: registrationSettings || DEFAULT_REGISTRATION_SETTINGS,
    });
  } catch (err) {
    next(err);
  }
}

export async function submitTrialRegistration(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parsed = trialRegistrationCreateSchema.parse(req.body);

    let resolvedCourseId = parsed.courseId || null;
    if (!resolvedCourseId) {
      const matchedCourse = await Course.findOne({ title: parsed.selectedCourse }).select('_id').lean();
      if (matchedCourse) {
        resolvedCourseId = matchedCourse._id.toString();
      }
    }

    const created = await TrialRegistration.create({
      fullName: parsed.fullName,
      selectedCourse: parsed.selectedCourse,
      courseId: resolvedCourseId || null,
      mobileNumber: parsed.mobileNumber,
      email: parsed.email,
      classTime: {
        hour: parsed.classTime?.hour || '',
        minute: parsed.classTime?.minute || '',
        period: parsed.classTime?.period || 'PM',
        formatted: parsed.classTime?.formatted || 'Not specified',
      },
      classDuration: parsed.classDuration || 'Not specified',
      selectedDays: parsed.selectedDays || 'Not specified',
      scheduleType: parsed.scheduleType,
      message: parsed.message || '',
    });

    res.status(201).json({
      message: 'Free trial registration submitted successfully.',
      registration: created,
    });
  } catch (err) {
    next(err);
  }
}

export async function submitContactInquiry(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parsed = contactInquiryCreateSchema.parse(req.body);

    const created = await ContactInquiry.create({
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone || '',
      subject: parsed.subject,
      message: parsed.message,
      isRead: false,
    });

    res.status(201).json({
      message: 'Contact inquiry submitted successfully.',
      inquiry: created,
    });
  } catch (err) {
    next(err);
  }
}
