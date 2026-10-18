import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart2,
  Calendar,
  CheckCircle2,
  Flame,
  Gauge,
  HeartPulse,
  Shield,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Users,
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
import { athletes, weekly } from "@/lib/sports-data";

export const Route = createFileRoute("/coaches")({
  head: () => ({
    meta: [
      { title: "Coaches & Teams Hub — SportsMax" },
      {
        name: "description",
        content:
          "Team dashboard, roster management, squad load monitoring, athlete comparison, and injury risk prevention models.",
      },
    ],
  }),
  component: CoachesPage,
});

const rosterMembers = [
  { name: "Aisha Raman", status: "Optimal", acwr: "1.08", weeklyLoad: "480 AU", injuryRisk: "Low (4%)", position: "Mid-distance" },
  { name: "Maya Chen", status: "Optimal", acwr: "1.12", weeklyLoad: "510 AU", injuryRisk: "Low (6%)", position: "Speed" },
  { name: "Leo Martins", status: "Warning: High Acute Spike", acwr: "1.42", weeklyLoad: "640 AU", injuryRisk: "Elevated (24%)", position: "Sprint / Relay" },
  { name: "Noah Williams", status: "Deloading", acwr: "0.82", weeklyLoad: "320 AU", injuryRisk: "Low (2%)", position: "Endurance" },
];

