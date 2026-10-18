import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  Flame,
  Globe,
  Heart,
  MessageSquare,
  Radio,
  Share2,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoBadge, PageIntro, SectionHead } from "@/components/sports-ui";
import { leaderboard } from "@/lib/sports-data";

export const Route = createFileRoute("/ecosystem")({
  head: () => ({
    meta: [
      { title: "SportsMax Ecosystem — Athletes, Coaches, Communities & Fans" },
      {
        name: "description",
        content:
          "Connect every participant in sport: athletes tracking data, coaches optimizing rosters, communities driving engagement, and fans experiencing live performance stories.",
      },
    ],
  }),
  component: EcosystemPage,
});

export function EcosystemPage() {
  const [activeTab, setActiveTab] = useState<"athletes" | "coaches" | "communities" | "fans">("athletes");

  return (
    <>
      <PageIntro
        eyebrow="Ecosystem Section"
        title="Unifying the Entire Sporting World"
        text="Sports performance doesn't happen in a vacuum. SportsMax creates a shared data currency linking individual athletes, coaching staffs, local running clubs, and global fan communities."
        action={
          <div className="flex flex-col items-end gap-3">
            <DemoBadge />
            <div className="inline-flex rounded-lg border border-border bg-secondary p-1">
              <button
                type="button"
                onClick={() => setActiveTab("athletes")}
                className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                  activeTab === "athletes" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Athletes
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("coaches")}
                className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                  activeTab === "coaches" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Coaches
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("communities")}
                className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                  activeTab === "communities" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Communities
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("fans")}
                className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                  activeTab === "fans" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Fans
              </button>
            </div>
          </div>
        }
      />

      <section className="py-12 bg-background">
        <div className="content-wrap">
          {/* Athletes Tab */}
          {activeTab === "athletes" && (
            <div className="surface-card p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Flame className="h-6 w-6" />
                </span>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Ecosystem Layer 1</span>
                  <h3 className="text-2xl font-bold">For Athletes: Total Ownership of Performance</h3>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
                Athletes gain sovereign ownership of their longitudinal physical telemetry. Understand effort curves, personal best progressions, and AI-tailored recovery prescriptions across any sport.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-secondary/50 p-4 border border-border">
                  <h4 className="font-bold text-sm">Automated Training Feedback</h4>
                  <p className="text-xs text-muted-foreground mt-1">Instant pacing and heart-rate zone diagnosis after every session.</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-4 border border-border">
                  <h4 className="font-bold text-sm">Longitudinal Milestones</h4>
                  <p className="text-xs text-muted-foreground mt-1">Verified personal records and achievement badges.</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-4 border border-border">
                  <h4 className="font-bold text-sm">Health & Fatigue Guard</h4>
                  <p className="text-xs text-muted-foreground mt-1">Proactive alerts to avoid overtraining and injury.</p>
                </div>
              </div>
              <div className="mt-6">
                <Button asChild size="sm">
                  <Link to="/athletes">Explore Athlete Dashboard &rarr;</Link>
                </Button>
              </div>
            </div>
          )}

          {/* Coaches Tab */}
          {activeTab === "coaches" && (
            <div className="surface-card p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent/15 text-accent">
                  <BrainCircuit className="h-6 w-6" />
                </span>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-accent">Ecosystem Layer 2</span>
                  <h3 className="text-2xl font-bold">For Coaches: Evidence-Based Squad Governance</h3>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
                Replace guesswork with calibrated workload telemetry. Compare athletes across positions, monitor acute-to-chronic load spikes, and prepare tactical game plans with computer vision feedback.
              </p>
              <div className="mt-6">
                <Button asChild size="sm">
                  <Link to="/coaches">Explore Coaches & Teams &rarr;</Link>
                </Button>
              </div>
            </div>
          )}

          {/* Communities Tab */}
          {activeTab === "communities" && (
            <div className="surface-card p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-chart-1/15 text-chart-1">
                  <Users className="h-6 w-6" />
                </span>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Ecosystem Layer 3</span>
                  <h3 className="text-2xl font-bold">For Communities: Social Challenges & Leaderboards</h3>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl mb-6">
                Connect running clubs, collegiate leagues, and local fitness groups with live leaderboards, collective challenges, and friendly peer competition.
              </p>
              <div className="surface-card overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-secondary/70 text-muted-foreground font-semibold uppercase">
                    <tr>
                      <th className="px-6 py-3">Rank</th>
                      <th className="px-6 py-3">Athlete</th>
                      <th className="px-6 py-3">Distance</th>
                      <th className="px-6 py-3">Sessions</th>
                      <th className="px-6 py-3">Achievement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {leaderboard.map((l) => (
                      <tr key={l.rank} className="hover:bg-secondary/30 transition">
                        <td className="px-6 py-3 font-bold text-primary">#{l.rank}</td>
                        <td className="px-6 py-3 font-semibold">{l.name}</td>
                        <td className="px-6 py-3 font-mono font-bold">{l.distance}</td>
                        <td className="px-6 py-3 text-muted-foreground">{l.sessions}</td>
                        <td className="px-6 py-3 font-semibold text-primary">{l.achievement}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Fans Tab */}
          {activeTab === "fans" && (
            <div className="surface-card p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-chart-4/15 text-chart-4">
                  <Radio className="h-6 w-6" />
                </span>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-chart-4">Ecosystem Layer 4</span>
                  <h3 className="text-2xl font-bold">For Fans: Immersive Next-Gen Sports Data</h3>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
                Deliver broadcast-quality augmented analytics to sports fans: live sprint speeds, expected goals (xG), shot apex arcs, and tactical replay telemetry.
              </p>
              <div className="mt-6">
                <Button asChild size="sm">
                  <Link to="/sports/game-analysis">View Tactical Broadcast Suite &rarr;</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
