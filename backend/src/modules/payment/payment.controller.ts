import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { protect } from '../../middlewares/protect';
import { PaymentService } from './payment.service';
import { ValidationError } from '../../utils/errors';

const initiatePayment = [
  protect,
  catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const { bookingIds } = req.body;

    if (!Array.isArray(bookingIds) || bookingIds.length === 0) {
      throw new ValidationError('bookingIds must be a non-empty array');
    }

    const result = await PaymentService.initiatePayment(userId, bookingIds);

    res.status(200).json({
      success: true,
      message: 'Payment initiated',
      data: result,
    });
  }),
];

const verifyPayment = [
  protect,
  catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const { pidx, bookingIds } = req.body;

    if (!pidx || typeof pidx !== 'string') {
      throw new ValidationError('pidx is required');
    }
    if (!Array.isArray(bookingIds) || bookingIds.length === 0) {
      throw new ValidationError('bookingIds must be a non-empty array');
    }

    const result = await PaymentService.verifyPayment(userId, pidx, bookingIds);

    res.status(200).json({
      success: true,
      message: 'Payment verified and booking confirmed',
      data: result,
    });
  }),
];

export const PaymentControllers = { initiatePayment, verifyPayment };
