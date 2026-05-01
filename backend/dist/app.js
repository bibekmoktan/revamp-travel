"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = require("./config/cors");
const rateLimit_1 = require("./config/rateLimit");
const security_middleware_1 = require("./middlewares/security.middleware");
const error_middleware_1 = require("./middlewares/error.middleware");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
// Security middleware
app.use(security_middleware_1.securityHeaders);
app.use(security_middleware_1.requestLogger);
// CORS configuration
app.use(cors_1.corsOptions);
// Rate limiting
app.use(rateLimit_1.rateLimiter);
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, cookie_parser_1.default)());
// Static files
app.use(express_1.default.static('public'));
// Health check endpoint
app.get('/health', async (req, res) => {
    const dbState = mongoose_1.default.connection.readyState;
    // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
    const dbHealthy = dbState === 1;
    const status = dbHealthy ? 200 : 503;
    res.status(status).json({
        success: dbHealthy,
        status: dbHealthy ? 'healthy' : 'degraded',
        db: dbHealthy ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString(),
        requestId: req.headers['x-request-id'],
    });
});
// API routes
app.use('/api/v1', routes_1.default);
// Global error handler
app.use(error_middleware_1.globalErrorHandler);
// 404 handler
app.use('*splat', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        requestId: req.headers['x-request-id']
    });
});
exports.default = app;
