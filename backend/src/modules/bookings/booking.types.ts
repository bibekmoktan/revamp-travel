import { Types } from 'mongoose';
import { IBookingSummary } from './bookingSummary.interface';
import { ITraveler } from './traveler.interface';

export interface CreateBookingPayload {
  packageId: string;
  trekDate: Date;
  idempotencyKey?: string;
  travelers: Array<{
    fullName: string;
    age?: number;
    gender?: string;
    idProof?: string;
  }>;
}

export interface BookingQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface BookingResult {
  booking: any;
  travelers: ITraveler[];
}

export interface PaginatedBookings {
  data: IBookingSummary[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface PopulatedBooking extends IBookingSummary {
  package?: {
    _id: Types.ObjectId;
    title: string;
    price: number;
  };
}

export interface BookingService {
  getBooking(bookingId: string, userId: string, userRole: string): Promise<BookingResult>;
}
