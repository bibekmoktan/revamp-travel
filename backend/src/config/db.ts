import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "../utils/logger";

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

const connectDB = async (attempt = 1): Promise<void> => {
  try {
    const connectionInstance = await mongoose.connect(env.mongoUrl, {
      serverSelectionTimeoutMS: 5000,
    });
    logger.info(`MongoDB connected: ${connectionInstance.connection.host}`);

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected — attempting reconnect");
      setTimeout(() => connectDB(), RETRY_DELAY_MS);
    });
  } catch (error: any) {
    logger.error(`MongoDB connection failed (attempt ${attempt}/${MAX_RETRIES})`, {
      error: error.message,
    });

    if (attempt >= MAX_RETRIES) {
      throw new Error(`MongoDB connection failed after ${MAX_RETRIES} attempts`);
    }

    await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
    return connectDB(attempt + 1);
  }
};

export { connectDB };
