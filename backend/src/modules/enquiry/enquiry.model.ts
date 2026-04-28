import mongoose, { Schema } from 'mongoose';
import { IEnquiry } from './enquiry.interface';

const enquirySchema = new Schema<IEnquiry>(
  {
    name:         { type: String, required: true, trim: true },
    email:        { type: String, required: true, trim: true, lowercase: true },
    phone:        { type: String, trim: true, default: '' },
    message:      { type: String, required: true },
    packageId:    { type: String, default: '' },
    packageTitle: { type: String, default: '' },
    status:       { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
  },
  { timestamps: true },
);

enquirySchema.index({ status: 1, createdAt: -1 });

export const EnquiryModel = mongoose.model<IEnquiry>('Enquiry', enquirySchema);
