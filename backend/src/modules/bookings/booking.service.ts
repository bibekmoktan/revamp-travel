import mongoose, { Types } from 'mongoose';
import { BookingSummaryModel, IBookingSummary } from './bookingSummary.model';
import { TravelerModel, ITraveler } from './traveler.model';
import { PackageDateInventoryModel } from '../package/packageDateInventory.model';
import { PackageModel } from '../package/package.model';
import { ConflictError, NotFoundError, ValidationError } from '../../utils/errors';
import { logger } from '../../utils/logger';
import { BOOKING_CONSTANTS, BOOKING_STATUS, PAYMENT_STATUS, TRAVELER_STATUS } from './booking.constants';
import { CreateBookingPayload, BookingQueryParams, BookingResult, PaginatedBookings, PopulatedBooking } from './booking.types';
import { InventoryManager } from './inventory.utils';
import { withTimeout } from '../../utils/catchAsync';

const TRANSACTION_TIMEOUT_MS = 10_000;

export const BookingService = {
  async createBooking(
    userId: string,
    payload: CreateBookingPayload
  ): Promise<BookingResult> {
    const session = await mongoose.startSession();
    try {
      const pax = payload.travelers.length;
      InventoryManager.validateNumberOfPeople(pax);

      if (payload.idempotencyKey) {
        const existing = await BookingSummaryModel.findOne({ user: new Types.ObjectId(userId), idempotencyKey: payload.idempotencyKey }).lean();
        if (existing) {
          const travelers = await TravelerModel.find({ booking: existing._id }).sort({ createdAt: 1 }).lean();
          return { booking: existing, travelers };
        }
      }

      const pkg = await PackageModel.findById(payload.packageId).lean();
      if (!pkg) {
        throw new NotFoundError('Package not found');
      }
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

      await withTimeout(session.withTransaction(async () => {
        const inventoryResult = await InventoryManager.reserveSeats(
          payload.packageId,
          payload.trekDate,
          pax,
          session
        );

        if (!inventoryResult.success) {
          throw new ValidationError(inventoryResult.error || 'Failed to reserve seats');
        }

        const bookingDocs = await BookingSummaryModel.create(
          [
            {
              user: new Types.ObjectId(userId),
              package: new Types.ObjectId(payload.packageId),
              trekDate: payload.trekDate,
              idempotencyKey: payload.idempotencyKey,
              numberOfPeople: pax,
              totalAmount,
              paymentStatus: PAYMENT_STATUS.PENDING,
              bookingStatus: BOOKING_STATUS.RESERVED,
              expiresAt,
            },
          ],
          { session }
        );

        createdBooking = bookingDocs[0].toObject();

        const travelerDocs = payload.travelers.map((t) => ({
          booking: bookingDocs[0]._id,
          fullName: t.fullName,
          age: t.age,
          gender: t.gender,
          idProof: t.idProof,
          status: TRAVELER_STATUS.ACTIVE,
        }));

        const insertedTravelers = await TravelerModel.insertMany(travelerDocs, { session });
        createdTravelers = insertedTravelers.map((t) => t.toObject());
      }), TRANSACTION_TIMEOUT_MS, 'Booking transaction timed out');

      if (!createdBooking) {
        throw new Error('Failed to create booking');
      }

      logger.info('Booking reserved', {
        userId,
        packageId: payload.packageId,
        bookingId: (createdBooking as IBookingSummary & { _id: any })._id?.toString(),
        count: pax,
      });

      return { booking: createdBooking, travelers: createdTravelers };
    } catch (error: any) {
      if (error?.code === 11000) {
        if (payload.idempotencyKey) {
          const existing = await BookingSummaryModel.findOne({ user: new Types.ObjectId(userId), idempotencyKey: payload.idempotencyKey }).lean();
          if (existing) {
            const travelers = await TravelerModel.find({ booking: existing._id }).sort({ createdAt: 1 }).lean();
            return { booking: existing, travelers };
          }
        }
        throw new ConflictError('Duplicate booking request');
      }

      logger.error('Failed to create booking', {
        userId,
        packageId: payload.packageId,
        error: error.message,
      });
      throw error;
    } finally {
      session.endSession();
    }
  },

  async confirmBooking(bookingId: string): Promise<BookingResult> {
    // Optimized booking lookup with field selection
    const booking = await BookingSummaryModel.findById(bookingId)
      .select('user bookingStatus')
      .lean() as IBookingSummary;
      
    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    await BookingSummaryModel.updateOne(
      { _id: new Types.ObjectId(bookingId), bookingStatus: { $ne: BOOKING_STATUS.CANCELLED } },
      { $set: { bookingStatus: BOOKING_STATUS.CONFIRMED } }
    );

    logger.info('Booking confirmed', {
      bookingId,
    });

    // Get updated booking with optimized field selection
    const updated = await BookingSummaryModel.findById(bookingId)
      .select('user package trekDate numberOfPeople totalAmount bookingStatus paymentStatus expiresAt createdAt')
      .lean() as IBookingSummary;
      
    // Optimized traveler query with field selection
    const travelers = await TravelerModel.find({ booking: new Types.ObjectId(bookingId) })
      .select('fullName age gender idProof status createdAt')
      .sort({ createdAt: 1 })
      .lean();
      
    return { booking: updated, travelers };
  },

  async getMyBookings(userId: string, query: BookingQueryParams): Promise<PaginatedBookings> {
    const { page = BOOKING_CONSTANTS.DEFAULT_PAGE, limit = BOOKING_CONSTANTS.DEFAULT_LIMIT, status, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    // Build optimized filter
    const filter: any = { user: new Types.ObjectId(userId) };
    if (status) filter.bookingStatus = status;

    // Build optimized sort
    const sort: any = {};
    const allowedSortFields = ['createdAt', 'trekDate', 'bookingStatus', 'totalAmount'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    sort[sortField] = sortOrder === 'desc' ? -1 : 1;

    // Calculate skip with validation
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(Math.max(1, Number(limit)), 100); // Max 100 per page
    const skip = (pageNum - 1) * limitNum;

    // Optimized parallel queries with lean() for performance
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
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    };
  },

  async getBooking(bookingId: string, userId: string, userRole: string): Promise<BookingResult> {
    const booking = await BookingSummaryModel.findById(bookingId)
      .select('user package trekDate numberOfPeople totalAmount bookingStatus paymentStatus expiresAt createdAt')
      .populate('package', 'title price')
      .lean();
    
    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    if (userRole !== 'admin' && (booking as any).user.toString() !== userId) {
      throw new ValidationError('You can only view your own bookings');
    }

    // Optimized traveler query with field selection
    const travelers = await TravelerModel.find({ booking: new Types.ObjectId(bookingId) })
      .select('fullName age gender idProof status createdAt')
      .sort({ createdAt: 1 })
      .lean();
    
    return { booking, travelers };
  },

  async cancelBooking(bookingId: string, userId: string, userRole: string): Promise<BookingResult> {
    const session = await mongoose.startSession();
    try {
      let updatedBooking: IBookingSummary | null = null;

      await withTimeout(session.withTransaction(async () => {
        // Optimized booking lookup with field selection
        const booking = await BookingSummaryModel.findById(bookingId)
          .select('user package trekDate bookingStatus')
          .session(session)
          .lean() as IBookingSummary;
          
        if (!booking) {
          throw new NotFoundError('Booking not found');
        }

        if (userRole !== 'admin' && booking.user.toString() !== userId) {
          throw new ValidationError('You can only cancel your own bookings');
        }

        if (booking.bookingStatus === BOOKING_STATUS.CANCELLED) {
          updatedBooking = booking;
          return;
        }

        // Optimized traveler count query
        const activeTravelerCount = await TravelerModel.countDocuments({ 
          booking: new Types.ObjectId(bookingId), 
          status: TRAVELER_STATUS.ACTIVE 
        }).session(session);
        
        if (activeTravelerCount > 0) {
          await InventoryManager.releaseSeats(
            booking.package as Types.ObjectId,
            booking.trekDate,
            activeTravelerCount,
            session
          );
        }

        // Optimized bulk update for travelers
        await TravelerModel.updateMany(
          { booking: new Types.ObjectId(bookingId), status: { $ne: TRAVELER_STATUS.CANCELLED } },
          { $set: { status: TRAVELER_STATUS.CANCELLED } },
          { session }
        );

        await BookingSummaryModel.updateOne(
          { _id: new Types.ObjectId(bookingId) },
          { $set: { bookingStatus: BOOKING_STATUS.CANCELLED } },
          { session }
        );

        // Get updated booking with optimized field selection
        updatedBooking = await BookingSummaryModel.findById(bookingId)
          .select('user package trekDate numberOfPeople totalAmount bookingStatus paymentStatus expiresAt createdAt')
          .session(session)
          .lean() as IBookingSummary;
      }), TRANSACTION_TIMEOUT_MS, 'Cancel booking transaction timed out');

      logger.info('Booking cancelled', {
        userId,
        bookingId,
      });

      if (!updatedBooking) {
        throw new Error('Failed to cancel booking');
      }

      // Optimized traveler query with field selection
      const travelers = await TravelerModel.find({ booking: new Types.ObjectId(bookingId) })
        .select('fullName age gender idProof status createdAt')
        .sort({ createdAt: 1 })
        .lean();
        
      return { booking: updatedBooking, travelers };
    } finally {
      session.endSession();
    }
  },
};
