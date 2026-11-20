import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'superadmin' | 'admin';
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['superadmin', 'admin'], default: 'admin' },
    lastLoginAt: { type: Date },
  },
  { timestamps: true, collection: 'Admins' }
);

export const Admin = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);
