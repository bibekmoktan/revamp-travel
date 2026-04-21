import { Schema, model, HydratedDocument } from 'mongoose';
import bcrypt from 'bcrypt';
import { TUser, UserModel } from './user.interface';
import { env } from '../../config/env';

// 1️⃣ Define Schema
const userSchema = new Schema<TUser, UserModel>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isBlocked: { type: Boolean, default: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
  },
  {
    timestamps: true,
  }
);

// 2️⃣ Pre-save middleware (Password hashing)
userSchema.pre('save', async function (
  this: HydratedDocument<TUser>,
  next
) {
  if (!this.isModified('password')) return next();

  if (this.password) {
    this.password = await bcrypt.hash(this.password, env.bcryptRounds);
  }

  next();
});

// 3️⃣ Static method for password compare
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

// 4️⃣ Create model
export const User = model<TUser, UserModel>('User', userSchema);