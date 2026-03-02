import { Types } from 'mongoose';

export interface IPackageDateInventory {
  _id?: Types.ObjectId;
  package: Types.ObjectId | string;
  date: Date;
  totalSeats: number;
  availableSeats: number;
  createdAt?: Date;
  updatedAt?: Date;
}
