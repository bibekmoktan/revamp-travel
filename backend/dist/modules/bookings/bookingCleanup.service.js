"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingCleanupService = void 0;
const bookingSummary_model_1 = require("./bookingSummary.model");
const traveler_model_1 = require("./traveler.model");
const booking_constants_1 = require("./booking.constants");
const logger_1 = require("../../utils/logger");
class BookingCleanupService {
    static async expireBookings() {
        const expiredBookings = await bookingSummary_model_1.BookingSummaryModel.find({
            bookingStatus: booking_constants_1.BOOKING_STATUS.RESERVED,
            expiresAt: { $lt: new Date() },
        }).lean();
        if (expiredBookings.length === 0) {
            logger_1.logger.info('No expired bookings to process');
            return;
        }
        logger_1.logger.info(`Processing ${expiredBookings.length} expired bookings`);
        for (const booking of expiredBookings) {
            try {
                await traveler_model_1.TravelerModel.updateMany({ booking: booking._id }, { $set: { status: booking_constants_1.TRAVELER_STATUS.CANCELLED } });
                await bookingSummary_model_1.BookingSummaryModel.updateOne({ _id: booking._id }, { $set: { bookingStatus: booking_constants_1.BOOKING_STATUS.CANCELLED } });
            }
            catch (err) {
                logger_1.logger.error('Failed to expire booking', {
                    bookingId: booking._id?.toString(),
                    error: err instanceof Error ? err.message : 'Unknown error',
                });
            }
        }
        logger_1.logger.info(`Successfully expired ${expiredBookings.length} bookings`);
    }
    static scheduleCleanup(intervalMinutes = 5) {
        setInterval(async () => {
            try {
                await this.expireBookings();
            }
            catch (error) {
                logger_1.logger.error('Scheduled booking cleanup failed', {
                    error: error instanceof Error ? error.message : 'Unknown error',
                });
            }
        }, intervalMinutes * 60 * 1000);
        logger_1.logger.info(`Booking cleanup scheduled every ${intervalMinutes} minutes`);
    }
}
exports.BookingCleanupService = BookingCleanupService;
