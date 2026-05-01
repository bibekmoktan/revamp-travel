"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const logger_1 = require("../utils/logger");
const errors_1 = require("../utils/errors");
const globalErrorHandler = (err, req, res, _next) => {
    let error = { ...err };
    error.message = err.message;
    // Log error
    logger_1.logger.error('Error occurred', {
        message: err.message,
        stack: err.stack,
        requestId: req.headers['x-request-id'],
        method: req.method,
        url: req.url,
        userId: req.user?.id,
        error: err,
    });
    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = new errors_1.AppError(message, 404);
    }
    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new errors_1.AppError(message, 400);
    }
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((val) => val.message).join(', ');
        error = new errors_1.AppError(message, 400);
    }
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = new errors_1.AppError(message, 401);
    }
    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        error = new errors_1.AppError(message, 401);
    }
    // Determine if error is operational
    const isOperational = error.isOperational || false;
    // Send error response
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Something went wrong",
        code: error.code,
        ...(isOperational && process.env.NODE_ENV === 'development' && { stack: err.stack }),
        requestId: req.headers['x-request-id'],
    });
};
exports.globalErrorHandler = globalErrorHandler;
