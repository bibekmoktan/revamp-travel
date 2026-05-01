"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const mongoose_1 = require("mongoose");
const bookingSummary_model_1 = require("./bookingSummary.model");
const traveler_model_1 = require("./traveler.model");
const package_model_1 = require("../package/package.model");
const errors_1 = require("../../utils/errors");
const logger_1 = require("../../utils/logger");
const booking_constants_1 = require("./booking.constants");
exports.BookingService = {
    async createBooking(userId, payload) {
        const pax = payload.travelers.length;
        if (!Number.isInteger(pax) || pax < booking_constants_1.BOOKING_CONSTANTS.MIN_TRAVELERS || pax > booking_constants_1.BOOKING_CONSTANTS.MAX_TRAVELERS) {
            throw new errors_1.ValidationError(`Number of travelers must be between ${booking_constants_1.BOOKING_CONSTANTS.MIN_TRAVELERS} and ${booking_constants_1.BOOKING_CONSTANTS.MAX_TRAVELERS}`);
        }
        if (payload.idempotencyKey) {
            const existing = await bookingSummary_model_1.BookingSummaryModel.findOne({
                user: new mongoose_1.Types.ObjectId(userId),
                idempotencyKey: payload.idempotencyKey,
            }).lean();
            if (existing) {
                const travelers = await traveler_model_1.TravelerModel.find({ booking: existing._id }).sort({ createdAt: 1 }).lean();
                return { booking: existing, travelers };
            }
        }
        const pkg = await package_model_1.PackageModel.findById(payload.packageId).lean();
        if (!pkg)
            throw new errors_1.NotFoundError('Package not found');
        if (pkg.status && pkg.status !== 'active') {
            throw new errors_1.ValidationError('Package is not active');
        }
        const pricePerPerson = Number(pkg.price ?? 0);
        if (Number.isNaN(pricePerPerson) || pricePerPerson < 0) {
            throw new errors_1.ValidationError('Invalid package price');
        }
        const totalAmount = pricePerPerson * pax;
        const expiresAt = new Date(Date.now() + booking_constants_1.BOOKING_CONSTANTS.BOOKING_EXPIRY_MINUTES * 60 * 1000);
        let createdBooking = null;
        let createdTravelers = [];
        try {
            // Step 2 — create booking
            const bookingDocs = await bookingSummary_model_1.BookingSummaryModel.create([{
                    user: new mongoose_1.Types.ObjectId(userId),
                    package: new mongoose_1.Types.ObjectId(payload.packageId),
                    trekDate: payload.trekDate,
                    idempotencyKey: payload.idempotencyKey,
                    numberOfPeople: pax,
                    totalAmount,
                    paymentStatus: booking_constants_1.PAYMENT_STATUS.PENDING,
                    bookingStatus: booking_constants_1.BOOKING_STATUS.RESERVED,
                    expiresAt,
                }]);
            createdBooking = bookingDocs[0].toObject();
            // Step 3 — create travelers
            const travelerDocs = payload.travelers.map((t) => ({
                booking: bookingDocs[0]._id,
                fullName: t.fullName,
                age: t.age,
                gender: t.gender,
                idProof: t.idProof,
                status: booking_constants_1.TRAVELER_STATUS.ACTIVE,
            }));
            const insertedTravelers = await traveler_model_1.TravelerModel.insertMany(travelerDocs);
            createdTravelers = insertedTravelers.map((t) => t.toObject());
        }
        catch (error) {
            if (createdBooking) {
                await bookingSummary_model_1.BookingSummaryModel.findByIdAndDelete(createdBooking._id).catch(() => { });
            }
            if (error?.code === 11000 && payload.idempotencyKey) {
                const existing = await bookingSummary_model_1.BookingSummaryModel.findOne({
                    user: new mongoose_1.Types.ObjectId(userId),
                    idempotencyKey: payload.idempotencyKey,
                }).lean();
                if (existing) {
                    const travelers = await traveler_model_1.TravelerModel.find({ booking: existing._id }).sort({ createdAt: 1 }).lean();
                    return { booking: existing, travelers };
                }
                throw new errors_1.ConflictError('Duplicate booking request');
            }
            logger_1.logger.error('Failed to create booking', { userId, packageId: payload.packageId, error: error.message });
            throw error;
        }
        logger_1.logger.info('Booking reserved', {
            userId,
            packageId: payload.packageId,
            bookingId: createdBooking._id?.toString(),
            count: pax,
        });
        return { booking: createdBooking, travelers: createdTravelers };
    },
    async confirmBooking(bookingId) {
        const booking = await bookingSummary_model_1.BookingSummaryModel.findById(bookingId)
            .select('user bookingStatus')
            .lean();
        if (!booking)
            throw new errors_1.NotFoundError('Booking not found');
        await bookingSummary_model_1.BookingSummaryModel.updateOne({ _id: new mongoose_1.Types.ObjectId(bookingId), bookingStatus: { $ne: booking_constants_1.BOOKING_STATUS.CANCELLED } }, { $set: { bookingStatus: booking_constants_1.BOOKING_STATUS.CONFIRMED } });
        logger_1.logger.info('Booking confirmed', { bookingId });
        const updated = await bookingSummary_model_1.BookingSummaryModel.findById(bookingId)
            .select('user package trekDate numberOfPeople totalAmount bookingStatus paymentStatus expiresAt createdAt')
            .lean();
        const travelers = await traveler_model_1.TravelerModel.find({ booking: new mongoose_1.Types.ObjectId(bookingId) })
            .select('fullName age gender idProof status createdAt')
            .sort({ createdAt: 1 })
            .lean();
        return { booking: updated, travelers };
    },
    async getAllBookings(query) {
        const { page = booking_constants_1.BOOKING_CONSTANTS.DEFAULT_PAGE, limit = booking_constants_1.BOOKING_CONSTANTS.DEFAULT_LIMIT, status, sortBy = 'createdAt', sortOrder = 'desc' } = query;
        const filter = {};
        if (status)
            filter.bookingStatus = status;
        const sort = {};
        const allowedSortFields = ['createdAt', 'trekDate', 'bookingStatus', 'totalAmount'];
        sort[allowedSortFields.includes(sortBy) ? sortBy : 'createdAt'] = sortOrder === 'desc' ? -1 : 1;
        const pageNum = Math.max(1, Number(page));
        const limitNum = Math.min(Math.max(1, Number(limit)), 100);
        const skip = (pageNum - 1) * limitNum;
        const [bookings, total] = await Promise.all([
            bookingSummary_model_1.BookingSummaryModel.find(filter)
                .populate('user', 'name email')
                .populate('package', 'title slug duration location price')
                .sort(sort)
                .skip(skip)
                .limit(limitNum)
                .lean(),
            bookingSummary_model_1.BookingSummaryModel.countDocuments(filter),
        ]);
        return {
            data: bookings,
            meta: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) },
        };
    },
    async getMyBookings(userId, query) {
        const { page = booking_constants_1.BOOKING_CONSTANTS.DEFAULT_PAGE, limit = booking_constants_1.BOOKING_CONSTANTS.DEFAULT_LIMIT, status, sortBy = 'createdAt', sortOrder = 'desc' } = query;
        const filter = { user: new mongoose_1.Types.ObjectId(userId) };
        if (status)
            filter.bookingStatus = status;
        const sort = {};
        const allowedSortFields = ['createdAt', 'trekDate', 'bookingStatus', 'totalAmount'];
        const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
        sort[sortField] = sortOrder === 'desc' ? -1 : 1;
        const pageNum = Math.max(1, Number(page));
        const limitNum = Math.min(Math.max(1, Number(limit)), 100);
        const skip = (pageNum - 1) * limitNum;
        const [bookings, total] = await Promise.all([
            bookingSummary_model_1.BookingSummaryModel.find(filter)
                .select('user package trekDate numberOfPeople totalAmount bookingStatus paymentStatus expiresAt createdAt')
                .populate('package', 'title slug featureImage duration location price')
                .sort(sort)
                .skip(skip)
                .limit(limitNum)
                .lean(),
            bookingSummary_model_1.BookingSummaryModel.countDocuments(filter),
        ]);
        return {
            data: bookings,
            meta: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) },
        };
    },
    async getBooking(bookingId, userId, userRole) {
        const booking = await bookingSummary_model_1.BookingSummaryModel.findById(bookingId)
            .select('user package trekDate numberOfPeople totalAmount bookingStatus paymentStatus expiresAt createdAt')
            .populate('package', 'title slug featureImage duration location price')
            .lean();
        if (!booking)
            throw new errors_1.NotFoundError('Booking not found');
        if (userRole !== 'admin' && booking.user.toString() !== userId) {
            throw new errors_1.ValidationError('You can only view your own bookings');
        }
        const travelers = await traveler_model_1.TravelerModel.find({ booking: new mongoose_1.Types.ObjectId(bookingId) })
            .select('fullName age gender idProof status createdAt')
            .sort({ createdAt: 1 })
            .lean();
        return { booking, travelers };
    },
    async cancelBooking(bookingId, userId, userRole) {
        const booking = await bookingSummary_model_1.BookingSummaryModel.findById(bookingId)
            .select('user package trekDate bookingStatus')
            .lean();
        if (!booking)
            throw new errors_1.NotFoundError('Booking not found');
        if (userRole !== 'admin' && booking.user.toString() !== userId) {
            throw new errors_1.ValidationError('You can only cancel your own bookings');
        }
        if (booking.bookingStatus === booking_constants_1.BOOKING_STATUS.CANCELLED) {
            const travelers = await traveler_model_1.TravelerModel.find({ booking: new mongoose_1.Types.ObjectId(bookingId) })
                .select('fullName age gender idProof status createdAt')
                .sort({ createdAt: 1 })
                .lean();
            return { booking, travelers };
        }
        await traveler_model_1.TravelerModel.updateMany({ booking: new mongoose_1.Types.ObjectId(bookingId), status: { $ne: booking_constants_1.TRAVELER_STATUS.CANCELLED } }, { $set: { status: booking_constants_1.TRAVELER_STATUS.CANCELLED } });
        await bookingSummary_model_1.BookingSummaryModel.updateOne({ _id: new mongoose_1.Types.ObjectId(bookingId) }, { $set: { bookingStatus: booking_constants_1.BOOKING_STATUS.CANCELLED } });
        logger_1.logger.info('Booking cancelled', { userId, bookingId });
        const updatedBooking = await bookingSummary_model_1.BookingSummaryModel.findById(bookingId)
            .select('user package trekDate numberOfPeople totalAmount bookingStatus paymentStatus expiresAt createdAt')
            .lean();
        const travelers = await traveler_model_1.TravelerModel.find({ booking: new mongoose_1.Types.ObjectId(bookingId) })
            .select('fullName age gender idProof status createdAt')
            .sort({ createdAt: 1 })
            .lean();
        return { booking: updatedBooking, travelers };
    },
};
