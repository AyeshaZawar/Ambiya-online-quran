import { Request, Response, NextFunction } from 'express';
import { WebsiteContent, WebsiteSectionKey } from '../models/WebsiteContent';
import { Testimonial } from '../models/Testimonial';
import { AboutCourseCard } from '../models/AboutCourseCard';
import { EligibilityCard } from '../models/EligibilityCard';
import { Course } from '../models/Course';
import { PricingPlan } from '../models/PricingPlan';
import { ContactInformation } from '../models/ContactInformation';
import { RegistrationSettings } from '../models/RegistrationSettings';
import {
  websiteContentUpdateSchema,
  testimonialSchema,
  aboutCourseCardSchema,
  eligibilityCardSchema,
  courseSchema,
  pricingPlanSchema,
  reorderSchema,
  contactInfoSchema,
  registrationSettingsSchema,
} from '../validation/schemas';

function makeSlug(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || `item-${Date.now()}`
  );
}

// ---------- Website Content Sections ----------
export async function getAllWebsiteContent(_req: Request, res: Response, next: NextFunction) {
  try {
    const docs = await WebsiteContent.find().lean();
    const map: Record<string, unknown> = {};
    for (const d of docs) {
      map[d.section] = d;
    }
    res.json({ websiteContent: map });
  } catch (err) {
    next(err);
  }
}

export async function updateWebsiteSection(req: Request, res: Response, next: NextFunction) {
  try {
    const section = req.params.section as WebsiteSectionKey;
    if (!['home_hero', 'home_why_study', 'about_welcome'].includes(section)) {
      res.status(400).json({ error: 'Invalid website content section.' });
      return;
    }

    const parsed = websiteContentUpdateSchema.parse(req.body);
    const updated = await WebsiteContent.findOneAndUpdate(
      { section },
      { $set: { ...parsed, section } },
      { new: true, upsert: true }
    );
    res.json({ content: updated });
  } catch (err) {
    next(err);
  }
}

// ---------- Testimonials ----------
export async function listTestimonials(_req: Request, res: Response, next: NextFunction) {
  try {
    const items = await Testimonial.find().sort({ order: 1, createdAt: 1 }).lean();
    res.json({ testimonials: items });
  } catch (err) {
    next(err);
  }
}

export async function createTestimonial(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = testimonialSchema.parse(req.body);
    const count = await Testimonial.countDocuments();
    const created = await Testimonial.create({
      ...parsed,
      location: parsed.location?.trim() || null,
      order: parsed.order ?? count + 1,
    });
    res.status(201).json({ testimonial: created });
  } catch (err) {
    next(err);
  }
}

export async function updateTestimonial(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = testimonialSchema.parse(req.body);
    const updated = await Testimonial.findByIdAndUpdate(
      req.params.id,
      {
        ...parsed,
        location: parsed.location?.trim() || null,
      },
      { new: true }
    );
    if (!updated) {
      res.status(404).json({ error: 'Testimonial not found.' });
      return;
    }
    res.json({ testimonial: updated });
  } catch (err) {
    next(err);
  }
}

export async function deleteTestimonial(req: Request, res: Response, next: NextFunction) {
  try {
    const deleted = await Testimonial.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Testimonial not found.' });
      return;
    }
    res.json({ message: 'Testimonial deleted.' });
  } catch (err) {
    next(err);
  }
}

// ---------- About Course Overview Cards ----------
export async function listAboutCourseCards(_req: Request, res: Response, next: NextFunction) {
  try {
    const items = await AboutCourseCard.find().sort({ order: 1, createdAt: 1 }).lean();
    res.json({ aboutCourseCards: items });
  } catch (err) {
    next(err);
  }
}

export async function createAboutCourseCard(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = aboutCourseCardSchema.parse(req.body);
    const count = await AboutCourseCard.countDocuments();
    const created = await AboutCourseCard.create({
      ...parsed,
      order: parsed.order ?? count + 1,
    });
    res.status(201).json({ aboutCourseCard: created });
  } catch (err) {
    next(err);
  }
}

export async function updateAboutCourseCard(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = aboutCourseCardSchema.parse(req.body);
    const updated = await AboutCourseCard.findByIdAndUpdate(req.params.id, parsed, { new: true });
    if (!updated) {
      res.status(404).json({ error: 'About course card not found.' });
      return;
    }
    res.json({ aboutCourseCard: updated });
  } catch (err) {
    next(err);
  }
}

export async function deleteAboutCourseCard(req: Request, res: Response, next: NextFunction) {
  try {
    const deleted = await AboutCourseCard.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'About course card not found.' });
      return;
    }
    res.json({ message: 'About course card deleted.' });
  } catch (err) {
    next(err);
  }
}

// ---------- Eligibility Cards (Who Can Join?) ----------
export async function listEligibilityCards(_req: Request, res: Response, next: NextFunction) {
  try {
    const items = await EligibilityCard.find().sort({ order: 1, createdAt: 1 }).lean();
    res.json({ eligibilityCards: items });
  } catch (err) {
    next(err);
  }
}

export async function createEligibilityCard(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = eligibilityCardSchema.parse(req.body);
    const count = await EligibilityCard.countDocuments();
    const created = await EligibilityCard.create({
      ...parsed,
      order: parsed.order ?? count + 1,
    });
    res.status(201).json({ eligibilityCard: created });
  } catch (err) {
    next(err);
  }
}

export async function updateEligibilityCard(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = eligibilityCardSchema.parse(req.body);
    const updated = await EligibilityCard.findByIdAndUpdate(req.params.id, parsed, { new: true });
    if (!updated) {
      res.status(404).json({ error: 'Eligibility card not found.' });
      return;
    }
    res.json({ eligibilityCard: updated });
  } catch (err) {
    next(err);
  }
}

