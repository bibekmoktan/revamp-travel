import { Request, Response } from 'express';
import { UserServices } from './user.service';
import { catchAsync } from '../../utils/catchAsync';
import { validateBody, validate } from '../../utils/validation';
import { createUserSchema, updateUserSchema, updatePasswordSchema, paginationSchema } from './user.validation';

// ✅ Create User Controller
const createUser = [
  validateBody(createUserSchema),
  catchAsync(async (req: Request, res: Response) => {
    const result = await UserServices.createUserIntoDB(req.body);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: result,
    });
  }),
];

// ✅ Get All Users with pagination
const getAllUsers = [
  validate(paginationSchema),
  catchAsync(async (req: Request, res: Response) => {
    const result = await UserServices.getAllUsersFromDB(req.query);

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: result.users,
      pagination: result.pagination,
    });
  }),
];

// ✅ Get Single User by ID
const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await UserServices.getUserByIdFromDB(id);

  res.status(200).json({
    success: true,
    message: 'User retrieved successfully',
    data: result,
  });
});

// ✅ Update User
const updateUser = [
  validateBody(updateUserSchema),
  catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await UserServices.updateUserInDB(id, req.body);

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: result,
    });
  }),
];

// ✅ Delete User (Admin)
const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await UserServices.deleteUserFromDB(id);

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});

// ✅ Update User Password
const updatePassword = [
  validateBody(updatePasswordSchema),
  catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    const result = await UserServices.updateUserPasswordInDB(id, currentPassword, newPassword);

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
      data: result,
    });
  }),
];

export const UserControllers = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updatePassword,
};