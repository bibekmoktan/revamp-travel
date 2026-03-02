import { Router } from 'express';
import { BookingControllers } from './booking.controller';

const router = Router();

router.post('/', ...BookingControllers.createBooking);
router.get('/my', ...BookingControllers.getMyBookings);
router.get('/:bookingId', ...BookingControllers.getBooking);
router.patch('/:bookingId/cancel', ...BookingControllers.cancelBooking);
router.patch('/:bookingId/confirm', ...BookingControllers.confirmBooking);

export const BookingRoutes = router;
