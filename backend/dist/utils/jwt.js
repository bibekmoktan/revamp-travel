"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const logger_1 = require("./logger");
const generateToken = (payload) => {
    try {
        const accessToken = jsonwebtoken_1.default.sign({ ...payload, type: 'access' }, env_1.env.jwtSecret, { expiresIn: env_1.env.jwtExpire });
        const refreshToken = jsonwebtoken_1.default.sign({ ...payload, type: 'refresh' }, env_1.env.jwtRefreshSecret, { expiresIn: env_1.env.jwtRefreshExpire });
        logger_1.logger.info('Tokens generated successfully', {
            userId: payload.userId,
            role: payload.role
        });
        return {
            accessToken,
            refreshToken,
        };
    }
    catch (error) {
        logger_1.logger.error('Failed to generate tokens', {
            userId: payload.userId,
            error: error.message
        });
        throw new Error('Token generation failed');
    }
};
exports.generateToken = generateToken;
const verifyToken = (token, type = 'access') => {
    try {
        const secret = type === 'access' ? env_1.env.jwtSecret : env_1.env.jwtRefreshSecret;
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        if (decoded.type !== type) {
            throw new Error('Invalid token type');
        }
        return decoded;
    }
    catch (error) {
        logger_1.logger.warn('Token verification failed', {
            error: error.message,
            tokenType: type
        });
        if (error.name === 'TokenExpiredError') {
            throw new Error('Token expired');
        }
        else if (error.name === 'JsonWebTokenError') {
            throw new Error('Invalid token');
        }
        else {
            throw error;
        }
    }
};
exports.verifyToken = verifyToken;
const generateAccessToken = (payload) => {
    try {
        return jsonwebtoken_1.default.sign({ ...payload, type: 'access' }, env_1.env.jwtSecret, { expiresIn: env_1.env.jwtExpire });
    }
    catch (error) {
        logger_1.logger.error('Failed to generate access token', {
            userId: payload.userId,
            error: error.message
        });
        throw new Error('Access token generation failed');
    }
};
exports.generateAccessToken = generateAccessToken;
