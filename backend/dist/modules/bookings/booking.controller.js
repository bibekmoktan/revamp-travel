"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const validation_1 = require("../../utils/validation");
const protect_1 = require("../../middlewares/protect");
const authorize_1 = require("../../middlewares/authorize");
const booking_service_1 = require("./booking.service");
const booking_validation_1 = require("./booking.validation");
const zod_1 = require("zod");
const listMyBookingsSchema = zod_1.z.object({
    query: booking_validation_1.bookingQuerySchema,
});
const bookingIdParamsSchema = zod_1.z.object({
    params: zod_1.z.object({
        bookingId: zod_1.z.string().min(1, 'bookingId is required'),
    }),
});
const createBooking = [
    protect_1.protect,
    (0, validation_1.validateBody)(booking_validation_1.createBookingSchema),
    (0, catchAsync_1.catchAsync)(async (req, res) => {
        const userId = req.user._id.toString();
        const result = await booking_service_1.BookingService.createBooking(userId, req.body);
        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: result.booking,
        });
    }),
];
const getAllBookings = [
    protect_1.protect,
    (0, authorize_1.authorize)('admin'),
    (0, catchAsync_1.catchAsync)(async (req, res) => {
        const result = await booking_service_1.BookingService.getAllBookings(req.query);
        res.status(200).json({
            success: true,
            message: 'Bookings retrieved successfully',
            data: result.data,
            meta: result.meta,
        });
    }),
];
const getMyBookings = [
    protect_1.protect,
    (0, validation_1.validate)(listMyBookingsSchema),
    (0, catchAsync_1.catchAsync)(async (req, res) => {
        const userId = req.user._id.toString();
        const result = await booking_service_1.BookingService.getMyBookings(userId, req.query);
        res.status(200).json({
            success: true,
            message: 'Bookings retrieved successfully',
            data: result.data,
            meta: result.meta,
        });
    }),
];
const getBooking = [
    protect_1.protect,
    (0, validation_1.validate)(bookingIdParamsSchema),
    (0, catchAsync_1.catchAsync)(async (req, res) => {
        const user = req.user;
        const result = await booking_service_1.BookingService.getBooking(req.params.bookingId, user._id.toString(), user.role);
        res.status(200).json({
            success: true,
            message: 'Booking retrieved successfully',
            data: result.booking,
        });
    }),
];
const cancelBooking = [
    protect_1.protect,
    (0, validation_1.validate)(bookingIdParamsSchema),
    (0, catchAsync_1.catchAsync)(async (req, res) => {
        const user = req.user;
        const result = await booking_service_1.BookingService.cancelBooking(req.params.bookingId, user._id.toString(), user.role);
        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully',
            data: result,
        });
    }),
];
const confirmBooking = [
    protect_1.protect,
    (0, authorize_1.authorize)('admin'),
    (0, validation_1.validate)(bookingIdParamsSchema),
    (0, catchAsync_1.catchAsync)(async (req, res) => {
        const updated = await booking_service_1.BookingService.confirmBooking(req.params.bookingId);
        res.status(200).json({
            success: true,
            message: 'Booking confirmed successfully',
            data: updated,
        });
    }),
];
exports.BookingControllers = {
    createBooking,
    getAllBookings,
    getMyBookings,
    getBooking,
    cancelBooking,
    confirmBooking,
};
