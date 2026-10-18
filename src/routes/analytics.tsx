import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  CalendarCheck,
  CheckCircle2,
  Flame,
  Gauge,
  HeartPulse,
  LineChart as LineChartIcon,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AreaChartCard,
  BarChartCard,
  DemoBadge,
  InsightCard,
  LineChartCard,
  MetricCard,
  PageIntro,
  SectionHead,
} from "@/components/sports-ui";
import { insights, progression, recommendations, runTrend, weekly } from "@/lib/sports-data";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics & AI Intelligence — SportsMax" },
      {
        name: "description",
        content:
          "Performance insights, acute-to-chronic training load, recovery readiness, comparative analytics, and automated AI recommendations.",
      },
    ],
  }),
  component: AnalyticsSuitePage,
});

export function AnalyticsSuitePage() {
  const [activeTab, setActiveTab] = useState<"performance" | "load-recovery" | "comparative" | "trends" | "ai-recs">("performance");

  return (
    <>
      <PageIntro
        eyebrow="Analytics Suite"
        title="Comprehensive Performance Analytics & Machine Learning"
        text="Turn millions of data points across sessions into clear diagnostic trends, acute-to-chronic load monitoring, and prescriptive coaching cues."
        action={
          <div className="flex flex-col items-end gap-3">
            <DemoBadge />
            <div className="flex flex-wrap gap-1 bg-secondary p-1 rounded-lg border border-border">
              <button
                type="button"
                onClick={() => setActiveTab("performance")}
                className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                  activeTab === "performance" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Performance Insights
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("load-recovery")}
                className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                  activeTab === "load-recovery" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Training Load & Recovery
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("comparative")}
                className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                  activeTab === "comparative" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Comparative Analytics
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("trends")}
                className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                  activeTab === "trends" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Trend Detection
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("ai-recs")}
                className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                  activeTab === "ai-recs" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                AI Recommendations
              </button>
            </div>
          </div>
        }
      />

      <section className="py-12 bg-background">
        <div className="content-wrap">
          {/* Tab 1: Performance Insights */}
          {activeTab === "performance" && (
            <div>
              <SectionHead
                eyebrow="Diagnostic Signals"
                title="Automated Performance Insights"
                text="Generated continuously by scanning pace efficiency, cardiac drift, and volume markers."
              />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {insights.map((item) => (
                  <InsightCard key={item.title} {...item} />
                ))}
              </div>
              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <LineChartCard title="Pace vs Heart Rate Efficiency" data={runTrend} keys={["pace", "heart"]} unit="" />
                <AreaChartCard title="Progression Index (6 Months)" data={progression} />
              </div>
            </div>
          )}

          {/* Tab 2: Load & Recovery */}
          {activeTab === "load-recovery" && (
            <div>
              <SectionHead
                eyebrow="Biometrics & Load"
                title="Acute-to-Chronic Workload Ratio (ACWR)"
                text="Keep athletes in the sweet spot (0.8 - 1.3 ACWR) to optimize adaptation while preventing soft-tissue injury spikes."
              />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard label="Acute Workload (7 Days)" value="524 AU" note="Optimal training stimulus" icon={<Flame className="h-4 w-4 text-primary" />} />
                <MetricCard label="Chronic Workload (28 Days)" value="480 AU" note="Established fitness base" icon={<Activity className="h-4 w-4 text-accent" />} />
                <MetricCard label="ACWR Index" value="1.09" note="Sweet spot (0.8 - 1.3)" icon={<TrendingUp className="h-4 w-4 text-chart-1" />} />
                <MetricCard label="Recovery Readiness" value="92 / 100" note="HRV: 68ms · Fully primed" icon={<HeartPulse className="h-4 w-4 text-primary" />} />
              </div>
              <div className="mt-8 surface-card p-6">
                <h3 className="font-bold text-base mb-2">Training Load Distribution (Sweet Spot Range)</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  The green corridor indicates the optimal workload window. Recent sessions remain safely within the safe adaptation tier.
                </p>
                <div className="h-48 w-full bg-secondary/40 rounded-lg border border-border p-4 flex items-center justify-center text-xs text-muted-foreground">
                  <span className="font-mono font-bold text-primary text-sm">
                    Current ACWR: 1.09 (Safe & Progressive) · 0 Overload Warnings Detected
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Comparative Analytics */}
          {activeTab === "comparative" && (
            <div>
              <SectionHead
                eyebrow="Cohort Benchmarks"
                title="Comparative Cohort Analytics"
                text="Benchmark against top 10% age-group and division peers across pace, volume, and recovery."
              />
              <div className="surface-card overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-secondary/70 text-muted-foreground font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3.5">Metric</th>
                      <th className="px-6 py-3.5">Athlete Score</th>
                      <th className="px-6 py-3.5">Cohort Median</th>
                      <th className="px-6 py-3.5">Top 10% Elite Tier</th>
                      <th className="px-6 py-3.5">Percentile</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-secondary/30 transition">
                      <td className="px-6 py-3.5 font-bold">10K Race Pace</td>
                      <td className="px-6 py-3.5 font-mono text-primary font-bold">4:58 /km</td>
                      <td className="px-6 py-3.5 font-mono text-muted-foreground">5:45 /km</td>
                      <td className="px-6 py-3.5 font-mono text-foreground">4:40 /km</td>
                      <td className="px-6 py-3.5 font-bold text-primary">88th Percentile</td>
                    </tr>
                    <tr className="hover:bg-secondary/30 transition">
                      <td className="px-6 py-3.5 font-bold">Monthly Mileage</td>
                      <td className="px-6 py-3.5 font-mono text-primary font-bold">124 km</td>
                      <td className="px-6 py-3.5 font-mono text-muted-foreground">85 km</td>
                      <td className="px-6 py-3.5 font-mono text-foreground">140 km</td>
                      <td className="px-6 py-3.5 font-bold text-primary">91st Percentile</td>
                    </tr>
                    <tr className="hover:bg-secondary/30 transition">
                      <td className="px-6 py-3.5 font-bold">Weekly Consistency</td>
                      <td className="px-6 py-3.5 font-mono text-primary font-bold">94%</td>
                      <td className="px-6 py-3.5 font-mono text-muted-foreground">72%</td>
                      <td className="px-6 py-3.5 font-mono text-foreground">92%</td>
                      <td className="px-6 py-3.5 font-bold text-primary">95th Percentile</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 4: Trend Detection */}
          {activeTab === "trends" && (
            <div>
              <SectionHead
                eyebrow="Macrocycle Tracking"
                title="Trend & Pattern Detection"
                text="Longitudinal analysis identifying micro-adaptations over 12 and 24-week blocks."
              />
              <div className="grid gap-6 lg:grid-cols-2">
                <LineChartCard title="Pace Adaptation vs Cardiac Load" data={runTrend} keys={["pace", "heart"]} unit="" />
                <BarChartCard title="Weekly Training Volume (km)" data={weekly} />
              </div>
            </div>
          )}

          {/* Tab 5: AI Recommendations */}
          {activeTab === "ai-recs" && (
            <div>
              <SectionHead
                eyebrow="Prescriptive Cues"
                title="AI Training Recommendations"
                text="Automated microcycle adjustments formulated by SportsMax AI models."
              />
              <div className="grid gap-4 md:grid-cols-3">
                {recommendations.map((rec) => (
                  <div key={rec.number} className="surface-card p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-primary">Cue #{rec.number}</span>
                        <span className="rounded bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-bold uppercase">{rec.priority}</span>
                      </div>
                      <h3 className="mt-3 text-lg font-bold text-foreground">{rec.title}</h3>
                      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{rec.detail}</p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-mono">{rec.evidence}</span>
                      <span className="text-primary font-bold">Apply cue &rarr;</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
