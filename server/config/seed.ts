import bcrypt from 'bcryptjs';
import { env } from './env';
import { Admin } from '../models/Admin';
import { WebsiteContent } from '../models/WebsiteContent';
import { AboutCourseCard } from '../models/AboutCourseCard';
import { EligibilityCard } from '../models/EligibilityCard';
import { Course } from '../models/Course';
import { PricingPlan } from '../models/PricingPlan';
import { Blog } from '../models/Blog';
import { Testimonial } from '../models/Testimonial';
import { ContactInformation } from '../models/ContactInformation';
import { RegistrationSettings } from '../models/RegistrationSettings';
import { SeedState } from '../models/SeedState';
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
} from './defaultData';

const INITIAL_SEED_KEY = 'initial_content_v1';

/**
 * Idempotent one-time database seeding.
 * Populates defaults on a fresh database only once, and never overwrites
 * or re-creates items edited or deleted by an administrator.
 */
export async function seedDatabaseIfEmpty(options?: { seedAdmin?: boolean }): Promise<void> {
  const shouldSeedAdmin = options?.seedAdmin ?? true;

  if (shouldSeedAdmin) {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const passwordHash = await bcrypt.hash(env.adminSeedPassword, 12);
      await Admin.create({
        name: env.adminSeedName,
        email: env.adminSeedEmail,
        passwordHash,
        role: 'superadmin',
      });
      console.log(`[Seed] Created initial superadmin account: ${env.adminSeedEmail}`);
    }
  }

  const alreadySeeded = await SeedState.findOne({ key: INITIAL_SEED_KEY });
  if (alreadySeeded) {
    return;
  }

  for (const key of ['home_hero', 'home_why_study', 'about_welcome'] as const) {
    const existing = await WebsiteContent.findOne({ section: key });
    if (!existing) {
      await WebsiteContent.create(DEFAULT_WEBSITE_CONTENT[key]);
    }
  }

  if ((await AboutCourseCard.countDocuments()) === 0) {
    await AboutCourseCard.insertMany(DEFAULT_ABOUT_COURSE_CARDS);
  }

  if ((await EligibilityCard.countDocuments()) === 0) {
    await EligibilityCard.insertMany(DEFAULT_ELIGIBILITY_CARDS);
  }

  if ((await Course.countDocuments()) === 0) {
    await Course.insertMany(DEFAULT_COURSES);
  }

  if ((await PricingPlan.countDocuments()) === 0) {
    await PricingPlan.insertMany(DEFAULT_PRICING_PLANS);
  }

  if ((await Blog.countDocuments()) === 0) {
    await Blog.insertMany(
      DEFAULT_BLOGS.map((blog) => ({
        ...blog,
        publishedAt: new Date(),
      }))
    );
  }

  if ((await Testimonial.countDocuments()) === 0) {
    await Testimonial.insertMany(DEFAULT_TESTIMONIALS);
  }

  if ((await ContactInformation.countDocuments()) === 0) {
    await ContactInformation.create(DEFAULT_CONTACT_INFO);
  }

  if ((await RegistrationSettings.countDocuments()) === 0) {
    await RegistrationSettings.create(DEFAULT_REGISTRATION_SETTINGS);
  }

  await SeedState.create({ key: INITIAL_SEED_KEY, seededAt: new Date() });
}
