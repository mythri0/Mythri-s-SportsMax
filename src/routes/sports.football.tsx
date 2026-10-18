import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Crosshair,
  Flame,
  Gauge,
  Goal,
  Layers,
  MapPin,
  Play,
  RotateCcw,
  Shield,
  Sparkles,
  TrendingUp,
  Trophy,
  Users,
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
import { SportVideoSubmission } from "@/components/sport-video-submission";

export const Route = createFileRoute("/sports/football")({
  head: () => ({
    meta: [
      { title: "Football / Soccer Tactical Intelligence — SportsMax" },
      {
        name: "description",
        content:
          "Expected Goals (xG), pressing intensity (PPDA), pitch heatmaps, pass completion matrices, and match event telemetry.",
      },
    ],
  }),
  component: FootballSportPage,
});

const xGProgression = [
  { label: "15'", performance: 0.12, consistency: 0.08 },
  { label: "30'", performance: 0.44, consistency: 0.18 },
  { label: "45' (HT)", performance: 0.98, consistency: 0.42 },
  { label: "60'", performance: 1.45, consistency: 0.65 },
  { label: "75'", performance: 2.15, consistency: 0.82 },
  { label: "90' (FT)", performance: 2.48, consistency: 1.14 },
];

const matchEvents = [
  { minute: "14'", event: "Shot on Target", player: "M. Sterling", xG: "0.24", team: "SportsMax FC", type: "threat" },
  { minute: "32'", event: "High Press Turnover", player: "K. De Jong", xG: "—", team: "SportsMax FC", type: "defense" },
  { minute: "41'", event: "GOAL (Header)", player: "L. Martinez", xG: "0.54", team: "SportsMax FC", type: "goal" },
  { minute: "58'", event: "Counter-Attack Shot", player: "Opponent Fwd", xG: "0.38", team: "Opponent", type: "opponent" },
  { minute: "72'", event: "GOAL (Open Play)", player: "E. Fernandez", xG: "0.71", team: "SportsMax FC", type: "goal" },
];

