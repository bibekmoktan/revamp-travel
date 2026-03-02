import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { env } from "./config/env";
import { logger } from "./utils/logger";

const PORT = env.port || 3002;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      logger.info(`🚀 Server is running on port ${PORT}`, {
        port: PORT,
        nodeEnv: env.nodeEnv,
        timestamp: new Date().toISOString()
      });
    });
  } catch (error: any) {
    logger.error('Failed to start server', { error: error.message });
    process.exit(1);
  }
};

startServer();
