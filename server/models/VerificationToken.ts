import mongoose, { Schema, Document, Types } from 'mongoose';

export type VerificationPurpose = 'password_change' | 'password_reset' | 'email_change';

export interface IVerificationToken extends Document {
  adminId: Types.ObjectId;
  email: string;
  purpose: VerificationPurpose;
  newEmail?: string;
  otpHash: string;
  tokenHash: string;
  expiresAt: Date;
  usedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const VerificationTokenSchema = new Schema<IVerificationToken>(
  {
    adminId: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    purpose: {
      type: String,
      enum: ['password_change', 'password_reset', 'email_change'],
      required: true,
    },
    newEmail: { type: String, lowercase: true, trim: true },
    otpHash: { type: String, required: true },
    tokenHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    usedAt: { type: Date, default: null },
  },
  { timestamps: true, collection: 'VerificationTokens' }
);

VerificationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
VerificationTokenSchema.index({ adminId: 1, purpose: 1 });

export const VerificationToken =
  mongoose.models.VerificationToken ||
  mongoose.model<IVerificationToken>('VerificationToken', VerificationTokenSchema);
