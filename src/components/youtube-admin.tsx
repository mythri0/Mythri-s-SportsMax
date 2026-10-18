import { useState, useEffect } from "react";
import {
  Youtube,
  Lock,
  LogOut,
  RefreshCw,
  Eye,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";

interface ChannelInfo {
  id: string;
  title: string;
  description: string;
  customUrl?: string;
  subscriberCount?: string;
  videoCount?: string;
  viewCount?: string;
  thumbnailUrl?: string;
}

interface VideoItem {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl?: string;
}

export function YouTubeAdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Channel & Video state
  const [channel, setChannel] = useState<ChannelInfo | null>(null);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [syncingEngagement, setSyncingEngagement] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Check auth and channel info on mount
  useEffect(() => {
    checkChannelStatus();
  }, []);

  const checkChannelStatus = async () => {
    setLoadingData(true);
    try {
      const res = await fetch("/api/youtube/channel");
      if (res.status === 401) {
        setIsAuthenticated(false);
        setChannel(null);
        return;
      }

      setIsAuthenticated(true);
      const data = await res.json();
      if (data.connected && data.channel) {
        setChannel(data.channel);
        loadVideos();
      } else {
        setChannel(null);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setLoadingData(false);
    }
  };

  const loadVideos = async () => {
    try {
      const res = await fetch("/api/youtube/videos");
      if (res.ok) {
        const data = await res.json();
        setVideos(data.videos || []);
      }
    } catch {
      // ignore
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await fetch("/api/youtube/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setLoginError(data.error || "Invalid administrator credentials");
      } else {
        setIsAuthenticated(true);
        setPassword("");
        checkChannelStatus();
      }
    } catch {
      setLoginError("Failed to authenticate with server");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/youtube/auth/logout", { method: "POST" });
    } finally {
      setIsAuthenticated(false);
      setChannel(null);
      setVideos([]);
    }
  };

  const handleSyncEngagement = async () => {
    setSyncingEngagement(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/youtube/engagement/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setStatusMessage({
          type: "error",
          text: data.error || "Failed to sync YouTube engagement to Google Sheets.",
        });
      } else {
        const commentMsg =
          typeof data.totalCommentsCollected === "number"
            ? `${data.totalCommentsCollected} comments`
            : "comments";
        const videoMsg = `${data.videosProcessed || 0} videos`;
        setStatusMessage({
          type: "success",
          text: `Engagement synchronized to Google Sheets ("YouTube Engagement" tab)! Processed ${videoMsg} and synced ${commentMsg}.`,
        });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Network error occurred while syncing engagement data.",
      });
    } finally {
      setSyncingEngagement(false);
    }
  };

  // Login view if not authenticated
  if (isAuthenticated === false) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600/10 text-red-500 ring-1 ring-red-500/20 mb-4">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-white">YouTube Automation Access</h2>
          <p className="text-xs text-slate-400 mt-1">
            Server-side authentication required. Enter your admin key to manage YouTube channels and video publishing.
          </p>
        </div>

        {loginError && (
          <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-950/20 p-3 text-xs text-red-400 mb-4">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{loginError}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Admin Secret</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••••••"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>

          <button
            type="submit"
            disabled={loginLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-500 disabled:opacity-50"
          >
            {loginLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Access Dashboard"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header / Channel Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          {channel?.thumbnailUrl ? (
            <img
              src={channel.thumbnailUrl}
              alt={channel.title}
              className="h-14 w-14 rounded-full border border-slate-700 object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600/10 text-red-500 ring-1 ring-red-500/20">
              <Youtube className="h-7 w-7" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">
                {channel ? channel.title : "YouTube Channel Not Connected"}
              </h2>
              {channel && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/60 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400 ring-1 ring-emerald-500/20">
                  <CheckCircle2 className="h-3 w-3" /> Connected
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {channel
                ? `${channel.subscriberCount || "0"} Subscribers • ${channel.videoCount || "0"} Videos • ${channel.viewCount || "0"} Views`
                : "Authorize your Google account to connect your official YouTube channel"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {channel ? (
            <>
              <button
                onClick={handleSyncEngagement}
                disabled={syncingEngagement || loadingData}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 disabled:opacity-50 transition-all"
                title="Sync video view counts, likes, and public comments to Google Sheets"
              >
                {syncingEngagement ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
                {syncingEngagement ? "Syncing to Sheets..." : "Sync Engagement to Sheets"}
              </button>

              <button
                onClick={checkChannelStatus}
                disabled={loadingData || syncingEngagement}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loadingData ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </>
          ) : (
            <a
              href="/api/youtube/oauth/start"
              className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-red-600/20 hover:bg-red-500"
            >
              <Youtube className="h-4 w-4" />
              Connect YouTube Channel
            </a>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-medium text-slate-400 hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`flex items-center gap-2 rounded-xl border p-4 text-xs ${
            statusMessage.type === "success"
              ? "border-emerald-500/20 bg-emerald-950/20 text-emerald-400"
              : "border-red-500/20 bg-red-950/20 text-red-400"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Main Content: Recent Videos & Direct Upload Notice */}
      <div className="space-y-6">
        {/* Recent Uploads from YouTube Studio */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2.5">
              <Eye className="h-5 w-5 text-red-400" />
              <div>
                <h3 className="text-lg font-bold text-white">Channel Videos</h3>
                <p className="text-xs text-slate-400">
                  Videos uploaded directly via YouTube Studio appear here automatically.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
                {videos.length} videos loaded
              </span>
              <a
                href="https://studio.youtube.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-red-600/10 border border-red-500/20 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-600/20 transition-colors"
              >
                <span>Open YouTube Studio</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {videos.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-10 text-center text-xs text-slate-400">
              No videos found or channel not yet linked. Once linked, public and unlisted uploads from YouTube Studio will display here.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[560px] overflow-y-auto pr-1">
              {videos.map((vid) => (
                <div
                  key={vid.id}
                  className="flex flex-col justify-between rounded-xl border border-slate-800/80 bg-slate-800/50 p-3.5 transition-colors hover:border-slate-700"
                >
                  <div>
                    {vid.thumbnailUrl ? (
                      <img
                        src={vid.thumbnailUrl}
                        alt={vid.title}
                        className="w-full aspect-video rounded-lg object-cover border border-slate-700/50 mb-3"
                      />
                    ) : (
                      <div className="flex w-full aspect-video items-center justify-center rounded-lg bg-slate-800 text-slate-600 mb-3">
                        <Youtube className="h-8 w-8" />
                      </div>
                    )}
                    <h4 className="text-xs font-semibold text-white line-clamp-2" title={vid.title}>
                      {vid.title}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-800 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      {vid.publishedAt ? new Date(vid.publishedAt).toLocaleDateString() : ""}
                    </span>
                    <a
                      href={`https://www.youtube.com/watch?v=${vid.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 text-slate-400 hover:text-white transition-colors"
                      title="Watch on YouTube"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
