import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITrialRegistration extends Document {
  fullName: string;
  selectedCourse: string;
  courseId?: Types.ObjectId | null;
  mobileNumber: string;
  email: string;
  classTime: {
    hour: string;
    minute: string;
    period: 'AM' | 'PM';
    formatted: string;
  };
  classDuration: string;
  selectedDays: string;
  scheduleType: 'weekly' | 'monthly';
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const TrialRegistrationSchema = new Schema<ITrialRegistration>(
  {
    fullName: { type: String, required: true, trim: true },
    selectedCourse: { type: String, required: true, trim: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', default: null },
    mobileNumber: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    classTime: {
      hour: { type: String, default: '', trim: true },
      minute: { type: String, default: '', trim: true },
      period: { type: String, enum: ['AM', 'PM'], default: 'PM' },
      formatted: { type: String, default: 'Not specified', trim: true },
    },
    classDuration: { type: String, default: 'Not specified', trim: true },
    selectedDays: { type: String, default: 'Not specified', trim: true },
    scheduleType: { type: String, enum: ['weekly', 'monthly'], default: 'weekly' },
    message: { type: String, default: '', trim: true },
  },
  { timestamps: true, collection: 'TrialRegistrations' }
);

TrialRegistrationSchema.index({ createdAt: -1 });
TrialRegistrationSchema.index({ selectedCourse: 1 });

export const TrialRegistration =
  mongoose.models.TrialRegistration ||
  mongoose.model<ITrialRegistration>('TrialRegistration', TrialRegistrationSchema);
