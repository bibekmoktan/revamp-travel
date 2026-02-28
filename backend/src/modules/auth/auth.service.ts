import { TLoginUser } from './auth.interface';
import { User } from '../users/user.model';
import { generateToken } from '../../utils/jwt';
import { AuthenticationError, AuthorizationError, NotFoundError } from '../../utils/errors';
import { logger } from '../../utils/logger';

const loginUser = async (payload: TLoginUser) => {
  const { email, password } = payload;

  try {
    // 1️⃣ Check user exists
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      logger.warn('Login attempt with non-existent email', { email });
      throw new AuthenticationError('Invalid credentials');
    }

    // 2️⃣ Check if user is blocked
    if (user.isBlocked) {
      logger.warn('Login attempt by blocked user', { 
        userId: user._id.toString(), 
        email 
      });
      throw new AuthorizationError('Account is blocked');
    }

    // 3️⃣ Check password
    const isMatched = await User.isPasswordMatched(
      password,
      user.password as string
    );

    if (!isMatched) {
      logger.warn('Login attempt with invalid password', { 
        userId: user._id.toString(), 
        email 
      });
      throw new AuthenticationError('Invalid credentials');
    }

    // 4️⃣ Generate tokens
    const tokens = generateToken({
      userId: user._id.toString(),
      role: user.role,
    });

    logger.info('User logged in successfully', { 
      userId: user._id.toString(), 
      email,
      role: user.role 
    });

    // 5️⃣ Return user data without password
    const userWithoutPassword = await User.findById(user._id).select('-password');

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: userWithoutPassword,
    };
  } catch (error: any) {
    // Re-throw known errors
    if (error instanceof AuthenticationError || error instanceof AuthorizationError) {
      throw error;
    }
    
    // Handle unexpected errors
    logger.error('Unexpected error during login', { 
      email, 
      error: error.message 
    });
    throw new AuthenticationError('Login failed');
  }
};

export const AuthServices = {
  loginUser,
};