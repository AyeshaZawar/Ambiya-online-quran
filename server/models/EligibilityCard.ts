import mongoose, { Schema, Document } from 'mongoose';

export interface IEligibilityCard extends Document {
  num: string;
  heading?: string;
  description: string;
  iconName: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const EligibilityCardSchema = new Schema<IEligibilityCard>(
  {
    num: { type: String, required: true, trim: true },
    heading: { type: String, trim: true, default: '' },
    description: { type: String, required: true, trim: true },
    iconName: { type: String, default: 'Baby', trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, collection: 'EligibilityCards' }
);

EligibilityCardSchema.index({ order: 1, createdAt: 1 });

export const EligibilityCard =
  mongoose.models.EligibilityCard ||
  mongoose.model<IEligibilityCard>('EligibilityCard', EligibilityCardSchema);
