// IN27-70 — GOOGLE TRENDS
import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  TrendingUp,
  Globe,
  Clock,
  RefreshCw,
  ExternalLink,
  BarChart2,
  Flame,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/google-trends")({
  head: () => ({
    meta: [
      { title: "Google Trends — SportsMax" },
      {
        name: "description",
        content:
          "Explore live Google Trends data for sports topics, compare search interest over time, and discover emerging regional trends in athletics and performance.",
      },
      { property: "og:title", content: "Google Trends — SportsMax" },
      { property: "og:description", content: "Real-time sports search trend intelligence powered by Google Trends." },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/google-trends" }],
  }),
  component: GoogleTrendsPage,
});

interface TopicItem {
  label: string;
  kw: string;
}

interface RegionItem {
  label: string;
  geo: string;
}

interface TimeRangeItem {
  label: string;
  value: string;
}

interface ChartTypeItem {
  label: string;
  type: string;
}

const TOPICS: TopicItem[] = [
  { label: "Sports (all)", kw: "sports" },
  { label: "Football / Soccer", kw: "football" },
  { label: "Athletics & Track", kw: "athletics track and field" },
  { label: "Swimming", kw: "swimming sports" },
  { label: "Cricket", kw: "cricket" },
  { label: "Basketball", kw: "basketball" },
  { label: "Cycling", kw: "cycling sport" },
  { label: "Tennis", kw: "tennis" },
  { label: "Rugby", kw: "rugby" },
  { label: "SportsMax", kw: "SportsMax analytics" },
];

const REGIONS: RegionItem[] = [
  { label: "Worldwide", geo: "" },
  { label: "United States", geo: "US" },
  { label: "United Kingdom", geo: "GB" },
  { label: "Jamaica", geo: "JM" },
  { label: "South Africa", geo: "ZA" },
  { label: "India", geo: "IN" },
  { label: "Australia", geo: "AU" },
  { label: "Germany", geo: "DE" },
  { label: "Brazil", geo: "BR" },
  { label: "Kenya", geo: "KE" },
];

const TIME_RANGES: TimeRangeItem[] = [
  { label: "Past hour", value: "now 1-H" },
  { label: "Past 4 hours", value: "now 4-H" },
  { label: "Past day", value: "now 1-d" },
  { label: "Past 7 days", value: "now 7-d" },
  { label: "Past 30 days", value: "today 1-m" },
  { label: "Past 90 days", value: "today 3-m" },
  { label: "Past 12 months", value: "today 12-m" },
  { label: "Past 5 years", value: "today 5-y" },
];

const CHART_TYPES: ChartTypeItem[] = [
  { label: "Interest over time", type: "TIMESERIES" },
  { label: "By region", type: "GEO_MAP" },
  { label: "Related queries", type: "RELATED_QUERIES" },
  { label: "Related topics", type: "RELATED_TOPICS" },
];

function buildEmbedUrl(kw: string, geo: string, timeRange: string) {
  const encoded = encodeURIComponent(kw);
  return `https://trends.google.com/trends/embed/explore/TIMESERIES?req=%7B%22comparisonItem%22%3A%5B%7B%22keyword%22%3A%22${encoded}%22%2C%22geo%22%3A%22${geo}%22%2C%22time%22%3A%22${encodeURIComponent(timeRange)}%22%7D%5D%2C%22category%22%3A20%2C%22property%22%3A%22%22%7D&tz=-330&hl=en`;
}

