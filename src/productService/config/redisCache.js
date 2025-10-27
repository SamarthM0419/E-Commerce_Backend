const redis = require("redis");
require("dotenv").config();

let redisClient;

async function connectRedis() {
  if (!redisClient) {
    redisClient = redis.createClient({
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      },
    });

    redisClient.on("connect", () => console.log("Redis Connected"));
    redisClient.on("error", (err) =>
      console.error("Redis Database Connection Failed", err)
    );

    await redisClient.connect();
  }
  return redisClient;
}

async function setCache(key, value, ttl = 60) {
  try {
    if (!redisClient) await connectRedis();
    await redisClient.setEx(key, ttl, JSON.stringify(value));
  } catch (err) {
    console.error("Redis setCache error:", err);
  }
}

async function getCache(key) {
  try {
    if (!redisClient) await connectRedis();
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error("Redis getCache error:", err);
    return null;
  }
}

module.exports = { connectRedis, setCache, getCache };