export function CoachesPage() {
  const [activeTab, setActiveTab] = useState<"team-dashboard" | "roster" | "comparison" | "load" | "injury">("team-dashboard");

  return (
    <>
      <PageIntro
        eyebrow="Coaches & Teams Section"
        title="Squad Intelligence & Load Governance"
        text="A unified command center for coaches, physical performance directors, and athletic trainers. Monitor squad readiness, mitigate soft-tissue injury risk, and benchmark roster depth."
        action={
          <div className="flex flex-col items-end gap-3">
            <DemoBadge />
            <div className="flex flex-wrap gap-1 bg-secondary p-1 rounded-lg border border-border">
              <button
                type="button"
                onClick={() => setActiveTab("team-dashboard")}
                className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                  activeTab === "team-dashboard" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Team Dashboard
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("roster")}
                className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                  activeTab === "roster" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Roster Management
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("comparison")}
                className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                  activeTab === "comparison" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Athlete Comparison
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("load")}
                className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                  activeTab === "load" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Load Management
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("injury")}
                className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                  activeTab === "injury" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Injury Risk
              </button>
            </div>
          </div>
        }
      />

      <section className="py-12 bg-background">
        <div className="content-wrap">
          {/* Tab 1: Team Dashboard */}
          {activeTab === "team-dashboard" && (
            <div className="grid gap-6">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <MetricCard label="Active Squad Size" value="32 Athletes" note="28 fully available" icon={<Users className="h-4 w-4 text-primary" />} />
                <MetricCard label="Team Readiness" value="94.2%" note="Optimal training state" icon={<Activity className="h-4 w-4 text-accent" />} />
                <MetricCard label="Mean ACWR" value="1.06" note="Safe progression" icon={<TrendingUp className="h-4 w-4" />} />
                <MetricCard label="Elevated Risk Flag" value="1 Athlete" note="Requires load reduction" icon={<AlertTriangle className="h-4 w-4 text-chart-3" />} />
                <MetricCard label="Weekly High-Speed" value="142 km" note="Squad sprint aggregate" icon={<Flame className="h-4 w-4 text-chart-1" />} />
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <BarChartCard title="Squad Aggregate Weekly Mileage" subtitle="Total volume distributed across all athletes" data={weekly} />
                <div className="surface-card p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">Coaching Action Item</span>
                    <h3 className="text-lg font-bold mt-1">Microcycle Load Prescription</h3>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      Squad average acute load is up 8.4% over baseline. Recommendation: Maintain current volume for Thursday's tactical session and cap high-speed sprint distance at 800m per athlete.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Generated by SportsMax AI</span>
                    <Button size="sm">Push Cues to Squad</Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Roster */}
          {activeTab === "roster" && (
            <div className="surface-card overflow-hidden">
              <div className="border-b border-border p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Squad Roster & Availability Status</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Real-time status based on morning biometrics</p>
                </div>
                <Button size="sm">Add Athlete</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-secondary/70 text-muted-foreground font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3.5">Athlete</th>
                      <th className="px-6 py-3.5">Discipline / Role</th>
                      <th className="px-6 py-3.5">ACWR</th>
                      <th className="px-6 py-3.5">Weekly Load</th>
                      <th className="px-6 py-3.5">Availability</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {rosterMembers.map((r) => (
                      <tr key={r.name} className="hover:bg-secondary/30 transition">
                        <td className="px-6 py-3.5 font-bold text-foreground">{r.name}</td>
                        <td className="px-6 py-3.5 text-muted-foreground">{r.position}</td>
                        <td className="px-6 py-3.5 font-mono font-bold text-foreground">{r.acwr}</td>
                        <td className="px-6 py-3.5 font-mono text-foreground">{r.weeklyLoad}</td>
                        <td className="px-6 py-3.5">
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                              r.status.includes("Warning")
                                ? "bg-destructive/10 text-destructive"
                                : "bg-primary/10 text-primary"
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Comparison */}
          {activeTab === "comparison" && (
            <div className="surface-card p-6">
              <h3 className="text-lg font-bold mb-2">Squad Athlete Comparison Matrix</h3>
              <p className="text-xs text-muted-foreground mb-6">
                Evaluate two athletes simultaneously across physical output, recovery rates, and speed percentiles.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="border border-border rounded-lg p-5">
                  <span className="text-xs font-bold text-primary">Athlete 1</span>
                  <h4 className="text-base font-bold mt-1">Aisha Raman</h4>
                  <p className="text-xs text-muted-foreground mt-1">VO2 Max: 56.4 · 10K PB: 44:12 · Consistency: 94%</p>
                </div>
                <div className="border border-border rounded-lg p-5">
                  <span className="text-xs font-bold text-accent">Athlete 2</span>
                  <h4 className="text-base font-bold mt-1">Maya Chen</h4>
                  <p className="text-xs text-muted-foreground mt-1">VO2 Max: 54.8 · 10K PB: 45:30 · Consistency: 88%</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Load */}
          {activeTab === "load" && (
            <div className="grid gap-6">
              <SectionHead
                eyebrow="Workload Governance"
                title="Squad Workload & Progression Guardrails"
                text="Automated monitoring ensures weekly mileage and sprint meters stay within safe adaptation limits."
              />
              <div className="surface-card p-6">
                <h3 className="text-base font-bold mb-4">Acute vs Chronic Workload Distribution</h3>
                <div className="h-44 bg-secondary/50 rounded-lg flex items-center justify-center text-xs text-muted-foreground">
                  <span className="font-semibold text-primary">All squad training blocks mapped to acute-to-chronic sweet spot (0.8 - 1.3)</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Injury Risk */}
          {activeTab === "injury" && (
            <div className="surface-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-destructive">Proactive Prevention</span>
                  <h3 className="text-lg font-bold">Injury Risk Prevention & Soft-Tissue Alerts</h3>
                </div>
                <span className="rounded-full bg-destructive/10 text-destructive border border-destructive/20 px-3 py-1 text-xs font-bold">
                  1 Alert Active
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-6">
                Machine learning models analyze asymmetric ground contact times, sudden sprint volume surges, and heart rate variability (HRV) depression to predict fatigue before clinical symptoms appear.
              </p>
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <div className="flex items-center gap-2 text-destructive font-bold text-xs uppercase tracking-wider">
                  <ShieldAlert className="h-4 w-4" /> High Risk Alert: Leo Martins
                </div>
                <p className="text-xs text-foreground mt-2 leading-relaxed">
                  Leo's acute sprint volume increased by 38% over the past 4 days, resulting in an ACWR spike to 1.42.
                  Asymmetric ground contact balance shifted 3.8% to the right leg. Action: Reduce intensity for 48 hours.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
