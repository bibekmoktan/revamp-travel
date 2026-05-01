"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnquiryService = void 0;
const enquiry_model_1 = require("./enquiry.model");
const errors_1 = require("../../utils/errors");
const logger_1 = require("../../utils/logger");
exports.EnquiryService = {
    async createEnquiry(payload) {
        const enquiry = await enquiry_model_1.EnquiryModel.create(payload);
        logger_1.logger.info('Enquiry received', { id: enquiry._id, email: enquiry.email });
        return enquiry;
    },
    async getAllEnquiries(query) {
        const { status, page = 1, limit = 20 } = query;
        const filter = {};
        if (status)
            filter.status = status;
        const [data, total] = await Promise.all([
            enquiry_model_1.EnquiryModel.find(filter)
                .sort({ createdAt: -1 })
                .skip((Number(page) - 1) * Number(limit))
                .limit(Number(limit))
                .lean(),
            enquiry_model_1.EnquiryModel.countDocuments(filter),
        ]);
        return {
            data,
            meta: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) },
        };
    },
    async updateStatus(id, status) {
        const enquiry = await enquiry_model_1.EnquiryModel.findByIdAndUpdate(id, { status }, { new: true });
        if (!enquiry)
            throw new errors_1.NotFoundError('Enquiry not found');
        logger_1.logger.info('Enquiry status updated', { id, status });
        return enquiry;
    },
    async deleteEnquiry(id) {
        const enquiry = await enquiry_model_1.EnquiryModel.findByIdAndDelete(id);
        if (!enquiry)
            throw new errors_1.NotFoundError('Enquiry not found');
        return enquiry;
    },
};
