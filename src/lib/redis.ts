
import { createClient, type RedisClientType } from "redis";

let client: RedisClientType | undefined;
let connecting: Promise<RedisClientType> | undefined;

export async function getRedisClient(): Promise<RedisClientType> {
  if (client?.isReady) return client;
  if (connecting) return connecting;

  connecting = (async () => {
    const host = process.env["REDIS_HOST"];
    const port = Number(process.env["REDIS_PORT"]);
    const password = process.env["REDIS_PASSWORD"];
    const username = process.env["REDIS_USERNAME"] || "default";
    const useTls = process.env["REDIS_TLS"] === "true";

    if (
      !host ||
      !Number.isInteger(port) ||
      port < 1 ||
      port > 65535 ||
      !password
    ) {
      throw new Error("Redis configuration is incomplete.");
    }

    const socketOptions = {
      host,
      port,
      connectTimeout: 5000,
      reconnectStrategy: (retries: number) =>
        retries >= 3 ? new Error("Redis reconnect limit reached") : 500,
    };

    const redis = createClient({
      username,
      password,
      socket: useTls
        ? { ...socketOptions, tls: true as const }
        : socketOptions,
    });

    redis.on("error", (error) => {
      console.error("[Redis] Connection error:", error.message);
    });

    await redis.connect();
    client = redis as RedisClientType;
    return client;
  })();

  try {
    return await connecting;
  } finally {
    connecting = undefined;
  }
}

export async function checkRedisHealth(): Promise<boolean> {
  try {
    const redis = await getRedisClient();
    return (await redis.ping()) === "PONG";
  } catch {
    return false;
  }
}

export async function checkRedisRateLimit(
  key: string,
  maxAttempts: number,
  windowSeconds: number,
): Promise<{
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}> {
  const redis = await getRedisClient();

  const result = (await redis.eval(
    `local count = redis.call('INCR', KEYS[1])
     if count == 1 then
       redis.call('EXPIRE', KEYS[1], ARGV[1])
     end
     local ttl = redis.call('TTL', KEYS[1])
     return {count, ttl}`,
    {
      keys: [key],
      arguments: [String(windowSeconds)],
    },
  )) as number[];

  const count = Number(result[0]);
  const ttl = Math.max(0, Number(result[1]));

  return {
    allowed: count <= maxAttempts,
    remaining: Math.max(0, maxAttempts - count),
    retryAfterSeconds: ttl,
  };
}

export async function closeRedisClient(): Promise<void> {
  if (client?.isOpen) {
    await client.quit();
  }

  client = undefined;
  connecting = undefined;
}
