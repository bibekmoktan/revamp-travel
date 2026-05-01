"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const user_model_1 = require("./user.model");
const errors_1 = require("../../utils/errors");
const logger_1 = require("../../utils/logger");
const bcrypt_1 = __importDefault(require("bcrypt"));
const env_1 = require("../../config/env");
// ✅ Create User
const createUserIntoDB = async (payload) => {
    try {
        const existingUser = await user_model_1.User.findOne({ email: payload.email });
        if (existingUser) {
            logger_1.logger.warn('Attempt to create user with existing email', { email: payload.email });
            throw new errors_1.ConflictError('Email already exists');
        }
        const result = await user_model_1.User.create(payload);
        logger_1.logger.info('User created successfully', {
            userId: result._id.toString(),
            email: result.email,
            role: result.role
        });
        // Return user without password
        const userWithoutPassword = await user_model_1.User.findById(result._id).select('-password');
        return userWithoutPassword;
    }
    catch (error) {
        if (error instanceof errors_1.ConflictError) {
            throw error;
        }
        logger_1.logger.error('Failed to create user', {
            email: payload.email,
            error: error.message
        });
        throw new Error('User creation failed');
    }
};
// ✅ Get Single User (for login - internal use only)
const getSingleUserFromDB = async (email) => {
    try {
        const user = await user_model_1.User.findOne({ email }).select('+password');
        if (!user) {
            logger_1.logger.warn('Attempt to get non-existent user', { email });
            throw new errors_1.NotFoundError('User not found');
        }
        return user;
    }
    catch (error) {
        if (error instanceof errors_1.NotFoundError) {
            throw error;
        }
        logger_1.logger.error('Failed to get user', { email, error: error.message });
        throw new Error('Failed to retrieve user');
    }
};
// ✅ Get User by ID (public - without password)
const getUserByIdFromDB = async (userId) => {
    try {
        const user = await user_model_1.User.findById(userId).select('-password');
        if (!user) {
            logger_1.logger.warn('Attempt to get non-existent user by ID', { userId });
            throw new errors_1.NotFoundError('User not found');
        }
        return user;
    }
    catch (error) {
        if (error instanceof errors_1.NotFoundError) {
            throw error;
        }
        logger_1.logger.error('Failed to get user by ID', { userId, error: error.message });
        throw new Error('Failed to retrieve user');
    }
};
// ✅ Get All Users (Admin) - with pagination
const getAllUsersFromDB = async (filters = {}) => {
    try {
        const { page = 1, limit = 10, search, role, isBlocked } = filters;
        // Build query
        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }
        if (role) {
            query.role = role;
        }
        if (typeof isBlocked === 'boolean') {
            query.isBlocked = isBlocked;
        }
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            user_model_1.User.find(query)
                .select('-password')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            user_model_1.User.countDocuments(query)
        ]);
        logger_1.logger.info('Retrieved users list', {
            count: users.length,
            total,
            page,
            limit,
            filters
        });
        return {
            users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    catch (error) {
        logger_1.logger.error('Failed to get users', { filters, error: error.message });
        throw new Error('Failed to retrieve users');
    }
};
// ✅ Update User
const updateUserInDB = async (userId, payload) => {
    try {
        const user = await user_model_1.User.findById(userId);
        if (!user) {
            logger_1.logger.warn('Attempt to update non-existent user', { userId });
            throw new errors_1.NotFoundError('User not found');
        }
        // Check if email is being updated and if it's already taken
        if (payload.email && payload.email !== user.email) {
            const existingUser = await user_model_1.User.findOne({ email: payload.email });
            if (existingUser) {
                throw new errors_1.ConflictError('Email already exists');
            }
        }
        const updatedUser = await user_model_1.User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true }).select('-password');
        logger_1.logger.info('User updated successfully', {
            userId,
            updatedFields: Object.keys(payload)
        });
        return updatedUser;
    }
    catch (error) {
        if (error instanceof errors_1.NotFoundError || error instanceof errors_1.ConflictError) {
            throw error;
        }
        logger_1.logger.error('Failed to update user', { userId, error: error.message });
        throw new Error('Failed to update user');
    }
};
// ✅ Delete User (Admin)
const deleteUserFromDB = async (userId) => {
    try {
        const user = await user_model_1.User.findById(userId);
        if (!user) {
            logger_1.logger.warn('Attempt to delete non-existent user', { userId });
            throw new errors_1.NotFoundError('User not found');
        }
        await user_model_1.User.findByIdAndDelete(userId);
        logger_1.logger.info('User deleted successfully', { userId, email: user.email });
        return { message: 'User deleted successfully' };
    }
    catch (error) {
        if (error instanceof errors_1.NotFoundError) {
            throw error;
        }
        logger_1.logger.error('Failed to delete user', { userId, error: error.message });
        throw new Error('Failed to delete user');
    }
};
// ✅ Update Password
const updateUserPasswordInDB = async (userId, currentPassword, newPassword) => {
    try {
        const user = await user_model_1.User.findById(userId).select('+password');
        if (!user) {
            logger_1.logger.warn('Attempt to update password for non-existent user', { userId });
            throw new errors_1.NotFoundError('User not found');
        }
        // Verify current password
        const isCurrentPasswordValid = await user_model_1.User.isPasswordMatched(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            logger_1.logger.warn('Invalid current password provided', { userId });
            throw new errors_1.ValidationError('Current password is incorrect');
        }
        // Hash new password
        const hashedNewPassword = await bcrypt_1.default.hash(newPassword, env_1.env.bcryptRounds);
        await user_model_1.User.findByIdAndUpdate(userId, { password: hashedNewPassword });
        logger_1.logger.info('User password updated successfully', { userId });
        return { message: 'Password updated successfully' };
    }
    catch (error) {
        if (error instanceof errors_1.NotFoundError || error instanceof errors_1.ValidationError) {
            throw error;
        }
        logger_1.logger.error('Failed to update user password', { userId, error: error.message });
        throw new Error('Failed to update password');
    }
};
exports.UserServices = {
    createUserIntoDB,
    getSingleUserFromDB,
    getUserByIdFromDB,
    getAllUsersFromDB,
    updateUserInDB,
    deleteUserFromDB,
    updateUserPasswordInDB,
};
