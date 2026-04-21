import crypto from 'crypto';
import { TLoginUser } from './auth.interface';
import { User } from '../users/user.model';
import { generateToken, verifyToken, generateAccessToken } from '../../utils/jwt';
import { AuthenticationError, AuthorizationError, NotFoundError, ValidationError } from '../../utils/errors';
import { logger } from '../../utils/logger';
import { sendEmail } from '../../utils/sendEmail';
import type { RegisterInput, RefreshTokenInput, ForgotPasswordInput, ResetPasswordInput } from './auth.validation';

const loginUser = async (payload: TLoginUser) => {
  const { email, password } = payload;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      logger.warn('Login attempt with non-existent email', { email });
      throw new AuthenticationError('Invalid credentials');
    }

    if (user.isBlocked) {
      logger.warn('Login attempt by blocked user', { userId: user._id.toString(), email });
      throw new AuthorizationError('Account is blocked');
    }

    const isMatched = await User.isPasswordMatched(password, user.password as string);

    if (!isMatched) {
      logger.warn('Login attempt with invalid password', { userId: user._id.toString() });
      throw new AuthenticationError('Invalid credentials');
    }

    const tokens = generateToken({ userId: user._id.toString(), role: user.role });

    logger.info('User logged in successfully', { userId: user._id.toString(), role: user.role });

    const userWithoutPassword = await User.findById(user._id).select('-password');

    return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, user: userWithoutPassword };
  } catch (error: any) {
    if (error instanceof AuthenticationError || error instanceof AuthorizationError) throw error;
    logger.error('Unexpected error during login', { error: error.message });
    throw new AuthenticationError('Login failed');
  }
};

const registerUser = async (payload: RegisterInput) => {
  const existing = await User.findOne({ email: payload.email });
  if (existing) {
    throw new ValidationError('Email already in use');
  }

  const user = await User.create({
    name: payload.name,
    email: payload.email,
    password: payload.password,
    role: payload.role ?? 'user',
  });

  const tokens = generateToken({ userId: user._id.toString(), role: user.role });

  logger.info('User registered', { userId: user._id.toString(), role: user.role });

  const userWithoutPassword = await User.findById(user._id).select('-password');

  return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, user: userWithoutPassword };
};

const refreshToken = async (payload: RefreshTokenInput) => {
  let decoded;
  try {
    decoded = verifyToken(payload.refreshToken, 'refresh');
  } catch {
    throw new AuthenticationError('Invalid or expired refresh token');
  }

  const user = await User.findById(decoded.userId);
  if (!user || user.isBlocked) {
    throw new AuthenticationError('Not authorized');
  }

  const accessToken = generateAccessToken({ userId: user._id.toString(), role: user.role });

  logger.info('Access token refreshed', { userId: user._id.toString() });

  return { accessToken };
};

const forgotPassword = async (payload: ForgotPasswordInput) => {
  const user = await User.findOne({ email: payload.email });

  // Always respond the same way to prevent email enumeration
  if (!user) {
    logger.warn('Forgot password for unknown email');
    return;
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  await user.save({ validateBeforeSave: false });

  await sendEmail({
    to: user.email,
    subject: 'Password Reset Request',
    html: `
      <p>You requested a password reset.</p>
      <p>Use this token (valid for 15 minutes):</p>
      <pre>${rawToken}</pre>
      <p>If you did not request this, ignore this email.</p>
    `,
  });

  logger.info('Password reset email sent', { userId: user._id.toString() });
};

const resetPassword = async (payload: ResetPasswordInput) => {
  const hashedToken = crypto.createHash('sha256').update(payload.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() },
  }).select('+password +passwordResetToken +passwordResetExpires');

  if (!user) {
    throw new AuthenticationError('Invalid or expired reset token');
  }

  user.password = payload.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  logger.info('Password reset successful', { userId: user._id.toString() });
};

export const AuthServices = {
  loginUser,
  registerUser,
  refreshToken,
  forgotPassword,
  resetPassword,
};