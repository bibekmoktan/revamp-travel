import { Request } from 'express';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public code?: string;

  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  public details: any[];

  constructor(message: string, details: any[] = []) {
    super(message, 400, 'VALIDATION_ERROR');
    this.details = details;
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists') {
    super(message, 409, 'CONFLICT');
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed') {
    super(message, 500, 'DATABASE_ERROR');
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(message, 429, 'RATE_LIMIT_ERROR');
  }
}

// Error factory function
export const createError = (type: string, message?: string) => {
  switch (type) {
    case 'ValidationError':
      return new ValidationError(message || 'Validation failed');
    case 'AuthenticationError':
      return new AuthenticationError(message);
    case 'AuthorizationError':
      return new AuthorizationError(message);
    case 'NotFoundError':
      return new NotFoundError(message);
    case 'ConflictError':
      return new ConflictError(message);
    case 'DatabaseError':
      return new DatabaseError(message);
    case 'RateLimitError':
      return new RateLimitError(message);
    default:
      return new AppError(message || 'An error occurred', 500);
  }
};
