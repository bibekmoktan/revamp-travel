import Joi from 'joi';

const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  
  PORT: Joi.number()
    .default(3002),
  
  MONGO_URL: Joi.string()
    .required()
    .pattern(/^mongodb(\+srv)?:\/\/.+/),
  
  JWT_SECRET: Joi.string()
    .required()
    .min(32),
  
  JWT_EXPIRE: Joi.string()
    .default('7d'),
  
  JWT_REFRESH_SECRET: Joi.string()
    .required()
    .min(32),
  
  JWT_REFRESH_EXPIRE: Joi.string()
    .default('30d'),
  
  BCRYPT_ROUNDS: Joi.number()
    .default(12),
  
  ALLOWED_ORIGINS: Joi.string()
    .when('NODE_ENV', {
      is: 'production',
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
  
  CLOUDINARY_CLOUD_NAME: Joi.string()
    .when('NODE_ENV', {
      is: 'production',
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
  
  CLOUDINARY_API_KEY: Joi.string()
    .when('NODE_ENV', {
      is: 'production',
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
  
  CLOUDINARY_API_SECRET: Joi.string()
    .when('NODE_ENV', {
      is: 'production',
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
  
  EMAIL_HOST: Joi.string().optional(),
  EMAIL_PORT: Joi.number().optional(),
  EMAIL_USER: Joi.string().optional(),
  EMAIL_PASS: Joi.string().optional(),
  
  REDIS_URL: Joi.string()
    .pattern(/^redis:\/\/.+/)
    .optional(),
  
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug')
    .default('info'),
}).unknown(true);

export const validateEnv = () => {
  const { error, value } = envSchema.validate(process.env, {
    allowUnknown: true,
    stripUnknown: true,
  });

  if (error) {
    throw new Error(`Environment validation error: ${error.message}`);
  }

  return value;
};
