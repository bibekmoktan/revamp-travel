import mongoose, { Schema } from 'mongoose';
import { ICategory } from './category.interface';

const categorySchema = new Schema<ICategory>(
  {
    name:        { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: '' },
    image:       { type: String, default: '' },
    order:       { type: Number, default: 0 },
    isActive:    { type: Boolean, default: true },
  },
  { timestamps: true },
);

categorySchema.index({ isActive: 1, order: 1 });

export const CategoryModel = mongoose.model<ICategory>('Category', categorySchema);
