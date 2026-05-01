"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./env");
exports.corsOptions = (0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin)
            return callback(null, true);
        if (env_1.env.nodeEnv === 'development') {
            return callback(null, true);
        }
        const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? '')
            .split(',')
            .map((o) => o.trim().replace(/\/$/, ''));
        const normalised = origin.replace(/\/$/, '');
        if (allowedOrigins.includes(normalised)) {
            callback(null, true);
        }
        else {
            callback(new Error(`CORS: origin "${origin}" not allowed`));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count'],
});
