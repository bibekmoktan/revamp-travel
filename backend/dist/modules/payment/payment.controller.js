"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const protect_1 = require("../../middlewares/protect");
const payment_service_1 = require("./payment.service");
const errors_1 = require("../../utils/errors");
const initiatePayment = [
    protect_1.protect,
    (0, catchAsync_1.catchAsync)(async (req, res) => {
        const userId = req.user._id.toString();
        const { bookingIds } = req.body;
        if (!Array.isArray(bookingIds) || bookingIds.length === 0) {
            throw new errors_1.ValidationError('bookingIds must be a non-empty array');
        }
        const result = await payment_service_1.PaymentService.initiatePayment(userId, bookingIds);
        res.status(200).json({
            success: true,
            message: 'Payment initiated',
            data: result,
        });
    }),
];
const verifyPayment = [
    protect_1.protect,
    (0, catchAsync_1.catchAsync)(async (req, res) => {
        const userId = req.user._id.toString();
        const { pidx, bookingIds } = req.body;
        if (!pidx || typeof pidx !== 'string') {
            throw new errors_1.ValidationError('pidx is required');
        }
        if (!Array.isArray(bookingIds) || bookingIds.length === 0) {
            throw new errors_1.ValidationError('bookingIds must be a non-empty array');
        }
        const result = await payment_service_1.PaymentService.verifyPayment(userId, pidx, bookingIds);
        res.status(200).json({
            success: true,
            message: 'Payment verified and booking confirmed',
            data: result,
        });
    }),
];
exports.PaymentControllers = { initiatePayment, verifyPayment };
