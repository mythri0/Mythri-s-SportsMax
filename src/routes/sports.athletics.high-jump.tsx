import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Crosshair,
  Gauge,
  Layers,
  Milestone,
  RotateCcw,
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

export const Route = createFileRoute("/sports/athletics/high-jump")({
  head: () => ({
    meta: [
      { title: "High Jump & Athletics Intelligence — SportsMax" },
      {
        name: "description",
        content:
          "High jump approach speed, takeoff angle, bar clearance trajectory, and comprehensive track & field telemetry.",
      },
    ],
  }),
  component: AthleticsHighJumpPage,
});

const jumpAttempts = [
  { height: "2.15 m", result: "Cleared (O)", approachSpeed: "7.82 m/s", takeoffAngle: "51.2°", clearanceMargin: "+8.4 cm" },
  { height: "2.20 m", result: "Cleared (XO)", approachSpeed: "7.94 m/s", takeoffAngle: "52.0°", clearanceMargin: "+5.1 cm" },
  { height: "2.24 m", result: "Cleared (O)", approachSpeed: "8.08 m/s", takeoffAngle: "52.8°", clearanceMargin: "+3.8 cm" },
  { height: "2.28 m", result: "Cleared (XXO)", approachSpeed: "8.14 m/s", takeoffAngle: "53.4°", clearanceMargin: "+1.9 cm (PB)" },
  { height: "2.31 m", result: "Missed (XXX)", approachSpeed: "8.22 m/s", takeoffAngle: "49.6°", clearanceMargin: "-2.4 cm (Heel clip)" },
];

const kinematicsCurve = [
  { label: "Step -5", speed: 6.8, force: 1200 },
  { label: "Step -4", speed: 7.2, force: 1450 },
  { label: "Step -3", speed: 7.6, force: 1800 },
  { label: "Step -2 (Curvature)", speed: 7.9, force: 2400 },
  { label: "Penultimate", speed: 8.1, force: 2900 },
  { label: "Plant Foot", speed: 8.14, force: 4800 },
  { label: "Takeoff Flight", speed: 4.8, force: 0 },
];

