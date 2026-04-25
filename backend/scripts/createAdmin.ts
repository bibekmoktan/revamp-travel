/**
 * Create an admin user
 * Run: npx ts-node -r tsconfig-paths/register scripts/createAdmin.ts
 */

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGO_URL = process.env.MONGO_URL!;
if (!MONGO_URL) { console.error('MONGO_URL not set'); process.exit(1); }

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  role:      { type: String, enum: ['user', 'admin'], default: 'user' },
  isBlocked: { type: Boolean, default: false },
}, { timestamps: true });

const User = mongoose.models.User ?? mongoose.model('User', userSchema);

// ── Change these if you want different credentials ───────────────────────────
const ADMIN_NAME     = 'Admin';
const ADMIN_EMAIL    = 'admin@travelnepal.com';
const ADMIN_PASSWORD = 'Admin@123';
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log('Connected to MongoDB');

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    // Update role to admin in case it was user
    await User.updateOne({ email: ADMIN_EMAIL }, { role: 'admin', isBlocked: false });
    console.log(`✓ Existing user "${ADMIN_EMAIL}" updated to admin role`);
  } else {
    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await User.create({ name: ADMIN_NAME, email: ADMIN_EMAIL, password: hashed, role: 'admin' });
    console.log(`✓ Admin user created`);
  }

  console.log(`\n  Email:    ${ADMIN_EMAIL}`);
  console.log(`  Password: ${ADMIN_PASSWORD}\n`);

  await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
