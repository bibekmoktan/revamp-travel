import { Request, Response } from 'express';
import { AuthServices } from './auth.service';
import { catchAsync } from '../../utils/catchAsync';
import { validateBody } from '../../utils/validation';
import {
  loginSchema,
  registerSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './auth.validation';

const loginUser = [
  validateBody(loginSchema),
  catchAsync(async (req: Request, res: Response) => {
    const result = await AuthServices.loginUser(req.body);
    res.status(200).json({ success: true, message: 'Login successful', data: result });
  }),
];

const registerUser = [
  validateBody(registerSchema),
  catchAsync(async (req: Request, res: Response) => {
    const result = await AuthServices.registerUser(req.body);
    res.status(201).json({ success: true, message: 'Registration successful', data: result });
  }),
];

const refreshToken = [
  validateBody(refreshTokenSchema),
  catchAsync(async (req: Request, res: Response) => {
    const result = await AuthServices.refreshToken(req.body);
    res.status(200).json({ success: true, message: 'Token refreshed', data: result });
  }),
];

const forgotPassword = [
  validateBody(forgotPasswordSchema),
  catchAsync(async (req: Request, res: Response) => {
    await AuthServices.forgotPassword(req.body);
    res.status(200).json({ success: true, message: 'If that email exists, a reset link has been sent' });
  }),
];

const resetPassword = [
  validateBody(resetPasswordSchema),
  catchAsync(async (req: Request, res: Response) => {
    await AuthServices.resetPassword(req.body);
    res.status(200).json({ success: true, message: 'Password reset successful' });
  }),
];

export const AuthControllers = {
  loginUser,
  registerUser,
  refreshToken,
  forgotPassword,
  resetPassword,
};