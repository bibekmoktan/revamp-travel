"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const crypto_1 = __importDefault(require("crypto"));
const user_model_1 = require("../users/user.model");
const jwt_1 = require("../../utils/jwt");
const errors_1 = require("../../utils/errors");
const logger_1 = require("../../utils/logger");
const sendEmail_1 = require("../../utils/sendEmail");
const loginUser = async (payload) => {
    const { email, password } = payload;
    try {
        const user = await user_model_1.User.findOne({ email }).select('+password');
        if (!user) {
            logger_1.logger.warn('Login attempt with non-existent email', { email });
            throw new errors_1.AuthenticationError('Invalid credentials');
        }
        if (user.isBlocked) {
            logger_1.logger.warn('Login attempt by blocked user', { userId: user._id.toString(), email });
            throw new errors_1.AuthorizationError('Account is blocked');
        }
        const isMatched = await user_model_1.User.isPasswordMatched(password, user.password);
        if (!isMatched) {
            logger_1.logger.warn('Login attempt with invalid password', { userId: user._id.toString() });
            throw new errors_1.AuthenticationError('Invalid credentials');
        }
        const tokens = (0, jwt_1.generateToken)({ userId: user._id.toString(), role: user.role });
        logger_1.logger.info('User logged in successfully', { userId: user._id.toString(), role: user.role });
        const userWithoutPassword = await user_model_1.User.findById(user._id).select('-password');
        return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, user: userWithoutPassword };
    }
    catch (error) {
        if (error instanceof errors_1.AuthenticationError || error instanceof errors_1.AuthorizationError)
            throw error;
        logger_1.logger.error('Unexpected error during login', { error: error.message });
        throw new errors_1.AuthenticationError('Login failed');
    }
};
const registerUser = async (payload) => {
    const existing = await user_model_1.User.findOne({ email: payload.email });
    if (existing) {
        throw new errors_1.ValidationError('Email already in use');
    }
    const user = await user_model_1.User.create({
        name: payload.name,
        email: payload.email,
        password: payload.password,
        role: payload.role ?? 'user',
    });
    const tokens = (0, jwt_1.generateToken)({ userId: user._id.toString(), role: user.role });
    logger_1.logger.info('User registered', { userId: user._id.toString(), role: user.role });
    const userWithoutPassword = await user_model_1.User.findById(user._id).select('-password');
    return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, user: userWithoutPassword };
};
const refreshToken = async (payload) => {
    let decoded;
    try {
        decoded = (0, jwt_1.verifyToken)(payload.refreshToken, 'refresh');
    }
    catch {
        throw new errors_1.AuthenticationError('Invalid or expired refresh token');
    }
    const user = await user_model_1.User.findById(decoded.userId);
    if (!user || user.isBlocked) {
        throw new errors_1.AuthenticationError('Not authorized');
    }
    const accessToken = (0, jwt_1.generateAccessToken)({ userId: user._id.toString(), role: user.role });
    logger_1.logger.info('Access token refreshed', { userId: user._id.toString() });
    return { accessToken };
};
const forgotPassword = async (payload) => {
    const user = await user_model_1.User.findOne({ email: payload.email });
    // Always respond the same way to prevent email enumeration
    if (!user) {
        logger_1.logger.warn('Forgot password for unknown email');
        return;
    }
    const rawToken = crypto_1.default.randomBytes(32).toString('hex');
    const hashedToken = crypto_1.default.createHash('sha256').update(rawToken).digest('hex');
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await user.save({ validateBeforeSave: false });
    await (0, sendEmail_1.sendEmail)({
        to: user.email,
        subject: 'Password Reset Request',
        html: `
      <p>You requested a password reset.</p>
      <p>Use this token (valid for 15 minutes):</p>
      <pre>${rawToken}</pre>
      <p>If you did not request this, ignore this email.</p>
    `,
    });
    logger_1.logger.info('Password reset email sent', { userId: user._id.toString() });
};
const resetPassword = async (payload) => {
    const hashedToken = crypto_1.default.createHash('sha256').update(payload.token).digest('hex');
    const user = await user_model_1.User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: new Date() },
    }).select('+password +passwordResetToken +passwordResetExpires');
    if (!user) {
        throw new errors_1.AuthenticationError('Invalid or expired reset token');
    }
    user.password = payload.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    logger_1.logger.info('Password reset successful', { userId: user._id.toString() });
};
exports.AuthServices = {
    loginUser,
    registerUser,
    refreshToken,
    forgotPassword,
    resetPassword,
};
