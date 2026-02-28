import { Router } from 'express';
import { AuthControllers } from './auth.controller';
import { authRateLimiter } from '../../config/rateLimit';

const router = Router();

router.post('/login', authRateLimiter, ...AuthControllers.loginUser);

export const AuthRoutes = router;