import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  quote: string;
  author: string;
  location?: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    quote: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    location: { type: String, default: null, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, collection: 'Testimonials' }
);

TestimonialSchema.index({ order: 1, createdAt: 1 });

export const Testimonial =
  mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
