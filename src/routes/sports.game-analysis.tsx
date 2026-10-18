import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  BarChart2,
  BrainCircuit,
  CheckCircle2,
  Compass,
  FileSpreadsheet,
  Flame,
  LayoutDashboard,
  Play,
  RotateCcw,
  Search,
  Share2,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
  Video,
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

export const Route = createFileRoute("/sports/game-analysis")({
  head: () => ({
    meta: [
      { title: "Game Analysis & Tactical Intelligence Suite — SportsMax" },
      {
        name: "description",
        content:
          "Match dashboard, tactical insights, player comparison radar, team comparison, automated event detection, and custom coaching reports.",
      },
    ],
  }),
  component: GameAnalysisPage,
});

const comparisonMetrics = [
  { metric: "Top Sprint Speed", playerA: "34.8 km/h", playerB: "33.2 km/h", winner: "A" },
  { metric: "Distance Covered (90')", playerA: "11.4 km", playerB: "12.1 km", winner: "B" },
  { metric: "Pass Completion Rate", playerA: "88.4%", playerB: "81.6%", winner: "A" },
  { metric: "Key Passes / 90", playerA: "2.8", playerB: "1.4", winner: "A" },
  { metric: "Pressures Applied", playerA: "18.2", playerB: "24.6", winner: "B" },
  { metric: "Tackle Success Rate", playerA: "64.0%", playerB: "78.5%", winner: "B" },
  { metric: "Expected Goals (xG)", playerA: "0.42", playerB: "0.18", winner: "A" },
];

