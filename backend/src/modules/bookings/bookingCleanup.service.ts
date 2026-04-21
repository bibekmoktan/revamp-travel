import mongoose from 'mongoose';
import { BookingSummaryModel } from './bookingSummary.model';
import { TravelerModel } from './traveler.model';
import { PackageDateInventoryModel } from '../package/packageDateInventory.model';
import { BOOKING_STATUS, TRAVELER_STATUS } from './booking.constants';
import { logger } from '../../utils/logger';
import { withTimeout } from '../../utils/catchAsync';

const TRANSACTION_TIMEOUT_MS = 10_000;

export class BookingCleanupService {
  static async expireBookings(): Promise<void> {
    const session = await mongoose.startSession();
    try {
      await withTimeout(session.withTransaction(async () => {
        const expiredBookings = await BookingSummaryModel.find({
          bookingStatus: BOOKING_STATUS.RESERVED,
          expiresAt: { $lt: new Date() },
        }).session(session).lean();

        if (expiredBookings.length === 0) {
          logger.info('No expired bookings to process');
          return;
        }

        logger.info(`Processing ${expiredBookings.length} expired bookings`);

        for (const booking of expiredBookings) {
          const activeTravelerCount = await TravelerModel.countDocuments({
            booking: booking._id,
            status: TRAVELER_STATUS.ACTIVE,
          }).session(session);

          if (activeTravelerCount > 0) {
            await PackageDateInventoryModel.updateOne(
              {
                package: booking.package,
                date: booking.trekDate,
              },
              { $inc: { availableSeats: activeTravelerCount } },
              { session }
            );
          }

          await TravelerModel.updateMany(
            { booking: booking._id },
            { $set: { status: TRAVELER_STATUS.CANCELLED } },
            { session }
          );

          await BookingSummaryModel.updateOne(
            { _id: booking._id },
            { $set: { bookingStatus: BOOKING_STATUS.CANCELLED } },
            { session }
          );
        }

        logger.info(`Successfully expired ${expiredBookings.length} bookings`);
      }), TRANSACTION_TIMEOUT_MS, 'Cleanup transaction timed out');
    } catch (error) {
      logger.error('Failed to expire bookings', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    } finally {
      session.endSession();
    }
  }

  static scheduleCleanup(intervalMinutes: number = 5): void {
    setInterval(async () => {
      try {
        await this.expireBookings();
      } catch (error) {
        logger.error('Scheduled booking cleanup failed', {
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }, intervalMinutes * 60 * 1000);

    logger.info(`Booking cleanup scheduled every ${intervalMinutes} minutes`);
  }
}
