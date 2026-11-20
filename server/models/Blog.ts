import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  slug: string;
  title: string;
  excerpt: string;
  featuredImage: string;
  gradient: string;
  readTime: string;
  content: string[];
  status: 'published' | 'draft';
  publishedAt?: Date;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, required: true, trim: true },
    featuredImage: { type: String, required: true, trim: true },
    gradient: {
      type: String,
      default:
        'linear-gradient(135deg, rgba(164, 130, 57, 0.85) 0%, rgba(93, 117, 67, 0.8) 50%, rgba(30, 73, 58, 0.9) 100%)',
    },
    readTime: { type: String, default: '4 min read', trim: true },
    content: { type: [String], default: [] },
    status: { type: String, enum: ['published', 'draft'], default: 'draft' },
    publishedAt: { type: Date },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, collection: 'Blogs' }
);

BlogSchema.index({ status: 1, order: 1, createdAt: -1 });

export const Blog = mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);
