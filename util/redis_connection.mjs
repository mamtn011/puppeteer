import "dotenv/config";
import Redis from "ioredis";

const connection = new Redis(process.env.REDIS_KEY, {
  maxRetriesPerRequest: null,
});

export default connection;
