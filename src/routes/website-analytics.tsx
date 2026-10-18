// IN27-61 — WEBSITE ANALYTICS REPORT LOOP
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Globe,
  Users,
  Eye,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  MapPin,
  Monitor,
  Smartphone,
  Tablet,
  RefreshCw,
  Download,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/website-analytics")({
  head: () => ({
    meta: [
      { title: "Website Analytics Report — SportsMax" },
      {
        name: "description",
        content:
          "Full website analytics report: sessions, users, bounce rate, top pages, traffic sources, device breakdown, and geographic distribution.",
      },
      { property: "og:title", content: "Website Analytics Report — SportsMax" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/website-analytics" }],
  }),
  component: WebsiteAnalyticsPage,
});

// ─── Demo Data ────────────────────────────────────────────────────────────────

const PERIOD_OPTIONS = ["Last 7 days", "Last 30 days", "Last 90 days", "This year"] as const;
type Period = (typeof PERIOD_OPTIONS)[number];

const OVERVIEW: Record<Period, { sessions: string; users: string; pageviews: string; bounce: string; duration: string; pagesPerSession: string; sessionDelta: string; usersDelta: string; bounceUp: boolean }> = {
  "Last 7 days":  { sessions: "12,840", users: "9,210", pageviews: "48,330", bounce: "38.2%", duration: "3m 12s", pagesPerSession: "3.76", sessionDelta: "+6.4%", usersDelta: "+4.1%", bounceUp: false },
  "Last 30 days": { sessions: "51,440", users: "34,820", pageviews: "197,210", bounce: "36.8%", duration: "3m 28s", pagesPerSession: "3.83", sessionDelta: "+11.2%", usersDelta: "+8.9%", bounceUp: false },
  "Last 90 days": { sessions: "148,320", users: "98,140", pageviews: "563,480", bounce: "37.5%", duration: "3m 19s", pagesPerSession: "3.80", sessionDelta: "+18.4%", usersDelta: "+15.7%", bounceUp: false },
  "This year":    { sessions: "581,200", users: "372,440", pageviews: "2,241,800", bounce: "35.9%", duration: "3m 41s", pagesPerSession: "3.86", sessionDelta: "+29.1%", usersDelta: "+24.3%", bounceUp: false },
};

const TOP_PAGES = [
  { path: "/", title: "Home", views: 82140, avgTime: "2m 45s", bounce: "28.4%" },
  { path: "/institution", title: "Institution Hub", views: 44210, avgTime: "4m 12s", bounce: "22.8%" },
  { path: "/analytics", title: "Analytics Suite", views: 38900, avgTime: "5m 01s", bounce: "18.3%" },
  { path: "/sports/", title: "Sports Directory", views: 31240, avgTime: "3m 33s", bounce: "31.1%" },
  { path: "/run-analytics", title: "Run Analytics", views: 24110, avgTime: "4m 48s", bounce: "19.7%" },
  { path: "/pricing", title: "Pricing", views: 21800, avgTime: "2m 55s", bounce: "42.1%" },
  { path: "/coaches", title: "Coaches Portal", views: 18930, avgTime: "3m 48s", bounce: "25.4%" },
  { path: "/athletes", title: "Athletes", views: 16440, avgTime: "3m 02s", bounce: "33.8%" },
];

const TRAFFIC_SOURCES = [
  { source: "Organic Search", sessions: 24810, pct: 48.3, color: "#6366f1" },
  { source: "Direct", sessions: 11420, pct: 22.2, color: "#22d3ee" },
  { source: "Social Media", sessions: 7830, pct: 15.2, color: "#f59e0b" },
  { source: "Referral", sessions: 4240, pct: 8.2, color: "#10b981" },
  { source: "Email", sessions: 2180, pct: 4.2, color: "#f43f5e" },
  { source: "Paid Ads", sessions: 960, pct: 1.9, color: "#a855f7" },
];

const DEVICES = [
  { type: "Desktop", icon: Monitor, pct: 54.3, sessions: 27940 },
  { type: "Mobile", icon: Smartphone, pct: 38.6, sessions: 19840 },
  { type: "Tablet", icon: Tablet, pct: 7.1, sessions: 3650 },
];

const GEO_TOP = [
  { country: "United Kingdom", flag: "🇬🇧", sessions: 12840, pct: 25.0 },
  { country: "United States", flag: "🇺🇸", sessions: 10610, pct: 20.6 },
  { country: "Jamaica", flag: "🇯🇲", sessions: 6120, pct: 11.9 },
  { country: "South Africa", flag: "🇿🇦", sessions: 4880, pct: 9.5 },
  { country: "Kenya", flag: "🇰🇪", sessions: 3840, pct: 7.5 },
  { country: "Australia", flag: "🇦🇺", sessions: 3220, pct: 6.3 },
  { country: "India", flag: "🇮🇳", sessions: 2710, pct: 5.3 },
  { country: "Other", flag: "🌍", sessions: 7210, pct: 14.0 },
];

// ─── Component ────────────────────────────────────────────────────────────────

