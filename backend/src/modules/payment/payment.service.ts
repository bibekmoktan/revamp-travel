import { Types } from 'mongoose';
import { BookingSummaryModel } from '../bookings/bookingSummary.model';
import { NotFoundError, ValidationError } from '../../utils/errors';
import { logger } from '../../utils/logger';

const KHALTI_BASE_URL = process.env.KHALTI_BASE_URL ?? 'https://a.khalti.com';
const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY ?? '';
const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:3000';
const USD_TO_NPR_RATE = Number(process.env.USD_TO_NPR_RATE ?? 133);

async function khaltiPost(endpoint: string, body: unknown): Promise<any> {
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
    throw new ValidationError(`Khalti error: ${detail}`);
  }
  return data;
}

export const PaymentService = {
  async initiatePayment(userId: string, bookingIds: string[]) {
    if (!bookingIds.length) throw new ValidationError('No booking IDs provided');

    const bookings = await BookingSummaryModel.find({
      _id: { $in: bookingIds.map((id) => new Types.ObjectId(id)) },
      user: new Types.ObjectId(userId),
    })
      .populate<{ package: { title: string } }>('package', 'title')
      .lean();

    if (bookings.length !== bookingIds.length) {
      throw new NotFoundError('One or more bookings not found');
    }

    for (const b of bookings) {
      if (b.bookingStatus === 'cancelled') {
        throw new ValidationError('Cannot pay for a cancelled booking');
      }
      if (b.paymentStatus === 'paid') {
        throw new ValidationError('Booking already paid');
      }
    }

    const totalUsd = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const amountPaisa = Math.round(totalUsd * USD_TO_NPR_RATE * 100);

    const primaryBookingId = bookingIds[0];
    const allIds = bookingIds.join(',');
    const returnUrl = `${FRONTEND_URL}/payment/callback?bookingIds=${encodeURIComponent(allIds)}`;

    const packageTitle = (bookings[0].package as any)?.title ?? 'Trek Package';

    const khaltiRes = await khaltiPost('/api/v2/epayment/initiate/', {
      return_url: returnUrl,
      website_url: FRONTEND_URL,
      amount: amountPaisa,
      purchase_order_id: primaryBookingId,
      purchase_order_name: packageTitle.slice(0, 100),
    });

    logger.info('Khalti payment initiated', { userId, bookingIds, pidx: khaltiRes.pidx });

    return {
      payment_url: khaltiRes.payment_url,
      pidx: khaltiRes.pidx,
      expires_at: khaltiRes.expires_at,
    };
  },

  async verifyPayment(userId: string, pidx: string, bookingIds: string[]) {
    if (!pidx) throw new ValidationError('pidx is required');
    if (!bookingIds.length) throw new ValidationError('bookingIds are required');

    const lookup = await khaltiPost('/api/v2/epayment/lookup/', { pidx });

    if (lookup.status !== 'Completed') {
      throw new ValidationError(`Payment not completed. Status: ${lookup.status}`);
    }

    await BookingSummaryModel.updateMany(
      {
        _id: { $in: bookingIds.map((id) => new Types.ObjectId(id)) },
        user: new Types.ObjectId(userId),
      },
      {
        $set: {
          paymentStatus: 'paid',
          bookingStatus: 'confirmed',
        },
      }
    );

    logger.info('Payment verified and bookings confirmed', { userId, pidx, bookingIds });

    return { primaryBookingId: bookingIds[0], allBookingIds: bookingIds };
  },
};
