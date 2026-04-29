import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { validateBody, validate } from '../../utils/validation';
import { protect } from '../../middlewares/protect';
import { authorize } from '../../middlewares/authorize';
import { BookingService } from './booking.service';
import { createBookingSchema, bookingQuerySchema } from './booking.validation';
import { z } from 'zod';

const listMyBookingsSchema = z.object({
  query: bookingQuerySchema,
});

const bookingIdParamsSchema = z.object({
  params: z.object({
    bookingId: z.string().min(1, 'bookingId is required'),
  }),
});

const createBooking = [
  protect,
  validateBody(createBookingSchema),
  catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();

    const result = await BookingService.createBooking(userId, req.body);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: result.booking,
    });
  }),
];

const getAllBookings = [
  protect,
  authorize('admin'),
  catchAsync(async (req: Request, res: Response) => {
    const result = await BookingService.getAllBookings(req.query as any);
    res.status(200).json({
      success: true,
      message: 'Bookings retrieved successfully',
      data: result.data,
      meta: result.meta,
    });
  }),
];

const getMyBookings = [
  protect,
  validate(listMyBookingsSchema),
  catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const result = await BookingService.getMyBookings(userId, req.query as any);

    res.status(200).json({
      success: true,
      message: 'Bookings retrieved successfully',
      data: result.data,
      meta: result.meta,
    });
  }),
];

const getBooking = [
  protect,
  validate(bookingIdParamsSchema),
  catchAsync(async (req: Request, res: Response) => {
    const user = req.user!;
    const result = await BookingService.getBooking(req.params.bookingId, user._id.toString(), user.role);

    res.status(200).json({
      success: true,
      message: 'Booking retrieved successfully',
      data: result.booking,
    });
  }),
];

const cancelBooking = [
  protect,
  validate(bookingIdParamsSchema),
  catchAsync(async (req: Request, res: Response) => {
    const user = req.user!;
    const result = await BookingService.cancelBooking(req.params.bookingId, user._id.toString(), user.role);

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: result,
    });
  }),
];

const confirmBooking = [
  protect,
  authorize('admin'),
  validate(bookingIdParamsSchema),
  catchAsync(async (req: Request, res: Response) => {
    const updated = await BookingService.confirmBooking(req.params.bookingId);

    res.status(200).json({
      success: true,
      message: 'Booking confirmed successfully',
      data: updated,
    });
  }),
];

export const BookingControllers = {
  createBooking,
  getAllBookings,
  getMyBookings,
  getBooking,
  cancelBooking,
  confirmBooking,
};