export function FootballSportPage() {
  const [activeLayer, setActiveLayer] = useState<"shots" | "press" | "zones">("shots");

  return (
    <>
      <PageIntro
        eyebrow="Team Sports · Football / Soccer"
        title="Tactical Intelligence & Match Analytics"
        text="Transform optical pitch tracking and GPS vests into game-winning tactical decisions. Calculate live Expected Goals (xG), pressing effectiveness, and defensive line heights."
        action={
          <div className="flex flex-col items-end gap-3">
            <DemoBadge />
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Match Status:</span>
              <span className="rounded-full bg-primary/10 text-primary font-bold px-2.5 py-1 text-xs border border-primary/20">
                Full Time · 2 - 0
              </span>
            </div>
          </div>
        }
      />

      <section className="py-12 bg-background">
        <div className="content-wrap">
          {/* Match Scoreboard and KPIs */}
          <SectionHead
            eyebrow="Match Analysis"
            title="SportsMax FC 2 — 0 Capital City"
            text="Premier League Division 1 · Opta & Computer Vision Synchronized Feeds"
            action={
              <Button asChild size="sm">
                <Link to="/sports/game-analysis">
                  Open Game Analysis Suite <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            }
          />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <MetricCard
              label="Expected Goals (xG)"
              value="2.48 vs 1.14"
              note="+1.34 xG differential"
              icon={<Goal className="h-4 w-4 text-primary" />}
            />
            <MetricCard
              label="Possession %"
              value="58.2%"
              note="642 completed passes"
              icon={<RotateCcw className="h-4 w-4 text-accent" />}
            />
            <MetricCard
              label="PPDA (Pressing)"
              value="8.4 passes"
              note="High pressure tier (<10)"
              icon={<Flame className="h-4 w-4 text-chart-3" />}
            />
            <MetricCard
              label="High-Speed Distance"
              value="12.8 km"
              note="Team total > 19.8 km/h"
              icon={<Zap className="h-4 w-4" />}
            />
            <MetricCard
              label="Defensive Line"
              value="48.2 m"
              note="High compact block"
              icon={<Shield className="h-4 w-4" />}
            />
            <MetricCard
              label="Pass Accuracy"
              value="87.4%"
              note="Final third: 79.1%"
              icon={<Activity className="h-4 w-4" />}
            />
          </div>

          {/* Interactive Pitch Map Visualizer */}
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
            <div className="surface-card p-6 flex flex-col justify-between">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    Spatial Analysis
                  </span>
                  <h3 className="text-lg font-bold">2D Pitch Control & Shot Clusters</h3>
                </div>
                <div className="inline-flex rounded-md border border-border bg-secondary p-1">
                  <button
                    type="button"
                    onClick={() => setActiveLayer("shots")}
                    className={`rounded px-2.5 py-1 text-xs font-semibold transition ${
                      activeLayer === "shots"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Shot Map
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveLayer("press")}
                    className={`rounded px-2.5 py-1 text-xs font-semibold transition ${
                      activeLayer === "press"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Pressing Heat
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveLayer("zones")}
                    className={`rounded px-2.5 py-1 text-xs font-semibold transition ${
                      activeLayer === "zones"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Zone 14 Control
                  </button>
                </div>
              </div>

              {/* Soccer Pitch SVG */}
              <div className="py-2">
                <svg
                  viewBox="0 0 700 420"
                  className="w-full h-auto rounded-lg border border-border"
                  style={{ backgroundColor: "color-mix(in oklab, var(--primary) 7%, white)" }}
                  role="img"
                  aria-label="Football Pitch Tactical View"
                >
                  {/* Pitch outline & markings */}
                  <rect x="20" y="20" width="660" height="380" fill="none" stroke="var(--border)" strokeWidth="2" />
                  {/* Halfway line */}
                  <line x1="350" y1="20" x2="350" y2="400" stroke="var(--border)" strokeWidth="2" />
                  {/* Center circle */}
                  <circle cx="350" cy="210" r="60" fill="none" stroke="var(--border)" strokeWidth="2" />
                  <circle cx="350" cy="210" r="3" fill="var(--border)" />

                  {/* Left Penalty Area */}
                  <rect x="20" y="90" width="110" height="240" fill="none" stroke="var(--border)" strokeWidth="2" />
                  <rect x="20" y="150" width="40" height="120" fill="none" stroke="var(--border)" strokeWidth="2" />

                  {/* Right Penalty Area (Attacking end) */}
                  <rect x="570" y="90" width="110" height="240" fill="none" stroke="var(--border)" strokeWidth="2" />
                  <rect x="640" y="150" width="40" height="120" fill="none" stroke="var(--border)" strokeWidth="2" />

                  {/* Attacking Shot Locations */}
                  {activeLayer === "shots" && (
                    <>
                      {/* Goal 1 */}
                      <circle cx="635" cy="190" r="10" fill="var(--primary)" stroke="white" strokeWidth="2" />
                      <text x="615" y="170" fill="var(--primary)" fontSize="11" fontWeight="bold">GOAL 41' (0.54 xG)</text>

                      {/* Goal 2 */}
                      <circle cx="610" cy="235" r="12" fill="var(--primary)" stroke="white" strokeWidth="2" />
                      <text x="530" y="260" fill="var(--primary)" fontSize="11" fontWeight="bold">GOAL 72' (0.71 xG)</text>

                      {/* Shot saved */}
                      <circle cx="590" cy="160" r="7" fill="var(--accent)" opacity="0.8" />
                      <circle cx="550" cy="200" r="6" fill="var(--accent)" opacity="0.8" />
                      <circle cx="530" cy="280" r="5" fill="var(--accent)" opacity="0.8" />
                    </>
                  )}

                  {/* Pressing Heat Overlay */}
                  {activeLayer === "press" && (
                    <>
                      <circle cx="480" cy="210" r="80" fill="var(--primary)" opacity="0.25" />
                      <circle cx="480" cy="210" r="50" fill="var(--primary)" opacity="0.35" />
                      <text x="410" y="215" fill="var(--primary)" fontSize="12" fontWeight="bold">High Turnover Zone</text>
                    </>
                  )}

                  {/* Zone 14 */}
                  {activeLayer === "zones" && (
                    <>
                      <rect x="440" y="140" width="130" height="140" fill="var(--accent)" opacity="0.25" stroke="var(--accent)" strokeWidth="2" strokeDasharray="4 4" />
                      <text x="465" y="215" fill="var(--accent)" fontSize="13" fontWeight="bold">Zone 14 (34 Passes)</text>
                    </>
                  )}
                </svg>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border text-center text-xs">
                <div>
                  <span className="text-muted-foreground block">Total Shots</span>
                  <span className="font-bold text-foreground">16 (9 on target)</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Box Touches</span>
                  <span className="font-bold text-foreground">38 touches</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">xG / Shot</span>
                  <span className="font-bold text-primary">0.155 (High Quality)</span>
                </div>
              </div>
            </div>

            {/* xG Cumulative Line Chart */}
            <LineChartCard
              title="Cumulative Expected Goals (xG)"
              subtitle="SportsMax FC (Green) vs Capital City (Blue)"
              data={xGProgression}
              keys={["performance", "consistency"]}
              unit=" xG"
            />
          </div>

          {/* Match Events Feed */}
          <div className="mt-10 surface-card overflow-hidden">
            <div className="border-b border-border p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Key Match Events</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Automated event detection feed</p>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link to="/sports/game-analysis">Tactical Insights &rarr;</Link>
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-secondary/70 text-muted-foreground font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Time</th>
                    <th className="px-6 py-3.5">Event</th>
                    <th className="px-6 py-3.5">Player</th>
                    <th className="px-6 py-3.5">Team</th>
                    <th className="px-6 py-3.5">xG Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {matchEvents.map((e) => (
                    <tr key={e.minute + e.player} className="hover:bg-secondary/30 transition">
                      <td className="px-6 py-3.5 font-bold font-mono text-primary">{e.minute}</td>
                      <td className="px-6 py-3.5 font-semibold text-foreground">{e.event}</td>
                      <td className="px-6 py-3.5 text-muted-foreground">{e.player}</td>
                      <td className="px-6 py-3.5 text-foreground">{e.team}</td>
                      <td className="px-6 py-3.5 font-mono font-bold text-foreground">{e.xG}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Football Match & Practice Drill Video Upload */}
          <div className="mt-12">
            <SectionHead
              eyebrow="Match Video Upload & Telemetry Form"
              title="Upload Match Video Footage for Optical AI Analysis"
              text="Submit full-pitch or sideline recordings. Our neural vision pipeline extracts player speed, pressing PPDA, and goal probabilities directly."
            />
            <div className="mt-6 max-w-3xl">
              <SportVideoSubmission
                sportName="Football / Soccer"
                category="Team Sport"
                defaultDrill="Full Match Footage / Counter-Attack Drill"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
