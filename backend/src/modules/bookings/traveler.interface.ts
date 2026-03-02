import { Types } from 'mongoose';

export type TravelerStatus = 'active' | 'cancelled';

export interface ITraveler {
  _id?: Types.ObjectId;
  booking: Types.ObjectId | string;
  fullName: string;
  age?: number;
  gender?: string;
  idProof?: string;
  status: TravelerStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
