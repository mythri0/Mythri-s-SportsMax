import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  BarChart2,
  CheckCircle2,
  Compass,
  Crosshair,
  Filter,
  Flame,
  Gauge,
  Goal,
  Layers,
  Milestone,
  Search,
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
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DemoBadge, Eyebrow, PageIntro, SectionHead } from "@/components/sports-ui";
import { SportVideoSubmission } from "@/components/sport-video-submission";
import {
  INDIVIDUAL_SPORTS,
  TEAM_SPORTS,
  GAME_ANALYSIS_MODULES,
  type SportItem,
} from "@/lib/sports-directory";

export const Route = createFileRoute("/sports/")({
  head: () => ({
    meta: [
      { title: "All Sports Directory & Intelligence — SportsMax" },
      {
        name: "description",
        content:
          "Explore the complete sports directory across individual disciplines, team sports, and deep game analysis modules.",
      },
    ],
  }),
  component: SportsDirectoryPage,
});

function SportsDirectoryPage() {
  const [filter, setFilter] = useState<"all" | "individual" | "team" | "analysis">("all");
  const [search, setSearch] = useState("");

  const allItems = [
    ...INDIVIDUAL_SPORTS,
    ...TEAM_SPORTS,
  ];

  const filteredSports = allItems.filter((item) => {
    const matchesFilter = filter === "all" || item.category === filter;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.metrics.some((m) => m.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <PageIntro
        eyebrow="Primary Section"
        title="Sports Intelligence Directory"
        text="A dedicated performance and tactical architecture for 24+ individual and team sports, powered by sensor telemetry and computer vision models."
        action={
          <div className="flex flex-col items-end gap-3">
            <DemoBadge />
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Quick Switch:</span>
              <Button asChild size="sm" variant="outline">
                <Link to="/sports/running">🏃 Running</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to="/sports/football">⚽ Football</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to="/sports/game-analysis">📊 Game Analysis</Link>
              </Button>
            </div>
          </div>
        }
      />

      <section className="py-12 bg-background">
        <div className="content-wrap">
          {/* Section Quick Jump Tiles */}
          <div className="grid gap-4 sm:grid-cols-3 mb-10">
            <Link
              to="/sports"
              onClick={() => setFilter("individual")}
              className={`rounded-xl border p-5 transition-all text-left group ${
                filter === "individual"
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border bg-card hover:border-primary/40 shadow-xs"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Flame className="h-5 w-5" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  10+ Sports
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-foreground group-hover:text-primary transition">
                Individual Sports
              </h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Running, Swimming, High Jump, Sprints, Distance, Cycling, Tennis, Golf, and Combat.
              </p>
            </Link>

            <Link
              to="/sports"
              onClick={() => setFilter("team")}
              className={`rounded-xl border p-5 transition-all text-left group ${
                filter === "team"
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border bg-card hover:border-primary/40 shadow-xs"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent/15 text-accent">
                  <Goal className="h-5 w-5" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-accent">
                  8+ Sports
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-foreground group-hover:text-primary transition">
                Team Sports
              </h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Football / Soccer, Hockey, Relay & Combined, Basketball, Volleyball, Rugby, Cricket.
              </p>
            </Link>

            <Link
              to="/sports/game-analysis"
              className="rounded-xl border border-border bg-card p-5 hover:border-primary/40 shadow-xs transition-all text-left group"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-chart-4/15 text-chart-4">
                  <BarChart2 className="h-5 w-5" />
                </span>
                <span className="rounded bg-chart-4/15 px-2 py-0.5 text-[10px] font-bold text-chart-4 uppercase">
                  Tactical Suite
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-foreground group-hover:text-primary transition">
                Game Analysis
              </h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Match Dashboard, Tactical Insights, Player Comparison, Event Detection & Reports.
              </p>
            </Link>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-border pb-6 mb-8">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
                className="rounded-full text-xs font-semibold"
              >
                All Sports ({allItems.length})
              </Button>
              <Button
                variant={filter === "individual" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("individual")}
                className="rounded-full text-xs font-semibold"
              >
                Individual Sports ({INDIVIDUAL_SPORTS.length})
              </Button>
              <Button
                variant={filter === "team" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("team")}
                className="rounded-full text-xs font-semibold"
              >
                Team Sports ({TEAM_SPORTS.length})
              </Button>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sports or metrics..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-card text-xs h-9"
              />
            </div>
          </div>

          {/* Sports Grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSports.map((sport) => (
              <SportCard key={sport.id} sport={sport} />
            ))}
          </div>

          {filteredSports.length === 0 && (
            <div className="text-center py-16 surface-card">
              <p className="text-base font-semibold">No sports found matching "{search}"</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Try searching for "pace", "xG", "SWOLF", "heart rate", or "cadence".
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                }}
              >
                Reset filters
              </Button>
            </div>
          )}

          {/* Deep Game Analysis Showcase */}
          <div className="mt-16 border-t border-border pt-14">
            <SectionHead
              eyebrow="Tactical Modules"
              title="Dedicated Game Analysis Suite"
              text="Engineered for performance analysts, technical directors, and coaches looking for tactical precision."
              action={
                <Button asChild>
                  <Link to="/sports/game-analysis">
                    Launch Game Analysis Suite <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              }
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
              {GAME_ANALYSIS_MODULES.map((mod) => (
                <div
                  key={mod.id}
                  className="surface-card p-6 flex flex-col justify-between hover:border-primary/50 transition group"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">
                        Analysis Module
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                        {mod.stat}
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg font-bold group-hover:text-primary transition">
                      {mod.name}
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      {mod.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-primary">
                    <Link to="/sports/game-analysis" className="hover:underline flex items-center gap-1">
                      Open in Suite <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function SportCard({ sport }: { sport: SportItem }) {
  return (
    <article className="surface-card p-6 flex flex-col justify-between hover:border-primary/50 transition group">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {sport.subcategory ?? (sport.category === "individual" ? "Individual" : "Team")}
            </span>
            <h3 className="text-xl font-bold mt-1 text-foreground group-hover:text-primary transition">
              {sport.name}
            </h3>
          </div>
          {sport.badge && (
            <span className="rounded-full bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              {sport.badge}
            </span>
          )}
        </div>

        <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{sport.description}</p>

        {/* Primary Stat Banner */}
        <div className="mt-4 rounded-lg bg-secondary/60 p-3 border border-border/60">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{sport.primaryStat.label}</span>
            <span className="font-mono font-bold text-foreground text-sm">
              {sport.primaryStat.value}
            </span>
          </div>
          <p className="mt-1 text-[11px] font-semibold text-primary">{sport.primaryStat.trend}</p>
        </div>

        {/* Metric Badges */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {sport.metrics.slice(0, 4).map((m) => (
            <span
              key={m}
              className="rounded bg-background border border-border px-2 py-0.5 text-[10px] font-medium text-foreground"
            >
              {m}
            </span>
          ))}
          {sport.metrics.length > 4 && (
            <span className="text-[10px] text-muted-foreground self-center">
              +{sport.metrics.length - 4} more
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <span className="text-[11px] text-muted-foreground">
          Tracked: <strong className="text-foreground">{sport.athletesTracked}</strong>
        </span>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          {/* Upload Video & Drill Form Dialog for this Sport */}
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="text-xs font-semibold h-8 px-2.5 border-primary/30 text-primary hover:bg-primary/10">
                <Video className="h-3.5 w-3.5 mr-1" /> Upload Video
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
              <DialogHeader className="sr-only">
                <DialogTitle>Upload Video for {sport.name}</DialogTitle>
                <DialogDescription>Submit tactical video footage and coaching form</DialogDescription>
              </DialogHeader>
              <SportVideoSubmission
                sportName={sport.name}
                category={sport.category === "individual" ? "Individual Discipline" : "Team Sport"}
                defaultDrill={`${sport.name} Practice & Match Session`}
              />
            </DialogContent>
          </Dialog>

          <Button asChild size="sm" variant="ghost" className="text-xs font-bold text-primary hover:text-primary group-hover:bg-primary/10 h-8 px-2.5">
            <Link to={sport.href}>
              Explore <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
