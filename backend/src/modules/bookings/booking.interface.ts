import { Types } from 'mongoose';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export type PaymentStatus = 'unpaid' | 'pending' | 'paid' | 'failed' | 'refunded' | 'partial_refund';

export type RefundStatus = 'none' | 'pending' | 'succeeded' | 'failed';

export interface ITravelerInfo {
  fullName: string;
  email?: string;
  phone?: string;
  nationality?: string;
  dob?: Date;
  passportNumber?: string;
}

export interface IBooking {
  _id?: Types.ObjectId;
  groupId?: string;
  travelerIndex?: number;
  idempotencyKey: string;
  user: Types.ObjectId | string;
  package: Types.ObjectId | string;
  departureDate: Date;
  status: BookingStatus;
  traveler: ITravelerInfo;
  paxInGroup?: number;
  pricePerPerson: number;
  currency: string;
  totalAmount: number;
  paymentStatus?: PaymentStatus;
  paymentProvider?: string;
  paymentIntentId?: string;
  paymentReference?: string;
  amountPaid?: number;
  refundedAmount?: number;
  refundStatus?: RefundStatus;
  cancelledAt?: Date;
  confirmedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
