import { Request, Response } from 'express';
import { AuthServices } from './auth.service';
import { catchAsync } from '../../utils/catchAsync';
import { validateBody } from '../../utils/validation';
import { loginSchema } from './auth.validation';

const loginUser = [
  validateBody(loginSchema),
  catchAsync(async (req: Request, res: Response) => {
    const result = await AuthServices.loginUser(req.body);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  }),
];

export const AuthControllers = {
  loginUser,
};