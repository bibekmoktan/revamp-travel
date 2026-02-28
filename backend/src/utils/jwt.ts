import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { logger } from './logger';

export interface JWTPayload {
  userId: string;
  role: string;
  type?: 'access' | 'refresh';
}

export const generateToken = (payload: Omit<JWTPayload, 'type'>) => {
  try {
    const accessToken = jwt.sign(
      { ...payload, type: 'access' }, 
      env.jwtSecret, 
      { expiresIn: env.jwtExpire }
    );

    const refreshToken = jwt.sign(
      { ...payload, type: 'refresh' }, 
      env.jwtRefreshSecret, 
      { expiresIn: env.jwtRefreshExpire }
    );

    logger.info('Tokens generated successfully', { 
      userId: payload.userId, 
      role: payload.role 
    });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error: any) {
    logger.error('Failed to generate tokens', { 
      userId: payload.userId, 
      error: error.message 
    });
    throw new Error('Token generation failed');
  }
};

export const verifyToken = (token: string, type: 'access' | 'refresh' = 'access') => {
  try {
    const secret = type === 'access' ? env.jwtSecret : env.jwtRefreshSecret;
    const decoded = jwt.verify(token, secret) as JWTPayload;
    
    if (decoded.type !== type) {
      throw new Error('Invalid token type');
    }

    return decoded;
  } catch (error: any) {
    logger.warn('Token verification failed', { 
      error: error.message,
      tokenType: type 
    });
    
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    } else {
      throw error;
    }
  }
};

export const generateAccessToken = (payload: Omit<JWTPayload, 'type'>) => {
  try {
    return jwt.sign(
      { ...payload, type: 'access' }, 
      env.jwtSecret, 
      { expiresIn: env.jwtExpire }
    );
  } catch (error: any) {
    logger.error('Failed to generate access token', { 
      userId: payload.userId, 
      error: error.message 
    });
    throw new Error('Access token generation failed');
  }
};