import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
  slug: string;
  title: string;
  badge: string;
  tag: string;
  description: string;
  suitableFor: string;
  learningPoints: string[];
  iconName: string;
  popular: boolean;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    badge: { type: String, required: true, trim: true },
    tag: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    suitableFor: { type: String, required: true, trim: true },
    learningPoints: { type: [String], default: [] },
    iconName: { type: String, default: 'BookOpen', trim: true },
    popular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, collection: 'Courses' }
);

CourseSchema.index({ order: 1, createdAt: 1 });

export const Course = mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);
