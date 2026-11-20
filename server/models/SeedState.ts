import mongoose, { Schema, Document } from 'mongoose';

export interface ISeedState extends Document {
  key: string;
  seededAt: Date;
}

const SeedStateSchema = new Schema<ISeedState>(
  {
    key: { type: String, required: true, unique: true },
    seededAt: { type: Date, default: Date.now },
  },
  { timestamps: true, collection: 'SeedState' }
);

export const SeedState =
  mongoose.models.SeedState ||
  mongoose.model<ISeedState>('SeedState', SeedStateSchema);
