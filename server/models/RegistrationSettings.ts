import mongoose, { Schema, Document } from 'mongoose';

export interface IRegistrationSettings extends Document {
  key: string;
  hours: string[];
  minutes: string[];
  durations: string[];
  daysPerWeekOptions: string[];
  daysPerMonthOptions: string[];
  allowTimeSelection: boolean;
  allowDurationSelection: boolean;
  allowWeeklySelection: boolean;
  allowMonthlySelection: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RegistrationSettingsSchema = new Schema<IRegistrationSettings>(
  {
    key: { type: String, required: true, unique: true, default: 'primary' },
    hours: {
      type: [String],
      default: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
    },
    minutes: {
      type: [String],
      default: ['00', '15', '30', '45'],
    },
    durations: {
      type: [String],
      default: ['30 Minutes', '45 Minutes', '1 Hour', '1.5 Hours', '2 Hours (Max)'],
    },
    daysPerWeekOptions: {
      type: [String],
      default: [
        '1 Day / Week',
        '2 Days / Week',
        '3 Days / Week',
        '4 Days / Week',
        '5 Days / Week',
        '6 Days / Week',
      ],
    },
    daysPerMonthOptions: {
      type: [String],
      default: [
        '4 Days / Month',
        '8 Days / Month',
        '12 Days / Month',
        '16 Days / Month',
        '20 Days / Month',
        '24 Days / Month',
      ],
    },
    allowTimeSelection: { type: Boolean, default: true },
    allowDurationSelection: { type: Boolean, default: true },
    allowWeeklySelection: { type: Boolean, default: true },
    allowMonthlySelection: { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'RegistrationSettings' }
);

export const RegistrationSettings =
  mongoose.models.RegistrationSettings ||
  mongoose.model<IRegistrationSettings>('RegistrationSettings', RegistrationSettingsSchema);
