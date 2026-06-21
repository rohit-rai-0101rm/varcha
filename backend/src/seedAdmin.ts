import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import bcrypt from 'bcryptjs';
import { connectDb } from './db';
import Admin from './models/Admin';

async function seed() {
  await connectDb();
  const email = process.env.ADMIN_EMAIL ?? 'admin@varcha.in';
  const password = process.env.ADMIN_PASSWORD ?? 'varcha@admin123';
  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log(`Admin already exists: ${email}`);
    process.exit(0);
  }
  const passwordHash = await bcrypt.hash(password, 10);
  await Admin.create({ name: 'Admin', email, passwordHash, role: 'super-admin' });
  console.log(`Created admin: ${email} / ${password}`);
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
