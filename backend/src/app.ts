import express from 'express';
import cookieParser from 'cookie-parser';
import { corsOptions } from './config/cors';
import { rateLimiter } from './config/rateLimit';
import { securityHeaders, requestLogger } from './middlewares/security.middleware';
import { globalErrorHandler } from './middlewares/error.middleware';
import { env } from './config/env';
import routes from './routes';

const app = express();

// Security middleware
app.use(securityHeaders);
app.use(requestLogger);

// CORS configuration
app.use(corsOptions);

// Rate limiting
app.use(rateLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Static files
app.use(express.static('public'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    requestId: req.headers['x-request-id']
  });
});

// API routes
app.use('/api/v1', routes);

// Global error handler
app.use(globalErrorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    requestId: req.headers['x-request-id']
  });
});

export default app;
