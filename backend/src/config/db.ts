import mongoose from "mongoose";
import { env } from "./env";

export const connectDB = async () => {
  try {
    await mongoose.connect(env.mongoUrl, {
      autoIndex: false, // disable in production
    });

    console.log("✅ MongoDB Connected");

  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1); // Stop app if DB fails
  }
};