export function AthleticsHighJumpPage() {
  const [activeDiscipline, setActiveDiscipline] = useState<"high-jump" | "sprints" | "distance" | "throws">("high-jump");

  return (
    <>
      <PageIntro
        eyebrow="Athletics & Track · Field Events"
        title="High Jump Kinematics & Bar Clearance"
        text="Computer-vision bar clearance tracking, curve approach velocity vectors, and takeoff ground reaction force for elite track and field athletes."
        action={
          <div className="flex flex-col items-end gap-3">
            <DemoBadge />
            <div className="flex flex-wrap gap-1 bg-secondary p-1 rounded-lg border border-border">
              <button
                type="button"
                onClick={() => setActiveDiscipline("high-jump")}
                className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                  activeDiscipline === "high-jump"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                High Jump
              </button>
              <button
                type="button"
                onClick={() => setActiveDiscipline("sprints")}
                className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                  activeDiscipline === "sprints"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sprints (100-400m)
              </button>
              <button
                type="button"
                onClick={() => setActiveDiscipline("distance")}
                className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                  activeDiscipline === "distance"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Distance Events
              </button>
              <button
                type="button"
                onClick={() => setActiveDiscipline("throws")}
                className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                  activeDiscipline === "throws"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Jumps & Throws
              </button>
            </div>
          </div>
        }
      />

      <section className="py-12 bg-background">
        <div className="content-wrap">
          {/* Main High Jump Content */}
          {activeDiscipline === "high-jump" && (
            <>
              <SectionHead
                eyebrow="Competition Diagnostic"
                title="Personal Best Performance: 2.28 meters"
                text="Fosbury Flop biomechanics captured via 120fps high-speed side and top optical motion tracking."
              />

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                <MetricCard
                  label="Best Clearance"
                  value="2.28 m"
                  note="New Personal Best"
                  icon={<Trophy className="h-4 w-4 text-primary" />}
                />
                <MetricCard
                  label="Approach Speed"
                  value="8.14 m/s"
                  note="Penultimate step peak"
                  icon={<Gauge className="h-4 w-4" />}
                />
                <MetricCard
                  label="Takeoff Angle"
                  value="53.4°"
                  note="Optimal window: 50-55°"
                  icon={<ArrowUpRight className="h-4 w-4 text-accent" />}
                />
                <MetricCard
                  label="Vertical Velocity"
                  value="4.62 m/s"
                  note="+0.18 m/s vs average"
                  icon={<Zap className="h-4 w-4 text-chart-3" />}
                />
                <MetricCard
                  label="Plant Ground Force"
                  value="4.8 kN"
                  note="6.1x body weight"
                  icon={<Activity className="h-4 w-4" />}
                />
                <MetricCard
                  label="Bar Clearance Margin"
                  value="+1.9 cm"
                  note="Pelvis apex clearance"
                  icon={<Crosshair className="h-4 w-4" />}
                />
              </div>

              {/* Approach and Parabola Trajectory Visualizer */}
              <div className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
                <div className="surface-card p-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">
                        Trajectory Modeling
                      </span>
                      <h3 className="text-lg font-bold">Fosbury Flop Flight Parabola</h3>
                    </div>
                    <span className="rounded bg-primary/10 text-primary px-2.5 py-1 text-xs font-bold">
                      Apex: 2.312m (Bar at 2.28m)
                    </span>
                  </div>

                  {/* Parabolic trajectory SVG */}
                  <div className="py-4">
                    <svg viewBox="0 0 700 240" className="w-full h-auto" role="img" aria-label="High Jump Clearance Curve">
                      <line x1="50" y1="210" x2="650" y2="210" stroke="var(--border)" strokeWidth="2" />
                      <text x="50" y="230" fill="var(--muted-foreground)" fontSize="11" fontFamily="sans-serif">Approach Runway</text>
                      <text x="520" y="230" fill="var(--muted-foreground)" fontSize="11" fontFamily="sans-serif">Landing Mat</text>

                      {/* Upright posts and crossbar */}
                      <line x1="420" y1="210" x2="420" y2="70" stroke="var(--muted-foreground)" strokeWidth="3" />
                      <line x1="480" y1="210" x2="480" y2="70" stroke="var(--muted-foreground)" strokeWidth="3" />
                      {/* Crossbar at 2.28m */}
                      <line x1="400" y1="80" x2="500" y2="80" stroke="var(--destructive)" strokeWidth="4" strokeLinecap="round" />
                      <text x="415" y="70" fill="var(--destructive)" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Bar: 2.28 m</text>

                      {/* Center of Mass Trajectory Curve */}
                      <path
                        d="M 120 210 Q 320 200 370 170 Q 450 40 560 190"
                        fill="none"
                        stroke="var(--primary)"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />

                      {/* Plant Foot and Takeoff */}
                      <circle cx="370" cy="170" r="6" fill="var(--accent)" />
                      <text x="310" y="160" fill="var(--accent)" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Takeoff (53.4°)</text>

                      {/* Apex Point */}
                      <circle cx="450" cy="62" r="6" fill="var(--primary)" />
                      <text x="465" y="58" fill="var(--primary)" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Apex +1.9cm</text>
                    </svg>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border text-center text-xs">
                    <div>
                      <span className="text-muted-foreground block">Curvature Inward Lean</span>
                      <span className="font-bold text-foreground">22.4° inward</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Time to Apex</span>
                      <span className="font-bold text-foreground">0.48 seconds</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Bar Center Offset</span>
                      <span className="font-bold text-primary">+3.2 cm centered</span>
                    </div>
                  </div>
                </div>

                {/* Approach Speed and Force Graph */}
                <LineChartCard
                  title="Approach Step Force & Acceleration"
                  subtitle="Ground reaction forces through final five steps"
                  data={kinematicsCurve}
                  keys={["speed"]}
                  unit=" m/s"
                />
              </div>

              {/* Competition Attempts Table */}
              <div className="mt-10 surface-card overflow-hidden">
                <div className="border-b border-border p-5 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base">Session Attempt Series</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Attempt-by-attempt diagnostic data</p>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/sports">All Sports &rarr;</Link>
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-secondary/70 text-muted-foreground font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-3.5">Height</th>
                        <th className="px-6 py-3.5">Result</th>
                        <th className="px-6 py-3.5">Approach Velocity</th>
                        <th className="px-6 py-3.5">Takeoff Angle</th>
                        <th className="px-6 py-3.5">Clearance Margin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {jumpAttempts.map((a) => (
                        <tr key={a.height} className="hover:bg-secondary/30 transition">
                          <td className="px-6 py-3.5 font-bold font-mono text-foreground">{a.height}</td>
                          <td className="px-6 py-3.5">
                            <span
                              className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                                a.result.includes("Cleared")
                                  ? "bg-primary/10 text-primary"
                                  : "bg-destructive/10 text-destructive"
                              }`}
                            >
                              {a.result}
                            </span>
                          </td>
                          <td className="px-6 py-3.5 text-foreground">{a.approachSpeed}</td>
                          <td className="px-6 py-3.5 font-mono">{a.takeoffAngle}</td>
                          <td className="px-6 py-3.5 font-semibold text-primary">{a.clearanceMargin}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Sprints, Distance, Throws Viewers */}
          {activeDiscipline !== "high-jump" && (
            <div className="surface-card p-10 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Activity className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold capitalize">
                {activeDiscipline === "sprints"
                  ? "Sprints Track Intelligence (100m - 400m)"
                  : activeDiscipline === "distance"
                  ? "Middle & Long Distance Events"
                  : "Field Jumps & Throws (Long Jump, Shotput, Javelin)"}
              </h3>
              <p className="mt-2 max-w-xl mx-auto text-sm text-muted-foreground">
                Dedicated sensors measure starting block reaction times, stride cadence drift, aerodynamic release angles, and velocity vectors.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Button onClick={() => setActiveDiscipline("high-jump")}>
                  Return to High Jump Model
                </Button>
                <Button asChild variant="outline">
                  <Link to="/sports/running">View Running Telemetry</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
