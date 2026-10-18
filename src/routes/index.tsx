import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  BarChart2,
  BrainCircuit,
  Compass,
  Database,
  Flame,
  Gauge,
  Goal,
  HeartPulse,
  Layers,
  Milestone,
  Radio,
  RotateCcw,
  Shield,
  ShieldAlert,
  Sparkles,
  Trophy,
  Users,
  Video,
  Waves,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoBadge, Eyebrow, InsightCard, SectionHead, Workflow } from "@/components/sports-ui";
import { insights } from "@/lib/sports-data";
import { INDIVIDUAL_SPORTS, TEAM_SPORTS, GAME_ANALYSIS_MODULES } from "@/lib/sports-directory";
import runnerImage from "@/assets/sportsmax-runner.jpg";
import { ConnectWithSportsMax } from "@/components/connect-with-sportsmax";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SportsMax — Sports Analytics & Performance Intelligence" },
      {
        name: "description",
        content:
          "Turn athlete telemetry, match tracking, and tactical video into performance intelligence across 24+ individual and team sports.",
      },
      { property: "og:title", content: "SportsMax — Performance Intelligence" },
      {
        property: "og:description",
        content: "Sports data, analytics, intelligence, automation, and engagement in one platform.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      {/* Light Theme Hero */}
      <section className="relative min-h-[min(880px,92vh)] overflow-hidden border-b border-border pt-18 bg-background">
        <img
          src={runnerImage}
          width={1600}
          height={1000}
          alt="Runner on track with integrated performance data traces"
          className="absolute inset-0 h-full w-full object-cover object-[68%_center] opacity-85"
        />
        {/* Luminous Light Theme Gradient Overlay for optimal high contrast */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--background)_0%,color-mix(in_oklab,var(--background)_96%,transparent)_42%,color-mix(in_oklab,var(--background)_45%,transparent)_75%,color-mix(in_oklab,var(--background)_75%,transparent)_100%)]" />
        <div className="sport-grid absolute inset-0 opacity-25" />

        <div className="content-wrap relative flex min-h-[min(790px,calc(92vh-72px))] items-center py-16">
          <div className="max-w-2xl reveal">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <DemoBadge />
              <span className="rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs px-3 py-1 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 fill-primary/30" /> New Primary Sports Hub Added
              </span>
            </div>

            <h1 className="text-balance text-5xl font-black leading-[1.02] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Turn Sports Data Into{" "}
              <span className="text-primary font-black">Performance Intelligence</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              SportsMax combines individual athlete biometrics, team tactics, optical computer vision, and automated coaching cues across 24+ sports.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="font-bold shadow-md">
                <Link to="/sports">
                  Explore Sports Hub <ArrowRight className="h-4 w-4 ml-1.5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="font-semibold bg-card/80">
                <Link to="/sports/game-analysis">Tactical Analysis Suite</Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="font-semibold text-muted-foreground hover:text-foreground">
                <Link to="/platform">How It Works</Link>
              </Button>
            </div>

            {/* Quick-Jump Sport Pills */}
            <div className="mt-8 flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1">
                Featured:
              </span>
              <Link
                to="/sports/running"
                className="rounded-full bg-card/90 border border-border px-3 py-1 text-xs font-semibold text-foreground hover:border-primary/50 shadow-xs transition"
              >
                🏃 Running (GPS & Pace)
              </Link>
              <Link
                to="/sports/swimming"
                className="rounded-full bg-card/90 border border-border px-3 py-1 text-xs font-semibold text-foreground hover:border-primary/50 shadow-xs transition"
              >
                🏊 Swimming (SWOLF)
              </Link>
              <Link
                to="/sports/athletics/high-jump"
                className="rounded-full bg-card/90 border border-border px-3 py-1 text-xs font-semibold text-foreground hover:border-primary/50 shadow-xs transition"
              >
                👟 High Jump (2.28m)
              </Link>
              <Link
                to="/sports/football"
                className="rounded-full bg-card/90 border border-border px-3 py-1 text-xs font-semibold text-foreground hover:border-primary/50 shadow-xs transition"
              >
                ⚽ Football (xG)
              </Link>
              <Link
                to="/sports/hockey"
                className="rounded-full bg-card/90 border border-border px-3 py-1 text-xs font-semibold text-foreground hover:border-primary/50 shadow-xs transition"
              >
                🏒 Hockey (Corsi)
              </Link>
              <Link
                to="/sports/relay"
                className="rounded-full bg-card/90 border border-border px-3 py-1 text-xs font-semibold text-foreground hover:border-primary/50 shadow-xs transition"
              >
                🔄 Relay Events
              </Link>
            </div>

            <div className="mt-12 grid max-w-xl grid-cols-3 gap-3 border-t border-border/70 pt-6">
              <Stat value="24+ Sports" label="Directory coverage" />
              <Stat value="< 50ms" label="Live telemetry feed" />
              <Stat value="99.2%" label="Event detection precision" />
            </div>
          </div>
        </div>

        {/* Live Floating Widget in Light Theme */}
        <div className="absolute bottom-8 right-[6%] hidden w-80 rounded-xl border border-border/90 bg-card/95 p-5 shadow-xl backdrop-blur-md lg:block">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Live Runner Cadence
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-primary">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Optimal
            </span>
          </div>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <span className="font-display text-3xl font-extrabold text-foreground">170</span>
              <span className="text-xs text-muted-foreground ml-1">spm</span>
            </div>
            <span className="text-xs font-mono font-semibold text-primary">Pace: 5:14 /km</span>
          </div>
          <div className="mt-4 flex h-12 items-end gap-1.5">
            {[45, 62, 54, 72, 60, 84, 70, 92, 78, 96, 82, 90].map((v, i) => (
              <span
                key={i}
                className="flex-1 rounded-xs bg-primary/80 transition-all hover:bg-primary"
                style={{ height: `${v}%` }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* NEW PRIMARY SECTION: SPORTS INTELLIGENCE HUB */}
      <section className="py-20 bg-background border-b border-border">
        <div className="content-wrap">
          <SectionHead
            eyebrow="New Primary Section"
            title="Sports Intelligence Hub"
            text="Comprehensive telemetry, biomechanical physics, and automated tactical analytics across individual sports, team leagues, and game analysis."
            action={
              <Button asChild>
                <Link to="/sports">
                  Browse All Sports Directory <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            }
          />

          {/* Three Main Sports Pillars */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Pillar 1: Individual Sports */}
            <div className="surface-card p-6 flex flex-col justify-between border-t-4 border-t-primary shadow-xs hover:shadow-md transition">
              <div>
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Flame className="h-5 w-5" />
                  </span>
                  <span className="rounded bg-primary/10 text-primary text-[10px] font-black uppercase px-2 py-0.5">
                    Individual
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-bold text-foreground">Individual Sports</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Precision biometric telemetry, cadence dynamics, ground contact time, and hydrodynamic efficiency.
                </p>

                <div className="mt-5 grid gap-2">
                  <Link
                    to="/sports/running"
                    className="flex items-center justify-between rounded-lg p-2.5 bg-secondary/50 hover:bg-secondary border border-border/50 text-xs font-semibold text-foreground group transition"
                  >
                    <span>🏃 Running (Enhanced Telemetry)</span>
                    <span className="text-[10px] text-primary font-bold group-hover:translate-x-0.5 transition-transform">
                      5:14 /km &rarr;
                    </span>
                  </Link>

                  <Link
                    to="/sports/swimming"
                    className="flex items-center justify-between rounded-lg p-2.5 bg-secondary/50 hover:bg-secondary border border-border/50 text-xs font-semibold text-foreground group transition"
                  >
                    <span>🏊 Swimming (SWOLF Index)</span>
                    <span className="text-[10px] text-primary font-bold group-hover:translate-x-0.5 transition-transform">
                      32.4 SWOLF &rarr;
                    </span>
                  </Link>

                  <Link
                    to="/sports/athletics/high-jump"
                    className="flex items-center justify-between rounded-lg p-2.5 bg-secondary/50 hover:bg-secondary border border-border/50 text-xs font-semibold text-foreground group transition"
                  >
                    <span>👟 High Jump & Field Events</span>
                    <span className="text-[10px] text-primary font-bold group-hover:translate-x-0.5 transition-transform">
                      2.28m Apex &rarr;
                    </span>
                  </Link>

                  <div className="flex flex-wrap gap-1.5 pt-2 text-[11px] text-muted-foreground">
                    <span>Sprints (100m-400m)</span> • <span>Distance</span> • <span>Cycling</span> • <span>Tennis</span> • <span>Golf</span> • <span>Combat</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <Link to="/sports" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                  View All Individual Sports &rarr;
                </Link>
              </div>
            </div>

            {/* Pillar 2: Team Sports */}
            <div className="surface-card p-6 flex flex-col justify-between border-t-4 border-t-accent shadow-xs hover:shadow-md transition">
              <div>
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent/15 text-accent">
                    <Goal className="h-5 w-5" />
                  </span>
                  <span className="rounded bg-accent/15 text-accent text-[10px] font-black uppercase px-2 py-0.5">
                    Team Sports
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-bold text-foreground">Team Sports</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Expected Goals (xG), pressing intensity (PPDA), shift length fatigue, and baton acceleration boxes.
                </p>

                <div className="mt-5 grid gap-2">
                  <Link
                    to="/sports/football"
                    className="flex items-center justify-between rounded-lg p-2.5 bg-secondary/50 hover:bg-secondary border border-border/50 text-xs font-semibold text-foreground group transition"
                  >
                    <span>⚽ Football / Soccer</span>
                    <span className="text-[10px] text-accent font-bold group-hover:translate-x-0.5 transition-transform">
                      2.48 xG &rarr;
                    </span>
                  </Link>

                  <Link
                    to="/sports/hockey"
                    className="flex items-center justify-between rounded-lg p-2.5 bg-secondary/50 hover:bg-secondary border border-border/50 text-xs font-semibold text-foreground group transition"
                  >
                    <span>🏒 Hockey (Shift & Corsi)</span>
                    <span className="text-[10px] text-accent font-bold group-hover:translate-x-0.5 transition-transform">
                      58.4% Corsi &rarr;
                    </span>
                  </Link>

                  <Link
                    to="/sports/relay"
                    className="flex items-center justify-between rounded-lg p-2.5 bg-secondary/50 hover:bg-secondary border border-border/50 text-xs font-semibold text-foreground group transition"
                  >
                    <span>🔄 Relay & Combined Events</span>
                    <span className="text-[10px] text-accent font-bold group-hover:translate-x-0.5 transition-transform">
                      1.71s Delta &rarr;
                    </span>
                  </Link>

                  <div className="flex flex-wrap gap-1.5 pt-2 text-[11px] text-muted-foreground">
                    <span>Basketball</span> • <span>Volleyball</span> • <span>Rugby / Football</span> • <span>Cricket</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <Link to="/sports" className="text-xs font-bold text-accent hover:underline flex items-center gap-1">
                  View All Team Sports &rarr;
                </Link>
              </div>
            </div>

            {/* Pillar 3: Game Analysis Suite */}
            <div className="surface-card p-6 flex flex-col justify-between border-t-4 border-t-chart-4 shadow-xs hover:shadow-md transition">
              <div>
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-chart-4/15 text-chart-4">
                    <BarChart2 className="h-5 w-5" />
                  </span>
                  <span className="rounded bg-chart-4/15 text-chart-4 text-[10px] font-black uppercase px-2 py-0.5">
                    Tactical Suite
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-bold text-foreground">Game Analysis Suite</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Real-time match dashboards, tactical anomaly detection, radar player comparisons, and automated tagging.
                </p>

                <div className="mt-5 grid gap-2">
                  <Link
                    to="/sports/game-analysis"
                    className="flex items-center justify-between rounded-lg p-2.5 bg-secondary/50 hover:bg-secondary border border-border/50 text-xs font-semibold text-foreground group transition"
                  >
                    <span>📊 Match Dashboard</span>
                    <span className="text-[10px] text-chart-4 font-bold">Sub-second &rarr;</span>
                  </Link>

                  <Link
                    to="/sports/game-analysis"
                    className="flex items-center justify-between rounded-lg p-2.5 bg-secondary/50 hover:bg-secondary border border-border/50 text-xs font-semibold text-foreground group transition"
                  >
                    <span>🧠 Tactical Insights</span>
                    <span className="text-[10px] text-chart-4 font-bold">AI formations &rarr;</span>
                  </Link>

                  <Link
                    to="/sports/game-analysis"
                    className="flex items-center justify-between rounded-lg p-2.5 bg-secondary/50 hover:bg-secondary border border-border/50 text-xs font-semibold text-foreground group transition"
                  >
                    <span>👥 Player & Team Comparison</span>
                    <span className="text-[10px] text-chart-4 font-bold">Radar charts &rarr;</span>
                  </Link>

                  <div className="flex flex-wrap gap-1.5 pt-2 text-[11px] text-muted-foreground">
                    <span>Event Detection</span> • <span>Custom Reports</span> • <span>Export PDF</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <Link to="/sports/game-analysis" className="text-xs font-bold text-chart-4 hover:underline flex items-center gap-1">
                  Launch Game Analysis Suite &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Architecture */}
      <section className="py-20 bg-secondary/30">
        <div className="content-wrap">
          <SectionHead
            eyebrow="Platform Architecture"
            title="From Raw Sensor Signals to Game-Winning Strategy"
            text="Every training session and competitive fixture moves through an end-to-end intelligence pipeline."
            action={
              <Button asChild variant="outline">
                <Link to="/platform">Full Technology Overview &rarr;</Link>
              </Button>
            }
          />
          <div className="grid gap-4 lg:grid-cols-3">
            <Layer
              icon={<Database className="h-5 w-5" />}
              number="01"
              title="Capture"
              text="Stream telemetry from GPS watches, heart rate straps, optical tracking cameras, and RFID chips."
              tags={["Distance", "Pace", "Speed", "Cadence", "Heart Rate", "GPS", "Optical 120fps"]}
            />
            <Layer
              icon={<BrainCircuit className="h-5 w-5" />}
              number="02"
              title="Analyze"
              text="Transform kinematics into acute-to-chronic workload ratios, fatigue markers, and tactical formations."
              tags={["ACWR Ratio", "xG / xT", "SWOLF", "Consistency", "Fatigue", "Spatial Press"]}
            />
            <Layer
              icon={<Zap className="h-5 w-5" />}
              number="03"
              title="Automate"
              text="Deliver pitch-side tactical dashboards, injury risk alerts, and tailored coaching feedback sheets."
              tags={["Live Dashboards", "Injury Alerts", "AI Cues", "Export PDF", "Personal Bests"]}
            />
          </div>
        </div>
      </section>

      {/* Automated Intelligence Signals */}
      <section className="border-y border-border bg-card py-20">
        <div className="content-wrap">
          <SectionHead
            eyebrow="Automated Intelligence"
            title="Diagnostic Signals That Drive Results"
            text="SportsMax continuously monitors physical telemetry to surface actionable adjustments."
            action={
              <Button asChild variant="outline">
                <Link to="/analytics">
                  All Analytics Insights <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            }
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {insights.map((i) => (
              <InsightCard key={i.title} {...i} />
            ))}
          </div>
        </div>
      </section>

      {/* Connected Automation Workflows */}
      <section className="py-20 bg-background">
        <div className="content-wrap">
          <SectionHead
            eyebrow="Connected Automation"
            title="Two Intelligent Feedback Loops"
            text="Reduce manual analyst workload internally while delivering timely feedback to athletes and coaches."
          />
          <div className="grid gap-5">
            <Workflow
              title="Internal Analytics Automation"
              description="For analysts, coaches, sports scientists, and athletic directors."
              steps={["Data capture", "Sensor filtering", "Kinematic models", "Insight generation", "Dashboard", "Staff Report"]}
            />
            <Workflow
              title="External Athlete & Fan Engagement"
              description="For athletes, club communities, broadcast audiences, and fans."
              steps={["Session sync", "Performance score", "Personal Best", "Coaching cue", "Community feed", "Fan Story"]}
            />
          </div>
        </div>
      </section>

      {/* Built for the Ecosystem */}
      <section className="border-t border-border bg-secondary/40 py-20">
        <div className="content-wrap">
          <SectionHead
            eyebrow="Sports Ecosystem"
            title="Purpose-Built for Every Side of Sport"
            action={
              <Button asChild variant="outline">
                <Link to="/ecosystem">Explore Ecosystem &rarr;</Link>
              </Button>
            }
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Use
              icon={<Gauge className="h-5 w-5" />}
              title="Athletes"
              text="Understand cardiac strain, pace adaptation, and verified personal best milestones."
              href="/athletes"
            />
            <Use
              icon={<BrainCircuit className="h-5 w-5" />}
              title="Coaches"
              text="Govern squad acute-to-chronic workload, manage rosters, and mitigate injury risks."
              href="/coaches"
            />
            <Use
              icon={<Users className="h-5 w-5" />}
              title="Communities"
              text="Organize local running clubs, track leaderboards, and celebrate group achievements."
              href="/ecosystem"
            />
            <Use
              icon={<Radio className="h-5 w-5" />}
              title="Fans"
              text="Engage with live broadcast sprint velocities, shot arcs, and tactical pitch overlays."
              href="/sports/game-analysis"
            />
          </div>
        </div>
      </section>

      {/* Connect with SportsMax & Assistant Section */}
      <ConnectWithSportsMax />
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-2xl font-black text-foreground">{value}</div>
      <div className="mt-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

function Layer({
  icon,
  number,
  title,
  text,
  tags,
}: {
  icon: React.ReactNode;
  number: string;
  title: string;
  text: string;
  tags: string[];
}) {
  return (
    <article className="surface-card p-6 shadow-xs">
      <div className="flex items-center justify-between">
        <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </span>
        <span className="font-mono text-xs font-bold text-muted-foreground">{number}</span>
      </div>
      <h3 className="mt-8 text-2xl font-bold text-foreground">{title}</h3>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{text}</p>
      <div className="mt-6 flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded bg-secondary border border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}

function Use({
  icon,
  title,
  text,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  href: string;
}) {
  return (
    <Link to={href} className="border-l-4 border-primary bg-card p-5 surface-card hover:border-primary/80 transition block group">
      <span className="text-primary">{icon}</span>
      <h3 className="mt-4 font-bold text-base text-foreground group-hover:text-primary transition">{title}</h3>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{text}</p>
      <span className="mt-4 inline-flex items-center text-xs font-bold text-primary group-hover:underline">
        Explore &rarr;
      </span>
    </Link>
  );
}
