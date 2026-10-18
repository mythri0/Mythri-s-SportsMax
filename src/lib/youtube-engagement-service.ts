import { getValidAccessToken } from "./youtube-service.ts";

export interface YouTubeCommentItem {
  commentId: string;
  videoId: string;
  videoTitle: string;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  commentText: string;
  commenterDisplayName: string;
  commenterChannelId: string;
  commentLikes: number;
  commentDate: string;
  commentUrl: string;
  lastSyncedTime: string;
}

export interface VideoEngagementSummary {
  videoId: string;
  videoTitle: string;
  views: number;
  likes: number;
  commentsCount: number;
  comments: YouTubeCommentItem[];
}

export interface SyncEngagementResult {
  success: boolean;
  videosProcessed: number;
  totalCommentsCollected: number;
  sheetsRecorded: boolean;
  sheetsError?: string | undefined;
  summary: {
    totalViews: number;
    totalLikes: number;
    totalComments: number;
  };
  error?: string | undefined;
}

/**
 * Fetches the authenticated channel's uploaded video playlist and video statistics.
 */
export async function fetchChannelVideosWithStats(): Promise<
  Array<{
    videoId: string;
    title: string;
    views: number;
    likes: number;
    commentsCount: number;
  }>
> {
  const accessToken = await getValidAccessToken();

  // 1. Get the channel's "Uploads" playlist ID via channels.list(mine=true, part=contentDetails)
  const channelRes = await fetch(
    "https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    }
  );

  if (!channelRes.ok) {
    const errText = await channelRes.text().catch(() => "");
    throw new Error(`Failed to fetch channel uploads playlist (${channelRes.status}): ${errText}`);
  }

  const channelData = await channelRes.json();
  const uploadsPlaylistId =
    channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

  if (!uploadsPlaylistId) {
    throw new Error("No uploads playlist found for this YouTube channel.");
  }

  // 2. Fetch up to 50 videos from the uploads playlist
  const playlistItemsRes = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=50`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    }
  );

  if (!playlistItemsRes.ok) {
    const errText = await playlistItemsRes.text().catch(() => "");
    throw new Error(`Failed to list playlist items (${playlistItemsRes.status}): ${errText}`);
  }

  const playlistData = await playlistItemsRes.json();
  const playlistItems = playlistData.items || [];
  if (playlistItems.length === 0) {
    return [];
  }

  const videoIds = playlistItems
    .map((item: any) => item.contentDetails?.videoId)
    .filter(Boolean)
    .join(",");

  if (!videoIds) return [];

  // 3. Batch fetch video snippet & statistics via videos.list
  const videosRes = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    }
  );

  if (!videosRes.ok) {
    const errText = await videosRes.text().catch(() => "");
    throw new Error(`Failed to retrieve video statistics (${videosRes.status}): ${errText}`);
  }

  const videosData = await videosRes.json();
  return (videosData.items || []).map((v: any) => ({
    videoId: v.id,
    title: v.snippet?.title || "Untitled Video",
    views: parseInt(v.statistics?.viewCount || "0", 10),
    likes: parseInt(v.statistics?.likeCount || "0", 10),
    commentsCount: parseInt(v.statistics?.commentCount || "0", 10),
  }));
}

/**
 * Fetches top-level comments for a given video using commentThreads.list.
 * If comments are disabled for a video, returns an empty array safely.
 */
export async function fetchVideoComments(
  videoId: string,
  videoTitle: string,
  views: number,
  likes: number,
  commentsCount: number,
  syncTimestamp: string
): Promise<YouTubeCommentItem[]> {
  const accessToken = await getValidAccessToken();
  const comments: YouTubeCommentItem[] = [];

  try {
    const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=100&textFormat=plainText&order=time`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      // YouTube returns 403 with reason 'commentsDisabled' if comments are off on the video
      if (res.status === 403 && errText.includes("commentsDisabled")) {
        console.info(`[YouTube Engagement] Comments are disabled for video: ${videoId}`);
        return [];
      }
      console.warn(`[YouTube Engagement] Could not fetch comments for video ${videoId} (${res.status}):`, errText);
      return [];
    }

    const data = await res.json();
    const items = data.items || [];

    for (const item of items) {
      const topComment = item.snippet?.topLevelComment?.snippet;
      if (!topComment) continue;

      const commentId = item.snippet?.topLevelComment?.id || item.id;
      const commenterChannelId =
        topComment.authorChannelUrl || topComment.authorChannelId?.value || "";

      comments.push({
        commentId,
        videoId,
        videoTitle,
        totalViews: views,
        totalLikes: likes,
        totalComments: commentsCount,
        commentText: topComment.textDisplay || topComment.textOriginal || "",
        commenterDisplayName: topComment.authorDisplayName || "Anonymous",
        commenterChannelId,
        commentLikes: topComment.likeCount || 0,
        commentDate: topComment.publishedAt || new Date().toISOString(),
        commentUrl: `https://www.youtube.com/watch?v=${videoId}&lc=${commentId}`,
        lastSyncedTime: syncTimestamp,
      });
    }
  } catch (err) {
    console.warn(`[YouTube Engagement] Error fetching comments for ${videoId}:`, err);
  }

  return comments;
}

