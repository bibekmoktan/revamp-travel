import { Model } from 'mongoose';

export type TUser = {
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  isBlocked: boolean;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export interface UserModel extends Model<TUser> {
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
}