import nodemailer from 'nodemailer';
import { env } from '../config/env';

interface SendVerificationEmailParams {
  to: string;
  subject: string;
  otpCode: string;
  actionTitle: string;
  actionDescription: string;
  verificationLink?: string;
}

export interface EmailSendResult {
  sentViaSmtp: boolean;
  devPreviewOtp?: string;
  devPreviewLink?: string;
}

export async function sendVerificationEmail(
  params: SendVerificationEmailParams
): Promise<EmailSendResult> {
  const { to, subject, otpCode, actionTitle, actionDescription, verificationLink } = params;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background: #FAF7F2; border: 1px solid #e5dfd3; border-radius: 12px; color: #2D3732;">
      <h2 style="color: #103b2d; margin-top: 0;">Adam to Muhammad Online Quran Academy</h2>
      <h3 style="color: #184c3c; margin-bottom: 8px;">${actionTitle}</h3>
      <p style="line-height: 1.6; color: #4f5953;">${actionDescription}</p>
      <div style="background: #ffffff; border: 1px solid #d6cfc1; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0;">
        <span style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #717b75; display: block; margin-bottom: 6px;">Verification Code</span>
        <strong style="font-size: 28px; letter-spacing: 6px; color: #103b2d;">${otpCode}</strong>
      </div>
      ${
        verificationLink
          ? `<p style="margin: 16px 0;"><a href="${verificationLink}" style="display: inline-block; background: #103b2d; color: #ffffff; padding: 10px 18px; border-radius: 6px; text-decoration: none; font-weight: bold;">Open Verification Page</a></p>`
          : ''
      }
      <p style="font-size: 12px; color: #717b75; margin-bottom: 0;">This verification code expires in 15 minutes. If you did not request this action, please ignore this email.</p>
    </div>
  `;

  if (env.smtpHost && env.smtpUser && env.smtpPass) {
    const transporter = nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpSecure,
      auth: {
        user: env.smtpUser,
        pass: env.smtpPass,
      },
    });

    await transporter.sendMail({
      from: env.smtpFrom,
      to,
      subject,
      text: `${actionTitle}\n\n${actionDescription}\n\nVerification Code: ${otpCode}\n${verificationLink ? `Link: ${verificationLink}\n` : ''}\nExpires in 15 minutes.`,
      html,
    });

    return { sentViaSmtp: true };
  }

  console.log('------------------------------------------------------------');
  console.log(`[Email Service - SMTP Not Configured] To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`OTP Code: ${otpCode}`);
  if (verificationLink) console.log(`Verification Link: ${verificationLink}`);
  console.log('------------------------------------------------------------');

  return {
    sentViaSmtp: false,
    ...(env.isProd ? {} : { devPreviewOtp: otpCode, devPreviewLink: verificationLink }),
  };
}
