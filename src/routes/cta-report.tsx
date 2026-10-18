// IN27-43 — CTA REPORTS HUB
// Consolidated record of CTA Quick Form submissions, CTA Long Form submissions,
// supporting documents, Airtable reports, and Jira task-tracking information.
import React, { useState, useEffect, useCallback } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  FileText,
  Users,
  ClipboardList,
  BarChart3,
  TicketCheck,
  ExternalLink,
  RefreshCw,
  Download,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Loader2,
  WifiOff,
  Database,
  FolderOpen,
  Tag,
  Calendar,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/cta-report")({
  head: () => ({
    meta: [
      { title: "CTA Reports Hub — SportsMax" },
      {
        name: "description",
        content:
          "Consolidated CTA Reports hub: Quick Form submissions, Long Form contact leads, supporting documents, Airtable reports, and Jira task-tracking records for SportsMax.",
      },
      { property: "og:title", content: "CTA Reports Hub — SportsMax" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/cta-report" }],
  }),
  component: CTAReportHubPage,
});

// ─── Types ────────────────────────────────────────────────────────────────────

interface JiraIssue {
  id: string;
  key: string;
  summary: string;
  status: string;
  statusColor: string;
  assignee: string | null;
  priority: string | null;
  issueType: string;
  created: string;
  updated: string;
  labels: string[];
  url: string;
}

interface JiraResult {
  total: number;
  startAt: number;
  issues: JiraIssue[];
  error?: string;
}

interface SheetsDashboard {
  connected: boolean;
  data?: {
    totalVisitors?: number;
    pageViews?: number;
    totalEvents?: number;
    contactSubmissions?: number;
  };
  error?: string;
}

type LoadState = "idle" | "loading" | "success" | "error";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRelativeDate(iso: string): string {
  try {
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 30) return `${days}d ago`;
    if (days < 365) return `${Math.floor(days / 30)}mo ago`;
    return `${Math.floor(days / 365)}y ago`;
  } catch {
    return iso;
  }
}

function jiraStatusColor(colorName: string): string {
  switch (colorName) {
    case "blue-grey": return "bg-slate-500/10 text-slate-400 border-slate-500/30";
    case "yellow":    return "bg-amber-500/10 text-amber-500 border-amber-500/30";
    case "green":     return "bg-emerald-500/10 text-emerald-500 border-emerald-500/30";
    case "blue":      return "bg-primary/10 text-primary border-primary/30";
    case "red":       return "bg-rose-500/10 text-rose-500 border-rose-500/30";
    default:          return "bg-secondary text-muted-foreground border-border";
  }
}

function priorityIcon(priority: string | null): string {
  if (priority === "Highest" || priority === "High") return "🔴";
  if (priority === "Medium") return "🟡";
  if (priority === "Low" || priority === "Lowest") return "🟢";
  return "⚪";
}

// ─── Section Shell ─────────────────────────────────────────────────────────────

