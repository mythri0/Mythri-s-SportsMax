// IN27-79 — DAILY WEEKLY MONTHLY REPORTS - TRIGGERS
import { useState, useEffect, useCallback } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Calendar,
  CalendarCheck,
  Clock,
  Mail,
  BellRing,
  Play,
  Pause,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FileText,
  BarChart3,
  TrendingUp,
  Download,
  Webhook,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkedInEngagementDashboard } from "@/components/linkedin-engagement-dashboard";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Automated Report Triggers — SportsMax" },
      {
        name: "description",
        content:
          "Configure and trigger Daily, Weekly, and Monthly analytics reports for SportsMax. Monitor delivery status, manage schedules, and run instant report dispatches.",
      },
      { property: "og:title", content: "Automated Report Triggers — SportsMax" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/reports" }],
  }),
  component: ReportsPage,
});

// ─── Types & Data ─────────────────────────────────────────────────────────────

type ReportStatus = "active" | "paused" | "error";
type DeliveryStatus = "delivered" | "pending" | "failed";

interface ReportSchedule {
  id: string;
  name: string;
  type: "daily" | "weekly" | "monthly";
  schedule: string;
  recipients: string[];
  status: ReportStatus;
  lastRun: string;
  nextRun: string;
  deliveries: number;
}

interface ReportLog {
  id: string;
  reportName: string;
  timestamp: string;
  status: DeliveryStatus;
  recipients: number;
  size: string;
}

const SCHEDULES: ReportSchedule[] = [
  {
    id: "daily-traffic",
    name: "Daily Performance Report",
    type: "daily",
    schedule: "Every day at 07:00 UTC",
    recipients: ["sreevarthini2006@gmail.com"],
    status: "active",
    lastRun: "Today at 07:00 UTC",
    nextRun: "Tomorrow at 07:00 UTC",
    deliveries: 284,
  },
  {
    id: "daily-cta",
    name: "Daily CTA Performance",
    type: "daily",
    schedule: "Every day at 08:00 UTC",
    recipients: ["sreevarthini2006@gmail.com"],
    status: "active",
    lastRun: "Today at 08:00 UTC",
    nextRun: "Tomorrow at 08:00 UTC",
    deliveries: 241,
  },
  {
    id: "weekly-analytics",
    name: "Weekly Analytics Brief",
    type: "weekly",
    schedule: "Every Monday at 09:00 UTC",
    recipients: ["sreevarthini2006@gmail.com"],
    status: "active",
    lastRun: "Last Monday",
    nextRun: "This Monday",
    deliveries: 52,
  },
  {
    id: "weekly-trends",
    name: "Weekly Google Trends Digest",
    type: "weekly",
    schedule: "Every Friday at 16:00 UTC",
    recipients: ["sreevarthini2006@gmail.com"],
    status: "paused",
    lastRun: "2 weeks ago",
    nextRun: "Paused",
    deliveries: 38,
  },
  {
    id: "monthly-full",
    name: "Monthly Executive Analytics Report",
    type: "monthly",
    schedule: "1st of each month at 06:00 UTC",
    recipients: ["sreevarthini2006@gmail.com"],
    status: "active",
    lastRun: "1st Oct 2026",
    nextRun: "1st Nov 2026",
    deliveries: 12,
  },
  {
    id: "monthly-seo",
    name: "Monthly SEO & Traffic Report",
    type: "monthly",
    schedule: "5th of each month at 07:00 UTC",
    recipients: ["sreevarthini2006@gmail.com"],
    status: "error",
    lastRun: "Failed: 5th Oct 2026",
    nextRun: "5th Nov 2026",
    deliveries: 10,
  },
];

const INITIAL_LOGS: ReportLog[] = [
  { id: "log-1", reportName: "Daily Traffic Summary", timestamp: "Today 07:00 UTC", status: "delivered", recipients: 2, size: "84 KB" },
  { id: "log-2", reportName: "Daily CTA Performance", timestamp: "Today 08:00 UTC", status: "delivered", recipients: 1, size: "61 KB" },
  { id: "log-3", reportName: "Weekly Analytics Report", timestamp: "Mon 09:00 UTC", status: "delivered", recipients: 2, size: "312 KB" },
  { id: "log-4", reportName: "Monthly SEO & Traffic Report", timestamp: "5 Oct 07:00 UTC", status: "failed", recipients: 2, size: "—" },
  { id: "log-5", reportName: "Monthly Full Intelligence Report", timestamp: "1 Oct 06:00 UTC", status: "delivered", recipients: 3, size: "1.2 MB" },
  { id: "log-6", reportName: "Weekly Google Trends Digest", timestamp: "26 Sep 16:00 UTC", status: "delivered", recipients: 1, size: "128 KB" },
];

