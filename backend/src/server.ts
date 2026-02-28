import 'dotenv/config';
import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";

const startServer = async () => {
  await connectDB();
  app.get("/", (req, res) => {
  res.send("Travel API is running 🚀");
});

  app.listen(env.port, () => {
    console.log(`🚀 Server running on port ${env.port}`);
  });
};

startServer();