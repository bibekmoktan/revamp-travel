import { Router } from 'express';
import { PaymentControllers } from './payment.controller';

const router = Router();

router.post('/initiate', ...PaymentControllers.initiatePayment);
router.post('/verify', ...PaymentControllers.verifyPayment);

export const PaymentRoutes = router;
