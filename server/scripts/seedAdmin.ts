import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDatabase, disconnectDatabase } from '../config/db';
import { seedDatabaseIfEmpty } from '../config/seed';
import { Admin } from '../models/Admin';
import { env } from '../config/env';

dotenv.config();

async function runSeed() {
  const connected = await connectDatabase();
  if (!connected) {
    console.error('[Seed CLI] Could not connect to MongoDB. Check MONGODB_URI.');
    process.exit(1);
  }

  const emailArg = process.argv[2]?.trim().toLowerCase();
  const passArg = process.argv[3]?.trim();

  if (emailArg && passArg) {
    const existing = await Admin.findOne({ email: emailArg });
    if (existing) {
      console.log(`[Seed CLI] Admin ${emailArg} already exists — skipping overwrite.`);
    } else {
      const passwordHash = await bcrypt.hash(passArg, 12);
      await Admin.create({
        name: env.adminSeedName,
        email: emailArg,
        passwordHash,
        role: 'superadmin',
      });
      console.log(`[Seed CLI] Created admin account: ${emailArg}`);
    }
  }

  await seedDatabaseIfEmpty({ seedAdmin: true });
  console.log('[Seed CLI] Database seed completed safely.');
  await disconnectDatabase();
  process.exit(0);
}

runSeed().catch((err) => {
  console.error('[Seed CLI] Failed:', err);
  process.exit(1);
});
