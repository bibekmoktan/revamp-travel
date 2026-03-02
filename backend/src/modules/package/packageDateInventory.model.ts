import mongoose, { Schema } from 'mongoose';
import { IPackageDateInventory } from './packageDateInventory.interface';

const packageDateInventorySchema = new Schema<IPackageDateInventory>(
  {
    package: { type: Schema.Types.ObjectId, ref: 'Package', required: true, index: true },
    date: { type: Date, required: true, index: true },
    totalSeats: { type: Number, required: true, min: 0 },
    availableSeats: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

packageDateInventorySchema.index({ package: 1, date: 1 }, { unique: true });

export const PackageDateInventoryModel = mongoose.model<IPackageDateInventory>('PackageDateInventory', packageDateInventorySchema);
