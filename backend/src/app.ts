import express from "express";
import compression from 'compression';
import morgan from 'morgan';
import { v4 as uuidv4 } from 'uuid';
import routes from "./routes";
import { globalErrorHandler } from "./middlewares/error.middleware";
import { securityHeaders, requestLogger } from "./middlewares/security.middleware";
import { corsOptions } from "./config/cors";
import { rateLimiter } from "./config/rateLimit";

const app = express();

// Security middleware
app.use(securityHeaders);
app.use(corsOptions);

// Request logging and ID
app.use((req, res, next) => {
  req.headers['x-request-id'] = req.headers['x-request-id'] || uuidv4();
  res.setHeader('X-Request-ID', req.headers['x-request-id']);
  next();
});

// General middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('combined'));
app.use(requestLogger);

// Rate limiting
app.use(rateLimiter);

// Routes
app.use("/api/v1", routes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
    requestId: req.headers['x-request-id'],
  });
});

// Error handling (must be last)
app.use(globalErrorHandler);

export default app;