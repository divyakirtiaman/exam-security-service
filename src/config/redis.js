import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on("error", (error) => {
  console.error("Redis error:", error.message);
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis");
  } catch (error) {
    console.error("Redis connection failed:", error.message);
    process.exit(1);
  }
};

export { redisClient, connectRedis };