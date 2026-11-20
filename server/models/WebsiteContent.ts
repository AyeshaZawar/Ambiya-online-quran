import mongoose, { Schema, Document } from 'mongoose';

export type WebsiteSectionKey = 'home_hero' | 'home_why_study' | 'about_welcome';

export interface IWebsiteContent extends Document {
  section: WebsiteSectionKey;
  heading?: string;
  introParagraph?: string;
  paragraphs: string[];
  steps: string[];
  imageUrl: string;
  imageCaption?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WebsiteContentSchema = new Schema<IWebsiteContent>(
  {
    section: {
      type: String,
      required: true,
      unique: true,
      enum: ['home_hero', 'home_why_study', 'about_welcome'],
    },
    heading: { type: String, trim: true },
    introParagraph: { type: String, trim: true },
    paragraphs: { type: [String], default: [] },
    steps: { type: [String], default: [] },
    imageUrl: { type: String, default: '', trim: true },
    imageCaption: { type: String, trim: true },
  },
  { timestamps: true, collection: 'WebsiteContent' }
);

export const WebsiteContent =
  mongoose.models.WebsiteContent ||
  mongoose.model<IWebsiteContent>('WebsiteContent', WebsiteContentSchema);
