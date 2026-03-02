import { Types } from 'mongoose';

export type BookingPaymentStatus = 'pending' | 'paid' | 'failed';
export type BookingStatus = 'reserved' | 'confirmed' | 'cancelled';

export interface IBookingSummary {
  _id?: Types.ObjectId;
  user: Types.ObjectId | string;
  package: Types.ObjectId | string;
  trekDate: Date;
  idempotencyKey?: string;
  numberOfPeople: number;
  totalAmount: number;
  paymentStatus: BookingPaymentStatus;
  bookingStatus: BookingStatus;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
