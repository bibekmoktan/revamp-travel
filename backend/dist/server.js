"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const logger_1 = require("./utils/logger");
const db_1 = require("./config/db");
const bookingCleanup_service_1 = require("./modules/bookings/bookingCleanup.service");
const PORT = env_1.env.port || 3002;
const startServer = async () => {
    try {
        await (0, db_1.connectDB)();
        bookingCleanup_service_1.BookingCleanupService.scheduleCleanup();
        const server = http_1.default.createServer(app_1.default);
        server.listen(PORT, () => {
            logger_1.logger.info(`Server is running on port ${PORT}`, {
                port: PORT,
                nodeEnv: env_1.env.nodeEnv,
                timestamp: new Date().toISOString(),
            });
        });
        const shutdown = async (signal) => {
            logger_1.logger.info(`${signal} received — shutting down gracefully`);
            server.close(async () => {
                try {
                    await mongoose_1.default.disconnect();
                    logger_1.logger.info("MongoDB disconnected");
                    process.exit(0);
                }
                catch (err) {
                    logger_1.logger.error("Error during shutdown", { error: err.message });
                    process.exit(1);
                }
            });
            // Force exit if graceful shutdown takes too long
            setTimeout(() => {
                logger_1.logger.error("Shutdown timeout — forcing exit");
                process.exit(1);
            }, 10000);
        };
        process.on("SIGTERM", () => shutdown("SIGTERM"));
        process.on("SIGINT", () => shutdown("SIGINT"));
        process.on("unhandledRejection", (reason) => {
            logger_1.logger.error("Unhandled promise rejection", { error: reason?.message ?? reason });
            shutdown("unhandledRejection");
        });
        process.on("uncaughtException", (err) => {
            logger_1.logger.error("Uncaught exception", { error: err.message, stack: err.stack });
            shutdown("uncaughtException");
        });
    }
    catch (error) {
        logger_1.logger.error("Failed to start server", { error: error.message });
        process.exit(1);
    }
};
startServer();
