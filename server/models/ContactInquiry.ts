import mongoose, { Schema, Document } from 'mongoose';

export interface IContactInquiry extends Document {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  readAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const ContactInquirySchema = new Schema<IContactInquiry>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: '', trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date, default: null },
  },
  { timestamps: true, collection: 'ContactInquiries' }
);

ContactInquirySchema.index({ createdAt: -1 });
ContactInquirySchema.index({ isRead: 1 });

export const ContactInquiry =
  mongoose.models.ContactInquiry ||
  mongoose.model<IContactInquiry>('ContactInquiry', ContactInquirySchema);
