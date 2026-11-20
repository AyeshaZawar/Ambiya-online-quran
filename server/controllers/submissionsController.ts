import { Request, Response, NextFunction } from 'express';
import { TrialRegistration } from '../models/TrialRegistration';
import { ContactInquiry } from '../models/ContactInquiry';

// ---------- Free Trial Registrations ----------
export async function listTrialRegistrations(req: Request, res: Response, next: NextFunction) {
  try {
    const search = (req.query.search as string | undefined)?.trim();
    const course = (req.query.course as string | undefined)?.trim();
    const scheduleType = (req.query.scheduleType as string | undefined)?.trim();

    const filter: Record<string, unknown> = {};
    if (course && course !== 'all') {
      filter.selectedCourse = course;
    }
    if (scheduleType === 'weekly' || scheduleType === 'monthly') {
      filter.scheduleType = scheduleType;
    }
    if (search) {
      const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [
        { fullName: regex },
        { email: regex },
        { mobileNumber: regex },
        { selectedCourse: regex },
        { message: regex },
      ];
    }

    const registrations = await TrialRegistration.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    res.json({ registrations });
  } catch (err) {
    next(err);
  }
}

export async function deleteTrialRegistration(req: Request, res: Response, next: NextFunction) {
  try {
    const deleted = await TrialRegistration.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Registration record not found.' });
      return;
    }
    res.json({ message: 'Registration record deleted.' });
  } catch (err) {
    next(err);
  }
}

// ---------- Contact Inquiries ----------
export async function listContactInquiries(req: Request, res: Response, next: NextFunction) {
  try {
    const search = (req.query.search as string | undefined)?.trim();
    const status = (req.query.status as string | undefined)?.trim();

    const filter: Record<string, unknown> = {};
    if (status === 'read') {
      filter.isRead = true;
    } else if (status === 'unread') {
      filter.isRead = false;
    }

    if (search) {
      const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [
        { name: regex },
        { email: regex },
        { phone: regex },
        { subject: regex },
        { message: regex },
      ];
    }

    const inquiries = await ContactInquiry.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ inquiries });
  } catch (err) {
    next(err);
  }
}

export async function toggleInquiryReadStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const isRead = Boolean(req.body?.isRead);
    const updated = await ContactInquiry.findByIdAndUpdate(
      req.params.id,
      {
        isRead,
        readAt: isRead ? new Date() : null,
      },
      { new: true }
    );
    if (!updated) {
      res.status(404).json({ error: 'Contact inquiry not found.' });
      return;
    }
    res.json({ inquiry: updated });
  } catch (err) {
    next(err);
  }
}

export async function deleteContactInquiry(req: Request, res: Response, next: NextFunction) {
  try {
    const deleted = await ContactInquiry.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Contact inquiry not found.' });
      return;
    }
    res.json({ message: 'Contact inquiry deleted.' });
  } catch (err) {
    next(err);
  }
}
