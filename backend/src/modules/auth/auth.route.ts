import { Router } from 'express';
import { AuthControllers } from './auth.controller';
import { authRateLimiter } from '../../config/rateLimit';

const router = Router();

router.post('/register', authRateLimiter, ...AuthControllers.registerUser);
router.post('/login', authRateLimiter, ...AuthControllers.loginUser);
router.post('/refresh', ...AuthControllers.refreshToken);
router.post('/forgot-password', authRateLimiter, ...AuthControllers.forgotPassword);
router.post('/reset-password', authRateLimiter, ...AuthControllers.resetPassword);

export const AuthRoutes = router;