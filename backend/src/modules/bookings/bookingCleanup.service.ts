import { BookingSummaryModel } from './bookingSummary.model';
import { TravelerModel } from './traveler.model';
import { BOOKING_STATUS, TRAVELER_STATUS } from './booking.constants';
import { logger } from '../../utils/logger';

export class BookingCleanupService {
  static async expireBookings(): Promise<void> {
    const expiredBookings = await BookingSummaryModel.find({
      bookingStatus: BOOKING_STATUS.RESERVED,
      expiresAt: { $lt: new Date() },
    }).lean();

    if (expiredBookings.length === 0) {
      logger.info('No expired bookings to process');
      return;
    }

    logger.info(`Processing ${expiredBookings.length} expired bookings`);

    for (const booking of expiredBookings) {
      try {
        await TravelerModel.updateMany(
          { booking: booking._id },
          { $set: { status: TRAVELER_STATUS.CANCELLED } }
        );

        await BookingSummaryModel.updateOne(
          { _id: booking._id },
          { $set: { bookingStatus: BOOKING_STATUS.CANCELLED } }
        );
      } catch (err) {
        logger.error('Failed to expire booking', {
          bookingId: booking._id?.toString(),
          error: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    }

    logger.info(`Successfully expired ${expiredBookings.length} bookings`);
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
