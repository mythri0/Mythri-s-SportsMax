import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Clock3,
  Compass,
  Gauge,
  RotateCcw,
  Shield,
  ShieldAlert,
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

export const Route = createFileRoute("/sports/hockey")({
  head: () => ({
    meta: [
      { title: "Hockey Intelligence & Shift Analytics — SportsMax" },
      {
        name: "description",
        content:
          "Ice hockey and field hockey telemetry: shift duration, Corsi possession %, zone entries, and transition acceleration.",
      },
    ],
  }),
  component: HockeySportPage,
});

const shiftPacing = [
  { label: "P1: 05'", performance: 48, consistency: 42 },
  { label: "P1: 15'", performance: 56, consistency: 44 },
  { label: "P2: 05'", performance: 59, consistency: 41 },
  { label: "P2: 15'", performance: 62, consistency: 38 },
  { label: "P3: 05'", performance: 64, consistency: 36 },
  { label: "P3: 15'", performance: 58, consistency: 42 },
];

const lineCombinations = [
  { line: "Forward Line 1", timeOnIce: "18:42", corsiForPct: "61.4%", xGF: "1.84", zoneEntryPct: "74%" },
  { line: "Forward Line 2", timeOnIce: "16:15", corsiForPct: "55.2%", xGF: "1.12", zoneEntryPct: "66%" },
  { line: "Defensive Pair 1", timeOnIce: "22:10", corsiForPct: "58.9%", xGF: "1.45", zoneEntryPct: "69%" },
  { line: "Powerplay Unit 1", timeOnIce: "04:30", corsiForPct: "82.1%", xGF: "1.25", zoneEntryPct: "88%" },
];

export function HockeySportPage() {
  return (
    <>
      <PageIntro
        eyebrow="Team Sports · Hockey"
        title="Hockey Shift Velocity & Possession Analytics"
        text="High-frequency telemetry for on-ice shifts, zone entry velocities, puck possession modeling, and transition defense."
        action={
          <div className="flex flex-col items-end gap-3">
            <DemoBadge />
            <span className="rounded-full bg-chart-4/10 text-chart-4 font-bold px-3 py-1 text-xs border border-chart-4/20">
              Period 3 · 4 - 2 Win
            </span>
          </div>
        }
      />

      <section className="py-12 bg-background">
        <div className="content-wrap">
          <SectionHead
            eyebrow="Game Summary"
            title="SportsMax Blades 4 — 2 North Star"
            text="RFID puck tracking and optical tracking telemetry across 60 minutes of high-tempo hockey."
          />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <MetricCard
              label="Corsi For %"
              value="58.4%"
              note="Shot attempt control"
              icon={<ShieldAlert className="h-4 w-4 text-chart-4" />}
            />
            <MetricCard
              label="Avg Shift Length"
              value="42.8 s"
              note="Optimal (<45s)"
              icon={<Clock3 className="h-4 w-4 text-primary" />}
            />
            <MetricCard
              label="Zone Entries (Controlled)"
              value="71.2%"
              note="+14% vs league avg"
              icon={<ArrowRight className="h-4 w-4 text-accent" />}
            />
            <MetricCard
              label="Faceoff Win %"
              value="56.8%"
              note="33 of 58 won"
              icon={<RotateCcw className="h-4 w-4" />}
            />
            <MetricCard
              label="Transition Speed"
              value="28.4 km/h"
              note="Neutral zone breakout"
              icon={<Zap className="h-4 w-4 text-chart-3" />}
            />
            <MetricCard
              label="Powerplay Efficiency"
              value="33.3%"
              note="2 goals on 6 chances"
              icon={<Trophy className="h-4 w-4" />}
            />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <LineChartCard
              title="Possession Control (Corsi % by Period)"
              subtitle="SportsMax Blades sustained high pressure through the 2nd period"
              data={shiftPacing}
              keys={["performance"]}
              unit="%"
            />

            <div className="surface-card p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Shift Fatigue Thresholds
                </span>
                <h3 className="text-lg font-bold mt-1">Shift Duration vs Skating Velocity</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Data indicates a 14% drop-off in high-intensity sprint bursts when player shifts exceed 48 seconds.
                  Keeping lines under 45 seconds ensured sustained forechecking pressure.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-secondary/70 p-3.5 border border-border">
                    <span className="text-[11px] text-muted-foreground block">Shifts &lt; 45s</span>
                    <span className="text-base font-bold text-primary">31.2 km/h peak speed</span>
                  </div>
                  <div className="rounded-lg bg-secondary/70 p-3.5 border border-border">
                    <span className="text-[11px] text-muted-foreground block">Shifts &gt; 55s</span>
                    <span className="text-base font-bold text-destructive">25.8 km/h (-17%)</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Bench rotation balance: Excellent</span>
                <Link to="/sports/game-analysis" className="font-bold text-primary hover:underline">
                  Full Tactical Analysis &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Line Combinations */}
          <div className="mt-10 surface-card overflow-hidden">
            <div className="border-b border-border p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Line Combination Effectiveness</h3>
                <p className="text-xs text-muted-foreground mt-0.5">5v5 on-ice performance rates</p>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link to="/sports">All Sports &rarr;</Link>
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-secondary/70 text-muted-foreground font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Unit</th>
                    <th className="px-6 py-3.5">Time on Ice</th>
                    <th className="px-6 py-3.5">Corsi For %</th>
                    <th className="px-6 py-3.5">Expected Goals (xGF)</th>
                    <th className="px-6 py-3.5">Controlled Zone Entries</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {lineCombinations.map((l) => (
                    <tr key={l.line} className="hover:bg-secondary/30 transition">
                      <td className="px-6 py-3.5 font-bold text-foreground">{l.line}</td>
                      <td className="px-6 py-3.5 text-muted-foreground font-mono">{l.timeOnIce}</td>
                      <td className="px-6 py-3.5 font-mono font-bold text-primary">{l.corsiForPct}</td>
                      <td className="px-6 py-3.5 font-mono text-foreground">{l.xGF}</td>
                      <td className="px-6 py-3.5 font-semibold text-foreground">{l.zoneEntryPct}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
