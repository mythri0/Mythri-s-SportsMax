import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Clock3,
  Flame,
  Footprints,
  Gauge,
  HeartPulse,
  Info,
  Map,
  Medal,
  Mountain,
  Share2,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BarChartCard,
  DemoBadge,
  LineChartCard,
  MetricCard,
  PageIntro,
  SectionHead,
  Segmented,
} from "@/components/sports-ui";
import { progression, runTrend, weekly } from "@/lib/sports-data";

export const Route = createFileRoute("/sports/running")({
  head: () => ({
    meta: [
      { title: "Running Intelligence & Telemetry — SportsMax" },
      {
        name: "description",
        content:
          "Advanced running performance metrics, GPS pacing splits, heart rate zone dynamics, cadence, and race time predictions.",
      },
    ],
  }),
  component: RunningSportPage,
});

const splitsData = [
  { km: "Km 1", pace: "5:32", elevation: "+12m", hr: 142, cadence: 164 },
  { km: "Km 2", pace: "5:21", elevation: "-4m", hr: 149, cadence: 166 },
  { km: "Km 3", pace: "5:18", elevation: "+2m", hr: 153, cadence: 168 },
  { km: "Km 4", pace: "5:15", elevation: "-1m", hr: 156, cadence: 169 },
  { km: "Km 5", pace: "5:10", elevation: "+8m", hr: 158, cadence: 170 },
  { km: "Km 6", pace: "5:12", elevation: "+0m", hr: 160, cadence: 171 },
  { km: "Km 7", pace: "5:08", elevation: "-15m", hr: 162, cadence: 172 },
  { km: "Km 8", pace: "4:59", elevation: "-2m", hr: 167, cadence: 175 },
];

const hrZones = [
  { zone: "Zone 1: Active Recovery", range: "< 130 bpm", time: "04:12", pct: "9%" },
  { zone: "Zone 2: Aerobic Base", range: "131 - 148 bpm", time: "16:45", pct: "37%" },
  { zone: "Zone 3: Tempo / Aerobic", range: "149 - 162 bpm", time: "18:20", pct: "41%" },
  { zone: "Zone 4: Threshold", range: "163 - 174 bpm", time: "05:21", pct: "13%" },
  { zone: "Zone 5: Maximum", range: "> 175 bpm", time: "00:00", pct: "0%" },
];

