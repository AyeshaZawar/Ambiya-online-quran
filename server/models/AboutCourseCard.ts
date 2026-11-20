import mongoose, { Schema, Document } from 'mongoose';

export interface IAboutCourseCard extends Document {
  title: string;
  description: string;
  tag: string;
  iconName: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const AboutCourseCardSchema = new Schema<IAboutCourseCard>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    tag: { type: String, required: true, trim: true },
    iconName: { type: String, default: 'BookOpen', trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, collection: 'AboutCourseCards' }
);

AboutCourseCardSchema.index({ order: 1, createdAt: 1 });

export const AboutCourseCard =
  mongoose.models.AboutCourseCard ||
  mongoose.model<IAboutCourseCard>('AboutCourseCard', AboutCourseCardSchema);
