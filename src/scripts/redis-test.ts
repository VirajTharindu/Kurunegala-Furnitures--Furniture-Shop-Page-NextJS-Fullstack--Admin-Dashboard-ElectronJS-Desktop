import redis from "../lib/redis";

async function main() {
    await redis.setex("demo:key", 30, JSON.stringify({ hello: "world" }));

    const val = await redis.get("demo:key");

    console.log("stored ->", JSON.parse(val!));
}

main().catch(console.error);
