import { Model } from 'mongoose';

export type TUser = {
  name: string;
  email: string;
  password?: string; // hidden when returning user
  role: 'user' | 'admin';
  isBlocked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export interface UserModel extends Model<TUser> {
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
}