export function GameAnalysisPage() {
  const [activeModule, setActiveModule] = useState<
    "match-dashboard" | "tactical" | "player-comp" | "team-comp" | "events" | "reports"
  >("match-dashboard");

  return (
    <>
      <PageIntro
        eyebrow="Sports Intelligence · Game Analysis Suite"
        title="Tactical Modeling & Match Intelligence"
        text="A unified multi-sport game analysis engine for video analysts, technical directors, and coaches. Combine synchronized broadcast video, wearable telemetry, and AI detection models."
        action={
          <div className="flex flex-col items-end gap-3">
            <DemoBadge />
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <Share2 className="h-4 w-4 mr-1.5" /> Export PDF
              </Button>
              <Button asChild size="sm">
                <Link to="/sports">All Sports Hub &rarr;</Link>
              </Button>
            </div>
          </div>
        }
      />

      <section className="py-12 bg-background">
        <div className="content-wrap">
          {/* Module Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4 mb-8">
            <button
              type="button"
              onClick={() => setActiveModule("match-dashboard")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeModule === "match-dashboard"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" /> Match Dashboard
            </button>

            <button
              type="button"
              onClick={() => setActiveModule("tactical")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeModule === "tactical"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <BrainCircuit className="h-4 w-4" /> Tactical Insights
            </button>

            <button
              type="button"
              onClick={() => setActiveModule("player-comp")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeModule === "player-comp"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="h-4 w-4" /> Player Comparison
            </button>

            <button
              type="button"
              onClick={() => setActiveModule("team-comp")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeModule === "team-comp"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <BarChart2 className="h-4 w-4" /> Team Comparison
            </button>

            <button
              type="button"
              onClick={() => setActiveModule("events")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeModule === "events"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <Video className="h-4 w-4" /> Event Detection
            </button>

            <button
              type="button"
              onClick={() => setActiveModule("reports")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeModule === "reports"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileSpreadsheet className="h-4 w-4" /> Custom Reports
            </button>
          </div>

          {/* Module 1: Match Dashboard */}
          {activeModule === "match-dashboard" && (
            <div className="grid gap-6">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard label="Live Win Probability" value="78.4%" note="Momentum Peak at 72'" icon={<TrendingUp className="h-4 w-4 text-primary" />} />
                <MetricCard label="Field Tilt %" value="64.1%" note="Dominance in final 3rd" icon={<Compass className="h-4 w-4 text-accent" />} />
                <MetricCard label="Expected Threat (xT)" value="+1.84" note="Progressive ball carries" icon={<Zap className="h-4 w-4 text-chart-3" />} />
                <MetricCard label="High Turnover Efficiency" value="44%" note="Shots generated off press" icon={<Flame className="h-4 w-4" />} />
              </div>

              <div className="surface-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">Live Match Monitor</span>
                    <h3 className="text-lg font-bold">Real-Time Pitch Pressure & Win Expectancy</h3>
                  </div>
                  <span className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-bold">
                    Connected to Optical Trackers
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  SportsMax synthesizes 25 frames-per-second broadcast feed tracking into synchronized positional coordinates.
                  Algorithms calculate live expected threat (xT), passing vectors, and defensive vulnerability in under 300 milliseconds.
                </p>
              </div>
            </div>
          )}

          {/* Module 2: Tactical Insights */}
          {activeModule === "tactical" && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="surface-card p-6 border-l-4 border-l-primary">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Tactical Alert</span>
                <h3 className="text-base font-bold mt-2">Opponent Left Flank Vulnerability</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Opponent fullback is stepping out 12 meters early during press transitions, leaving a 28-meter corridor open for diagonal through balls.
                </p>
                <div className="mt-4 pt-3 border-t border-border flex justify-between text-xs font-bold text-primary">
                  <span>Confidence: 94%</span>
                  <span>4 Occurrences</span>
                </div>
              </div>

              <div className="surface-card p-6 border-l-4 border-l-accent">
                <span className="text-xs font-bold uppercase tracking-wider text-accent">Spacing Anomaly</span>
                <h3 className="text-base font-bold mt-2">Midfield Compactness Optimal</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Average distance between center backs and central midfielders is maintained at 14.2 meters, reducing opponent line breaks by 41%.
                </p>
                <div className="mt-4 pt-3 border-t border-border flex justify-between text-xs font-bold text-accent">
                  <span>Compactness: High</span>
                  <span>Zone 14 Protected</span>
                </div>
              </div>

              <div className="surface-card p-6 border-l-4 border-l-chart-3">
                <span className="text-xs font-bold uppercase tracking-wider text-chart-3">Transition Speed</span>
                <h3 className="text-base font-bold mt-2">Counter-Attack Phase Velocity</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Regaining possession in the middle third leads to a shot within 8.6 seconds on average, exceeding league top quartile pace.
                </p>
                <div className="mt-4 pt-3 border-t border-border flex justify-between text-xs font-bold text-chart-3">
                  <span>Speed: 24.2 km/h</span>
                  <span>3 Shots generated</span>
                </div>
              </div>
            </div>
          )}

          {/* Module 3: Player Comparison */}
          {activeModule === "player-comp" && (
            <div className="surface-card overflow-hidden">
              <div className="border-b border-border p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Head-to-Head Radar</span>
                  <h3 className="text-lg font-bold">Player A (Winger) vs Player B (Box-to-Box Midfielder)</h3>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-primary" /> Player A (Green)</span>
                  <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-accent" /> Player B (Blue)</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-secondary/70 text-muted-foreground font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3.5">Performance Metric</th>
                      <th className="px-6 py-3.5">Player A (Attacking Output)</th>
                      <th className="px-6 py-3.5">Player B (Defensive Engine)</th>
                      <th className="px-6 py-3.5">Advantage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {comparisonMetrics.map((m) => (
                      <tr key={m.metric} className="hover:bg-secondary/30 transition">
                        <td className="px-6 py-3.5 font-bold text-foreground">{m.metric}</td>
                        <td className="px-6 py-3.5 font-mono text-foreground font-semibold">{m.playerA}</td>
                        <td className="px-6 py-3.5 font-mono text-foreground font-semibold">{m.playerB}</td>
                        <td className="px-6 py-3.5">
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                              m.winner === "A"
                                ? "bg-primary/10 text-primary"
                                : "bg-accent/15 text-accent"
                            }`}
                          >
                            Player {m.winner} Advantage
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Module 4: Team Comparison */}
          {activeModule === "team-comp" && (
            <div className="surface-card p-6">
              <h3 className="text-lg font-bold mb-2">Team Benchmark: SportsMax FC vs League Median</h3>
              <p className="text-xs text-muted-foreground mb-6">
                Comparative percentile ranks normalized across 38 regular season fixtures.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg bg-secondary/50 p-4 border border-border">
                  <span className="text-xs text-muted-foreground">High Press Intensity</span>
                  <p className="text-2xl font-bold font-mono text-primary mt-1">94th Percentile</p>
                  <span className="text-[11px] text-muted-foreground">PPDA 8.4 vs 12.8</span>
                </div>
                <div className="rounded-lg bg-secondary/50 p-4 border border-border">
                  <span className="text-xs text-muted-foreground">Expected Goal Difference</span>
                  <p className="text-2xl font-bold font-mono text-primary mt-1">+0.82 / match</p>
                  <span className="text-[11px] text-muted-foreground">Ranked #2 in division</span>
                </div>
                <div className="rounded-lg bg-secondary/50 p-4 border border-border">
                  <span className="text-xs text-muted-foreground">Set Piece Efficiency</span>
                  <p className="text-2xl font-bold font-mono text-accent mt-1">88th Percentile</p>
                  <span className="text-[11px] text-muted-foreground">14 goals scored off corners</span>
                </div>
                <div className="rounded-lg bg-secondary/50 p-4 border border-border">
                  <span className="text-xs text-muted-foreground">Roster Age & Mileage</span>
                  <p className="text-2xl font-bold font-mono text-chart-3 mt-1">24.6 years</p>
                  <span className="text-[11px] text-muted-foreground">Optimal physical peak window</span>
                </div>
              </div>
            </div>
          )}

          {/* Module 5: Event Detection */}
          {activeModule === "events" && (
            <div className="surface-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Automated Video Tagging</span>
                  <h3 className="text-lg font-bold">142 Machine-Detected Match Milestones</h3>
                </div>
                <span className="rounded bg-primary/10 text-primary font-bold text-xs px-2.5 py-1">
                  100% Computer Vision Verified
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-6">
                Automated clip generation for video sessions: shots on target, offside calls, set piece routines, tackle regains, and tactical transitions.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="border border-border rounded-lg p-3 hover:bg-secondary/40 transition">
                  <span className="text-[11px] font-mono font-bold text-primary">Tag #104 · 41:12</span>
                  <h4 className="font-bold text-sm mt-1">Goal: Header from Corner Routine</h4>
                  <p className="text-xs text-muted-foreground mt-1">xG: 0.54 · Near post run</p>
                </div>
                <div className="border border-border rounded-lg p-3 hover:bg-secondary/40 transition">
                  <span className="text-[11px] font-mono font-bold text-primary">Tag #118 · 56:44</span>
                  <h4 className="font-bold text-sm mt-1">High Press Ball Recovery</h4>
                  <p className="text-xs text-muted-foreground mt-1">Recovered in 4.2 seconds</p>
                </div>
                <div className="border border-border rounded-lg p-3 hover:bg-secondary/40 transition">
                  <span className="text-[11px] font-mono font-bold text-primary">Tag #132 · 72:08</span>
                  <h4 className="font-bold text-sm mt-1">Goal: Cutback from Right Flank</h4>
                  <p className="text-xs text-muted-foreground mt-1">xG: 0.71 · 6-pass buildup</p>
                </div>
              </div>
            </div>
          )}

          {/* Module 6: Custom Reports */}
          {activeModule === "reports" && (
            <div className="surface-card p-8 text-center max-w-2xl mx-auto">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FileSpreadsheet className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold">One-Click Coaching & Executive Reports</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Generate formatted PDF dossiers, tactical video summaries, and individual player feedback sheets in seconds.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button size="sm">
                  Download Full Match PDF <Share2 className="h-4 w-4 ml-1.5" />
                </Button>
                <Button size="sm" variant="outline">
                  Download Tactical Slides
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
