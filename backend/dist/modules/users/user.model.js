"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const env_1 = require("../../config/env");
// 1️⃣ Define Schema
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    isBlocked: { type: Boolean, default: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
}, {
    timestamps: true,
});
// 2️⃣ Pre-save middleware (Password hashing)
userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    if (this.password) {
        this.password = await bcrypt_1.default.hash(this.password, env_1.env.bcryptRounds);
    }
    next();
});
// 3️⃣ Static method for password compare
userSchema.statics.isPasswordMatched = async function (plainTextPassword, hashedPassword) {
    return await bcrypt_1.default.compare(plainTextPassword, hashedPassword);
};
// 4️⃣ Create model
exports.User = (0, mongoose_1.model)('User', userSchema);
