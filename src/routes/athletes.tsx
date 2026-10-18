import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Award,
  CalendarCheck,
  CheckCircle2,
  Gauge,
  Map,
  Medal,
  Sparkles,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AreaChartCard,
  BarChartCard,
  DemoBadge,
  LineChartCard,
  MetricCard,
  PageIntro,
  SectionHead,
} from "@/components/sports-ui";
import { athletes, leaderboard, progression, runTrend, weekly } from "@/lib/sports-data";

export const Route = createFileRoute("/athletes")({
  head: () => ({
    meta: [
      { title: "Athletes Hub & Personal Intelligence — SportsMax" },
      {
        name: "description",
        content:
          "Athlete dashboard, detailed biometric profiles, goals and progress tracking, consistency streaks, and verified personal bests.",
      },
    ],
  }),
  component: AthletesPage,
});

const personalBests = [
  { event: "5K Road", mark: "20:45", date: "Aug 14, 2026", progress: "-42s" },
  { event: "10K Road", mark: "44:12", date: "Sep 18, 2026", progress: "-1m 18s" },
  { event: "Half Marathon", mark: "1:38:20", date: "Jul 02, 2026", progress: "-3m 05s" },
  { event: "100m Freestyle (Swim)", mark: "1:02.4", date: "Jun 12, 2026", progress: "-0.8s" },
  { event: "High Jump", mark: "2.28 m", date: "Sep 22, 2026", progress: "+4 cm" },
];

