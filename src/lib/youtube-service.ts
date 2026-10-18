import { readEncryptedRecord, writeEncryptedRecord } from "./youtube-token-store.ts";
import { getGoogleOAuthEnv, GoogleOAuthTokens } from "./youtube-oauth.ts";

export interface ChannelInfo {
  id: string;
  title: string;
  description: string;
  customUrl?: string;
  subscriberCount?: string;
  videoCount?: string;
  viewCount?: string;
  thumbnailUrl?: string;
}

export interface VideoSnippetItem {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl?: string;
  privacyStatus?: string;
}

export interface UploadVideoOptions {
  title: string;
  description: string;
  privacyStatus: "private" | "unlisted" | "public";
  publishAt?: string | undefined; // ISO 8601 string for scheduled release
  tags?: string[] | undefined;
  fileBuffer: Buffer;
  mimeType: string;
}

/**
 * Returns a valid access token. Automatically refreshes using refresh_token if expired or close to expiring.
 */
export async function getValidAccessToken(): Promise<string> {
  const tokens = await readEncryptedRecord<GoogleOAuthTokens>("yt_oauth_tokens");
  if (!tokens || !tokens.access_token) {
    throw new Error("NOT_AUTHENTICATED: No YouTube channel is connected. Please connect via OAuth.");
  }

  const now = Date.now();
  // Refresh if token expires within 2 minutes (or expiry unknown)
  const isExpired = tokens.expiry_date ? tokens.expiry_date - now < 120 * 1000 : false;

  if (!isExpired) {
    return tokens.access_token;
  }

  if (!tokens.refresh_token) {
    throw new Error("REAUTH_REQUIRED: Access token expired and no refresh token is stored. Please re-authenticate.");
  }

  const { clientId, clientSecret } = getGoogleOAuthEnv();
  if (!clientId || !clientSecret) {
    throw new Error("CONFIGURATION_ERROR: OAuth client ID or secret missing.");
  }

  // Refresh token via Google OAuth token endpoint
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: tokens.refresh_token,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => "");
    console.error(`[YouTube Service] Token refresh failed (${res.status}): ${errorBody}`);
    if (res.status === 400 || res.status === 401) {
      throw new Error("REAUTH_REQUIRED: YouTube refresh token has expired or was revoked. Please connect again.");
    }
    throw new Error(`Failed to refresh YouTube access token (${res.status})`);
  }

  const newTokens = (await res.json()) as GoogleOAuthTokens & { expires_in?: number };
  const updatedTokens: GoogleOAuthTokens = {
    ...tokens,
    access_token: newTokens.access_token || null,
    expiry_date: newTokens.expires_in
      ? Date.now() + newTokens.expires_in * 1000
      : Date.now() + 3600 * 1000,
  };

  await writeEncryptedRecord("yt_oauth_tokens", updatedTokens);
  return updatedTokens.access_token!;
}

/**
 * Retrieves the authenticated YouTube channel's details.
 */
export async function getChannelDetails(): Promise<ChannelInfo> {
  const accessToken = await getValidAccessToken();

  const url =
    "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true";
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`YouTube API channel request failed (${res.status}): ${errText}`);
  }

  const data = await res.json();
  if (!data.items || data.items.length === 0) {
    throw new Error("No YouTube channel found for the authenticated account.");
  }

  const item = data.items[0];
  return {
    id: item.id,
    title: item.snippet?.title || "",
    description: item.snippet?.description || "",
    customUrl: item.snippet?.customUrl,
    subscriberCount: item.statistics?.subscriberCount,
    videoCount: item.statistics?.videoCount,
    viewCount: item.statistics?.viewCount,
    thumbnailUrl:
      item.snippet?.thumbnails?.default?.url ||
      item.snippet?.thumbnails?.high?.url,
  };
}

/**
 * Lists the authenticated channel's most recent videos.
 */
export async function listChannelVideos(maxResults = 25): Promise<VideoSnippetItem[]> {
  const accessToken = await getValidAccessToken();

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&forMine=true&type=video&order=date&maxResults=${maxResults}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(`YouTube API video listing failed (${res.status}): ${err}`);
  }

  const data = await res.json();
  if (!data.items) return [];

  return data.items.map((item: any) => ({
    id: item.id?.videoId || item.id,
    title: item.snippet?.title || "",
    description: item.snippet?.description || "",
    publishedAt: item.snippet?.publishedAt || "",
    thumbnailUrl: item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url,
  }));
}

/**
 * Uploads a video to YouTube using resumable upload protocol.
 * For scheduled videos:
 * - privacyStatus MUST be private
 * - publishAt MUST be ISO 8601 string in future
 */
export async function uploadVideo(options: UploadVideoOptions): Promise<{ id: string; title: string }> {
  const accessToken = await getValidAccessToken();

  let privacyStatus = options.privacyStatus;
  let publishAt: string | undefined = undefined;

  if (options.publishAt) {
    const targetDate = new Date(options.publishAt);
    if (isNaN(targetDate.getTime()) || targetDate.getTime() <= Date.now()) {
      throw new Error("Scheduled publication time (publishAt) must be a valid future ISO date-time.");
    }
    // Per YouTube Data API rules: scheduled publish requires privacyStatus = 'private'
    privacyStatus = "private";
    publishAt = targetDate.toISOString();
  }

  const metadata: any = {
    snippet: {
      title: options.title,
      description: options.description,
      tags: options.tags || [],
    },
    status: {
      privacyStatus,
      selfDeclaredMadeForKids: false,
    },
  };

  if (publishAt) {
    metadata.status.publishAt = publishAt;
  }

  // 1. Initialize resumable upload session
  const initUrl =
    "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status";

  const initRes = await fetch(initUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json; charset=UTF-8",
      "X-Upload-Content-Type": options.mimeType,
      "X-Upload-Content-Length": options.fileBuffer.length.toString(),
    },
    body: JSON.stringify(metadata),
  });

  if (!initRes.ok) {
    const err = await initRes.text().catch(() => "");
    throw new Error(`Failed to initiate YouTube video upload session (${initRes.status}): ${err}`);
  }

  const uploadLocation = initRes.headers.get("location");
  if (!uploadLocation) {
    throw new Error("YouTube upload session did not return an upload location URI.");
  }

  // 2. Upload video binary content
  const uploadRes = await fetch(uploadLocation, {
    method: "PUT",
    headers: {
      "Content-Type": options.mimeType,
      "Content-Length": options.fileBuffer.length.toString(),
    },
    body: new Uint8Array(options.fileBuffer),
  });

  if (!uploadRes.ok) {
    const err = await uploadRes.text().catch(() => "");
    throw new Error(`Failed to upload video content to YouTube (${uploadRes.status}): ${err}`);
  }

  const resultData = await uploadRes.json();
  return {
    id: resultData.id,
    title: resultData.snippet?.title || options.title,
  };
}
