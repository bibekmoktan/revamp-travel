import { Types } from 'mongoose';
import { BookingSummaryModel, IBookingSummary } from './bookingSummary.model';
import { TravelerModel, ITraveler } from './traveler.model';
import { PackageModel } from '../package/package.model';
import { ConflictError, NotFoundError, ValidationError } from '../../utils/errors';
import { logger } from '../../utils/logger';
import { BOOKING_CONSTANTS, BOOKING_STATUS, PAYMENT_STATUS, TRAVELER_STATUS } from './booking.constants';
import { CreateBookingPayload, BookingQueryParams, BookingResult, PaginatedBookings } from './booking.types';

export const BookingService = {
  async createBooking(
    userId: string,
    payload: CreateBookingPayload
  ): Promise<BookingResult> {
    const pax = payload.travelers.length;
    if (!Number.isInteger(pax) || pax < BOOKING_CONSTANTS.MIN_TRAVELERS || pax > BOOKING_CONSTANTS.MAX_TRAVELERS) {
      throw new ValidationError(`Number of travelers must be between ${BOOKING_CONSTANTS.MIN_TRAVELERS} and ${BOOKING_CONSTANTS.MAX_TRAVELERS}`);
    }

    if (payload.idempotencyKey) {
      const existing = await BookingSummaryModel.findOne({
        user: new Types.ObjectId(userId),
        idempotencyKey: payload.idempotencyKey,
      }).lean();
      if (existing) {
        const travelers = await TravelerModel.find({ booking: existing._id }).sort({ createdAt: 1 }).lean();
        return { booking: existing, travelers };
      }
    }

    const pkg = await PackageModel.findById(payload.packageId).lean();
    if (!pkg) throw new NotFoundError('Package not found');
    if ((pkg as any).status && (pkg as any).status !== 'active') {
      throw new ValidationError('Package is not active');
    }

    const pricePerPerson = Number((pkg as any).price ?? 0);
    if (Number.isNaN(pricePerPerson) || pricePerPerson < 0) {
      throw new ValidationError('Invalid package price');
    }

    const totalAmount = pricePerPerson * pax;
    const expiresAt = new Date(Date.now() + BOOKING_CONSTANTS.BOOKING_EXPIRY_MINUTES * 60 * 1000);

    let createdBooking: IBookingSummary | null = null;
    let createdTravelers: ITraveler[] = [];

    try {
      // Step 2 — create booking
      const bookingDocs = await BookingSummaryModel.create([{
        user: new Types.ObjectId(userId),
        package: new Types.ObjectId(payload.packageId),
        trekDate: payload.trekDate,
        idempotencyKey: payload.idempotencyKey,
        numberOfPeople: pax,
        totalAmount,
        paymentStatus: PAYMENT_STATUS.PENDING,
        bookingStatus: BOOKING_STATUS.RESERVED,
        expiresAt,
      }]);
      createdBooking = bookingDocs[0].toObject();

      // Step 3 — create travelers
      const travelerDocs = payload.travelers.map((t) => ({
        booking: bookingDocs[0]._id,
        fullName: t.fullName,
        age: t.age,
        gender: t.gender,
        idProof: t.idProof,
        status: TRAVELER_STATUS.ACTIVE,
      }));
      const insertedTravelers = await TravelerModel.insertMany(travelerDocs);
      createdTravelers = insertedTravelers.map((t) => t.toObject());
    } catch (error: any) {
      if (createdBooking) {
        await BookingSummaryModel.findByIdAndDelete((createdBooking as any)._id).catch(() => {});
      }

      if (error?.code === 11000 && payload.idempotencyKey) {
        const existing = await BookingSummaryModel.findOne({
          user: new Types.ObjectId(userId),
          idempotencyKey: payload.idempotencyKey,
        }).lean();
        if (existing) {
          const travelers = await TravelerModel.find({ booking: existing._id }).sort({ createdAt: 1 }).lean();
          return { booking: existing, travelers };
        }
        throw new ConflictError('Duplicate booking request');
      }

      logger.error('Failed to create booking', { userId, packageId: payload.packageId, error: error.message });
      throw error;
    }

    logger.info('Booking reserved', {
      userId,
      packageId: payload.packageId,
      bookingId: (createdBooking as any)._id?.toString(),
      count: pax,
    });

    return { booking: createdBooking, travelers: createdTravelers };
  },

  async confirmBooking(bookingId: string): Promise<BookingResult> {
    const booking = await BookingSummaryModel.findById(bookingId)
      .select('user bookingStatus')
      .lean() as IBookingSummary;

    if (!booking) throw new NotFoundError('Booking not found');

    await BookingSummaryModel.updateOne(
      { _id: new Types.ObjectId(bookingId), bookingStatus: { $ne: BOOKING_STATUS.CANCELLED } },
      { $set: { bookingStatus: BOOKING_STATUS.CONFIRMED } }
    );

    logger.info('Booking confirmed', { bookingId });

    const updated = await BookingSummaryModel.findById(bookingId)
      .select('user package trekDate numberOfPeople totalAmount bookingStatus paymentStatus expiresAt createdAt')
      .lean() as IBookingSummary;

    const travelers = await TravelerModel.find({ booking: new Types.ObjectId(bookingId) })
      .select('fullName age gender idProof status createdAt')
      .sort({ createdAt: 1 })
      .lean();

    return { booking: updated, travelers };
  },

  async getMyBookings(userId: string, query: BookingQueryParams): Promise<PaginatedBookings> {
    const { page = BOOKING_CONSTANTS.DEFAULT_PAGE, limit = BOOKING_CONSTANTS.DEFAULT_LIMIT, status, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const filter: any = { user: new Types.ObjectId(userId) };
    if (status) filter.bookingStatus = status;

    const sort: any = {};
    const allowedSortFields = ['createdAt', 'trekDate', 'bookingStatus', 'totalAmount'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    sort[sortField] = sortOrder === 'desc' ? -1 : 1;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(Math.max(1, Number(limit)), 100);
    const skip = (pageNum - 1) * limitNum;

    const [bookings, total] = await Promise.all([
      BookingSummaryModel.find(filter)
        .select('user package trekDate numberOfPeople totalAmount bookingStatus paymentStatus expiresAt createdAt')
        .populate('package', 'title price')
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      BookingSummaryModel.countDocuments(filter),
    ]);

    return {
      data: bookings,
      meta: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) },
    };
  },

  async getBooking(bookingId: string, userId: string, userRole: string): Promise<BookingResult> {
    const booking = await BookingSummaryModel.findById(bookingId)
      .select('user package trekDate numberOfPeople totalAmount bookingStatus paymentStatus expiresAt createdAt')
      .populate('package', 'title price')
      .lean();

    if (!booking) throw new NotFoundError('Booking not found');

    if (userRole !== 'admin' && (booking as any).user.toString() !== userId) {
      throw new ValidationError('You can only view your own bookings');
    }

    const travelers = await TravelerModel.find({ booking: new Types.ObjectId(bookingId) })
      .select('fullName age gender idProof status createdAt')
      .sort({ createdAt: 1 })
      .lean();

    return { booking, travelers };
  },

  async cancelBooking(bookingId: string, userId: string, userRole: string): Promise<BookingResult> {
    const booking = await BookingSummaryModel.findById(bookingId)
      .select('user package trekDate bookingStatus')
      .lean() as IBookingSummary;

    if (!booking) throw new NotFoundError('Booking not found');

    if (userRole !== 'admin' && booking.user.toString() !== userId) {
      throw new ValidationError('You can only cancel your own bookings');
    }

    if (booking.bookingStatus === BOOKING_STATUS.CANCELLED) {
      const travelers = await TravelerModel.find({ booking: new Types.ObjectId(bookingId) })
        .select('fullName age gender idProof status createdAt')
        .sort({ createdAt: 1 })
        .lean();
      return { booking, travelers };
    }

    await TravelerModel.updateMany(
      { booking: new Types.ObjectId(bookingId), status: { $ne: TRAVELER_STATUS.CANCELLED } },
      { $set: { status: TRAVELER_STATUS.CANCELLED } }
    );

    await BookingSummaryModel.updateOne(
      { _id: new Types.ObjectId(bookingId) },
      { $set: { bookingStatus: BOOKING_STATUS.CANCELLED } }
    );

    logger.info('Booking cancelled', { userId, bookingId });

    const updatedBooking = await BookingSummaryModel.findById(bookingId)
      .select('user package trekDate numberOfPeople totalAmount bookingStatus paymentStatus expiresAt createdAt')
      .lean() as IBookingSummary;

    const travelers = await TravelerModel.find({ booking: new Types.ObjectId(bookingId) })
      .select('fullName age gender idProof status createdAt')
      .sort({ createdAt: 1 })
      .lean();

    return { booking: updatedBooking, travelers };
  },
};
