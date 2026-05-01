"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryManager = void 0;
const mongoose_1 = require("mongoose");
const packageDateInventory_model_1 = require("../package/packageDateInventory.model");
const booking_constants_1 = require("./booking.constants");
class InventoryManager {
    static async reserveSeats(packageId, trekDate, numberOfPeople) {
        try {
            const inventory = await packageDateInventory_model_1.PackageDateInventoryModel.findOneAndUpdate({
                package: new mongoose_1.Types.ObjectId(packageId.toString()),
                date: trekDate,
                availableSeats: { $gte: numberOfPeople },
            }, { $inc: { availableSeats: -numberOfPeople } }, { new: true }).lean();
            if (!inventory) {
                const exists = await packageDateInventory_model_1.PackageDateInventoryModel.findOne({
                    package: new mongoose_1.Types.ObjectId(packageId.toString()),
                    date: trekDate,
                }).lean();
                if (!exists) {
                    return { success: false, error: 'trekDate is not available for this package' };
                }
                return { success: false, error: 'Not enough seats available' };
            }
            return { success: true, inventory };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown inventory error',
            };
        }
    }
    static async releaseSeats(packageId, trekDate, numberOfPeople) {
        await packageDateInventory_model_1.PackageDateInventoryModel.updateOne({ package: new mongoose_1.Types.ObjectId(packageId.toString()), date: trekDate }, { $inc: { availableSeats: numberOfPeople } });
    }
    static validateNumberOfPeople(pax) {
        if (!Number.isInteger(pax) || pax < booking_constants_1.BOOKING_CONSTANTS.MIN_TRAVELERS || pax > booking_constants_1.BOOKING_CONSTANTS.MAX_TRAVELERS) {
            throw new Error(`Number of people must be between ${booking_constants_1.BOOKING_CONSTANTS.MIN_TRAVELERS} and ${booking_constants_1.BOOKING_CONSTANTS.MAX_TRAVELERS}`);
        }
    }
}
exports.InventoryManager = InventoryManager;
