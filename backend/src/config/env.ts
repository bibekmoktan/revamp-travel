import dotenv from "dotenv";
import { validateEnv } from "./envValidation";

dotenv.config();

const validatedEnv = validateEnv();

export const env = {
  port: validatedEnv.PORT,
  mongoUrl: validatedEnv.MONGO_URL,
  nodeEnv: validatedEnv.NODE_ENV,
  jwtSecret: validatedEnv.JWT_SECRET,
  jwtExpire: validatedEnv.JWT_EXPIRE,
  jwtRefreshSecret: validatedEnv.JWT_REFRESH_SECRET,
  jwtRefreshExpire: validatedEnv.JWT_REFRESH_EXPIRE,
  bcryptRounds: validatedEnv.BCRYPT_ROUNDS,
  allowedOrigins: validatedEnv.ALLOWED_ORIGINS?.split(',') || [],
  cloudinary: {
    cloudName: validatedEnv.CLOUDINARY_CLOUD_NAME,
    apiKey: validatedEnv.CLOUDINARY_API_KEY,
    apiSecret: validatedEnv.CLOUDINARY_API_SECRET,
  },
  email: {
    host: validatedEnv.EMAIL_HOST,
    port: validatedEnv.EMAIL_PORT,
    user: validatedEnv.EMAIL_USER,
    pass: validatedEnv.EMAIL_PASS,
  },
  redisUrl: validatedEnv.REDIS_URL,
  logLevel: validatedEnv.LOG_LEVEL,
};

// Type safety for environment variables
export type Env = typeof env;