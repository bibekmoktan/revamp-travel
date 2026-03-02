import mongoose from 'mongoose';
import { BookingSummaryModel } from './bookingSummary.model';
import { TravelerModel } from './traveler.model';
import { BOOKING_STATUS, TRAVELER_STATUS } from './booking.constants';
import { logger } from '../../utils/logger';

export class BookingAnalyticsService {
  static async getBookingStats(packageId?: string): Promise<any> {
    try {
      const matchStage: any = {};
      if (packageId) {
        matchStage.package = new mongoose.Types.ObjectId(packageId);
      }

      const stats = await BookingSummaryModel.aggregate([
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
    } catch (error) {
      logger.error('Failed to get booking stats', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  static async getRevenueAnalytics(startDate?: Date, endDate?: Date): Promise<any> {
    try {
      const matchStage: any = {
        bookingStatus: { $in: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.RESERVED] },
      };
      
      if (startDate || endDate) {
        matchStage.createdAt = {};
        if (startDate) matchStage.createdAt.$gte = startDate;
        if (endDate) matchStage.createdAt.$lte = endDate;
      }

      const revenue = await BookingSummaryModel.aggregate([
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
    } catch (error) {
      logger.error('Failed to get revenue analytics', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  static async getPopularPackages(limit: number = 10): Promise<any> {
    try {
      const popularPackages = await BookingSummaryModel.aggregate([
        {
          $match: {
            bookingStatus: { $in: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.RESERVED] },
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
    } catch (error) {
      logger.error('Failed to get popular packages', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  static async getTravelerDemographics(): Promise<any> {
    try {
      const demographics = await TravelerModel.aggregate([
        {
          $match: {
            status: TRAVELER_STATUS.ACTIVE,
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
    } catch (error) {
      logger.error('Failed to get traveler demographics', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }
}
