import mongoose, { Schema, Document } from 'mongoose';

export interface IContactInformation extends Document {
  key: string;
  cardTitle: string;
  addressLocation: string;
  globalAvailabilityTitle: string;
  globalAvailabilityText: string;
  whatsappTitle: string;
  whatsappNumber: string;
  whatsappText: string;
  emailTitle: string;
  emailAddress: string;
  emailText: string;
  ctaButtonText: string;
  headerDescription: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactInformationSchema = new Schema<IContactInformation>(
  {
    key: { type: String, required: true, unique: true, default: 'primary' },
    cardTitle: { type: String, default: 'Academy Information', trim: true },
    addressLocation: { type: String, default: 'Online Worldwide (UK, USA, Canada, Europe, Middle East & Australia)', trim: true },
    globalAvailabilityTitle: { type: String, default: 'Global Availability', trim: true },
    globalAvailabilityText: {
      type: String,
      default:
        'Available worldwide, online for students across UK, USA, Canada, Europe, Middle East & Australia.',
      trim: true,
    },
    whatsappTitle: { type: String, default: 'Coordinator WhatsApp', trim: true },
    whatsappNumber: { type: String, default: '', trim: true },
    whatsappText: {
      type: String,
      default: 'Direct communication for instant class arrangements and timing coordination.',
      trim: true,
    },
    emailTitle: { type: String, default: 'Email Support', trim: true },
    emailAddress: { type: String, default: 'contact@adam-to-muhammad-quran-academy.com', trim: true },
    emailText: {
      type: String,
      default: 'Response within 24 hours for any questions or concerns.',
      trim: true,
    },
    ctaButtonText: { type: String, default: 'Start Free Trial Week', trim: true },
    headerDescription: {
      type: String,
      default:
        'We are available worldwide, online. Whether you have questions about our tutors, class schedules, or wish to register for a 1-week free trial, our coordinators are here to help.',
      trim: true,
    },
  },
  { timestamps: true, collection: 'ContactInformation' }
);

export const ContactInformation =
  mongoose.models.ContactInformation ||
  mongoose.model<IContactInformation>('ContactInformation', ContactInformationSchema);
