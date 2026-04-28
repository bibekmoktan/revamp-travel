import { Types } from 'mongoose';
import { PackageDateInventoryModel } from '../package/packageDateInventory.model';
import { BOOKING_CONSTANTS } from './booking.constants';

export interface InventoryUpdateResult {
  success: boolean;
  inventory?: any;
  error?: string;
}

export class InventoryManager {
  static async reserveSeats(
    packageId: string | Types.ObjectId,
    trekDate: Date,
    numberOfPeople: number,
  ): Promise<InventoryUpdateResult> {
    try {
      const inventory = await PackageDateInventoryModel.findOneAndUpdate(
        {
          package: new Types.ObjectId(packageId.toString()),
          date: trekDate,
          availableSeats: { $gte: numberOfPeople },
        },
        { $inc: { availableSeats: -numberOfPeople } },
        { new: true }
      ).lean();

      if (!inventory) {
        const exists = await PackageDateInventoryModel.findOne({
          package: new Types.ObjectId(packageId.toString()),
          date: trekDate,
        }).lean();

        if (!exists) {
          return { success: false, error: 'trekDate is not available for this package' };
        }

        return { success: false, error: 'Not enough seats available' };
      }

      return { success: true, inventory };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown inventory error',
      };
    }
  }

  static async releaseSeats(
    packageId: Types.ObjectId | string,
    trekDate: Date,
    numberOfPeople: number,
  ): Promise<void> {
    await PackageDateInventoryModel.updateOne(
      { package: new Types.ObjectId(packageId.toString()), date: trekDate },
      { $inc: { availableSeats: numberOfPeople } }
    );
  }

  static validateNumberOfPeople(pax: number): void {
    if (!Number.isInteger(pax) || pax < BOOKING_CONSTANTS.MIN_TRAVELERS || pax > BOOKING_CONSTANTS.MAX_TRAVELERS) {
      throw new Error(`Number of people must be between ${BOOKING_CONSTANTS.MIN_TRAVELERS} and ${BOOKING_CONSTANTS.MAX_TRAVELERS}`);
    }
  }
}
