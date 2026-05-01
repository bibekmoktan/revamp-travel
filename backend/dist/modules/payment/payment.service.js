"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const mongoose_1 = require("mongoose");
const bookingSummary_model_1 = require("../bookings/bookingSummary.model");
const errors_1 = require("../../utils/errors");
const logger_1 = require("../../utils/logger");
const KHALTI_BASE_URL = process.env.KHALTI_BASE_URL ?? 'https://a.khalti.com';
const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY ?? '';
const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:3000';
const USD_TO_NPR_RATE = Number(process.env.USD_TO_NPR_RATE ?? 133);
async function khaltiPost(endpoint, body) {
    const res = await fetch(`${KHALTI_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            Authorization: `Key ${KHALTI_SECRET_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
        const detail = data?.detail ?? data?.error_key ?? JSON.stringify(data);
        throw new errors_1.ValidationError(`Khalti error: ${detail}`);
    }
    return data;
}
exports.PaymentService = {
    async initiatePayment(userId, bookingIds) {
        if (!bookingIds.length)
            throw new errors_1.ValidationError('No booking IDs provided');
        const bookings = await bookingSummary_model_1.BookingSummaryModel.find({
            _id: { $in: bookingIds.map((id) => new mongoose_1.Types.ObjectId(id)) },
            user: new mongoose_1.Types.ObjectId(userId),
        })
            .populate('package', 'title')
            .lean();
        if (bookings.length !== bookingIds.length) {
            throw new errors_1.NotFoundError('One or more bookings not found');
        }
        for (const b of bookings) {
            if (b.bookingStatus === 'cancelled') {
                throw new errors_1.ValidationError('Cannot pay for a cancelled booking');
            }
            if (b.paymentStatus === 'paid') {
                throw new errors_1.ValidationError('Booking already paid');
            }
        }
        const totalUsd = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
        const amountPaisa = Math.round(totalUsd * USD_TO_NPR_RATE * 100);
        const primaryBookingId = bookingIds[0];
        const allIds = bookingIds.join(',');
        const returnUrl = `${FRONTEND_URL}/payment/callback?bookingIds=${encodeURIComponent(allIds)}`;
        const packageTitle = bookings[0].package?.title ?? 'Trek Package';
        const khaltiRes = await khaltiPost('/api/v2/epayment/initiate/', {
            return_url: returnUrl,
            website_url: FRONTEND_URL,
            amount: amountPaisa,
            purchase_order_id: primaryBookingId,
            purchase_order_name: packageTitle.slice(0, 100),
        });
        logger_1.logger.info('Khalti payment initiated', { userId, bookingIds, pidx: khaltiRes.pidx });
        return {
            payment_url: khaltiRes.payment_url,
            pidx: khaltiRes.pidx,
            expires_at: khaltiRes.expires_at,
        };
    },
    async verifyPayment(userId, pidx, bookingIds) {
        if (!pidx)
            throw new errors_1.ValidationError('pidx is required');
        if (!bookingIds.length)
            throw new errors_1.ValidationError('bookingIds are required');
        const lookup = await khaltiPost('/api/v2/epayment/lookup/', { pidx });
        if (lookup.status !== 'Completed') {
            throw new errors_1.ValidationError(`Payment not completed. Status: ${lookup.status}`);
        }
        await bookingSummary_model_1.BookingSummaryModel.updateMany({
            _id: { $in: bookingIds.map((id) => new mongoose_1.Types.ObjectId(id)) },
            user: new mongoose_1.Types.ObjectId(userId),
        }, {
            $set: {
                paymentStatus: 'paid',
                bookingStatus: 'confirmed',
            },
        });
        logger_1.logger.info('Payment verified and bookings confirmed', { userId, pidx, bookingIds });
        return { primaryBookingId: bookingIds[0], allBookingIds: bookingIds };
    },
};
