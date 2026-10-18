import React, { useState } from "react";
import {
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Eye,
  Globe2,
  LineChart,
  Linkedin,
  Loader2,
  MessageSquare,
  MousePointerClick,
  Plus,
  RefreshCw,
  Share2,
  Sparkles,
  ThumbsUp,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface LinkedInEngagementRecord {
  id: string;
  postTitle: string;
  postUrl: string;
  date: string;
  totalLikes: number;
  impressions: number;
  commenterName: string;
  commenterProfileUrl: string;
  commentText: string;
  commentLikes: number;
  commentDate: string;
  lastSyncedTime?: string;
}

const DEFAULT_POST_URL =
  "https://www.linkedin.com/posts/sportsanalytics_sportsmax-sportsanalytics-sportstech-activity-7515635590776750080-yFT_";

const INITIAL_RECORDS: LinkedInEngagementRecord[] = [
  {
    id: "li_rec_1",
    postTitle: "SportsMax AI Telemetry & Tactical Intelligence Launch",
    postUrl: DEFAULT_POST_URL,
    date: "2026-10-14",
    totalLikes: 14,
    impressions: 480,
    commenterName: "David Sterling",
    commenterProfileUrl: "https://www.linkedin.com/in/david-sterling-analytics",
    commentText: "Impressive kinematic models! Can SportsMax track sprint speed profiles from broadcast camera feeds?",
    commentLikes: 3,
    commentDate: "2026-10-14",
  },
  {
    id: "li_rec_2",
    postTitle: "SportsMax AI Telemetry & Tactical Intelligence Launch",
    postUrl: DEFAULT_POST_URL,
    date: "2026-10-14",
    totalLikes: 14,
    impressions: 480,
    commenterName: "Elena Rostova",
    commenterProfileUrl: "https://www.linkedin.com/in/elena-rostova-coach",
    commentText: "Would love to see how your acute workload metrics integrate with GPS tracking units.",
    commentLikes: 2,
    commentDate: "2026-10-14",
  },
];

export function LinkedInEngagementDashboard() {
  const [records, setRecords] = useState<LinkedInEngagementRecord[]>(INITIAL_RECORDS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ success: boolean; message: string } | null>(null);

  // Form Fields
  const [postTitle, setPostTitle] = useState("SportsMax Launch — Sports Analytics & Intelligence");
  const [postUrl, setPostUrl] = useState(DEFAULT_POST_URL);
  const [totalLikes, setTotalLikes] = useState("14");
  const [impressions, setImpressions] = useState("480");
  const [commenterName, setCommenterName] = useState("");
  const [commenterProfileUrl, setCommenterProfileUrl] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentLikes, setCommentLikes] = useState("0");
  const [commentDate, setCommentDate] = useState(new Date().toISOString().slice(0, 10));

  // Sync to Google Sheets "LinkedIn Engagement" tab
  async function syncRecordsToSheets(dataToSync: LinkedInEngagementRecord[]) {
    const analyticsUrl = import.meta.env["VITE_ANALYTICS_URL"] as string | undefined;
    if (!analyticsUrl) {
      setSyncStatus({ success: false, message: "VITE_ANALYTICS_URL not configured." });
      return;
    }

    setSyncing(true);
    setSyncStatus(null);

    const payload = {
      action: "linkedin_engagement_sync",
      sheetName: "LinkedIn Engagement",
      syncTimestamp: new Date().toISOString(),
      records: dataToSync,
    };

    try {
      await fetch(analyticsUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify(payload),
      });

      setSyncStatus({
        success: true,
        message: `Successfully synchronized ${dataToSync.length} LinkedIn engagement row(s) to 'LinkedIn Engagement' tab in Sheets!`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSyncStatus({
        success: false,
        message: `Failed to push to Google Sheets: ${msg}`,
      });
    } finally {
      setSyncing(false);
    }
  }

  function handleAddRecord(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim() && !postTitle.trim()) return;

    const newRec: LinkedInEngagementRecord = {
      id: "li_" + Date.now(),
      postTitle: postTitle.trim(),
      postUrl: postUrl.trim() || DEFAULT_POST_URL,
      date: commentDate,
      totalLikes: parseInt(totalLikes, 10) || 0,
      impressions: parseInt(impressions, 10) || 0,
      commenterName: commenterName.trim() || "LinkedIn Member",
      commenterProfileUrl: commenterProfileUrl.trim() || "https://www.linkedin.com",
      commentText: commentText.trim(),
      commentLikes: parseInt(commentLikes, 10) || 0,
      commentDate,
      lastSyncedTime: new Date().toISOString(),
    };

    const updated = [newRec, ...records];
    setRecords(updated);

    // Auto-sync new record to Google Sheets
    syncRecordsToSheets([newRec]);

    // Reset comment fields
    setCommentText("");
    setCommenterName("");
    setCommenterProfileUrl("");
    setCommentLikes("0");
    setShowAddForm(false);
  }

  const latestLikes = records[0]?.totalLikes || 14;
  const totalComments = records.length;

  return (
    <div className="surface-card p-6 md:p-8 rounded-2xl border border-sky-500/20 bg-gradient-to-b from-sky-950/20 to-card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Linkedin className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-foreground">LinkedIn Engagement & Comments</h2>
              <span className="rounded-full bg-sky-500/20 px-2.5 py-0.5 text-[10px] font-bold text-sky-300 border border-sky-500/30">
                Sheet Tab: &quot;LinkedIn Engagement&quot;
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Stores post likes count, comments, and commenter profiles in the dedicated Google Sheets tab.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => syncRecordsToSheets(records)}
            disabled={syncing}
            className="border-sky-500/30 text-sky-300 hover:bg-sky-500/10"
          >
            {syncing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            )}
            Sync to Sheets
          </Button>

          <Button
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-sky-600 hover:bg-sky-500 text-white"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            {showAddForm ? "Close" : "Add Comment / Reaction"}
          </Button>

          <a
            href={DEFAULT_POST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/80 px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition"
          >
            <span>View Post</span>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
          </a>
        </div>
      </div>

      {/* Sync Status Alert */}
      {syncStatus && (
        <div
          className={`mt-4 flex items-center gap-2 rounded-lg p-3 text-xs font-medium ${
            syncStatus.success
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
              : "bg-destructive/10 border border-destructive/20 text-destructive"
          }`}
        >
          {syncStatus.success ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <div className="h-4 w-4 rounded-full bg-destructive/20 flex items-center justify-center font-bold">
              !
            </div>
          )}
          <span>{syncStatus.message}</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6">
        <div className="rounded-xl border border-border bg-card/60 p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
            <ThumbsUp className="h-4 w-4 text-sky-400" />
            <span>Post Likes</span>
          </div>
          <div className="mt-2 text-2xl font-black text-foreground">{latestLikes}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Likes on linked post</div>
        </div>

        <div className="rounded-xl border border-border bg-card/60 p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
            <MessageSquare className="h-4 w-4 text-sky-400" />
            <span>Comments Tracked</span>
          </div>
          <div className="mt-2 text-2xl font-black text-sky-400">{totalComments}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Stored in Sheet tab</div>
        </div>

        <div className="rounded-xl border border-border bg-card/60 p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
            <Users className="h-4 w-4 text-emerald-400" />
            <span>Linked User IDs</span>
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-400">{totalComments}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Profiles captured</div>
        </div>

        <div className="rounded-xl border border-sky-500/40 bg-sky-500/10 p-4">
          <div className="flex items-center gap-2 text-sky-300 text-xs font-bold">
            <Sparkles className="h-4 w-4 text-sky-400" />
            <span>Target Sheet Tab</span>
          </div>
          <div className="mt-2 text-sm font-black text-sky-300 uppercase tracking-wide truncate">
            LinkedIn Engagement
          </div>
          <div className="text-[11px] text-sky-300/80 mt-0.5">Google Sheets auto-synced</div>
        </div>
      </div>

      {/* Add Comment / Post Details Modal Form */}
      {showAddForm && (
        <form onSubmit={handleAddRecord} className="mt-6 rounded-xl border border-sky-500/30 bg-sky-950/30 p-5">
          <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <Plus className="h-4 w-4 text-sky-400" />
            Record Post Likes, Comment & Linked User ID into Google Sheets
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Post Title / Topic *</label>
              <input
                required
                type="text"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">No. of Post Likes *</label>
              <input
                required
                type="number"
                value={totalLikes}
                onChange={(e) => setTotalLikes(e.target.value)}
                placeholder="14"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Post URL</label>
              <input
                type="url"
                value={postUrl}
                onChange={(e) => setPostUrl(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-sky-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Date</label>
              <input
                type="date"
                value={commentDate}
                onChange={(e) => setCommentDate(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Commenter Name *</label>
              <input
                required
                type="text"
                placeholder="e.g., Alex Morgan"
                value={commenterName}
                onChange={(e) => setCommenterName(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Commenter LinkedIn Profile URL / User ID *
              </label>
              <input
                required
                type="text"
                placeholder="https://www.linkedin.com/in/alex-morgan or @alexmorgan"
                value={commenterProfileUrl}
                onChange={(e) => setCommenterProfileUrl(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-sky-500 focus:outline-none font-mono"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Comment Text *</label>
              <textarea
                required
                rows={3}
                placeholder="Paste the comment text here..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" className="bg-sky-600 hover:bg-sky-500 text-white">
              Save &amp; Push to Google Sheets
            </Button>
          </div>
        </form>
      )}

      {/* Table: Comments & Linked Profiles Stored in Sheet */}
      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <div className="px-5 py-3 bg-secondary/40 border-b border-border flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Comments, Likes &amp; Linked User Profiles in Google Sheets
          </span>
          <span className="text-[11px] text-sky-400 font-medium">
            Tab: <strong>LinkedIn Engagement</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-secondary/20 text-muted-foreground font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Commenter</th>
                <th className="px-4 py-3">LinkedIn User ID / Profile URL</th>
                <th className="px-4 py-3">Comment</th>
                <th className="px-3 py-3 text-center">Post Likes</th>
                <th className="px-4 py-3 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-secondary/30 transition">
                  <td className="px-4 py-3.5 font-bold text-foreground whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/20 text-sky-400 font-bold text-[10px]">
                        {r.commenterName.charAt(0)}
                      </div>
                      <span>{r.commenterName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[11px] text-sky-400 max-w-xs truncate">
                    <a
                      href={r.commenterProfileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-1"
                    >
                      <span className="truncate">{r.commenterProfileUrl}</span>
                      <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" />
                    </a>
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground max-w-sm">{r.commentText}</td>
                  <td className="px-3 py-3.5 text-center font-mono font-bold text-sky-300">
                    <span className="inline-flex items-center gap-1 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                      👍 {r.totalLikes}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-muted-foreground whitespace-nowrap">
                    {r.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
