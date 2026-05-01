"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthControllers = void 0;
const auth_service_1 = require("./auth.service");
const catchAsync_1 = require("../../utils/catchAsync");
const validation_1 = require("../../utils/validation");
const auth_validation_1 = require("./auth.validation");
const loginUser = [
    (0, validation_1.validateBody)(auth_validation_1.loginSchema),
    (0, catchAsync_1.catchAsync)(async (req, res) => {
        const result = await auth_service_1.AuthServices.loginUser(req.body);
        res.status(200).json({ success: true, message: 'Login successful', data: result });
    }),
];
const registerUser = [
    (0, validation_1.validateBody)(auth_validation_1.registerSchema),
    (0, catchAsync_1.catchAsync)(async (req, res) => {
        const result = await auth_service_1.AuthServices.registerUser(req.body);
        res.status(201).json({ success: true, message: 'Registration successful', data: result });
    }),
];
const refreshToken = [
    (0, validation_1.validateBody)(auth_validation_1.refreshTokenSchema),
    (0, catchAsync_1.catchAsync)(async (req, res) => {
        const result = await auth_service_1.AuthServices.refreshToken(req.body);
        res.status(200).json({ success: true, message: 'Token refreshed', data: result });
    }),
];
const forgotPassword = [
    (0, validation_1.validateBody)(auth_validation_1.forgotPasswordSchema),
    (0, catchAsync_1.catchAsync)(async (req, res) => {
        await auth_service_1.AuthServices.forgotPassword(req.body);
        res.status(200).json({ success: true, message: 'If that email exists, a reset link has been sent' });
    }),
];
const resetPassword = [
    (0, validation_1.validateBody)(auth_validation_1.resetPasswordSchema),
    (0, catchAsync_1.catchAsync)(async (req, res) => {
        await auth_service_1.AuthServices.resetPassword(req.body);
        res.status(200).json({ success: true, message: 'Password reset successful' });
    }),
];
exports.AuthControllers = {
    loginUser,
    registerUser,
    refreshToken,
    forgotPassword,
    resetPassword,
};
