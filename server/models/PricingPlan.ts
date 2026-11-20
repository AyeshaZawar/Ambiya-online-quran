import mongoose, { Schema, Document } from 'mongoose';

export interface IPricingPlan extends Document {
  planName: string;
  subtitle: string;
  daysPerWeek: string;
  daysPerMonth?: string;
  classesPerMonth: string;
  classDuration: string;
  monthlyPrice: number;
  currency: string;
  currencySymbol: string;
  billingPeriod: string;
  description: string;
  features: string[];
  isPopular: boolean;
  popularBadgeText: string;
  ctaText: string;
  footnoteText: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const PricingPlanSchema = new Schema<IPricingPlan>(
  {
    planName: { type: String, required: true, trim: true },
    subtitle: { type: String, default: '', trim: true },
    daysPerWeek: { type: String, required: true, trim: true },
    daysPerMonth: { type: String, default: '', trim: true },
    classesPerMonth: { type: String, required: true, trim: true },
    classDuration: { type: String, required: true, trim: true },
    monthlyPrice: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'GBP', trim: true },
    currencySymbol: { type: String, default: '£', trim: true },
    billingPeriod: { type: String, default: 'month', trim: true },
    description: { type: String, required: true, trim: true },
    features: { type: [String], default: [] },
    isPopular: { type: Boolean, default: false },
    popularBadgeText: { type: String, default: 'Most Popular', trim: true },
    ctaText: { type: String, default: 'Start 1-Week Free Trial', trim: true },
    footnoteText: { type: String, default: 'No credit card required · Cancel anytime', trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, collection: 'PricingPlans' }
);

PricingPlanSchema.index({ order: 1, createdAt: 1 });

export const PricingPlan =
  mongoose.models.PricingPlan || mongoose.model<IPricingPlan>('PricingPlan', PricingPlanSchema);
