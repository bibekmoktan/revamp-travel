import { TUser } from './user.interface';
import { User } from './user.model';
import { ConflictError, NotFoundError, ValidationError } from '../../utils/errors';
import { logger } from '../../utils/logger';
import bcrypt from 'bcrypt';
import { env } from '../../config/env';

// ✅ Create User
const createUserIntoDB = async (payload: TUser) => {
  try {
    const existingUser = await User.findOne({ email: payload.email });

    if (existingUser) {
      logger.warn('Attempt to create user with existing email', { email: payload.email });
      throw new ConflictError('Email already exists');
    }

    const result = await User.create(payload);

    logger.info('User created successfully', { 
      userId: result._id.toString(), 
      email: result.email,
      role: result.role 
    });

    // Return user without password
    const userWithoutPassword = await User.findById(result._id).select('-password');
    return userWithoutPassword;
  } catch (error: any) {
    if (error instanceof ConflictError) {
      throw error;
    }
    
    logger.error('Failed to create user', { 
      email: payload.email, 
      error: error.message 
    });
    throw new Error('User creation failed');
  }
};

// ✅ Get Single User (for login - internal use only)
const getSingleUserFromDB = async (email: string) => {
  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      logger.warn('Attempt to get non-existent user', { email });
      throw new NotFoundError('User not found');
    }

    return user;
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    
    logger.error('Failed to get user', { email, error: error.message });
    throw new Error('Failed to retrieve user');
  }
};

// ✅ Get User by ID (public - without password)
const getUserByIdFromDB = async (userId: string) => {
  try {
    const user = await User.findById(userId).select('-password');

    if (!user) {
      logger.warn('Attempt to get non-existent user by ID', { userId });
      throw new NotFoundError('User not found');
    }

    return user;
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    
    logger.error('Failed to get user by ID', { userId, error: error.message });
    throw new Error('Failed to retrieve user');
  }
};

// ✅ Get All Users (Admin) - with pagination
const getAllUsersFromDB = async (filters: any = {}) => {
  try {
    const { page = 1, limit = 10, search, role, isBlocked } = filters;
    
    // Build query
    const query: any = {};
    
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
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(query)
    ]);

    logger.info('Retrieved users list', { 
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
  } catch (error: any) {
    logger.error('Failed to get users', { filters, error: error.message });
    throw new Error('Failed to retrieve users');
  }
};

// ✅ Update User
const updateUserInDB = async (userId: string, payload: Partial<TUser>) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      logger.warn('Attempt to update non-existent user', { userId });
      throw new NotFoundError('User not found');
    }

    // Check if email is being updated and if it's already taken
    if (payload.email && payload.email !== user.email) {
      const existingUser = await User.findOne({ email: payload.email });
      if (existingUser) {
        throw new ConflictError('Email already exists');
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      payload,
      { new: true, runValidators: true }
    ).select('-password');

    logger.info('User updated successfully', { 
      userId, 
      updatedFields: Object.keys(payload) 
    });

    return updatedUser;
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ConflictError) {
      throw error;
    }
    
    logger.error('Failed to update user', { userId, error: error.message });
    throw new Error('Failed to update user');
  }
};

// ✅ Delete User (Admin)
const deleteUserFromDB = async (userId: string) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      logger.warn('Attempt to delete non-existent user', { userId });
      throw new NotFoundError('User not found');
    }

    await User.findByIdAndDelete(userId);

    logger.info('User deleted successfully', { userId, email: user.email });

    return { message: 'User deleted successfully' };
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    
    logger.error('Failed to delete user', { userId, error: error.message });
    throw new Error('Failed to delete user');
  }
};

// ✅ Update Password
const updateUserPasswordInDB = async (userId: string, currentPassword: string, newPassword: string) => {
  try {
    const user = await User.findById(userId).select('+password');

    if (!user) {
      logger.warn('Attempt to update password for non-existent user', { userId });
      throw new NotFoundError('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await User.isPasswordMatched(
      currentPassword,
      user.password as string
    );

    if (!isCurrentPasswordValid) {
      logger.warn('Invalid current password provided', { userId });
      throw new ValidationError('Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, env.bcryptRounds);

    await User.findByIdAndUpdate(userId, { password: hashedNewPassword });

    logger.info('User password updated successfully', { userId });

    return { message: 'Password updated successfully' };
  } catch (error: any) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    
    logger.error('Failed to update user password', { userId, error: error.message });
    throw new Error('Failed to update password');
  }
};

export const UserServices = {
  createUserIntoDB,
  getSingleUserFromDB,
  getUserByIdFromDB,
  getAllUsersFromDB,
  updateUserInDB,
  deleteUserFromDB,
  updateUserPasswordInDB,
};