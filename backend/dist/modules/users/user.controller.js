"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserControllers = void 0;
const user_service_1 = require("./user.service");
const catchAsync_1 = require("../../utils/catchAsync");
const validation_1 = require("../../utils/validation");
const user_validation_1 = require("./user.validation");
// ✅ Create User Controller
const createUser = [
    (0, validation_1.validateBody)(user_validation_1.createUserSchema),
    (0, catchAsync_1.catchAsync)(async (req, res) => {
        const result = await user_service_1.UserServices.createUserIntoDB(req.body);
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: result,
        });
    }),
];
// ✅ Get All Users with pagination
const getAllUsers = [
    (0, validation_1.validate)(user_validation_1.paginationSchema),
    (0, catchAsync_1.catchAsync)(async (req, res) => {
        const result = await user_service_1.UserServices.getAllUsersFromDB(req.query);
        res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            data: result.users,
            pagination: result.pagination,
        });
    }),
];
// ✅ Get Single User by ID
const getUserById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const result = await user_service_1.UserServices.getUserByIdFromDB(id);
    res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        data: result,
    });
});
// ✅ Update User
const updateUser = [
    (0, validation_1.validateBody)(user_validation_1.updateUserSchema),
    (0, catchAsync_1.catchAsync)(async (req, res) => {
        const { id } = req.params;
        const result = await user_service_1.UserServices.updateUserInDB(id, req.body);
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: result,
        });
    }),
];
// ✅ Delete User (Admin)
const deleteUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const result = await user_service_1.UserServices.deleteUserFromDB(id);
    res.status(200).json({
        success: true,
        message: 'User deleted successfully',
        data: result,
    });
});
// ✅ Update User Password
const updatePassword = [
    (0, validation_1.validateBody)(user_validation_1.updatePasswordSchema),
    (0, catchAsync_1.catchAsync)(async (req, res) => {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;
        const result = await user_service_1.UserServices.updateUserPasswordInDB(id, currentPassword, newPassword);
        res.status(200).json({
            success: true,
            message: 'Password updated successfully',
            data: result,
        });
    }),
];
exports.UserControllers = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    updatePassword,
};
