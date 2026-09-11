import "dotenv/config";
import app from "./app.js";
import connectMongoDB from "./config/mongodb.js";
import { connectRedis } from "./config/redis.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectMongoDB();
  await connectRedis();

  app.listen(PORT, () => {
    console.log(`Security service running on port ${PORT}`);
  });
};

startServer();