import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../modules/users/user.model';
import { env } from '../config/env';

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const parts = authHeader?.split(' ');
  const token = parts?.length === 2 && parts[0] === 'Bearer' ? parts[1] : undefined;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized',
    });
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as { userId: string; role: string };

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized',
    });
  }
};