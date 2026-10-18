import { createHmac, timingSafeEqual, createHash } from "node:crypto";
import { findRecordByKey, writeEncryptedRecord } from "./youtube-token-store.ts";

const COOKIE_NAME = "yt_admin_session";
const SESSION_TTL_SECONDS = 8 * 60 * 60; // 8 hours

export interface SessionPayload {
  role: "admin";
  issuedAt: number;
  expiresAt: number;
}

function getAdminSecret(): string {
  const secret = process.env["YOUTUBE_ADMIN_SECRET"];
  if (!secret || secret.trim().length === 0) {
    throw new Error("YOUTUBE_ADMIN_SECRET is not configured on the server");
  }
  return secret.trim();
}

/**
 * Signs session payload with HMAC-SHA256 and returns cookie value (payload.sig)
 */
export function signSession(): string {
  const secret = getAdminSecret();
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    role: "admin",
    issuedAt: now,
    expiresAt: now + SESSION_TTL_SECONDS,
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const hmac = createHmac("sha256", secret);
  hmac.update(payloadB64);
  const sig = hmac.digest("base64url");

  return `${payloadB64}.${sig}`;
}

/**
 * Verifies session cookie from HTTP request.
 * Returns true if valid and not expired.
 */
export function verifySession(cookieHeader?: string | null): boolean {
  if (!cookieHeader) return false;

  let secret: string;
  try {
    secret = getAdminSecret();
  } catch {
    return false;
  }

  // Parse cookies
  const cookies = parseCookies(cookieHeader);
  const token = cookies[COOKIE_NAME];
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const payloadB64 = parts[0];
  const providedSig = parts[1];
  if (!payloadB64 || !providedSig) return false;

  // Compute expected signature
  const hmac = createHmac("sha256", secret);
  hmac.update(payloadB64);
  const expectedSig = hmac.digest("base64url");

  // Constant-time comparison
  const providedBuffer = Buffer.from(providedSig);
  const expectedBuffer = Buffer.from(expectedSig);
  if (providedBuffer.length !== expectedBuffer.length) return false;
  if (!timingSafeEqual(providedBuffer, expectedBuffer)) return false;

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8")) as SessionPayload;
    const now = Math.floor(Date.now() / 1000);
    if (!payload.expiresAt || payload.expiresAt < now) {
      return false;
    }
    return payload.role === "admin";
  } catch {
    return false;
  }
}

/**
 * Builds Set-Cookie header for successful login.
 */
export function buildSetCookieHeader(cookieValue: string): string {
  // HttpOnly, Secure in production, SameSite=Strict, Max-Age
  const isProd = process.env["NODE_ENV"] === "production";
  const secureFlag = isProd ? "; Secure" : "";
  return `${COOKIE_NAME}=${cookieValue}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_TTL_SECONDS}${secureFlag}`;
}

/**
 * Builds Set-Cookie header to clear session on logout.
 */
export function buildClearCookieHeader(): string {
  const isProd = process.env["NODE_ENV"] === "production";
  const secureFlag = isProd ? "; Secure" : "";
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT${secureFlag}`;
}

/**
 * Validates login password using constant-time comparison.
 */
export function validateAdminPassword(password: string): boolean {
  if (!password || typeof password !== "string") return false;
  let secret: string;
  try {
    secret = getAdminSecret();
  } catch {
    return false;
  }

  // Hash both with sha256 to guarantee identical lengths for timingSafeEqual
  const passwordHash = createHash("sha256").update(password).digest();
  const secretHash = createHash("sha256").update(secret).digest();

  return timingSafeEqual(passwordHash, secretHash);
}

/**
 * Validates CSRF headers on mutating requests (POST/PUT/DELETE).
 * Verifies Origin or Referer header matches host or deployed domain.
 */
export function validateCsrfOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const host = req.headers.get("host");

  if (!origin && !referer) {
    // If neither is present, reject
    return false;
  }

  const checkUrl = origin || referer;
  if (!checkUrl) return false;

  try {
    const parsed = new URL(checkUrl);
    if (host && parsed.host === host) return true;
    if (parsed.hostname === "sports-max-dig.vercel.app" || parsed.hostname === "localhost") return true;
    return false;
  } catch {
    return false;
  }
}

/**
 * Hash client IP address for privacy in rate-limit storage.
 */
export function hashClientIp(ip: string): string {
  return createHash("sha256").update(ip || "unknown").digest("hex").slice(0, 16);
}

export interface RateLimitState {
  count: number;
  resetAt: number;
}

/**
 * Rate limiting helper using Airtable records.
 * Documented limitation:
 * Airtable does not support atomic increment or transactions.
 * Concurrent requests may read the same count before updating.
 * Under high concurrency or network partitions, this rate limiter may fail open.
 * Critical lead deduplication and validation remain strictly enforced independently.
 */
export async function checkAirtableRateLimit(
  bucketKey: string,
  maxAttempts: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number }> {
  const now = Date.now();
  const recordKey = `ratelimit_${bucketKey}`;

  try {
    const record = await findRecordByKey(recordKey);
    let state: RateLimitState = { count: 0, resetAt: now + windowSeconds * 1000 };

    if (record && record.fields && record.fields.EncryptedBlob) {
      try {
        const { decryptAES256GCM } = await import("./youtube-crypto");
        const parsed = JSON.parse(decryptAES256GCM(record.fields.EncryptedBlob)) as RateLimitState;
        if (parsed.resetAt > now) {
          state = parsed;
        }
      } catch {
        // Reset if malformed
      }
    }

    if (state.count >= maxAttempts) {
      return { allowed: false, remaining: 0 };
    }

    state.count += 1;
    await writeEncryptedRecord(recordKey, state, {
      ExpiresAt: new Date(state.resetAt).toISOString(),
    });

    return { allowed: true, remaining: maxAttempts - state.count };
  } catch (err) {
    // If rate-limit storage is temporarily unavailable, fail open safely
    console.warn(`[RateLimit] Storage lookup failed for ${bucketKey}, falling back open:`, err);
    return { allowed: true, remaining: 1 };
  }
}

function parseCookies(header: string): Record<string, string> {
  const list: Record<string, string> = {};
  header.split(";").forEach((cookie) => {
    const parts = cookie.split("=");
    const name = parts[0]?.trim();
    if (name) {
      list[name] = decodeURIComponent(parts.slice(1).join("=").trim());
    }
  });
  return list;
}