function SectionShell({
  id,
  icon: Icon,
  title,
  badge,
  badgeColor = "primary",
  children,
  collapsible = false,
}: {
  id: string;
  icon: React.ElementType;
  title: string;
  badge?: string;
  badgeColor?: "primary" | "emerald" | "amber" | "rose" | "slate";
  children: React.ReactNode;
  collapsible?: boolean;
}) {
  const [open, setOpen] = useState(true);
  const badgeClass =
    badgeColor === "emerald" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30" :
    badgeColor === "amber"   ? "bg-amber-500/10 text-amber-500 border-amber-500/30" :
    badgeColor === "rose"    ? "bg-rose-500/10 text-rose-500 border-rose-500/30" :
    badgeColor === "slate"   ? "bg-slate-500/10 text-slate-400 border-slate-500/30" :
                               "bg-primary/10 text-primary border-primary/30";

  return (
    <div id={id} className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <div
        className={`flex items-center justify-between gap-3 px-6 py-5 border-b border-border${collapsible ? " cursor-pointer select-none hover:bg-secondary/40 transition" : ""}`}
        onClick={collapsible ? () => setOpen((o) => !o) : undefined}
      >
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </div>
          <h2 className="text-base font-bold text-foreground">{title}</h2>
          {badge && (
            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${badgeClass}`}>
              {badge}
            </span>
          )}
        </div>
        {collapsible && (
          <span className="text-muted-foreground">
            {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </span>
        )}
      </div>
      {open && <div className="p-6">{children}</div>}
    </div>
  );
}

// ─── Shared UI States ──────────────────────────────────────────────────────────

function LoadingState({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-2.5 py-10 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin text-primary" />
      {label}
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <AlertTriangle className="h-8 w-8 text-amber-500" />
      <p className="text-sm text-muted-foreground max-w-md">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
          <RefreshCw className="h-3 w-3" /> Retry
        </button>
      )}
    </div>
  );
}

function NotConnectedState({ source, detail }: { source: string; detail?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <WifiOff className="h-8 w-8 text-muted-foreground/50" />
      <div>
        <p className="text-sm font-semibold text-foreground">{source} — Not Connected</p>
        {detail && <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">{detail}</p>}
      </div>
    </div>
  );
}

// ─── Section: CTA Quick Form Submissions ──────────────────────────────────────

function QuickFormSection({ sheetsData, sheetsState }: { sheetsData: SheetsDashboard | null; sheetsState: LoadState }) {
  const events = sheetsData?.data?.totalEvents;
  const pageViews = sheetsData?.data?.pageViews;
  const visitors = sheetsData?.data?.totalVisitors;

  return (
    <SectionShell id="cta-quick-form" icon={BarChart3} title="CTA Quick Form Submissions" badge="Google Sheets" badgeColor="emerald" collapsible>
      <div className="space-y-4">
        <div className="flex items-start gap-2.5 rounded-xl border border-border bg-secondary/30 p-3.5">
          <Info className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            CTA Quick Form captures are automatic analytics events (page views, CTA impressions, assistant interactions)
            recorded via the Google Apps Script endpoint into the <strong className="text-foreground">Analytics_Events</strong> sheet.
            They require no manual form fill. The totals below reflect live data from Google Sheets.
          </p>
        </div>
        {sheetsState === "loading" && <LoadingState label="Loading Google Sheets data…" />}
        {sheetsState === "error" && (
          <ErrorState message="Could not reach the Google Sheets dashboard endpoint. Check that VITE_ANALYTICS_URL is configured." />
        )}
        {sheetsState === "success" && sheetsData && (
          <>
            {sheetsData.connected ? (
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Total Events Captured", value: events?.toLocaleString() ?? "–", icon: BarChart3, note: "Analytics_Events tab" },
                  { label: "Total Page Views", value: pageViews?.toLocaleString() ?? "–", icon: FileText, note: "Recorded automatically" },
                  { label: "Unique Visitors", value: visitors?.toLocaleString() ?? "–", icon: Users, note: "Distinct visitor IDs" },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl border border-border bg-background p-4 flex flex-col gap-2">
                    <m.icon className="h-4 w-4 text-primary" />
                    <div className="text-2xl font-black text-foreground">{m.value}</div>
                    <div className="text-xs font-semibold text-foreground">{m.label}</div>
                    <div className="text-[11px] text-muted-foreground">{m.note}</div>
                  </div>
                ))}
              </div>
            ) : (
              <NotConnectedState
                source="Google Sheets"
                detail={sheetsData.error ?? "The Google Apps Script endpoint did not respond. Verify VITE_ANALYTICS_URL."}
              />
            )}
          </>
        )}
        <div className="flex items-center gap-2 pt-1">
          <Link to="/website-analytics" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
            View Full Analytics Report <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <span className="text-muted-foreground text-xs">·</span>
          <Link to="/analytics" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
            Analytics Suite <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </SectionShell>
  );
}

// ─── Section: CTA Long Form Submissions ───────────────────────────────────────

function LongFormSection({ sheetsData, sheetsState }: { sheetsData: SheetsDashboard | null; sheetsState: LoadState }) {
  const submissions = sheetsData?.data?.contactSubmissions;

  return (
    <SectionShell id="cta-long-form" icon={ClipboardList} title="CTA Long Form Submissions (Contact Leads)" badge="Google Sheets" badgeColor="emerald" collapsible>
      <div className="space-y-4">
        <div className="flex items-start gap-2.5 rounded-xl border border-border bg-secondary/30 p-3.5">
          <Info className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            CTA Long Form submissions are contact inquiries filled via the{" "}
            <strong className="text-foreground">Connect with SportsMax</strong> form (Name, Email, Organisation, Sport, Requirement).
            Each submission lands in the <strong className="text-foreground">Contact_Leads</strong> tab with a unique{" "}
            <code className="font-mono text-[11px] bg-secondary px-1 rounded">LD-xxxxxx</code> lead number.
            Individual records are not shown here to protect personal data; use Google Sheets directly to review leads.
          </p>
        </div>
        {sheetsState === "loading" && <LoadingState label="Loading submission counts…" />}
        {sheetsState === "error" && <ErrorState message="Could not reach the Google Sheets dashboard endpoint." />}
        {sheetsState === "success" && sheetsData && (
          <>
            {sheetsData.connected ? (
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 rounded-xl border border-border bg-background p-5 flex flex-col gap-2">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  <div className="text-3xl font-black text-foreground">{submissions?.toLocaleString() ?? "–"}</div>
                  <div className="text-xs font-semibold text-foreground">Contact Lead Submissions</div>
                  <div className="text-[11px] text-muted-foreground">Stored in Contact_Leads tab · Each row has a LD-xxxxxx lead number</div>
                </div>
                <div className="flex-1 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 flex flex-col gap-2">
                  <div className="text-xs font-semibold text-foreground">What is captured per lead:</div>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {["Lead Number (LD-xxxxxx)", "Full Name & Work Email", "Role & Organisation", "Sport(s) of interest", "Analytics Requirement", "Phone (if provided)", "Additional Details", "Timestamp & Visitor ID"].map((f) => (
                      <li key={f} className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <a href="/contact" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                    View Contact Page <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ) : (
              <NotConnectedState source="Google Sheets" detail={sheetsData.error ?? "The Apps Script endpoint did not respond."} />
            )}
          </>
        )}
      </div>
    </SectionShell>
  );
}

// ─── Section: Supporting Documents ────────────────────────────────────────────

const SUPPORTING_DOCS = [
  { id: "doc-website-analytics", title: "Website Analytics Report", description: "Sessions, page views, traffic sources, device breakdown, and geographic data.", type: "Live Report", route: "/website-analytics" },
  { id: "doc-google-trends", title: "Google Trends Embed", description: "Sports keyword trend data via the Google Trends explorer for selected sport categories.", type: "Live Embed", route: "/google-trends" },
  { id: "doc-reports", title: "Automated Report Schedule", description: "Daily, weekly, and monthly report trigger configuration, execution history, and delivery status log.", type: "Server Report", route: "/reports" },
  { id: "doc-institution", title: "Institution Intelligence Hub", description: "School and college sports analytics hierarchy: student records, coach dashboards, and video drill submissions.", type: "Module", route: "/institution" },
  { id: "doc-run-analytics", title: "Athlete Run Analytics", description: "GPS pace models, stride metrics, VO2 max estimations, and workload ratio charts for individual athletes.", type: "Analytics", route: "/run-analytics" },
  { id: "doc-cta-report", title: "CTA Reports Hub", description: "This consolidated hub: CTA Quick Form events, Long Form leads, Airtable (pending), and Jira task tracking.", type: "This Page", route: null },
] as const;

type SupportingDoc = (typeof SUPPORTING_DOCS)[number];

function DocumentsSection() {
  return (
    <SectionShell id="supporting-docs" icon={FolderOpen} title="Supporting Documents" badge="Internal" collapsible>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SUPPORTING_DOCS.map((doc: SupportingDoc) => (
          <div key={doc.id} className="rounded-xl border border-border bg-background p-4 flex flex-col gap-2.5 hover:border-primary/30 transition group">
            <div className="flex items-start justify-between gap-2">
              <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase text-muted-foreground tracking-wide">{doc.type}</span>
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><Clock className="h-3 w-3" /> Live</span>
            </div>
            <div>
              <div className="text-sm font-bold text-foreground">{doc.title}</div>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{doc.description}</p>
            </div>
            {doc.route ? (
              <Link to={doc.route} className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:underline">
                Open <ArrowRight className="h-3 w-3" />
              </Link>
            ) : (
              <span className="mt-auto text-xs text-muted-foreground italic">Current page</span>
            )}
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

// ─── Section: Airtable Reports ────────────────────────────────────────────────

function AirtableSection() {
  return (
    <SectionShell id="airtable-reports" icon={Database} title="Airtable Reports" badge="Not Connected" badgeColor="slate" collapsible>
      <NotConnectedState
        source="Airtable"
        detail="No Airtable Personal Access Token (AIRTABLE_TOKEN) or Base ID (AIRTABLE_BASE_ID) is configured. To connect, add those server-side variables and implement an /api/airtable/records endpoint."
      />
      <div className="mt-4 rounded-xl border border-border bg-secondary/30 p-4 text-xs text-muted-foreground space-y-1.5">
        <div className="font-semibold text-foreground mb-1">Required server-side configuration:</div>
        {[
          "AIRTABLE_TOKEN — Personal Access Token from airtable.com/account",
          "AIRTABLE_BASE_ID — The base ID from your Airtable workspace URL",
          "AIRTABLE_TABLE_NAME — The specific table to query (e.g. CTA_Reports)",
        ].map((line) => (
          <div key={line} className="flex items-start gap-2">
            <span className="font-mono text-amber-500 shrink-0">→</span>
            <span>{line}</span>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

// ─── Section: Jira Issues ─────────────────────────────────────────────────────

const STATUS_OPTIONS = ["All", "To Do", "In Progress", "Done", "Blocked"] as const;
type StatusFilter = (typeof STATUS_OPTIONS)[number];

function JiraSection({ onDataLoaded }: { onDataLoaded?: (data: JiraResult | null) => void } = {}) {
  const [jiraData, setJiraData] = useState<JiraResult | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchJira = useCallback(async () => {
    setLoadState("loading");
    try {
      const params = new URLSearchParams({ maxResults: "100" });
      if (statusFilter !== "All") params.set("status", statusFilter);
      const res = await fetch(`/api/jira/issues?${params.toString()}`);
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        console.warn("[CTA Report] Non-JSON response received:", text.slice(0, 150));
        throw new Error(`Server returned non-JSON response (${res.status}). Verify API proxy registration.`);
      }
      const data = (await res.json()) as JiraResult;
      if (!res.ok || data.error) {
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      const safeData: JiraResult = {
        total: typeof data.total === "number" ? data.total : (Array.isArray(data.issues) ? data.issues.length : 0),
        startAt: data.startAt ?? 0,
        issues: Array.isArray(data.issues) ? data.issues : [],
      };
      setJiraData(safeData);
      setLoadState("success");
      onDataLoaded?.(safeData);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("[CTA Report] Jira fetch error:", errorMessage);
      const errorResult: JiraResult = { total: 0, startAt: 0, issues: [], error: errorMessage };
      setJiraData(errorResult);
      setLoadState("error");
      onDataLoaded?.(errorResult);
    }
  }, [statusFilter, onDataLoaded]);

  useEffect(() => { fetchJira(); }, [fetchJira]);

  const filtered = (jiraData?.issues ?? []).filter((issue) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      issue.key.toLowerCase().includes(q) ||
      issue.summary.toLowerCase().includes(q) ||
      (issue.assignee?.toLowerCase().includes(q) ?? false) ||
      issue.labels.some((l) => l.toLowerCase().includes(q))
    );
  });

  const exportCsv = () => {
    const headers = ["Key", "Summary", "Status", "Type", "Priority", "Assignee", "Created", "Updated", "URL"];
    const rows = filtered.map((i) => [i.key, `"${i.summary.replace(/"/g, '""')}"`, i.status, i.issueType, i.priority ?? "", i.assignee ?? "", i.created.split("T")[0], i.updated.split("T")[0], i.url]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sportsmax-jira-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const totalCount = typeof jiraData?.total === "number" ? jiraData.total : (jiraData?.issues?.length ?? 0);

  return (
    <SectionShell
      id="jira-reports"
      icon={TicketCheck}
      title="Jira Task Tracking"
      badge={loadState === "success" ? `${totalCount} issues` : loadState === "loading" ? "Loading…" : "Live"}
      collapsible
    >
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <input
              id="jira-search-input"
              type="text"
              placeholder="Search key, summary, assignee, label…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-background pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                id={`jira-filter-${s.replace(/\s+/g, "-").toLowerCase()}`}
                onClick={() => setStatusFilter(s)}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${statusFilter === s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
              >
                {s}
              </button>
            ))}
            {loadState === "success" && filtered.length > 0 && (
              <Button variant="outline" size="sm" className="gap-1.5 text-xs h-7" id="jira-export-btn" onClick={exportCsv}>
                <Download className="h-3 w-3" /> CSV
              </Button>
            )}
            <Button variant="outline" size="sm" className="gap-1.5 text-xs h-7" id="jira-refresh-btn" onClick={fetchJira} disabled={loadState === "loading"}>
              <RefreshCw className={`h-3 w-3 ${loadState === "loading" ? "animate-spin" : ""}`} />
              {loadState === "loading" ? "Loading…" : "Refresh"}
            </Button>
          </div>
        </div>

        {loadState === "loading" && <LoadingState label="Fetching Jira issues from KAN project…" />}
        {loadState === "error" && (
          <ErrorState
            message={jiraData?.error ?? "Could not fetch Jira issues. Check that JIRA_DOMAIN, JIRA_EMAIL, and JIRA_API_TOKEN are configured on the server."}
            onRetry={fetchJira}
          />
        )}

        {loadState === "success" && (
          <>
            {filtered.length === 0 ? (
              <div className="py-10 text-center text-sm text-muted-foreground">
                {search ? `No issues match "${search}".` : "No issues found in the KAN project."}
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full text-left text-xs">
                  <thead className="bg-secondary/70 text-muted-foreground font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Key</th>
                      <th className="px-4 py-3">Summary</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 hidden sm:table-cell">Type</th>
                      <th className="px-4 py-3 hidden md:table-cell">Assignee</th>
                      <th className="px-4 py-3 hidden lg:table-cell text-right">Updated</th>
                      <th className="px-4 py-3 w-8" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filtered.map((issue) => (
                      <React.Fragment key={issue.id}>
                        <tr
                          className="hover:bg-secondary/30 transition cursor-pointer"
                          onClick={() => setExpanded((e) => (e === issue.id ? null : issue.id))}
                        >
                          <td className="px-4 py-3 font-mono font-bold text-primary whitespace-nowrap">
                            <a
                              href={issue.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="hover:underline flex items-center gap-1"
                            >
                              {issue.key} <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                            </a>
                          </td>
                          <td className="px-4 py-3 max-w-[240px]">
                            <span className="line-clamp-2 text-foreground">{issue.summary}</span>
                            {issue.labels.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {issue.labels.slice(0, 3).map((l) => (
                                  <span key={l} className="flex items-center gap-0.5 rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
                                    <Tag className="h-2.5 w-2.5" /> {l}
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${jiraStatusColor(issue.statusColor)}`}>
                              {issue.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">{issue.issueType}</td>
                          <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                            {issue.assignee ?? <span className="italic opacity-50">Unassigned</span>}
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell text-right text-muted-foreground whitespace-nowrap">
                            {formatRelativeDate(issue.updated)}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {expanded === issue.id ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                          </td>
                        </tr>
                        {expanded === issue.id && (
                          <tr className="bg-secondary/20">
                            <td colSpan={7} className="px-4 py-4">
                              <div className="grid gap-3 text-xs sm:grid-cols-2 lg:grid-cols-4">
                                <div>
                                  <span className="font-semibold text-foreground block mb-0.5">Priority</span>
                                  <span className="text-muted-foreground">{priorityIcon(issue.priority)} {issue.priority ?? "None"}</span>
                                </div>
                                <div>
                                  <span className="font-semibold text-foreground block mb-0.5">Created</span>
                                  <span className="text-muted-foreground">{formatRelativeDate(issue.created)}</span>
                                </div>
                                <div>
                                  <span className="font-semibold text-foreground block mb-0.5">Last Updated</span>
                                  <span className="text-muted-foreground">{formatRelativeDate(issue.updated)}</span>
                                </div>
                                <div>
                                  <span className="font-semibold text-foreground block mb-0.5">Jira Link</span>
                                  <a href={issue.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                                    Open in Jira <ExternalLink className="h-3 w-3" />
                                  </a>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p className="text-[11px] text-muted-foreground">
              Showing {filtered.length} of {jiraData?.total ?? 0} total issues in project{" "}
              <strong className="text-foreground">KAN</strong> ·{" "}
              <a
                href="https://sreevarthini.atlassian.net/jira/software/projects/KAN/boards"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-0.5"
              >
                View Jira Board <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </p>
          </>
        )}
      </div>
    </SectionShell>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

function CTAReportHubPage() {
  const [sheetsData, setSheetsData] = useState<SheetsDashboard | null>(null);
  const [sheetsState, setSheetsState] = useState<LoadState>("idle");
  const [jiraSummary, setJiraSummary] = useState<JiraResult | null>(null);

  const fetchSheets = useCallback(async () => {
    setSheetsState("loading");
    try {
      const res = await fetch("/api/sheets/dashboard");
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error(`Server returned non-JSON response (${res.status}).`);
      }
      const data = (await res.json()) as SheetsDashboard;
      setSheetsData(data);
      setSheetsState("success");
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Network error";
      setSheetsData({ connected: false, error: errorMsg });
      setSheetsState("error");
    }
  }, []);

  useEffect(() => { fetchSheets(); }, [fetchSheets]);

  const reportDate = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <>
      {/* Header */}
      <section className="border-b border-border bg-gradient-to-br from-background via-background to-accent/5 py-14">
        <div className="content-wrap">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-accent">
                <FileText className="h-3.5 w-3.5" />
                IN27-43 · CTA Reports Hub
              </div>
              <h1 className="font-display text-4xl font-black tracking-tight text-foreground sm:text-5xl">
                CTA Reports<br />
                <span className="text-primary">&amp; Documentation Hub</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                Consolidated record of CTA Quick Form events, Long Form contact lead submissions,
                supporting documents, Airtable reports, and live Jira task-tracking data.
                Report date: <strong>{reportDate}</strong>.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1.5" id="cta-hub-refresh-btn" onClick={fetchSheets}>
                <RefreshCw className="h-4 w-4" /> Refresh
              </Button>
              <Link to="/reports">
                <Button size="sm" className="gap-1.5" id="cta-hub-schedules-btn">
                  <Calendar className="h-4 w-4" /> Scheduled Reports
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Summary KPI Row */}
      <section className="border-b border-border bg-secondary/30 py-6">
        <div className="content-wrap">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Analytics Events",
                value: sheetsState === "success" && sheetsData?.connected ? (sheetsData.data?.totalEvents?.toLocaleString() ?? "–") : sheetsState === "loading" ? "…" : "–",
                note: "Google Sheets · Live",
                color: "text-primary",
              },
              {
                label: "Contact Leads",
                value: sheetsState === "success" && sheetsData?.connected ? (sheetsData.data?.contactSubmissions?.toLocaleString() ?? "–") : sheetsState === "loading" ? "…" : "–",
                note: "Contact_Leads tab · Live",
                color: "text-emerald-500",
              },
              {
                label: "Jira Issues (KAN)",
                value: jiraSummary ? `${jiraSummary.total ?? (jiraSummary.issues?.length ?? 0)}` : "—",
                note: jiraSummary ? "Total tasks in KAN" : "Live synchronization",
                color: "text-accent",
              },
              {
                label: "Airtable Records",
                value: "N/A",
                note: "Not connected",
                color: "text-muted-foreground",
              },
            ].map((kpi) => (
              <div key={kpi.label} className="surface-card p-4 flex flex-col gap-1">
                <div className={`text-2xl font-black ${kpi.color}`}>{kpi.value}</div>
                <div className="text-xs font-semibold text-foreground">{kpi.label}</div>
                <div className="text-[11px] text-muted-foreground">{kpi.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Sections */}
      <section className="py-10 bg-background">
        <div className="content-wrap space-y-6">
          <QuickFormSection sheetsData={sheetsData} sheetsState={sheetsState} />
          <LongFormSection sheetsData={sheetsData} sheetsState={sheetsState} />
          <DocumentsSection />
          <AirtableSection />
          <JiraSection onDataLoaded={setJiraSummary} />

          {/* Footer nav */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-xs">
            <Link to="/analytics" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
              Analytics Suite <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link to="/website-analytics" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
              Website Analytics <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link to="/reports" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
              Scheduled Reports <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link to="/google-trends" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
              Google Trends <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
