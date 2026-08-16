import redis from "./redis";

/**
 * @param key unique key for caching
 * @param ttl time to live in seconds  
 * @param fetcher function that returns a fresh data when cache miss occurs

**/

export async function fetchWithCache<T>(
    key: string,
    ttl: number,
    fetcher: () => Promise<T>
): Promise<T> {

    try {
        // 1. Attempt to get cached data 
        const cached = await redis.get(key);

        if (cached) {
            return JSON.parse(cached);
        }

        // 2. If cache miss, fetch fresh data
        const fresh = await fetcher();

        // 3. Save the fresh data in cache with the ttl
        await redis.setex(key, ttl, JSON.stringify(fresh));

        return fresh;


    }
    catch (error) {
        console.error(`Cache error for key ${key}:`, error);
        // Fallback to fresh fetch if cache fails
        return fetcher();

    }



}