function DeltaBadge({ delta, up }: { delta: string; up: boolean }) {
  return (
    <span className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${up ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}>
      {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {delta}
    </span>
  );
}

function WebsiteAnalyticsPage() {
  const [period, setPeriod] = useState<Period>("Last 30 days");
  const ov = OVERVIEW[period];
  const reportDate = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

  const exportReport = () => {
    const reportData = {
      reportDate,
      period,
      overview: ov,
      topPages: TOP_PAGES,
      trafficSources: TRAFFIC_SOURCES,
      devices: DEVICES,
      geography: GEO_TOP,
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `sportsmax-website-analytics-${period.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Header */}
      <section className="border-b border-border bg-gradient-to-br from-background via-background to-chart-1/5 py-14">
        <div className="content-wrap">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-chart-1/30 bg-chart-1/10 px-3 py-1 text-xs font-bold uppercase tracking-widest" style={{ color: "hsl(var(--chart-1))" }}>
                <Globe className="h-3.5 w-3.5" />
                IN27-61 · Website Analytics Report
              </div>
              <h1 className="font-display text-4xl font-black tracking-tight text-foreground sm:text-5xl">
                Website Analytics<br />
                <span className="text-primary">Performance Report</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                Full-spectrum analytics covering sessions, users, page performance, traffic acquisition, device split,
                and geographic distribution. Report date: <strong>{reportDate}</strong>.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1.5" id="wa-refresh-btn" onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4" /> Refresh
              </Button>
              <Button size="sm" className="gap-1.5" id="wa-export-btn" onClick={exportReport}>
                <Download className="h-4 w-4" /> Export JSON
              </Button>
              <Button asChild variant="outline" size="sm" className="gap-1.5" id="wa-clarity-btn">
                <a href="https://clarity.microsoft.com/projects/view/yrxe87qisd" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" /> Microsoft Clarity
                </a>
              </Button>
            </div>
          </div>

          {/* Period Selector */}
          <div className="mt-6 flex flex-wrap gap-1 bg-secondary/50 p-1 rounded-lg border border-border w-fit">
            {PERIOD_OPTIONS.map((p) => (
              <button
                key={p}
                id={`wa-period-${p.replace(/\s+/g, "-").toLowerCase()}`}
                onClick={() => setPeriod(p)}
                className={`px-4 py-1.5 rounded text-xs font-bold transition ${period === p ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Overview KPIs */}
      <section className="border-b border-border bg-secondary/30 py-8">
        <div className="content-wrap">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {[
              { label: "Sessions", value: ov.sessions, delta: ov.sessionDelta, up: true, icon: Activity },
              { label: "Users", value: ov.users, delta: ov.usersDelta, up: true, icon: Users },
              { label: "Pageviews", value: ov.pageviews, delta: "+9.8%", up: true, icon: Eye },
              { label: "Bounce Rate", value: ov.bounce, delta: "-2.1pp", up: false, icon: TrendingDown },
              { label: "Avg. Session", value: ov.duration, delta: "+0:12", up: true, icon: Clock },
              { label: "Pages / Session", value: ov.pagesPerSession, delta: "+0.14", up: true, icon: BarChart3 },
            ].map((m) => (
              <div key={m.label} className="surface-card p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <m.icon className="h-5 w-5 text-primary" />
                  <DeltaBadge delta={m.delta} up={m.up} />
                </div>
                <div>
                  <div className="text-2xl font-black text-foreground">{m.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{m.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-10 bg-background">
        <div className="content-wrap space-y-10">

          {/* Top Pages */}
          <div>
            <h2 className="mb-4 text-xl font-bold text-foreground flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" /> Top Pages
            </h2>
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <table className="w-full text-left text-xs">
                <thead className="bg-secondary/70 text-muted-foreground font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Page</th>
                    <th className="px-5 py-3.5 text-right">Views</th>
                    <th className="px-5 py-3.5 text-right">Avg. Time</th>
                    <th className="px-5 py-3.5 text-right">Bounce Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {TOP_PAGES.map((p) => (
                    <tr key={p.path} className="hover:bg-secondary/30 transition">
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-foreground">{p.title}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">{p.path}</div>
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono font-bold text-primary">{p.views.toLocaleString()}</td>
                      <td className="px-5 py-3.5 text-right font-mono text-muted-foreground">{p.avgTime}</td>
                      <td className="px-5 py-3.5 text-right font-mono">{p.bounce}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Traffic Sources + Devices */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Traffic Sources */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" /> Traffic Sources
              </h2>
              <div className="surface-card p-5 space-y-3">
                {TRAFFIC_SOURCES.map((s) => (
                  <div key={s.source}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-foreground">{s.source}</span>
                      <span className="text-muted-foreground font-mono">{s.sessions.toLocaleString()} <span className="font-bold text-foreground">({s.pct}%)</span></span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Device Breakdown */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-foreground flex items-center gap-2">
                <Monitor className="h-5 w-5 text-chart-1" /> Device Breakdown
              </h2>
              <div className="surface-card p-5 space-y-4">
                {DEVICES.map((d) => (
                  <div key={d.type} className="flex items-center gap-4">
                    <d.icon className="h-8 w-8 text-muted-foreground shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold">{d.type}</span>
                        <span className="font-mono text-primary font-bold">{d.pct}% ({d.sessions.toLocaleString()})</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${d.pct}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Geographic Distribution */}
          <div>
            <h2 className="mb-4 text-xl font-bold text-foreground flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" /> Geographic Distribution
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {GEO_TOP.map((g) => (
                <div key={g.country} className="surface-card p-4 flex items-center gap-3">
                  <span className="text-2xl">{g.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-foreground truncate">{g.country}</div>
                    <div className="text-[11px] text-muted-foreground">{g.sessions.toLocaleString()} sessions · <strong>{g.pct}%</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border">
            <Link to="/cta-report" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
              CTA Performance Report →
            </Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/reports" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
              Scheduled Reports Dashboard →
            </Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/google-trends" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
              Google Trends →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
