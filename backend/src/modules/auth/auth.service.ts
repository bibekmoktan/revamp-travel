import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { TLoginUser } from './auth.interface';
import { User } from '../users/user.model';
import { generateToken, verifyToken, generateAccessToken } from '../../utils/jwt';
import { AuthenticationError, AuthorizationError, NotFoundError, ValidationError } from '../../utils/errors';
import { logger } from '../../utils/logger';
import { sendEmail } from '../../utils/sendEmail';
import { env } from '../../config/env';
import type { RegisterInput, RefreshTokenInput, ForgotPasswordInput, ResetPasswordInput, OAuthInput } from './auth.validation';

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

async function verifyAppleIdToken(idToken: string): Promise<{ sub: string; email: string }> {
  const res = await fetch('https://appleid.apple.com/auth/keys');
  const { keys } = await res.json() as { keys: JsonWebKey[] };

  const headerB64 = idToken.split('.')[0];
  const header = JSON.parse(Buffer.from(headerB64, 'base64url').toString()) as { kid: string };

  const jwk = keys.find((k: any) => k.kid === header.kid);
  if (!jwk) throw new AuthenticationError('Apple signing key not found');

  const publicKey = crypto.createPublicKey({ key: jwk, format: 'jwk' });
  const decoded = jwt.verify(idToken, publicKey, {
    algorithms: ['RS256'],
    issuer: 'https://appleid.apple.com',
  }) as { sub: string; email: string };

  return { sub: decoded.sub, email: decoded.email };
}

const oauthLogin = async (payload: OAuthInput) => {
  const { provider, code, token, redirectUri } = payload;
  let providerUser: { id: string; email: string; name: string; avatar?: string };

  if (provider === 'google') {
    if (!env.oauth.google.clientId || !env.oauth.google.clientSecret) {
      throw new ValidationError('Google OAuth is not configured on this server');
    }
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        client_id:     env.oauth.google.clientId,
        client_secret: env.oauth.google.clientSecret,
        redirect_uri:  redirectUri,
        grant_type:    'authorization_code',
      }),
    });
    const tokenData = await tokenRes.json() as any;
    if (!tokenRes.ok) throw new AuthenticationError(`Google OAuth failed: ${tokenData.error_description ?? tokenData.error ?? 'Unknown error'}`);

    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const u = await userRes.json() as any;
    providerUser = { id: u.sub, email: u.email, name: u.name ?? u.given_name ?? 'Google User', avatar: u.picture };

  } else if (provider === 'facebook') {
    if (!env.oauth.facebook.clientId || !env.oauth.facebook.clientSecret) {
      throw new ValidationError('Facebook OAuth is not configured on this server');
    }
    const tokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?${new URLSearchParams({
      client_id:     env.oauth.facebook.clientId,
      client_secret: env.oauth.facebook.clientSecret,
      redirect_uri:  redirectUri,
      code:          code!,
    })}`;
    const tokenRes = await fetch(tokenUrl);
    const tokenData = await tokenRes.json() as any;
    if (!tokenRes.ok || tokenData.error) throw new AuthenticationError(`Facebook OAuth failed: ${tokenData.error?.message ?? 'Unknown error'}`);

    const userRes = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${tokenData.access_token}`);
    const u = await userRes.json() as any;
    if (!u.email) throw new ValidationError('Facebook account has no accessible email. Please use email/password signup instead.');
    providerUser = { id: u.id, email: u.email, name: u.name ?? 'Facebook User', avatar: u.picture?.data?.url };

  } else {
    // Apple
    if (!token) throw new ValidationError('ID token required for Apple Sign In');
    const apple = await verifyAppleIdToken(token);
    providerUser = { id: apple.sub, email: apple.email, name: 'Apple User' };
  }

  const idField = `${provider}Id` as 'googleId' | 'facebookId' | 'appleId';

  let user = await User.findOne({ [idField]: providerUser.id }).select(`+${idField}`);

  if (!user) {
    user = await User.findOne({ email: providerUser.email });
    if (user) {
      (user as any)[idField] = providerUser.id;
      if (!user.avatar && providerUser.avatar) user.avatar = providerUser.avatar;
      await user.save({ validateBeforeSave: false });
    } else {
      user = await User.create({
        name:            providerUser.name,
        email:           providerUser.email,
        [idField]:       providerUser.id,
        avatar:          providerUser.avatar,
        provider,
      });
    }
  }

  if (user.isBlocked) throw new AuthorizationError('Account is blocked');

  const tokens = generateToken({ userId: user._id.toString(), role: user.role });
  logger.info('OAuth login successful', { userId: user._id.toString(), provider });

  const cleanUser = await User.findById(user._id);
  return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, user: cleanUser };
};

export const AuthServices = {
  loginUser,
  registerUser,
  refreshToken,
  forgotPassword,
  resetPassword,
  oauthLogin,
};