function GoogleTrendsPage() {
  const [topicIdx, setTopicIdx] = useState(0);
  const [regionIdx, setRegionIdx] = useState(0);
  const [timeIdx, setTimeIdx] = useState(6);
  const [chartIdx, setChartIdx] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const topic: TopicItem = TOPICS[topicIdx] || TOPICS[0]!;
  const region: RegionItem = REGIONS[regionIdx] || REGIONS[0]!;
  const timeRange: TimeRangeItem = TIME_RANGES[timeIdx] || TIME_RANGES[0]!;
  const currentChart: ChartTypeItem = CHART_TYPES[chartIdx] || CHART_TYPES[0]!;

  const embedUrl = useMemo(
    () => buildEmbedUrl(topic.kw, region.geo, timeRange.value),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [topicIdx, regionIdx, timeIdx, chartIdx, refreshKey]
  );

  const directUrl = `https://trends.google.com/trends/explore?q=${encodeURIComponent(topic.kw)}${region.geo ? `&geo=${region.geo}` : ""}&date=${encodeURIComponent(timeRange.value)}&cat=20`;

  return (
    <>
      <section className="border-b border-border bg-gradient-to-br from-background via-background to-primary/5 py-14">
        <div className="content-wrap">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
                <TrendingUp className="h-3.5 w-3.5" />
                IN27-70 · Google Trends
              </div>
              <h1 className="font-display text-4xl font-black tracking-tight text-foreground sm:text-5xl">
                Sports Search<br />
                <span className="text-primary">Trend Intelligence</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                Monitor real-time Google search interest for sports topics worldwide. Adjust the topic, region, and
                time frame to explore how sporting events drive audience search behaviour.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setRefreshKey((k) => k + 1)} className="gap-1.5" id="trends-refresh-btn">
                <RefreshCw className="h-4 w-4" /> Refresh
              </Button>
              <Button asChild size="sm" className="gap-1.5" id="trends-open-btn">
                <a href={directUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" /> Open in Google Trends
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-secondary/40 py-6">
        <div className="content-wrap">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                <Search className="h-3 w-3" /> Topic
              </label>
              <select id="trends-topic-select" value={topicIdx} onChange={(e) => setTopicIdx(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/40">
                {TOPICS.map((t, i) => <option key={t.kw} value={i}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                <Globe className="h-3 w-3" /> Region
              </label>
              <select id="trends-region-select" value={regionIdx} onChange={(e) => setRegionIdx(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/40">
                {REGIONS.map((r, i) => <option key={r.geo || "WW"} value={i}>{r.label}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                <Clock className="h-3 w-3" /> Time Range
              </label>
              <select id="trends-time-select" value={timeIdx} onChange={(e) => setTimeIdx(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/40">
                {TIME_RANGES.map((t, i) => <option key={t.value} value={i}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                <BarChart2 className="h-3 w-3" /> Chart Type
              </label>
              <select id="trends-chart-select" value={chartIdx} onChange={(e) => setChartIdx(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/40">
                {CHART_TYPES.map((c, i) => <option key={c.type} value={i}>{c.label}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
            <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-semibold text-primary">🔍 {topic.label}</span>
            <span className="rounded-full border border-border bg-secondary px-3 py-1 font-medium text-muted-foreground">📍 {region.label}</span>
            <span className="rounded-full border border-border bg-secondary px-3 py-1 font-medium text-muted-foreground">🕐 {timeRange.label}</span>
            <span className="rounded-full border border-border bg-secondary px-3 py-1 font-medium text-muted-foreground">📊 {currentChart.label}</span>
          </div>
        </div>
      </section>

      <section className="py-10 bg-background">
        <div className="content-wrap">
          <div className="overflow-hidden rounded-2xl border border-border shadow-lg bg-card">
            <div className="border-b border-border px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-sm text-foreground">
                  Live Trend: <span className="text-primary">{topic.label}</span>
                  <span className="ml-2 text-muted-foreground font-normal">— {region.label} · {timeRange.label}</span>
                </h2>
              </div>
              <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">Live</span>
            </div>
            <div className="relative min-h-[420px] w-full">
              <iframe
                key={`gt-${topicIdx}-${regionIdx}-${timeIdx}-${chartIdx}-${refreshKey}`}
                id="google-trends-embed-frame"
                src={embedUrl}
                title={`Google Trends: ${topic.label} in ${region.label}`}
                className="h-[420px] w-full border-0"
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            </div>
            <div className="border-t border-border px-6 py-3 text-[11px] text-muted-foreground">
              Data sourced from Google Trends. Embed updates when controls change.{" "}
              <a href={directUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Open directly in Google Trends ↗
              </a>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { icon: <TrendingUp className="h-5 w-5 text-primary" />, title: "Search Volume Spikes", desc: "Identify peak interest windows around competitions, tournaments, and seasonal events to time content and campaigns." },
              { icon: <Globe className="h-5 w-5 text-accent" />, title: "Regional Popularity", desc: "Discover which countries and cities show the highest search interest — critical for geographic targeting." },
              { icon: <BarChart2 className="h-5 w-5 text-chart-1" />, title: "Comparative Benchmarking", desc: "Compare multiple sports keywords simultaneously to benchmark relative audience awareness and growth." },
            ].map((card) => (
              <div key={card.title} className="surface-card p-5 flex flex-col gap-3">
                <div className="flex items-center gap-2">{card.icon}<h3 className="font-bold text-sm text-foreground">{card.title}</h3></div>
                <p className="text-xs text-muted-foreground leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
