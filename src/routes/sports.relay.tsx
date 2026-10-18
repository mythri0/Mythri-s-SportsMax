import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Clock3,
  Flame,
  Gauge,
  Milestone,
  RotateCcw,
  Shuffle,
  Sparkles,
  TrendingUp,
  Trophy,
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
} from "@/components/sports-ui";

export const Route = createFileRoute("/sports/relay")({
  head: () => ({
    meta: [
      { title: "Relay & Combined Events Analytics — SportsMax" },
      {
        name: "description",
        content:
          "Relay baton exchange box velocity differentials, decathlon/heptathlon point scoring curves, and combined events tracking.",
      },
    ],
  }),
  component: RelaySportPage,
});

const exchangeData = [
  { exchange: "Leg 1 to Leg 2", delta: "1.74s", incomingSpeed: "10.42 m/s", outgoingSpeed: "9.85 m/s", efficiency: "96.4%" },
  { exchange: "Leg 2 to Leg 3", delta: "1.68s", incomingSpeed: "10.65 m/s", outgoingSpeed: "10.12 m/s", efficiency: "98.1%" },
  { exchange: "Leg 3 to Leg 4 (Anchor)", delta: "1.71s", incomingSpeed: "10.58 m/s", outgoingSpeed: "10.25 m/s", efficiency: "97.6%" },
];

const combinedPoints = [
  { event: "100m Dash", mark: "10.52s", points: 970, runningTotal: 970 },
  { event: "Long Jump", mark: "7.78m", points: 1005, runningTotal: 1975 },
  { event: "Shot Put", mark: "15.42m", points: 816, runningTotal: 2791 },
  { event: "High Jump", mark: "2.08m", points: 878, runningTotal: 3669 },
  { event: "400m Dash", mark: "47.88s", points: 915, runningTotal: 4584 },
];