export function AthletesPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "profiles" | "goals" | "consistency" | "bests">("dashboard");

  return (
    <>
      <PageIntro
        eyebrow="Athletes Section"
        title="Athlete Intelligence & Development"
        text="A dedicated athlete cockpit. Track performance scores, personal records, goal adherence, and training consistency with automated biometric feedback."
        action={
          <div className="flex flex-col items-end gap-3">
            <DemoBadge />
            <div className="flex flex-wrap gap-1 bg-secondary p-1 rounded-lg border border-border">
              <button
                type="button"
                onClick={() => setActiveTab("dashboard")}
                className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                  activeTab === "dashboard" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("profiles")}
                className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                  activeTab === "profiles" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Profiles
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("goals")}
                className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                  activeTab === "goals" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Goals & Progress
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("consistency")}
                className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                  activeTab === "consistency" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Consistency
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("bests")}
                className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                  activeTab === "bests" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Personal Bests
              </button>
            </div>
          </div>
        }
      />

      <section className="py-12 bg-background">
        <div className="content-wrap">
          {/* Tab 1: Dashboard */}
          {activeTab === "dashboard" && (
            <div className="grid gap-6">
              <div className="surface-card grid gap-6 p-6 md:grid-cols-[auto_1fr_auto] md:items-center">
                <div className="grid h-20 w-20 place-items-center rounded-full bg-primary text-2xl font-bold text-primary-foreground shadow-md">
                  AR
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-semibold">Aisha Raman</h2>
                    <span className="rounded border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                      Track & Road Runner
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    SportsMax Athletics Club · Active Goal: Sub-44 minute 10K road race
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-6 text-right">
                  <div>
                    <p className="text-2xl font-bold font-mono text-foreground">148</p>
                    <p className="text-xs text-muted-foreground">Logged sessions</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-mono text-foreground">1,024 km</p>
                    <p className="text-xs text-muted-foreground">Season distance</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <MetricCard label="Performance Score" value="88 / 100" note="Top 8% cohort" icon={<Gauge className="h-4 w-4 text-primary" />} />
                <MetricCard label="Weekly Volume" value="38.4 km" note="4 sessions completed" icon={<Target className="h-4 w-4 text-accent" />} />
                <MetricCard label="Avg Pace" value="4:58 /km" note="-12s vs last cycle" icon={<Activity className="h-4 w-4" />} />
                <MetricCard label="Personal Best" value="44:12" note="10K · Sep 18" icon={<Trophy className="h-4 w-4 text-chart-3" />} />
                <MetricCard label="Consistency Streak" value="91%" note="12 weeks unbroken" icon={<CalendarCheck className="h-4 w-4 text-chart-1" />} />
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <LineChartCard title="Pace Trajectory" data={runTrend} keys={["pace"]} unit=" /km" />
                <BarChartCard title="Weekly Mileage Consistency" data={weekly} />
              </div>
            </div>
          )}

          {/* Tab 2: Profiles */}
          {activeTab === "profiles" && (
            <div>
              <SectionHead
                eyebrow="Roster & Profiles"
                title="Monitored Athlete Profiles"
                text="Athletic metrics, current paces, and progression across individual sports."
              />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {athletes.map((a) => (
                  <div key={a.name} className="surface-card p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                          {a.initials}
                        </span>
                        <div>
                          <h3 className="font-bold text-base text-foreground">{a.name}</h3>
                          <span className="text-xs text-muted-foreground">{a.sessions} sessions</span>
                        </div>
                      </div>
                      <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
                        <div className="rounded bg-secondary p-2.5">
                          <span className="text-muted-foreground block">Distance</span>
                          <span className="font-bold font-mono text-foreground text-sm">{a.distance}</span>
                        </div>
                        <div className="rounded bg-secondary p-2.5">
                          <span className="text-muted-foreground block">Avg Pace</span>
                          <span className="font-bold font-mono text-foreground text-sm">{a.pace}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progression</span>
                      <span className="font-bold text-primary">{a.progress}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Goals */}
          {activeTab === "goals" && (
            <div className="grid gap-6">
              <SectionHead
                eyebrow="Milestones"
                title="Active Training Goals"
                text="Structured microcycle and macrocycle performance milestones."
              />
              <div className="surface-card p-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-sm">Sub-44 Minute 10K Target</span>
                  <span className="font-mono text-xs font-bold text-primary">82% Completed</span>
                </div>
                <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "82%" }} />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Current benchmark: 44:12 (-12s needed). Predicted achievement window: Next competitive race in 3 weeks.
                </p>
              </div>

              <div className="surface-card p-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-sm">Monthly 140km Mileage Volume</span>
                  <span className="font-mono text-xs font-bold text-accent">88% Completed</span>
                </div>
                <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: "88%" }} />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  124 km logged of 140 km target with 7 days remaining in the training block.
                </p>
              </div>
            </div>
          )}

          {/* Tab 4: Consistency */}
          {activeTab === "consistency" && (
            <div>
              <SectionHead
                eyebrow="Routine Adherence"
                title="Consistency Matrix & Training Streak"
                text="Consistency is the strongest statistical predictor of long-term athletic durability and performance."
              />
              <div className="surface-card p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">Active Streak</span>
                    <h3 className="text-2xl font-bold mt-1">21 Consecutive Training Days</h3>
                  </div>
                  <span className="rounded-full bg-primary/10 text-primary px-3 py-1 font-bold text-xs">
                    Level 4 Durability Badge
                  </span>
                </div>
              </div>
              <LineChartCard title="6-Month Consistency Percentage" data={progression} keys={["consistency"]} unit="%" />
            </div>
          )}

          {/* Tab 5: Personal Bests */}
          {activeTab === "bests" && (
            <div className="surface-card overflow-hidden">
              <div className="border-b border-border p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Verified Personal Bests</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Chronologically verified records</p>
                </div>
                <Button size="sm">Log New PB</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-secondary/70 text-muted-foreground font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3.5">Event / Discipline</th>
                      <th className="px-6 py-3.5">Mark / Time</th>
                      <th className="px-6 py-3.5">Date Achieved</th>
                      <th className="px-6 py-3.5">Improvement Delta</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {personalBests.map((pb) => (
                      <tr key={pb.event} className="hover:bg-secondary/30 transition">
                        <td className="px-6 py-3.5 font-bold text-foreground flex items-center gap-2">
                          <Medal className="h-4 w-4 text-primary" /> {pb.event}
                        </td>
                        <td className="px-6 py-3.5 font-mono text-base font-bold text-primary">{pb.mark}</td>
                        <td className="px-6 py-3.5 text-muted-foreground">{pb.date}</td>
                        <td className="px-6 py-3.5 font-semibold text-foreground">{pb.progress}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
