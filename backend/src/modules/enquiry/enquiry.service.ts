import { EnquiryModel } from './enquiry.model';
import { IEnquiry, EnquiryStatus } from './enquiry.interface';
import { NotFoundError } from '../../utils/errors';
import { logger } from '../../utils/logger';

export const EnquiryService = {
  async createEnquiry(payload: Partial<IEnquiry>) {
    const enquiry = await EnquiryModel.create(payload);
    logger.info('Enquiry received', { id: enquiry._id, email: enquiry.email });
    return enquiry;
  },

  async getAllEnquiries(query: Record<string, any>) {
    const { status, page = 1, limit = 20 } = query;
    const filter: Record<string, any> = {};
    if (status) filter.status = status;

    const [data, total] = await Promise.all([
      EnquiryModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .lean(),
      EnquiryModel.countDocuments(filter),
    ]);

    return {
      data,
      meta: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) },
    };
  },

  async updateStatus(id: string, status: EnquiryStatus) {
    const enquiry = await EnquiryModel.findByIdAndUpdate(id, { status }, { new: true });
    if (!enquiry) throw new NotFoundError('Enquiry not found');
    logger.info('Enquiry status updated', { id, status });
    return enquiry;
  },

  async deleteEnquiry(id: string) {
    const enquiry = await EnquiryModel.findByIdAndDelete(id);
    if (!enquiry) throw new NotFoundError('Enquiry not found');
    return enquiry;
  },
};