export function RelaySportPage() {
  const [mode, setMode] = useState<"relay" | "combined">("relay");

  return (
    <>
      <PageIntro
        eyebrow="Athletics · Relay & Combined Events"
        title="Baton Exchange Velocity & Multi-Discipline Scoring"
        text="Optimize exchange zone velocity in 4x100m / 4x400m relays and model point-progression trajectories across Decathlon and Heptathlon competitions."
        action={
          <div className="flex flex-col items-end gap-3">
            <DemoBadge />
            <div className="inline-flex rounded-md border border-border bg-secondary p-1">
              <button
                type="button"
                onClick={() => setMode("relay")}
                className={`rounded px-3 py-1.5 text-xs font-semibold transition ${
                  mode === "relay"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                4x100m / 4x400m Relay
              </button>
              <button
                type="button"
                onClick={() => setMode("combined")}
                className={`rounded px-3 py-1.5 text-xs font-semibold transition ${
                  mode === "combined"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Decathlon / Combined
              </button>
            </div>
          </div>
        }
      />

      <section className="py-12 bg-background">
        <div className="content-wrap">
          {mode === "relay" ? (
            <>
              <SectionHead
                eyebrow="Relay Exchange Diagnostics"
                title="4x100m National Qualifier: 37.94s"
                text="Optical track tracking over 30-meter acceleration and takeover zones."
              />

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                <MetricCard
                  label="Total Time"
                  value="37.94 s"
                  note="Season Best (SB)"
                  icon={<Trophy className="h-4 w-4 text-primary" />}
                />
                <MetricCard
                  label="Avg Exchange Delta"
                  value="1.71 s"
                  note="Sub-1.75s elite benchmark"
                  icon={<Shuffle className="h-4 w-4 text-accent" />}
                />
                <MetricCard
                  label="Incoming Velocity"
                  value="10.55 m/s"
                  note="Zone entry peak"
                  icon={<Gauge className="h-4 w-4" />}
                />
                <MetricCard
                  label="Outgoing Velocity"
                  value="10.07 m/s"
                  note="Breakout acceleration"
                  icon={<Zap className="h-4 w-4 text-chart-3" />}
                />
                <MetricCard
                  label="Exchange Efficiency"
                  value="97.4%"
                  note="+2.2% vs previous run"
                  icon={<Activity className="h-4 w-4" />}
                />
                <MetricCard
                  label="Transfer Position"
                  value="18.2 m"
                  note="Optimal 17-21m mark"
                  icon={<Milestone className="h-4 w-4" />}
                />
              </div>

              {/* 30m Exchange Zone Visualizer */}
              <div className="mt-8 surface-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      Exchange Box Modeling
                    </span>
                    <h3 className="text-lg font-bold">20m Takeover + 10m Acceleration Zone</h3>
                  </div>
                  <span className="rounded bg-primary/10 text-primary font-bold text-xs px-2.5 py-1">
                    Exchange 2: 1.68s Transfer
                  </span>
                </div>

                <div className="py-4">
                  <svg viewBox="0 0 740 160" className="w-full h-auto" role="img" aria-label="Relay Exchange Zone">
                    {/* Track lane */}
                    <rect x="20" y="40" width="700" height="80" fill="color-mix(in oklab, var(--primary) 5%, white)" stroke="var(--border)" strokeWidth="2" />
                    {/* Acceleration line (10m) */}
                    <line x1="160" y1="40" x2="160" y2="120" stroke="var(--border)" strokeWidth="2" strokeDasharray="4 4" />
                    <text x="50" y="30" fill="var(--muted-foreground)" fontSize="11">Pre-Zone (10m Accel)</text>

                    {/* Takeover Zone (20m) */}
                    <rect x="160" y="40" width="400" height="80" fill="color-mix(in oklab, var(--primary) 12%, transparent)" />
                    <line x1="560" y1="40" x2="560" y2="120" stroke="var(--border)" strokeWidth="2" />
                    <text x="290" y="30" fill="var(--primary)" fontSize="11" fontWeight="bold">20-Meter Passing Zone</text>

                    {/* Baton handoff spot */}
                    <circle cx="420" cy="80" r="10" fill="var(--primary)" stroke="white" strokeWidth="2" />
                    <text x="360" y="145" fill="var(--primary)" fontSize="11" fontWeight="bold">Handoff at 18.2m</text>

                    {/* Incoming and Outgoing Velocity vectors */}
                    <line x1="220" y1="70" x2="380" y2="70" stroke="var(--accent)" strokeWidth="3" markerEnd="url(#arrow)" />
                    <text x="240" y="65" fill="var(--accent)" fontSize="10">Incoming: 10.65 m/s</text>

                    <line x1="420" y1="90" x2="580" y2="90" stroke="var(--chart-3)" strokeWidth="3" markerEnd="url(#arrow)" />
                    <text x="460" y="105" fill="var(--chart-3)" fontSize="10">Outgoing: 10.12 m/s</text>
                  </svg>
                </div>
              </div>

              {/* Exchanges Breakdown Table */}
              <div className="mt-8 surface-card overflow-hidden">
                <div className="border-b border-border p-5">
                  <h3 className="font-bold text-base">Leg-by-Leg Transfer Breakdown</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Microsecond precision splits</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-secondary/70 text-muted-foreground font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-3.5">Exchange</th>
                        <th className="px-6 py-3.5">Transfer Delta</th>
                        <th className="px-6 py-3.5">Incoming Speed</th>
                        <th className="px-6 py-3.5">Outgoing Speed</th>
                        <th className="px-6 py-3.5">Transfer Efficiency</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {exchangeData.map((ex) => (
                        <tr key={ex.exchange} className="hover:bg-secondary/30 transition">
                          <td className="px-6 py-3.5 font-bold text-foreground">{ex.exchange}</td>
                          <td className="px-6 py-3.5 font-mono font-bold text-primary">{ex.delta}</td>
                          <td className="px-6 py-3.5 text-muted-foreground">{ex.incomingSpeed}</td>
                          <td className="px-6 py-3.5 text-foreground">{ex.outgoingSpeed}</td>
                          <td className="px-6 py-3.5 font-semibold text-foreground">{ex.efficiency}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            /* Combined Decathlon Events View */
            <>
              <SectionHead
                eyebrow="Combined Events"
                title="Decathlon Multi-Event Scoring Tracker"
                text="Day 1 point aggregation vs Olympic qualifying benchmark (8,350 pts target)."
              />

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <MetricCard label="Current Total" value="4,584 pts" note="Day 1 Complete" icon={<Trophy className="h-4 w-4 text-primary" />} />
                <MetricCard label="Target Pace" value="8,420 pts" note="+70 pts above benchmark" icon={<TrendingUp className="h-4 w-4 text-accent" />} />
                <MetricCard label="Strongest Event" value="Long Jump (1,005)" note="7.78m (+1.4 m/s)" icon={<Zap className="h-4 w-4" />} />
                <MetricCard label="Remaining Events" value="5 Events" note="Day 2: Hurdles, Discus, Pole Vault, Javelin, 1500m" icon={<Activity className="h-4 w-4" />} />
              </div>

              <div className="surface-card overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-secondary/70 text-muted-foreground font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3.5">Event</th>
                      <th className="px-6 py-3.5">Mark</th>
                      <th className="px-6 py-3.5">Points</th>
                      <th className="px-6 py-3.5">Running Cumulative</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {combinedPoints.map((cp) => (
                      <tr key={cp.event} className="hover:bg-secondary/30 transition">
                        <td className="px-6 py-3.5 font-bold text-foreground">{cp.event}</td>
                        <td className="px-6 py-3.5 font-mono text-foreground">{cp.mark}</td>
                        <td className="px-6 py-3.5 font-mono font-bold text-primary">+{cp.points} pts</td>
                        <td className="px-6 py-3.5 font-mono font-semibold text-foreground">{cp.runningTotal} pts</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
