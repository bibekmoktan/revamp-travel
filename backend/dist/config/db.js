"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const logger_1 = require("../utils/logger");
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;
const connectDB = async (attempt = 1) => {
    try {
        const connectionInstance = await mongoose_1.default.connect(env_1.env.mongoUrl, {
            serverSelectionTimeoutMS: 5000,
        });
        logger_1.logger.info(`MongoDB connected: ${connectionInstance.connection.host}`);
        mongoose_1.default.connection.on("disconnected", () => {
            logger_1.logger.warn("MongoDB disconnected — attempting reconnect");
            setTimeout(() => connectDB(), RETRY_DELAY_MS);
        });
    }
    catch (error) {
        logger_1.logger.error(`MongoDB connection failed (attempt ${attempt}/${MAX_RETRIES})`, {
            error: error.message,
        });
        if (attempt >= MAX_RETRIES) {
            throw new Error(`MongoDB connection failed after ${MAX_RETRIES} attempts`);
        }
        await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
        return connectDB(attempt + 1);
    }
};
exports.connectDB = connectDB;