/**
 * Sends YouTube engagement rows to Google Apps Script / Google Sheets.
 * Dispatched to the dedicated "YouTube Engagement" tab.
 * Deduplicates / updates by commentId.
 */
export async function syncEngagementToGoogleSheets(
  records: YouTubeCommentItem[],
  videoSummaries: Array<{
    videoId: string;
    videoTitle: string;
    views: number;
    likes: number;
    commentsCount: number;
    lastSyncedTime: string;
  }>
): Promise<{ success: boolean; error?: string }> {
  const analyticsUrl = process.env["VITE_ANALYTICS_URL"];
  if (!analyticsUrl) {
    return {
      success: false,
      error: "VITE_ANALYTICS_URL is not configured on the server.",
    };
  }

  const payload = {
    action: "youtube_engagement_sync",
    sheetName: "YouTube Engagement",
    syncTimestamp: new Date().toISOString(),
    records,
    videoSummaries,
  };

  try {
    const res = await fetch(analyticsUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return {
        success: false,
        error: `Google Sheets Apps Script responded with HTTP ${res.status}: ${errText}`,
      };
    }

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: `Network error posting to Google Sheets: ${msg}` };
  }
}

/**
 * Orchestrates full YouTube channel engagement sync.
 * Collects video stats and public comments, then pushes strictly to Google Sheets.
 * NEVER writes to Airtable or Jira.
 */
export async function runYouTubeEngagementSync(): Promise<SyncEngagementResult> {
  const syncTimestamp = new Date().toISOString();

  // 1. Fetch channel videos with statistics
  const videos = await fetchChannelVideosWithStats();
  if (videos.length === 0) {
    return {
      success: true,
      videosProcessed: 0,
      totalCommentsCollected: 0,
      sheetsRecorded: true,
      summary: { totalViews: 0, totalLikes: 0, totalComments: 0 },
    };
  }

  let totalViews = 0;
  let totalLikes = 0;
  let totalComments = 0;
  const allComments: YouTubeCommentItem[] = [];
  const videoSummaries: Array<{
    videoId: string;
    videoTitle: string;
    views: number;
    likes: number;
    commentsCount: number;
    lastSyncedTime: string;
  }> = [];

  for (const v of videos) {
    totalViews += v.views;
    totalLikes += v.likes;
    totalComments += v.commentsCount;

    videoSummaries.push({
      videoId: v.videoId,
      videoTitle: v.title,
      views: v.views,
      likes: v.likes,
      commentsCount: v.commentsCount,
      lastSyncedTime: syncTimestamp,
    });

    // 2. Fetch comments for this video
    const videoComments = await fetchVideoComments(
      v.videoId,
      v.title,
      v.views,
      v.likes,
      v.commentsCount,
      syncTimestamp
    );

    if (videoComments.length > 0) {
      allComments.push(...videoComments);
    } else {
      // If video has no comments yet, record the video itself so metrics appear in the sheet
      allComments.push({
        commentId: `vid_${v.videoId}`,
        videoId: v.videoId,
        videoTitle: v.title,
        totalViews: v.views,
        totalLikes: v.likes,
        totalComments: v.commentsCount,
        commentText: "(No comments yet)",
        commenterDisplayName: "Channel Video",
        commenterChannelId: "",
        commentLikes: 0,
        commentDate: syncTimestamp,
        commentUrl: `https://www.youtube.com/watch?v=${v.videoId}`,
        lastSyncedTime: syncTimestamp,
      });
    }
  }

  // 3. Deduplicate comments in-memory by commentId
  const uniqueCommentsMap = new Map<string, YouTubeCommentItem>();
  for (const c of allComments) {
    uniqueCommentsMap.set(c.commentId, c);
  }
  const deduplicatedComments = Array.from(uniqueCommentsMap.values());

  // 4. Send directly to Google Sheets only
  const sheetsResult = await syncEngagementToGoogleSheets(
    deduplicatedComments,
    videoSummaries
  );

  return {
    success: true,
    videosProcessed: videos.length,
    totalCommentsCollected: deduplicatedComments.length,
    sheetsRecorded: sheetsResult.success,
    sheetsError: sheetsResult.error,
    summary: {
      totalViews,
      totalLikes,
      totalComments,
    },
  };
}
