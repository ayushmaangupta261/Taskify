const { createClient } = require("redis");

// Create Redis client using environment configuration
const redisClient = createClient({
  url: process.env.REDIS_URL
});

// Establish connection to Redis
redisClient.connect()
  .then(() => console.log("Redis connected"))
  .catch(console.error);

// Export shared Redis client instance
module.exports = redisClient;
