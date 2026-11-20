import dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',
  port: Number(process.env.PORT) || 3000,
  mongodbUri: (process.env.MONGODB_URI || '').trim(),
  jwtSecret:
    process.env.JWT_SECRET ||
    'dev-only-adam-to-muhammad-academy-jwt-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  appUrl: process.env.APP_URL || 'http://localhost:3000',
  adminSeedEmail: (process.env.ADMIN_SEED_EMAIL || 'admin@adammohammadacademy.com').toLowerCase(),
  adminSeedPassword: process.env.ADMIN_SEED_PASSWORD || 'AcademyAdmin2026!',
  adminSeedName: process.env.ADMIN_SEED_NAME || 'Academy Administrator',
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: Number(process.env.SMTP_PORT) || 587,
  smtpSecure: process.env.SMTP_SECURE === 'true',
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  smtpFrom: process.env.SMTP_FROM || 'no-reply@adammohammadacademy.com',
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',
};
