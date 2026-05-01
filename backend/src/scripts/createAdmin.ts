import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGO_URL = process.env.MONGO_URL!;

const EMAIL    = 'admin@travelnepal.com';
const PASSWORD = 'Admin@Nepal2025';
const NAME     = 'Super Admin';

async function createAdmin() {
  await mongoose.connect(MONGO_URL);
  console.log('Connected to MongoDB');

  const db = mongoose.connection.db!;
  const users = db.collection('users');

  const existing = await users.findOne({ email: EMAIL });
  if (existing) {
    const hashed = await bcrypt.hash(PASSWORD, 12);
    await users.updateOne({ email: EMAIL }, { $set: { password: hashed, role: 'admin', isBlocked: false } });
    console.log('✅ Admin password reset successfully');
    console.log('   Email:   ', EMAIL);
    console.log('   Password:', PASSWORD);
    await mongoose.disconnect();
    return;
  }

  const hashed = await bcrypt.hash(PASSWORD, 12);
  await users.insertOne({
    name:      NAME,
    email:     EMAIL,
    password:  hashed,
    role:      'admin',
    isBlocked: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log('✅ Admin user created successfully');
  console.log('   Email:   ', EMAIL);
  console.log('   Password:', PASSWORD);

  await mongoose.disconnect();
}

createAdmin().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
