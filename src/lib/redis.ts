// src/lib/redis.ts
import Redis from "ioredis";

const getRedisClient = () => {
    return new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
        lazyConnect: true
    });
};

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined
}

const redis = globalForRedis.redis ?? getRedisClient();

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;

// Optional: add simple error handling
redis.on("error", (err) => {
    console.error("Redis error:", err);
});

//cache invalidations
export async function invalidatePattern(pattern: string) {
    const stream = redis.scanStream({ match: pattern });

    const keys: string[] = [];

    for await (const batch of stream) {
        keys.push(...batch);
    }

    if (keys.length) await redis.del(...keys);
}

export default redis;
