import dotenv from "dotenv";
dotenv.config();

import http from "http";
import mongoose from "mongoose";
import app from "./app";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import { connectDB } from "./config/db";
import { BookingCleanupService } from "./modules/bookings/bookingCleanup.service";

const PORT = env.port || 3002;

const startServer = async () => {
  try {
    await connectDB();
    BookingCleanupService.scheduleCleanup();

    const server = http.createServer(app);

    server.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`, {
        port: PORT,
        nodeEnv: env.nodeEnv,
        timestamp: new Date().toISOString(),
      });
    });

    const shutdown = async (signal: string) => {
      logger.info(`${signal} received — shutting down gracefully`);
      server.close(async () => {
        try {
          await mongoose.disconnect();
          logger.info("MongoDB disconnected");
          process.exit(0);
        } catch (err: any) {
          logger.error("Error during shutdown", { error: err.message });
          process.exit(1);
        }
      });

      // Force exit if graceful shutdown takes too long
      setTimeout(() => {
        logger.error("Shutdown timeout — forcing exit");
        process.exit(1);
      }, 10_000);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    process.on("unhandledRejection", (reason: any) => {
      logger.error("Unhandled promise rejection", { error: reason?.message ?? reason });
      shutdown("unhandledRejection");
    });

    process.on("uncaughtException", (err: Error) => {
      logger.error("Uncaught exception", { error: err.message, stack: err.stack });
      shutdown("uncaughtException");
    });
  } catch (error: any) {
    logger.error("Failed to start server", { error: error.message });
    process.exit(1);
  }
};

startServer();
