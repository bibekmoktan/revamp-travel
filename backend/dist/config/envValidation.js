"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnv = void 0;
const joi_1 = __importDefault(require("joi"));
const envSchema = joi_1.default.object({
    NODE_ENV: joi_1.default.string()
        .valid('development', 'production', 'test')
        .default('development'),
    PORT: joi_1.default.number()
        .default(3002),
    MONGO_URL: joi_1.default.string()
        .required()
        .pattern(/^mongodb(\+srv)?:\/\/.+/),
    JWT_SECRET: joi_1.default.string()
        .required()
        .min(32),
    JWT_EXPIRE: joi_1.default.string()
        .default('7d'),
    JWT_REFRESH_SECRET: joi_1.default.string()
        .required()
        .min(32),
    JWT_REFRESH_EXPIRE: joi_1.default.string()
        .default('30d'),
    BCRYPT_ROUNDS: joi_1.default.number()
        .default(12),
    ALLOWED_ORIGINS: joi_1.default.string()
        .when('NODE_ENV', {
        is: 'production',
        then: joi_1.default.required(),
        otherwise: joi_1.default.optional(),
    }),
    CLOUDINARY_CLOUD_NAME: joi_1.default.string()
        .when('NODE_ENV', {
        is: 'production',
        then: joi_1.default.required(),
        otherwise: joi_1.default.optional(),
    }),
    CLOUDINARY_API_KEY: joi_1.default.string()
        .when('NODE_ENV', {
        is: 'production',
        then: joi_1.default.required(),
        otherwise: joi_1.default.optional(),
    }),
    CLOUDINARY_API_SECRET: joi_1.default.string()
        .when('NODE_ENV', {
        is: 'production',
        then: joi_1.default.required(),
        otherwise: joi_1.default.optional(),
    }),
    EMAIL_HOST: joi_1.default.string().optional(),
    EMAIL_PORT: joi_1.default.number().optional(),
    EMAIL_USER: joi_1.default.string().optional(),
    EMAIL_PASS: joi_1.default.string().optional(),
    REDIS_URL: joi_1.default.string()
        .pattern(/^redis:\/\/.+/)
        .optional(),
    LOG_LEVEL: joi_1.default.string()
        .valid('error', 'warn', 'info', 'debug')
        .default('info'),
}).unknown(true);
const validateEnv = () => {
    const { error, value } = envSchema.validate(process.env, {
        allowUnknown: true,
        stripUnknown: true,
    });
    if (error) {
        throw new Error(`Environment validation error: ${error.message}`);
    }
    return value;
};
exports.validateEnv = validateEnv;
