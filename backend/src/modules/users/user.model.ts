import { Schema, model, HydratedDocument } from 'mongoose';
import bcrypt from 'bcrypt';
import { TUser, UserModel } from './user.interface';
import { env } from '../../config/env';

const userSchema = new Schema<TUser, UserModel>(
  {
    name:     { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: false, select: false },
    role:     { type: String, enum: ['user', 'admin'], default: 'user' },
    isBlocked: { type: Boolean, default: false },
    googleId:   { type: String, select: false, sparse: true },
    facebookId: { type: String, select: false, sparse: true },
    appleId:    { type: String, select: false, sparse: true },
    provider: { type: String, enum: ['local', 'google', 'facebook', 'apple'], default: 'local' },
    avatar:   { type: String },
    passwordResetToken:   { type: String, select: false },
    passwordResetExpires: { type: Date,   select: false },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (this: HydratedDocument<TUser>, next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, env.bcryptRounds);
  next();
});

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<TUser, UserModel>('User', userSchema);