const TYPE_COLORS = {
  daily: { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20" },
  weekly: { bg: "bg-accent/10", text: "text-accent", border: "border-accent/20" },
  monthly: { bg: "bg-chart-1/10", text: "text-chart-1", border: "border-chart-1/20" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusDot({ status }: { status: ReportStatus }) {
  if (status === "active") return <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />;
  if (status === "paused") return <span className="inline-flex h-2 w-2 rounded-full bg-amber-500 ring-2 ring-amber-500/20" />;
  return <span className="inline-flex h-2 w-2 rounded-full bg-rose-500 ring-2 ring-rose-500/20" />;
}

function DeliveryBadge({ status }: { status: DeliveryStatus }) {
  if (status === "delivered") return <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500"><CheckCircle2 className="h-3 w-3" />Delivered</span>;
  if (status === "failed") return <span className="flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-500"><AlertCircle className="h-3 w-3" />Failed</span>;
  return <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary"><Clock className="h-3 w-3" />Pending</span>;
}

// ─── Main Component ───────────────────────────────────────────────────────────

function ReportsPage() {
  const [schedules, setSchedules] = useState(SCHEDULES);
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [triggeringId, setTriggeringId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "daily" | "weekly" | "monthly">("all");

  const filteredSchedules = filter === "all" ? schedules : schedules.filter((s) => s.type === filter);

  const toggleStatus = (id: string) => {
    setSchedules((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: s.status === "active" ? "paused" : "active" } : s
      )
    );
  };

  // Fetch server logs on mount
  useEffect(() => {
    fetch("/api/reports/logs")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.logs?.length) {
          setLogs(data.logs);
        }
      })
      .catch(() => {
        // Fallback to initial logs
      });
  }, []);

  const triggerNow = useCallback(async (schedule: ReportSchedule) => {
    setTriggeringId(schedule.id);
    try {
      const res = await fetch("/api/reports/trigger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer sportsmax_cron_secret_layer1_2026",
        },
        body: JSON.stringify({
          reportId: schedule.id,
          reportName: schedule.name,
          period: schedule.type,
          recipients: schedule.recipients,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const report = data?.report;
        const isDelivered = report?.deliveryStatus === "delivered";
        const newLog: ReportLog = {
          id: `log-${Date.now()}`,
          reportName: schedule.name,
          timestamp: `Just now (${new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} UTC)`,
          status: isDelivered ? "delivered" : "failed",
          recipients: schedule.recipients.length,
          size: schedule.type === "daily" ? "78 KB" : schedule.type === "weekly" ? "295 KB" : "1.1 MB",
        };
        setLogs((prev) => [newLog, ...prev]);

        // Refresh persistent history from server
        try {
          const logsRes = await fetch("/api/reports/logs");
          if (logsRes.ok) {
            const logsData = await logsRes.json();
            if (logsData?.logs?.length) setLogs(logsData.logs);
          }
        } catch {
          // ignore
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        const failLog: ReportLog = {
          id: `log-${Date.now()}`,
          reportName: schedule.name,
          timestamp: "Just now",
          status: "failed",
          recipients: schedule.recipients.length,
          size: "—",
        };
        setLogs((prev) => [failLog, ...prev]);
        console.error("[Reports Trigger] Server error:", errData);
      }
    } catch (err) {
      const failLog: ReportLog = {
        id: `log-${Date.now()}`,
        reportName: schedule.name,
        timestamp: "Just now",
        status: "failed",
        recipients: schedule.recipients.length,
        size: "—",
      };
      setLogs((prev) => [failLog, ...prev]);
      console.error("[Reports Trigger] Network error:", err);
    } finally {
      setTriggeringId(null);
    }
  }, []);

  // IN27-79: Simulate a 60-second auto-tick for next-run countdown display
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  const stats = {
    total: schedules.length,
    active: schedules.filter((s) => s.status === "active").length,
    paused: schedules.filter((s) => s.status === "paused").length,
    errors: schedules.filter((s) => s.status === "error").length,
    totalDeliveries: schedules.reduce((sum, s) => sum + s.deliveries, 0),
  };

  return (
    <>
      {/* Header */}
      <section className="border-b border-border bg-gradient-to-br from-background via-background to-primary/5 py-14">
        <div className="content-wrap">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
                <CalendarCheck className="h-3.5 w-3.5" />
                IN27-79 · Automated Report Triggers
              </div>
              <h1 className="font-display text-4xl font-black tracking-tight text-foreground sm:text-5xl">
                Daily · Weekly · Monthly<br />
                <span className="text-primary">Report Scheduler</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                Manage automated report delivery schedules across analytics, CTA performance, website traffic, and
                Google Trends data. Trigger instant dispatches or pause/resume recurring jobs.
              </p>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <div className="text-xs text-muted-foreground font-mono">Last checked: {new Date().toLocaleTimeString()}</div>
              <Button size="sm" className="gap-1.5" id="reports-run-all-btn">
                <Play className="h-4 w-4" /> Run All Active Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-secondary/30 py-7">
        <div className="content-wrap">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { label: "Total Schedules", value: stats.total, icon: Calendar, color: "text-muted-foreground" },
              { label: "Active", value: stats.active, icon: CheckCircle2, color: "text-emerald-500" },
              { label: "Paused", value: stats.paused, icon: Pause, color: "text-amber-500" },
              { label: "Errors", value: stats.errors, icon: AlertCircle, color: "text-rose-500" },
              { label: "All-Time Deliveries", value: stats.totalDeliveries, icon: Mail, color: "text-primary" },
            ].map((s) => (
              <div key={s.label} className="surface-card p-4 flex items-center gap-4">
                <s.icon className={`h-8 w-8 shrink-0 ${s.color}`} />
                <div>
                  <div className="text-2xl font-black text-foreground">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedules */}
      <section className="py-10 bg-background">
        <div className="content-wrap space-y-8">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <BellRing className="h-5 w-5 text-primary" /> Report Schedules
            </h2>
            <div className="flex gap-1 bg-secondary p-1 rounded-lg border border-border">
              {(["all", "daily", "weekly", "monthly"] as const).map((f) => (
                <button key={f} id={`reports-filter-${f}`} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded text-xs font-bold capitalize transition ${filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {filteredSchedules.map((s) => {
              const tc = TYPE_COLORS[s.type];
              const isTrigger = triggeringId === s.id;
              return (
                <div key={s.id} className={`surface-card p-5 border-l-4 ${tc.border}`}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <StatusDot status={s.status} />
                      <h3 className="font-bold text-sm text-foreground">{s.name}</h3>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${tc.bg} ${tc.text}`}>
                      {s.type}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 shrink-0" /> {s.schedule}</div>
                    <div className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 shrink-0" /> {s.recipients.join(", ")}</div>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <CalendarCheck className="h-3.5 w-3.5 shrink-0" />
                      <span>Last: <strong className="text-foreground">{s.lastRun}</strong></span>
                      <span className="mx-1">·</span>
                      <span>Next: <strong className="text-foreground">{s.nextRun}</strong></span>
                      <span className="mx-1">·</span>
                      <span>{s.deliveries} deliveries</span>
                    </div>
                    {s.status === "error" && (
                      <div className="flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/5 px-2 py-1 text-rose-400">
                        <AlertCircle className="h-3.5 w-3.5" /> SMTP delivery failed — check recipient configuration
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      id={`reports-trigger-${s.id}`}
                      size="sm"
                      variant="outline"
                      className="gap-1.5 flex-1"
                      disabled={isTrigger}
                      onClick={() => triggerNow(s)}
                    >
                      {isTrigger ? <><RefreshCw className="h-3.5 w-3.5 animate-spin" /> Sending…</> : <><Play className="h-3.5 w-3.5" /> Trigger Now</>}
                    </Button>
                    <Button
                      id={`reports-toggle-${s.id}`}
                      size="sm"
                      variant="ghost"
                      className="gap-1.5"
                      onClick={() => toggleStatus(s.id)}
                    >
                      {s.status === "active" ? <><Pause className="h-3.5 w-3.5" /> Pause</> : <><Play className="h-3.5 w-3.5" /> Resume</>}
                    </Button>
                    <Button id={`reports-download-${s.id}`} size="sm" variant="ghost">
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Delivery Log */}
          <div>
            <h2 className="mb-4 text-xl font-bold text-foreground flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> Recent Delivery Log
            </h2>
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <table className="w-full text-left text-xs">
                <thead className="bg-secondary/70 text-muted-foreground font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Report</th>
                    <th className="px-5 py-3.5">Timestamp</th>
                    <th className="px-5 py-3.5 text-center">Recipients</th>
                    <th className="px-5 py-3.5 text-right">Size</th>
                    <th className="px-5 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-secondary/30 transition">
                      <td className="px-5 py-3.5 font-semibold text-foreground">{log.reportName}</td>
                      <td className="px-5 py-3.5 text-muted-foreground font-mono">{log.timestamp}</td>
                      <td className="px-5 py-3.5 text-center">{log.recipients}</td>
                      <td className="px-5 py-3.5 text-right font-mono text-muted-foreground">{log.size}</td>
                      <td className="px-5 py-3.5"><DeliveryBadge status={log.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* LinkedIn Engagement & Attribution Dashboard */}
          <LinkedInEngagementDashboard />

          {/* Integration Info */}
          <div className="surface-card p-6 border border-primary/10 bg-primary/5 rounded-xl">
            <div className="flex items-start gap-4">
              <Webhook className="h-6 w-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm text-foreground mb-1">Webhook & Apps Script Integration</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Reports are dispatched via <strong>Google Apps Script</strong> triggered by time-based cron jobs.
                  The payload is POSTed to <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[11px]">VITE_ANALYTICS_URL</code> in <strong>text/plain;charset=UTF-8</strong> to avoid CORS preflight.
                  Each delivery appends a row to the <strong>SportsMax Analytics Google Sheet</strong> for audit trail and duplicate detection.
                  Configure the recipient list and schedule cadence in the <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[11px]">.env</code> file.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link to="/website-analytics" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                    <BarChart3 className="h-3.5 w-3.5" /> Website Analytics →
                  </Link>
                  <span className="text-muted-foreground">·</span>
                  <Link to="/cta-report" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                    <TrendingUp className="h-3.5 w-3.5" /> CTA Report →
                  </Link>
                  <span className="text-muted-foreground">·</span>
                  <Link to="/google-trends" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                    <TrendingUp className="h-3.5 w-3.5" /> Google Trends →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
