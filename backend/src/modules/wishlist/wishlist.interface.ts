import { Types } from 'mongoose';

export interface IWishlist {
  _id?: Types.ObjectId;
  user: Types.ObjectId | string;
  package: Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}
