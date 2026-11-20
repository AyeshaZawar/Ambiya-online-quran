import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { Admin } from '../models/Admin';
import { VerificationToken, VerificationPurpose } from '../models/VerificationToken';
import {
  AuthenticatedRequest,
  signAdminToken,
  setAdminSessionCookie,
  clearAdminSessionCookie,
} from '../middleware/auth';
import {
  loginSchema,
  updateProfileSchema,
  changeEmailSchema,
  confirmPasswordChangeSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validation/schemas';
import { sendVerificationEmail } from '../services/emailService';
import { env } from '../config/env';

function hashSecretValue(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function generateOtpAndToken() {
  const otpCode = String(crypto.randomInt(100000, 999999));
  const rawToken = crypto.randomBytes(24).toString('hex');
  return { otpCode, rawToken };
}

export async function loginAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    admin.lastLoginAt = new Date();
    await admin.save();

    const token = signAdminToken({
      id: admin._id.toString(),
      email: admin.email,
      role: admin.role,
    });
    setAdminSessionCookie(res, token, req);

    res.json({
      token,
      admin: {
        id: admin._id.toString(),
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLoginAt: admin.lastLoginAt,
        createdAt: admin.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
}

export function logoutAdmin(req: Request, res: Response) {
  clearAdminSessionCookie(res, req);
  res.json({ message: 'Logged out successfully.' });
}

export async function getAdminProfile(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const admin = await Admin.findById(req.admin!.id).select('-passwordHash').lean();
    if (!admin) {
      res.status(404).json({ error: 'Admin account not found.' });
      return;
    }
    res.json({
      admin: {
        id: admin._id.toString(),
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLoginAt: admin.lastLoginAt,
        createdAt: admin.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function updateAdminProfile(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { name } = updateProfileSchema.parse(req.body);
    const admin = await Admin.findByIdAndUpdate(
      req.admin!.id,
      { name },
      { new: true }
    ).select('-passwordHash');

    if (!admin) {
      res.status(404).json({ error: 'Admin account not found.' });
      return;
    }

    res.json({
      message: 'Profile updated successfully.',
      admin: {
        id: admin._id.toString(),
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLoginAt: admin.lastLoginAt,
        createdAt: admin.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function changeAdminEmail(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { currentPassword, newEmail, confirmNewEmail } = changeEmailSchema.parse(req.body);

    if (newEmail.toLowerCase() !== confirmNewEmail.toLowerCase()) {
      res.status(400).json({ error: 'New email address and confirmation email do not match.' });
      return;
    }

    const admin = await Admin.findById(req.admin!.id);
    if (!admin) {
      res.status(404).json({ error: 'Admin account not found.' });
      return;
    }

    const validPassword = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!validPassword) {
      res.status(401).json({ error: 'Current password is incorrect.' });
      return;
    }

    const normalizedNewEmail = newEmail.toLowerCase();
    if (normalizedNewEmail === admin.email.toLowerCase()) {
      res.status(400).json({ error: 'New email address is the same as your current email.' });
      return;
    }

    const duplicate = await Admin.findOne({ email: normalizedNewEmail });
    if (duplicate) {
      res.status(409).json({ error: 'Another admin account already uses that email.' });
      return;
    }

    admin.email = normalizedNewEmail;
    await admin.save();

    const token = signAdminToken({
      id: admin._id.toString(),
      email: admin.email,
      role: admin.role,
    });
    setAdminSessionCookie(res, token, req);

    res.json({
      message: 'Email address updated successfully.',
      token,
      admin: {
        id: admin._id.toString(),
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLoginAt: admin.lastLoginAt,
        createdAt: admin.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function createAndSendVerification(
  adminId: string,
  email: string,
  purpose: VerificationPurpose,
  subject: string,
  actionTitle: string,
  actionDescription: string,
  linkPath: string
) {
  await VerificationToken.deleteMany({ adminId, purpose, usedAt: null });

  const { otpCode, rawToken } = generateOtpAndToken();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await VerificationToken.create({
    adminId,
    email: email.toLowerCase(),
    purpose,
    otpHash: hashSecretValue(otpCode),
    tokenHash: hashSecretValue(rawToken),
    expiresAt,
  });

  const verificationLink = `${env.appUrl}/#management-portal?${linkPath}&token=${rawToken}`;

  return sendVerificationEmail({
    to: email,
    subject,
    otpCode,
    actionTitle,
    actionDescription,
    verificationLink,
  });
}

export async function requestPasswordChangeOtp(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const admin = await Admin.findById(req.admin!.id);
    if (!admin) {
      res.status(404).json({ error: 'Admin account not found.' });
      return;
    }

    const result = await createAndSendVerification(
      admin._id.toString(),
      admin.email,
      'password_change',
      'Verify Password Change — Adam to Muhammad Online Quran Academy',
      'Confirm Password Change',
      'Use the 6-digit verification code below to authorize changing your admin account password.',
      'action=change-password'
    );

    res.json({
      message: result.sentViaSmtp
        ? `A 6-digit verification code was sent to ${admin.email}.`
        : `Verification code generated for ${admin.email}. (Configure SMTP in .env for live email delivery.)`,
      sentViaSmtp: result.sentViaSmtp,
      ...(result.devPreviewOtp ? { devPreviewOtp: result.devPreviewOtp } : {}),
    });
  } catch (err) {
    next(err);
  }
}

export async function confirmPasswordChange(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { otpOrToken, newPassword, confirmPassword } = confirmPasswordChangeSchema.parse(req.body);

    if (newPassword !== confirmPassword) {
      res.status(400).json({ error: 'New password and confirmation password do not match.' });
      return;
    }

    const hashedInput = hashSecretValue(otpOrToken.trim());
    const record = await VerificationToken.findOne({
      adminId: req.admin!.id,
      purpose: 'password_change',
      usedAt: null,
      expiresAt: { $gt: new Date() },
      $or: [{ otpHash: hashedInput }, { tokenHash: hashedInput }],
    });

    if (!record) {
      res.status(400).json({ error: 'Invalid or expired verification code.' });
      return;
    }

    const admin = await Admin.findById(req.admin!.id);
    if (!admin) {
      res.status(404).json({ error: 'Admin account not found.' });
      return;
    }

    admin.passwordHash = await bcrypt.hash(newPassword, 12);
    await admin.save();

    record.usedAt = new Date();
    await record.save();

    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    next(err);
  }
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);
    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      res.json({
        message: 'If an admin account matches that email, a verification code has been issued.',
        sentViaSmtp: Boolean(env.smtpHost),
      });
      return;
    }

    const result = await createAndSendVerification(
      admin._id.toString(),
      admin.email,
      'password_reset',
      'Password Reset Code — Adam to Muhammad Online Quran Academy',
      'Reset Your Admin Password',
      'Use this 6-digit verification code or link to reset your Admin Panel password.',
      `action=reset-password&email=${encodeURIComponent(admin.email)}`
    );

    res.json({
      message: result.sentViaSmtp
        ? `A 6-digit reset code was sent to ${admin.email}.`
        : `Reset code generated for ${admin.email}. (Configure SMTP in .env for live email delivery.)`,
      sentViaSmtp: result.sentViaSmtp,
      ...(result.devPreviewOtp ? { devPreviewOtp: result.devPreviewOtp } : {}),
    });
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, otpOrToken, newPassword, confirmPassword } = resetPasswordSchema.parse(req.body);

    if (newPassword !== confirmPassword) {
      res.status(400).json({ error: 'New password and confirmation password do not match.' });
      return;
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      res.status(400).json({ error: 'Invalid or expired reset code.' });
      return;
    }

    const hashedInput = hashSecretValue(otpOrToken.trim());
    const record = await VerificationToken.findOne({
      adminId: admin._id,
      purpose: 'password_reset',
      usedAt: null,
      expiresAt: { $gt: new Date() },
      $or: [{ otpHash: hashedInput }, { tokenHash: hashedInput }],
    });

    if (!record) {
      res.status(400).json({ error: 'Invalid or expired reset code.' });
      return;
    }

    admin.passwordHash = await bcrypt.hash(newPassword, 12);
    await admin.save();

    record.usedAt = new Date();
    await record.save();

    res.json({ message: 'Password has been reset. You may now sign in with your new password.' });
  } catch (err) {
    next(err);
  }
}
