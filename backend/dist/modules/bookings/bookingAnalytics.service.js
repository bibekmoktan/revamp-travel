"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingAnalyticsService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bookingSummary_model_1 = require("./bookingSummary.model");
const traveler_model_1 = require("./traveler.model");
const booking_constants_1 = require("./booking.constants");
const logger_1 = require("../../utils/logger");
class BookingAnalyticsService {
    static async getBookingStats(packageId) {
        try {
            const matchStage = {};
            if (packageId) {
                matchStage.package = new mongoose_1.default.Types.ObjectId(packageId);
            }
            const stats = await bookingSummary_model_1.BookingSummaryModel.aggregate([
                { $match: matchStage },
                {
                    $group: {
                        _id: '$bookingStatus',
                        count: { $sum: 1 },
                        totalAmount: { $sum: '$totalAmount' },
                        avgAmount: { $avg: '$totalAmount' },
                    },
                },
                { $sort: { count: -1 } },
            ]);
            return stats;
        }
        catch (error) {
            logger_1.logger.error('Failed to get booking stats', {
                error: error instanceof Error ? error.message : 'Unknown error',
            });
            throw error;
        }
    }
    static async getRevenueAnalytics(startDate, endDate) {
        try {
            const matchStage = {
                bookingStatus: { $in: [booking_constants_1.BOOKING_STATUS.CONFIRMED, booking_constants_1.BOOKING_STATUS.RESERVED] },
            };
            if (startDate || endDate) {
                matchStage.createdAt = {};
                if (startDate)
                    matchStage.createdAt.$gte = startDate;
                if (endDate)
                    matchStage.createdAt.$lte = endDate;
            }
            const revenue = await bookingSummary_model_1.BookingSummaryModel.aggregate([
                { $match: matchStage },
                {
                    $group: {
                        _id: {
                            year: { $year: '$createdAt' },
                            month: { $month: '$createdAt' },
                        },
                        totalRevenue: { $sum: '$totalAmount' },
                        bookingCount: { $sum: 1 },
                        avgBookingValue: { $avg: '$totalAmount' },
                    },
                },
                { $sort: { '_id.year': -1, '_id.month': -1 } },
            ]);
            return revenue;
        }
        catch (error) {
            logger_1.logger.error('Failed to get revenue analytics', {
                error: error instanceof Error ? error.message : 'Unknown error',
            });
            throw error;
        }
    }
    static async getPopularPackages(limit = 10) {
        try {
            const popularPackages = await bookingSummary_model_1.BookingSummaryModel.aggregate([
                {
                    $match: {
                        bookingStatus: { $in: [booking_constants_1.BOOKING_STATUS.CONFIRMED, booking_constants_1.BOOKING_STATUS.RESERVED] },
                    },
                },
                {
                    $group: {
                        _id: '$package',
                        bookingCount: { $sum: '$numberOfPeople' },
                        totalRevenue: { $sum: '$totalAmount' },
                        avgGroupSize: { $avg: '$numberOfPeople' },
                    },
                },
                {
                    $lookup: {
                        from: 'packages',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'packageInfo',
                    },
                },
                { $unwind: '$packageInfo' },
                {
                    $project: {
                        packageId: '$_id',
                        title: '$packageInfo.title',
                        bookingCount: 1,
                        totalRevenue: 1,
                        avgGroupSize: 1,
                    },
                },
                { $sort: { bookingCount: -1 } },
                { $limit: Math.min(limit, 50) },
            ]);
            return popularPackages;
        }
        catch (error) {
            logger_1.logger.error('Failed to get popular packages', {
                error: error instanceof Error ? error.message : 'Unknown error',
            });
            throw error;
        }
    }
    static async getTravelerDemographics() {
        try {
            const demographics = await traveler_model_1.TravelerModel.aggregate([
                {
                    $match: {
                        status: booking_constants_1.TRAVELER_STATUS.ACTIVE,
                        age: { $exists: true, $ne: null },
                    },
                },
                {
                    $group: {
                        _id: null,
                        avgAge: { $avg: '$age' },
                        minAge: { $min: '$age' },
                        maxAge: { $max: '$age' },
                        totalTravelers: { $sum: 1 },
                    },
                },
                {
                    $bucket: {
                        groupBy: '$age',
                        boundaries: [0, 18, 25, 35, 45, 55, 65, 100],
                        default: 'Other',
                        output: {
                            count: { $sum: 1 },
                        },
                    },
                },
            ]);
            return demographics;
        }
        catch (error) {
            logger_1.logger.error('Failed to get traveler demographics', {
                error: error instanceof Error ? error.message : 'Unknown error',
            });
            throw error;
        }
    }
}
exports.BookingAnalyticsService = BookingAnalyticsService;
