"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createError = exports.RateLimitError = exports.DatabaseError = exports.ConflictError = exports.NotFoundError = exports.AuthorizationError = exports.AuthenticationError = exports.ValidationError = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode = 500, code) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
class ValidationError extends AppError {
    constructor(message, details = []) {
        super(message, 400, 'VALIDATION_ERROR');
        this.details = details;
    }
}
exports.ValidationError = ValidationError;
class AuthenticationError extends AppError {
    constructor(message = 'Authentication failed') {
        super(message, 401, 'AUTHENTICATION_ERROR');
    }
}
exports.AuthenticationError = AuthenticationError;
class AuthorizationError extends AppError {
    constructor(message = 'Access denied') {
        super(message, 403, 'AUTHORIZATION_ERROR');
    }
}
exports.AuthorizationError = AuthorizationError;
class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404, 'NOT_FOUND');
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends AppError {
    constructor(message = 'Resource already exists') {
        super(message, 409, 'CONFLICT');
    }
}
exports.ConflictError = ConflictError;
class DatabaseError extends AppError {
    constructor(message = 'Database operation failed') {
        super(message, 500, 'DATABASE_ERROR');
    }
}
exports.DatabaseError = DatabaseError;
class RateLimitError extends AppError {
    constructor(message = 'Too many requests') {
        super(message, 429, 'RATE_LIMIT_ERROR');
    }
}
exports.RateLimitError = RateLimitError;
// Error factory function
const createError = (type, message) => {
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
exports.createError = createError;
