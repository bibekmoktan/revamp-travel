import { Request, Response } from 'express';
import { EnquiryService } from './enquiry.service';
import { catchAsync } from '../../utils/catchAsync';
import { validateBody } from '../../utils/validation';
import { createEnquirySchema, updateEnquiryStatusSchema } from './enquiry.validation';

export const createEnquiry = [
  validateBody(createEnquirySchema),
  catchAsync(async (req: Request, res: Response) => {
    const enquiry = await EnquiryService.createEnquiry(req.body);
    res.status(201).json({ success: true, message: 'Enquiry submitted successfully', data: enquiry });
  }),
];

export const getAllEnquiries = catchAsync(async (req: Request, res: Response) => {
  const result = await EnquiryService.getAllEnquiries(req.query);
  res.json({ success: true, message: 'Enquiries fetched', ...result });
});

export const updateEnquiryStatus = [
  validateBody(updateEnquiryStatusSchema),
  catchAsync(async (req: Request, res: Response) => {
    const enquiry = await EnquiryService.updateStatus(req.params.id, req.body.status);
    res.json({ success: true, message: 'Status updated', data: enquiry });
  }),
];

export const deleteEnquiry = catchAsync(async (req: Request, res: Response) => {
  await EnquiryService.deleteEnquiry(req.params.id);
  res.json({ success: true, message: 'Enquiry deleted' });
});