export function RunningSportPage() {
  const [period, setPeriod] = useState("4 weeks");
  const [activeTab, setActiveTab] = useState<"splits" | "zones" | "gear">("splits");

  return (
    <>
      <PageIntro
        eyebrow="Individual Sports · Running"
        title="Running Intelligence & Biomechanics"
        text="Continuous telemetry for road runners, sprinters, and marathoners. Analyze split distributions, stride cadence, lactate threshold drift, and aerodynamic ground contact time."
        action={
          <div className="flex flex-col items-end gap-3">
            <DemoBadge />
            <Segmented
              values={["7 days", "4 weeks", "12 weeks"]}
              value={period}
              onChange={setPeriod}
            />
          </div>
        }
      />

      <section className="py-12 bg-background">
        <div className="content-wrap">
          {/* Top Key Performance Indicators */}
          <SectionHead
            eyebrow="Session Summary"
            title="8.42 km Riverside Speed Endurance Run"
            text="Completed Oct 03, 2026 at 06:45 AM · Optimal weather conditions (16°C, 62% humidity)"
            action={
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <Share2 className="h-4 w-4 mr-1.5" /> Export GPX
                </Button>
                <Button asChild size="sm">
                  <Link to="/analytics">Full Analysis &rarr;</Link>
                </Button>
              </div>
            }
          />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <MetricCard
              label="Distance"
              value="8.42 km"
              note="Planned: 8.0 km"
              icon={<Map className="h-4 w-4" />}
            />
            <MetricCard
              label="Avg Pace"
              value="5:14 /km"
              note="Negative split (-18s)"
              icon={<Activity className="h-4 w-4" />}
            />
            <MetricCard
              label="Moving Time"
              value="44:06"
              note="Elapsed: 44:38"
              icon={<Clock3 className="h-4 w-4" />}
            />
            <MetricCard
              label="Avg Cadence"
              value="170 spm"
              note="Target: 168-172"
              icon={<Footprints className="h-4 w-4" />}
            />
            <MetricCard
              label="Avg Heart Rate"
              value="156 bpm"
              note="Max: 168 bpm"
              icon={<HeartPulse className="h-4 w-4" />}
            />
            <MetricCard
              label="Est. VO2 Max"
              value="54.2"
              note="+0.8 this month"
              icon={<Zap className="h-4 w-4" />}
            />
          </div>

          {/* Interactive GPS Trace and Pace Curve */}
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
            {/* GPS Elevation Map */}
            <div className="surface-card p-6 relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    Telemetry Trace
                  </span>
                  <h3 className="text-lg font-bold">Riverside Waterfront Circuit</h3>
                </div>
                <span className="rounded bg-secondary px-2.5 py-1 text-xs font-mono font-semibold">
                  86m Elevation Gain
                </span>
              </div>

              {/* Graphic visual representing running loop */}
              <div className="relative py-4">
                <svg viewBox="0 0 740 240" className="w-full h-auto" role="img" aria-label="Running Route Map">
                  <defs>
                    <linearGradient id="runGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
                      <stop offset="50%" stopColor="var(--accent)" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>
                  {/* Grid Lines */}
                  <line x1="40" y1="200" x2="700" y2="200" stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="40" y1="140" x2="700" y2="140" stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="40" y1="80" x2="700" y2="80" stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" />

                  {/* Route Silhouette */}
                  <path
                    d="M 50 170 C 130 90, 220 180, 310 130 C 400 80, 520 220, 610 100 C 650 50, 680 70, 700 90"
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="14"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 50 170 C 130 90, 220 180, 310 130 C 400 80, 520 220, 610 100 C 650 50, 680 70, 700 90"
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  {/* Pace Markers */}
                  <circle cx="50" cy="170" r="7" fill="var(--primary)" />
                  <text x="45" y="215" fill="var(--muted-foreground)" fontSize="11" fontFamily="sans-serif">Km 0 (Start)</text>

                  <circle cx="310" cy="130" r="5" fill="var(--accent)" />
                  <text x="295" y="165" fill="var(--muted-foreground)" fontSize="11" fontFamily="sans-serif">Km 4 (5:15)</text>

                  <circle cx="700" cy="90" r="8" fill="var(--primary)" />
                  <text x="640" y="70" fill="var(--primary)" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Km 8.42 (Finish)</text>
                </svg>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border text-center text-xs">
                <div>
                  <span className="text-muted-foreground block">Max Elevation</span>
                  <span className="font-bold text-foreground">42 m</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Min Elevation</span>
                  <span className="font-bold text-foreground">12 m</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Aerobic Efficiency</span>
                  <span className="font-bold text-primary">1.62 km / (bpm·min)</span>
                </div>
              </div>
            </div>

            {/* Pace Trend Chart */}
            <LineChartCard
              title="Pace Progression per Kilometer"
              subtitle="Negative split achieved during the final 3.4 km"
              data={runTrend}
              keys={["pace"]}
              unit=" min/km"
            />
          </div>

          {/* Sub-Section Tabs: Splits, Heart Rate Zones, Footwear */}
          <div className="mt-10">
            <div className="flex border-b border-border gap-6">
              <button
                type="button"
                onClick={() => setActiveTab("splits")}
                className={`pb-3 text-sm font-bold border-b-2 transition ${
                  activeTab === "splits"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Kilometer Splits Breakdown
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("zones")}
                className={`pb-3 text-sm font-bold border-b-2 transition ${
                  activeTab === "zones"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Heart Rate Zones
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("gear")}
                className={`pb-3 text-sm font-bold border-b-2 transition ${
                  activeTab === "gear"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Gear & Shoe Wear
              </button>
            </div>

            {/* Splits Tab */}
            {activeTab === "splits" && (
              <div className="mt-6 surface-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-secondary/70 text-muted-foreground font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-3.5">Split</th>
                        <th className="px-6 py-3.5">Pace (/km)</th>
                        <th className="px-6 py-3.5">Elevation</th>
                        <th className="px-6 py-3.5">Avg Heart Rate</th>
                        <th className="px-6 py-3.5">Cadence (spm)</th>
                        <th className="px-6 py-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {splitsData.map((s, idx) => (
                        <tr key={s.km} className="hover:bg-secondary/30 transition">
                          <td className="px-6 py-3.5 font-bold text-foreground">{s.km}</td>
                          <td className="px-6 py-3.5 font-mono font-semibold text-foreground">
                            {s.pace}
                          </td>
                          <td className="px-6 py-3.5 text-muted-foreground">{s.elevation}</td>
                          <td className="px-6 py-3.5 text-foreground">{s.hr} bpm</td>
                          <td className="px-6 py-3.5 text-foreground">{s.cadence}</td>
                          <td className="px-6 py-3.5">
                            {idx >= 4 ? (
                              <span className="rounded bg-primary/10 text-primary font-bold px-2 py-0.5 text-[10px]">
                                Negative Split
                              </span>
                            ) : (
                              <span className="rounded bg-secondary text-muted-foreground px-2 py-0.5 text-[10px]">
                                On Target
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Heart Rate Zones Tab */}
            {activeTab === "zones" && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {hrZones.map((z, idx) => (
                  <div key={z.zone} className="surface-card p-5 border">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary">Z{idx + 1}</span>
                      <span className="text-xs font-mono font-bold">{z.pct}</span>
                    </div>
                    <h4 className="mt-2 text-sm font-bold text-foreground">{z.zone.split(":")[1]}</h4>
                    <p className="mt-1 text-xs text-muted-foreground">{z.range}</p>
                    <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Time in zone</span>
                      <span className="font-mono font-semibold">{z.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Gear Tab */}
            {activeTab === "gear" && (
              <div className="mt-6 surface-card p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      Tracked Equipment
                    </span>
                    <h4 className="text-lg font-bold text-foreground mt-0.5">
                      Nike Vaporfly 3 (Neon Green)
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Target retirement: 450 km · Cushioned race day super shoe
                    </p>
                  </div>
                  <span className="rounded-full bg-primary/10 text-primary border border-primary/20 px-3 py-1 text-xs font-bold">
                    Optimal Cushioning
                  </span>
                </div>
                <div className="mt-6">
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span>Current mileage: 168.4 km</span>
                    <span className="text-primary">37% Life consumed (281.6 km remaining)</span>
                  </div>
                  <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "37%" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Historical Trends */}
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <LineChartCard
              title="Heart Rate vs Speed Velocity"
              subtitle="Cardiac efficiency index over 4 weeks"
              data={runTrend}
              keys={["heart", "speed"]}
              unit=""
            />
            <BarChartCard
              title="Weekly Training Volume (km)"
              subtitle="Consistent progressive overload without overreaching"
              data={weekly}
            />
          </div>
        </div>
      </section>
    </>
  );
}