export async function deleteEligibilityCard(req: Request, res: Response, next: NextFunction) {
  try {
    const deleted = await EligibilityCard.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Eligibility card not found.' });
      return;
    }
    res.json({ message: 'Eligibility card deleted.' });
  } catch (err) {
    next(err);
  }
}

export async function reorderEligibilityCards(req: Request, res: Response, next: NextFunction) {
  try {
    const { orderedIds } = reorderSchema.parse(req.body);
    await Promise.all(
      orderedIds.map((id, index) =>
        EligibilityCard.findByIdAndUpdate(id, { order: index + 1 })
      )
    );
    const items = await EligibilityCard.find().sort({ order: 1, createdAt: 1 }).lean();
    res.json({ eligibilityCards: items });
  } catch (err) {
    next(err);
  }
}

// ---------- Courses Page ----------
export async function listCourses(_req: Request, res: Response, next: NextFunction) {
  try {
    const items = await Course.find().sort({ order: 1, createdAt: 1 }).lean();
    res.json({ courses: items });
  } catch (err) {
    next(err);
  }
}

export async function createCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = courseSchema.parse(req.body);
    const count = await Course.countDocuments();
    let slug = makeSlug(parsed.title);
    const exists = await Course.findOne({ slug });
    if (exists) {
      slug = `${slug}-${Date.now()}`;
    }
    const created = await Course.create({
      ...parsed,
      slug,
      order: parsed.order ?? count + 1,
    });
    res.status(201).json({ course: created });
  } catch (err) {
    next(err);
  }
}

export async function updateCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = courseSchema.parse(req.body);
    const updated = await Course.findByIdAndUpdate(req.params.id, parsed, { new: true });
    if (!updated) {
      res.status(404).json({ error: 'Course not found.' });
      return;
    }
    res.json({ course: updated });
  } catch (err) {
    next(err);
  }
}

export async function deleteCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Course not found.' });
      return;
    }
    res.json({ message: 'Course deleted.' });
  } catch (err) {
    next(err);
  }
}

export async function reorderCourses(req: Request, res: Response, next: NextFunction) {
  try {
    const { orderedIds } = reorderSchema.parse(req.body);
    await Promise.all(
      orderedIds.map((id, index) => Course.findByIdAndUpdate(id, { order: index + 1 }))
    );
    const items = await Course.find().sort({ order: 1, createdAt: 1 }).lean();
    res.json({ courses: items });
  } catch (err) {
    next(err);
  }
}

// ---------- Pricing Plans ----------
export async function listPricingPlans(_req: Request, res: Response, next: NextFunction) {
  try {
    const items = await PricingPlan.find().sort({ order: 1, createdAt: 1 }).lean();
    res.json({ pricingPlans: items });
  } catch (err) {
    next(err);
  }
}

export async function createPricingPlan(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = pricingPlanSchema.parse(req.body);
    const count = await PricingPlan.countDocuments();
    const created = await PricingPlan.create({
      ...parsed,
      order: parsed.order ?? count + 1,
    });
    res.status(201).json({ pricingPlan: created });
  } catch (err) {
    next(err);
  }
}

export async function updatePricingPlan(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = pricingPlanSchema.parse(req.body);
    const updated = await PricingPlan.findByIdAndUpdate(req.params.id, parsed, { new: true });
    if (!updated) {
      res.status(404).json({ error: 'Pricing plan not found.' });
      return;
    }
    res.json({ pricingPlan: updated });
  } catch (err) {
    next(err);
  }
}

export async function deletePricingPlan(req: Request, res: Response, next: NextFunction) {
  try {
    const deleted = await PricingPlan.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Pricing plan not found.' });
      return;
    }
    res.json({ message: 'Pricing plan deleted.' });
  } catch (err) {
    next(err);
  }
}

export async function reorderPricingPlans(req: Request, res: Response, next: NextFunction) {
  try {
    const { orderedIds } = reorderSchema.parse(req.body);
    await Promise.all(
      orderedIds.map((id, index) => PricingPlan.findByIdAndUpdate(id, { order: index + 1 }))
    );
    const items = await PricingPlan.find().sort({ order: 1, createdAt: 1 }).lean();
    res.json({ pricingPlans: items });
  } catch (err) {
    next(err);
  }
}

// ---------- Contact Information ----------
export async function getContactInformation(_req: Request, res: Response, next: NextFunction) {
  try {
    const doc = await ContactInformation.findOne({ key: 'primary' }).lean();
    res.json({ contactInfo: doc });
  } catch (err) {
    next(err);
  }
}

export async function updateContactInformation(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = contactInfoSchema.parse(req.body);
    const updated = await ContactInformation.findOneAndUpdate(
      { key: 'primary' },
      { $set: { ...parsed, key: 'primary' } },
      { new: true, upsert: true }
    );
    res.json({ contactInfo: updated });
  } catch (err) {
    next(err);
  }
}

// ---------- Registration Form Selectable Options ----------
export async function getRegistrationSettings(_req: Request, res: Response, next: NextFunction) {
  try {
    const doc = await RegistrationSettings.findOne({ key: 'primary' }).lean();
    res.json({ registrationSettings: doc });
  } catch (err) {
    next(err);
  }
}

export async function updateRegistrationSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = registrationSettingsSchema.parse(req.body);
    const updated = await RegistrationSettings.findOneAndUpdate(
      { key: 'primary' },
      { $set: { ...parsed, key: 'primary' } },
      { new: true, upsert: true }
    );
    res.json({ registrationSettings: updated });
  } catch (err) {
    next(err);
  }
}
