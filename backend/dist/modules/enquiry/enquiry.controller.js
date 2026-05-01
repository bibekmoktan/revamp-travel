"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEnquiry = exports.updateEnquiryStatus = exports.getAllEnquiries = exports.createEnquiry = void 0;
const enquiry_service_1 = require("./enquiry.service");
const catchAsync_1 = require("../../utils/catchAsync");
const validation_1 = require("../../utils/validation");
const enquiry_validation_1 = require("./enquiry.validation");
exports.createEnquiry = [
    (0, validation_1.validateBody)(enquiry_validation_1.createEnquirySchema),
    (0, catchAsync_1.catchAsync)(async (req, res) => {
        const enquiry = await enquiry_service_1.EnquiryService.createEnquiry(req.body);
        res.status(201).json({ success: true, message: 'Enquiry submitted successfully', data: enquiry });
    }),
];
exports.getAllEnquiries = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await enquiry_service_1.EnquiryService.getAllEnquiries(req.query);
    res.json({ success: true, message: 'Enquiries fetched', ...result });
});
exports.updateEnquiryStatus = [
    (0, validation_1.validateBody)(enquiry_validation_1.updateEnquiryStatusSchema),
    (0, catchAsync_1.catchAsync)(async (req, res) => {
        const enquiry = await enquiry_service_1.EnquiryService.updateStatus(req.params.id, req.body.status);
        res.json({ success: true, message: 'Status updated', data: enquiry });
    }),
];
exports.deleteEnquiry = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await enquiry_service_1.EnquiryService.deleteEnquiry(req.params.id);
    res.json({ success: true, message: 'Enquiry deleted' });
});
