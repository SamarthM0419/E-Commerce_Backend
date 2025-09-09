const redis = require("redis");
require("dotenv").config();

let publisher;
let subscriber;

const connectRedisDB = async () => {
  if (!publisher || !subscriber) {
    publisher = redis.createClient({
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      },
    });

    subscriber = publisher.duplicate();

    publisher.on("error", (err) =>
      console.error("Redis Publisher Error:", err)
    );
    subscriber.on("error", (err) =>
      console.error("Redis Subscriber Error:", err)
    );

    await publisher.connect();
    await subscriber.connect();

    console.log(" EventBus connected to Redis Cloud");
  }
};

const isConnected = () => {
  return publisher?.isOpen && subscriber?.isOpen;
};

const publish = async (channel, message) => {
  if (!publisher) {
    throw new Error("Publisher not connected. First connect to redis database");
  }
  await publisher.publish(channel, JSON.stringify(message));
  console.log(` Published on [${channel}]:`, message);
};

const subscribe = async (channel, callback) => {
  if (!subscriber) {
    throw new Error(
      "Subscriber not connected. First connect to redis database"
    );
  }
  await subscriber.subscribe(channel, (message) => {
    console.log(` Received from [${channel}]:`, message);
    callback(JSON.parse(message));
  });
};

module.exports = {
  connectRedisDB,
  publish,
  subscribe,
  isConnected,
};
