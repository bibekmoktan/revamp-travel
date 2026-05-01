"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../modules/users/user.model");
const env_1 = require("../config/env");
const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const parts = authHeader?.split(' ');
    const token = parts?.length === 2 && parts[0] === 'Bearer' ? parts[1] : undefined;
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized',
        });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret);
        const user = await user_model_1.User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized',
            });
        }
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized',
        });
    }
};
exports.protect = protect;
