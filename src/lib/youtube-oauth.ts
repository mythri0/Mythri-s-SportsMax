import { randomBytes, createHash } from "node:crypto";
import {
  writeEncryptedRecord,
  readEncryptedRecord,
  deleteRecordByKey,
  cleanExpiredRecords,
} from "./youtube-token-store.ts";

const STATE_RECORD_PREFIX = "yt_oauth_state_";
const STATE_TTL_SECONDS = 10 * 60; // 10 minutes expiry

export interface StoredOAuthState {
  state: string;
  codeVerifier: string;
  createdAt: string;
  expiresAt: string;
}

export interface GoogleOAuthTokens {
  access_token?: string | null;
  refresh_token?: string | null;
  scope?: string | null;
  token_type?: string | null;
  expiry_date?: number | null;
}

export function getGoogleOAuthEnv() {
  const clientId = process.env["YOUTUBE_CLIENT_ID"];
  const clientSecret = process.env["YOUTUBE_CLIENT_SECRET"];
  const redirectUri =
    process.env["YOUTUBE_REDIRECT_URI"] ||
    "https://sports-max-dig.vercel.app/api/youtube/oauth/callback";

  return { clientId, clientSecret, redirectUri };
}

/**
 * Base64URL-encodes a buffer (without padding)
 */
function base64UrlEncode(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Generates PKCE code_verifier and code_challenge (S256).
 */
export function generatePkcePair() {
  const verifier = base64UrlEncode(randomBytes(32));
  const challenge = base64UrlEncode(
    createHash("sha256").update(verifier).digest()
  );
  return { verifier, challenge };
}

/**
 * Builds the Google OAuth 2.0 authorization URL with:
 * - offline access (refresh token)
 * - prompt=consent
 * - PKCE code challenge
 * - Uniquely keyed Airtable record: `yt_oauth_state_<uuid>`
 * - 10-minute expiry
 */
export async function buildAuthorizationUrl(): Promise<string> {
  const { clientId, redirectUri } = getGoogleOAuthEnv();
  if (!clientId) {
    throw new Error("YOUTUBE_CLIENT_ID is not configured on the server");
  }

  // 1. Clean up old expired states before issuing a new one
  try {
    await cleanExpiredRecords(STATE_RECORD_PREFIX);
  } catch (cleanErr) {
    console.warn("[OAuth] Non-blocking state cleanup warning:", cleanErr);
  }

  // 2. Generate random UUID state & PKCE pair
  const stateId = randomBytes(24).toString("hex");
  const { verifier, challenge } = generatePkcePair();

  const now = Date.now();
  const expiresAt = new Date(now + STATE_TTL_SECONDS * 1000).toISOString();
  const recordKey = `${STATE_RECORD_PREFIX}${stateId}`;

  const stateData: StoredOAuthState = {
    state: stateId,
    codeVerifier: verifier,
    createdAt: new Date(now).toISOString(),
    expiresAt,
  };

  // 3. Store in Airtable under its unique key so concurrent flows never overwrite each other
  await writeEncryptedRecord(recordKey, stateData, {
    ExpiresAt: expiresAt,
  });

  // 4. Construct authorization URL
  const scopes = [
    "https://www.googleapis.com/auth/youtube.readonly",
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.force-ssl",
  ];

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: scopes.join(" "),
    access_type: "offline",
    prompt: "consent",
    state: stateId,
    code_challenge: challenge,
    code_challenge_method: "S256",
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Validates callback code and state:
 * - Fetches unique state record from Airtable
 * - Validates single-use requirement by deleting the record BEFORE token exchange
 * - Checks 10-minute expiry
 * - Exchanges authorization code + PKCE verifier for Google tokens
 * - Persists encrypted tokens to Airtable under `yt_oauth_tokens`
 */
export async function handleOAuthCallback(
  code: string,
  state: string
): Promise<{ success: boolean; error?: string }> {
  if (!code || !state) {
    return { success: false, error: "Missing authorization code or state parameter" };
  }

  const { clientId, clientSecret, redirectUri } = getGoogleOAuthEnv();
  if (!clientId || !clientSecret) {
    return { success: false, error: "OAuth server credentials are not fully configured" };
  }

  const recordKey = `${STATE_RECORD_PREFIX}${state}`;

  // 1. Fetch state record from Airtable
  const stateData = await readEncryptedRecord<StoredOAuthState>(recordKey);
  if (!stateData) {
    return {
      success: false,
      error: "Invalid or already-consumed OAuth state. Authorization attempt expired or invalid.",
    };
  }

  // 2. Immediately delete record to enforce strict single-use
  try {
    await deleteRecordByKey(recordKey);
  } catch (delErr) {
    console.warn("[OAuth] Warning deleting consumed state record:", delErr);
  }

  // 3. Validate expiry (10 minutes)
  const expiresTimestamp = new Date(stateData.expiresAt).getTime();
  if (Date.now() > expiresTimestamp) {
    return {
      success: false,
      error: "OAuth authorization attempt expired. Please initiate authorization again.",
    };
  }

  // 4. Exchange authorization code with Google using fetch / OAuth token endpoint
  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
        code_verifier: stateData.codeVerifier,
      }),
    });

    if (!tokenRes.ok) {
      const errBody = await tokenRes.text().catch(() => "");
      console.error(`[OAuth] Token exchange failed with status ${tokenRes.status}`);
      return {
        success: false,
        error: `Google OAuth token exchange failed (${tokenRes.status})`,
      };
    }

    const tokens = (await tokenRes.json()) as GoogleOAuthTokens;

    if (!tokens.access_token) {
      return { success: false, error: "No access token returned by Google" };
    }

    // Preserve existing refresh token if Google didn't return a new one on this exchange
    const existingTokens = await readEncryptedRecord<GoogleOAuthTokens>("yt_oauth_tokens");
    const mergedTokens: GoogleOAuthTokens = {
      ...tokens,
      refresh_token: tokens.refresh_token || existingTokens?.refresh_token || null,
    };

    // Calculate absolute expiry timestamp if expires_in returned
    if ((tokens as { expires_in?: number }).expires_in) {
      mergedTokens.expiry_date =
        Date.now() + ((tokens as { expires_in?: number }).expires_in! * 1000);
    }

    // Store encrypted tokens under yt_oauth_tokens in Airtable
    await writeEncryptedRecord("yt_oauth_tokens", mergedTokens);

    return { success: true };
  } catch (err) {
    console.error("[OAuth] Unexpected exception exchanging OAuth code:", err);
    return { success: false, error: "Failed to exchange OAuth token with provider" };
  }
}
