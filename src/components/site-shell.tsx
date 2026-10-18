import { useState, FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bot,
  BookOpen,
  Calendar,
  CalendarRange,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Database,
  FileBarChart2,
  FileText,
  Flame,
  Gauge,
  Globe,
  Goal,
  Layers,
  Loader2,
  LogIn,
  LogOut,
  Menu,
  Milestone,
  Search,
  Shield,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Trophy,
  User,
  Users,
  Video,
  Waves,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";

export function Brand() {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2.5 group" aria-label="SportsMax home">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
        <Activity className="h-5 w-5" />
      </span>
      <div className="flex flex-col">
        <span className="font-display text-lg font-bold tracking-tight text-foreground">
          SPORTS<span className="text-primary font-black">MAX</span>
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground -mt-1 hidden sm:block">
          Intelligence Hub
        </span>
      </div>
    </Link>
  );
}

export function AuthDialog({
  children,
  defaultMode = "login",
}: {
  children: React.ReactNode;
  defaultMode?: "login" | "signup";
}) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">(defaultMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      setMode(defaultMode);
      setError(null);
      setSuccessMsg(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        if (!name.trim()) {
          setError("Please enter your full name.");
          setLoading(false);
          return;
        }
        if (!email.trim()) {
          setError("Please enter your email address.");
          setLoading(false);
          return;
        }
        const res = await signup(name, email, password);
        if (!res.success) {
          setError(res.error || "Failed to create account.");
          setLoading(false);
          return;
        }
        setSuccessMsg("Account registered successfully! Redirecting to dashboard...");
      } else {
        if (!email.trim()) {
          setError("Please enter your email address.");
          setLoading(false);
          return;
        }
        const res = await login(email, password);
        if (!res.success) {
          setError(res.error || "Invalid login credentials.");
          setLoading(false);
          return;
        }
        setSuccessMsg("Signed in successfully! Redirecting to dashboard...");
      }

      setTimeout(() => {
        setOpen(false);
        navigate({ to: "/dashboard" });
      }, 700);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="border-border bg-card shadow-2xl sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Activity className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center text-xl font-bold">
            {mode === "login" ? "Welcome back to SportsMax" : "Create your SportsMax account"}
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground">
            {mode === "login"
              ? "Access athlete telemetry, tactical analytics, and AI training models."
              : "Start your intelligence trial for athletes and coaching staffs."}
          </DialogDescription>
        </DialogHeader>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 rounded-lg bg-secondary/60 p-1 text-xs font-semibold">
          <button
            type="button"
            className={`rounded-md py-1.5 transition ${
              mode === "login"
                ? "bg-background text-foreground shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => {
              setMode("login");
              setError(null);
            }}
          >
            Log In
          </button>
          <button
            type="button"
            className={`rounded-md py-1.5 transition ${
              mode === "signup"
                ? "bg-background text-foreground shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => {
              setMode("signup");
              setError(null);
            }}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs font-medium text-destructive">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs font-medium text-emerald-500">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-3 pt-1">
          {mode === "signup" && (
            <label className="grid gap-1 text-xs font-semibold text-foreground">
              Full Name *
              <Input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Jordan"
                className="bg-background"
                disabled={loading}
              />
            </label>
          )}

          <label className="grid gap-1 text-xs font-semibold text-foreground">
            Email address *
            <Input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="athlete@sportsmax.ai"
              className="bg-background"
              disabled={loading}
            />
          </label>

          <label className="grid gap-1 text-xs font-semibold text-foreground">
            Password *
            <Input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-background"
              disabled={loading}
            />
          </label>

          <Button type="submit" disabled={loading} className="w-full mt-2 font-semibold">
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {mode === "login" ? "Signing in..." : "Creating account..."}
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1">
                {mode === "login" ? "Sign in to Dashboard" : "Create Account"}
                <ChevronRight className="h-4 w-4" />
              </span>
            )}
          </Button>

          <div className="text-center mt-2">
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-primary transition underline underline-offset-4"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setError(null);
              }}
            >
              {mode === "login"
                ? "Don't have an account? Register free"
                : "Already registered? Log in here"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function SiteHeader() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [platformHover, setPlatformHover] = useState(false);
  const [solutionsHover, setSolutionsHover] = useState(false);
  const [sportsHover, setSportsHover] = useState(false);
  const [segmentsHover, setSegmentsHover] = useState(false);
  const [casesHover, setCasesHover] = useState(false);
  const [resourcesHover, setResourcesHover] = useState(false);
  const [aboutHover, setAboutHover] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur-md shadow-xs">
      <div className="content-wrap flex h-18 items-center justify-between gap-2 lg:gap-3">
        <Brand />

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5" aria-label="Main navigation">


          {/* 1. Platform */}
          <div
            className="relative"
            onMouseEnter={() => setPlatformHover(true)}
            onMouseLeave={() => setPlatformHover(false)}
          >
            <Link
              to="/platform"
              className="inline-flex items-center gap-1 rounded-md px-2 xl:px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary hover:text-primary transition"
            >
              Platform
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </Link>

            {platformHover && (
              <div className="absolute left-0 top-full mt-1 w-72 rounded-xl border border-border bg-card p-3 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-150 z-50">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 pb-1.5">
                  Core Technology &amp; Architecture
                </div>
                <Link
                  to="/platform"
                  onClick={() => setPlatformHover(false)}
                  className="flex items-start gap-2.5 rounded-lg p-2 hover:bg-secondary transition"
                >
                  <Gauge className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-xs text-foreground">How It Works</div>
                    <div className="text-[11px] text-muted-foreground">Data capture, optical telemetry &amp; live AI models</div>
                  </div>
                </Link>
                <Link
                  to="/platform"
                  onClick={() => setPlatformHover(false)}
                  className="flex items-start gap-2.5 rounded-lg p-2 hover:bg-secondary transition"
                >
                  <Zap className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-xs text-foreground">Technology</div>
                    <div className="text-[11px] text-muted-foreground">Biomechanics, kinematics &amp; automated ML pipelines</div>
                  </div>
                </Link>
                <Link
                  to="/platform"
                  onClick={() => setPlatformHover(false)}
                  className="flex items-start gap-2.5 rounded-lg p-2 hover:bg-secondary transition"
                >
                  <Database className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-xs text-foreground">Integrations</div>
                    <div className="text-[11px] text-muted-foreground">Garmin, Polar, Catapult, VICON, IMUs &amp; REST APIs</div>
                  </div>
                </Link>
                <Link
                  to="/platform"
                  onClick={() => setPlatformHover(false)}
                  className="flex items-start gap-2.5 rounded-lg p-2 hover:bg-secondary transition"
                >
                  <Shield className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-xs text-foreground">Security</div>
                    <div className="text-[11px] text-muted-foreground">WADA compliance, encrypted telemetry &amp; RBAC safeguards</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* 2. Solutions */}
          <div
            className="relative"
            onMouseEnter={() => setSolutionsHover(true)}
            onMouseLeave={() => setSolutionsHover(false)}
          >
            <Link
              to="/analytics"
              className="inline-flex items-center gap-1 rounded-md px-2 xl:px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary hover:text-primary transition"
            >
              Solutions
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </Link>

            {solutionsHover && (
              <div className="absolute left-0 top-full mt-1 w-76 rounded-xl border border-border bg-card p-3 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-150 z-50">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 pb-1.5">
                  High-Level Service Offerings
                </div>
                <Link
                  to="/analytics"
                  onClick={() => setSolutionsHover(false)}
                  className="flex items-start gap-2.5 rounded-lg p-2 hover:bg-secondary transition"
                >
                  <BarChart3 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-xs text-foreground">Analytics Services</div>
                    <div className="text-[11px] text-muted-foreground">Session deep-dives, load ratios &amp; AI automated cues</div>
                  </div>
                </Link>
                <Link
                  to="/coaches"
                  onClick={() => setSolutionsHover(false)}
                  className="flex items-start gap-2.5 rounded-lg p-2 hover:bg-secondary transition"
                >
                  <Bot className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-xs text-foreground">Coaching Services</div>
                    <div className="text-[11px] text-muted-foreground">Tactical whiteboards, drill assignments &amp; athlete feedback</div>
                  </div>
                </Link>
                <Link
                  to="/ecosystem"
                  onClick={() => setSolutionsHover(false)}
                  className="flex items-start gap-2.5 rounded-lg p-2 hover:bg-secondary transition"
                >
                  <Trophy className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                      Olympic &amp; Elite Programs
                      <span className="rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[9px] font-bold px-1.5 py-0.2">Gold</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">Podium tracking, quadrennial macrocycles &amp; peak timing</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* 3. Sports */}
          <div
            className="relative"
            onMouseEnter={() => setSportsHover(true)}
            onMouseLeave={() => setSportsHover(false)}
          >
            <Link
              to="/sports"
              className="inline-flex items-center gap-1 rounded-md px-2 xl:px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary hover:text-primary transition"
            >
              <span className="flex items-center gap-1">
                <Flame className="h-3.5 w-3.5 fill-primary/20 text-primary" />
                Sports
              </span>
              <span className="rounded bg-primary/15 px-1 py-0.2 text-[9px] font-black uppercase text-primary">
                New
              </span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </Link>

            {sportsHover && (
              <div className="absolute left-0 top-full mt-1 w-[720px] rounded-xl border border-border bg-card p-5 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-150 z-50">
                <div className="grid grid-cols-3 gap-5">
                  {/* Individual Sports Column */}
                  <div>
                    <div className="flex items-center justify-between border-b border-border/70 pb-2 mb-2.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Individual Sports
                      </span>
                    </div>
                    <ul className="grid gap-2 text-xs">
                      <li>
                        <Link
                          to="/sports/running"
                          onClick={() => setSportsHover(false)}
                          className="font-medium text-foreground hover:text-primary flex items-center justify-between"
                        >
                          <span>🏃 Running</span>
                          <span className="text-[10px] text-muted-foreground">GPS &amp; Pace</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/sports/swimming"
                          onClick={() => setSportsHover(false)}
                          className="font-medium text-foreground hover:text-primary flex items-center justify-between"
                        >
                          <span>🏊 Swimming</span>
                          <span className="text-[10px] text-muted-foreground">SWOLF &amp; Splits</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/sports/athletics/high-jump"
                          onClick={() => setSportsHover(false)}
                          className="font-medium text-foreground hover:text-primary flex items-center justify-between"
                        >
                          <span>👟 High Jump</span>
                          <span className="text-[10px] text-muted-foreground">Kinematics</span>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Team Sports Column */}
                  <div>
                    <div className="flex items-center justify-between border-b border-border/70 pb-2 mb-2.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Team Sports
                      </span>
                    </div>
                    <ul className="grid gap-2 text-xs">
                      <li>
                        <Link
                          to="/sports/football"
                          onClick={() => setSportsHover(false)}
                          className="font-medium text-foreground hover:text-primary flex items-center justify-between"
                        >
                          <span>⚽ Football / Soccer</span>
                          <span className="text-[10px] text-muted-foreground">xG &amp; Passing</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/sports/hockey"
                          onClick={() => setSportsHover(false)}
                          className="font-medium text-foreground hover:text-primary flex items-center justify-between"
                        >
                          <span>🏒 Hockey</span>
                          <span className="text-[10px] text-muted-foreground">Zone Control</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/sports/relay"
                          onClick={() => setSportsHover(false)}
                          className="font-medium text-foreground hover:text-primary flex items-center justify-between"
                        >
                          <span>🔄 Relay Events</span>
                          <span className="text-[10px] text-muted-foreground">Handover Speed</span>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Game Analysis Suite & All Sports */}
                  <div className="bg-secondary/40 rounded-lg p-3 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-foreground block mb-2">
                        Game Analysis Suite
                      </span>
                      <p className="text-[11px] text-muted-foreground mb-3">
                        Real-time match telemetry, formation detection &amp; tactical event reports.
                      </p>
                      <Link
                        to="/sports/game-analysis"
                        onClick={() => setSportsHover(false)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                      >
                        Launch Match Suite &rarr;
                      </Link>
                    </div>

                    <div className="mt-3 pt-3 border-t border-border/80">
                      <Link
                        to="/sports"
                        onClick={() => setSportsHover(false)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground hover:text-primary"
                      >
                        All Sports Directory <ArrowRight className="h-3.5 w-3.5 text-primary" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. ICP */}
          <div
            className="relative"
            onMouseEnter={() => setSegmentsHover(true)}
            onMouseLeave={() => setSegmentsHover(false)}
          >
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-md px-2 xl:px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary hover:text-primary transition"
            >
              ICP
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>

            {segmentsHover && (
              <div className="absolute left-0 top-full mt-1 w-76 rounded-xl border border-border bg-card p-3 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-150 z-50">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 pb-1.5">
                  Tailored by User Type
                </div>
                <Link
                  to="/athletes"
                  onClick={() => setSegmentsHover(false)}
                  className="flex items-start gap-2.5 rounded-lg p-2 hover:bg-secondary transition"
                >
                  <User className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-xs text-foreground">Athletes</div>
                    <div className="text-[11px] text-muted-foreground">Self-tracking, PR archives &amp; biomechanics feedback</div>
                  </div>
                </Link>
                <Link
                  to="/coaches"
                  onClick={() => setSegmentsHover(false)}
                  className="flex items-start gap-2.5 rounded-lg p-2 hover:bg-secondary transition"
                >
                  <Users className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-xs text-foreground">Coaches &amp; Teams</div>
                    <div className="text-[11px] text-muted-foreground">Roster management, workload monitoring &amp; game strategy</div>
                  </div>
                </Link>
                <Link
                  to="/institution"
                  onClick={() => setSegmentsHover(false)}
                  className="flex items-start gap-2.5 rounded-lg p-2 hover:bg-secondary transition"
                >
                  <Milestone className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-xs text-foreground flex items-center gap-1">
                      Institutions / NOCs
                      <span className="rounded bg-primary/20 text-primary text-[9px] font-bold px-1.5 py-0.2">Elite</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">Universities, academies &amp; National Olympic Committees</div>
                  </div>
                </Link>
                <Link
                  to="/ecosystem"
                  onClick={() => setSegmentsHover(false)}
                  className="flex items-start gap-2.5 rounded-lg p-2 hover:bg-secondary transition"
                >
                  <Globe className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-xs text-foreground">Federations</div>
                    <div className="text-[11px] text-muted-foreground">National governing bodies, benchmarking &amp; talent IDs</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* 5. Case Studies & Guides (Replaces Pricing) */}
          <div
            className="relative"
            onMouseEnter={() => setCasesHover(true)}
            onMouseLeave={() => setCasesHover(false)}
          >
            <Link
              to="/resources"
              className="inline-flex items-center gap-1 rounded-md px-2 xl:px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary hover:text-primary transition whitespace-nowrap"
            >
              Case Studies &amp; Guides
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </Link>

            {casesHover && (
              <div className="absolute left-0 top-full mt-1 w-84 rounded-xl border border-border bg-card p-3 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-150 z-50">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 pb-1.5">
                  Proof &amp; Education
                </div>
                <Link
                  to="/resources"
                  onClick={() => setCasesHover(false)}
                  className="flex items-start gap-2.5 rounded-lg p-2 hover:bg-secondary transition"
                >
                  <FileText className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-xs text-foreground">Case Studies</div>
                    <div className="text-[11px] text-muted-foreground">National federation implementations &amp; high-performance deployments</div>
                  </div>
                </Link>
                <Link
                  to="/resources"
                  onClick={() => setCasesHover(false)}
                  className="flex items-start gap-2.5 rounded-lg p-2 hover:bg-secondary transition"
                >
                  <Trophy className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-xs text-foreground">Success Stories</div>
                    <div className="text-[11px] text-muted-foreground">Athlete, team and coach outcome highlights with verified metrics</div>
                  </div>
                </Link>
                <Link
                  to="/resources"
                  onClick={() => setCasesHover(false)}
                  className="flex items-start gap-2.5 rounded-lg p-2 hover:bg-secondary transition"
                >
                  <Video className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-xs text-foreground">Video Guides</div>
                    <div className="text-[11px] text-muted-foreground">How-to walkthroughs, coaching cue demos &amp; analytics tutorials</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* 6. Resources */}
          <div
            className="relative"
            onMouseEnter={() => setResourcesHover(true)}
            onMouseLeave={() => setResourcesHover(false)}
          >
            <Link
              to="/resources"
              className="inline-flex items-center gap-1 rounded-md px-2 xl:px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary hover:text-primary transition"
            >
              Resources
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </Link>

            {resourcesHover && (
              <div className="absolute left-0 top-full mt-1 w-76 rounded-xl border border-border bg-card p-3 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-150 z-50">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 pb-1.5">
                  Knowledge &amp; Intelligence Reports
                </div>
                <Link
                  to="/resources"
                  onClick={() => setResourcesHover(false)}
                  className="flex items-start gap-2.5 rounded-lg p-2 hover:bg-secondary transition"
                >
                  <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-xs text-foreground">Insights</div>
                    <div className="text-[11px] text-muted-foreground">Research whitepapers &amp; sports science discoveries</div>
                  </div>
                </Link>
                <Link
                  to="/reports"
                  id="nav-site-reports"
                  onClick={() => setResourcesHover(false)}
                  className="flex items-start gap-2.5 rounded-lg p-2 hover:bg-secondary transition"
                >
                  <CalendarRange className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-xs text-foreground">Reports</div>
                    <div className="text-[11px] text-muted-foreground">Quarterly benchmark indexes &amp; athletic telemetry</div>
                  </div>
                </Link>
                <Link
                  to="/resources"
                  onClick={() => setResourcesHover(false)}
                  className="flex items-start gap-2.5 rounded-lg p-2 hover:bg-secondary transition"
                >
                  <BookOpen className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-xs text-foreground">Blog</div>
                    <div className="text-[11px] text-muted-foreground">Expert articles from elite trainers and physiologists</div>
                  </div>
                </Link>
                <Link
                  to="/resources"
                  onClick={() => setResourcesHover(false)}
                  className="flex items-start gap-2.5 rounded-lg p-2 hover:bg-secondary transition"
                >
                  <FileBarChart2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-xs text-foreground">Documentation</div>
                    <div className="text-[11px] text-muted-foreground">SDK guides, sensor protocols &amp; telemetry API specs</div>
                  </div>
                </Link>

                {/* Additional Preserved Tools */}
                <div className="mt-2 pt-2 border-t border-border grid grid-cols-2 gap-1.5">
                  <Link
                    to="/google-trends"
                    id="nav-google-trends"
                    onClick={() => setResourcesHover(false)}
                    className="flex items-center gap-1.5 rounded-md p-1.5 hover:bg-secondary text-[11px] font-medium text-foreground hover:text-primary transition"
                  >
                    <TrendingUp className="h-3.5 w-3.5 text-primary" />
                    <span>Google Trends</span>
                  </Link>
                  <Link
                    to="/cta-report"
                    id="nav-cta-reports"
                    onClick={() => setResourcesHover(false)}
                    className="flex items-center gap-1.5 rounded-md p-1.5 hover:bg-secondary text-[11px] font-medium text-foreground hover:text-primary transition"
                  >
                    <ClipboardList className="h-3.5 w-3.5 text-primary" />
                    <span>CTA Reports</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* 7. About */}
          <div
            className="relative"
            onMouseEnter={() => setAboutHover(true)}
            onMouseLeave={() => setAboutHover(false)}
          >
            <Link
              to="/about"
              className="inline-flex items-center gap-1 rounded-md px-2 xl:px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary hover:text-primary transition"
            >
              About
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </Link>

            {aboutHover && (
              <div className="absolute left-0 top-full mt-1 w-64 rounded-xl border border-border bg-card p-3 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-150 z-50">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 pb-1.5">
                  Company &amp; Credibility
                </div>
                <Link
                  to="/about"
                  onClick={() => setAboutHover(false)}
                  className="block rounded-lg p-2 hover:bg-secondary transition"
                >
                  <div className="font-semibold text-xs text-foreground">Mission</div>
                  <div className="text-[11px] text-muted-foreground">Democratizing Olympic-level intelligence</div>
                </Link>
                <Link
                  to="/about"
                  onClick={() => setAboutHover(false)}
                  className="block rounded-lg p-2 hover:bg-secondary transition"
                >
                  <div className="font-semibold text-xs text-foreground">Team</div>
                  <div className="text-[11px] text-muted-foreground">World-class sports scientists &amp; engineers</div>
                </Link>
                <Link
                  to="/ecosystem"
                  onClick={() => setAboutHover(false)}
                  className="block rounded-lg p-2 hover:bg-secondary transition"
                >
                  <div className="font-semibold text-xs text-foreground">Partners</div>
                  <div className="text-[11px] text-muted-foreground">Federations, hardware brands &amp; universities</div>
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setAboutHover(false)}
                  className="block rounded-lg p-2 hover:bg-secondary transition"
                >
                  <div className="font-semibold text-xs text-foreground">Contact</div>
                  <div className="text-[11px] text-muted-foreground">High-performance consultation &amp; support</div>
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Action Controls */}
        <div className="hidden lg:flex items-center gap-1.5 xl:gap-2 shrink-0">
          {/* Highlighted Book Appointment Button */}
          <Button
            asChild
            size="sm"
            className="font-bold text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-900/20 border border-emerald-400/30 px-3 transition-transform hover:scale-[1.02]"
          >
            <Link to="/book-appointment">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              Book Appointment
            </Link>
          </Button>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 rounded-lg bg-secondary/80 hover:bg-secondary border border-border px-3 py-1.5 transition text-xs font-medium text-foreground"
              >
                <div className="grid h-6 w-6 place-items-center rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-3 w-3" />}
                </div>
                <span className="max-w-[120px] truncate font-semibold">{user.name}</span>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                title="Log out"
                className="text-xs text-muted-foreground hover:text-destructive h-8 px-2"
              >
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <AuthDialog defaultMode="login">
                <Button variant="ghost" size="sm" className="font-semibold text-xs">
                  <LogIn className="h-4 w-4 mr-1 text-muted-foreground" />
                  Log in
                </Button>
              </AuthDialog>
              <AuthDialog defaultMode="signup">
                <Button variant="outline" size="sm" className="font-semibold text-xs border-primary/30 text-primary hover:bg-primary/10">
                  Register
                </Button>
              </AuthDialog>
            </div>
          )}

          <Button asChild size="sm" className="font-semibold text-xs shadow-sm px-3">
            <Link to="/sports">
              Get Started <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <Button
          aria-label="Open mobile menu"
          variant="outline"
          size="icon"
          className="lg:hidden bg-background"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Drawer (Clean 7 Sections + Preserved Tools) */}
      {mobileOpen && (
        <div className="border-t border-border bg-card/98 backdrop-blur-xl p-5 lg:hidden max-h-[85vh] overflow-y-auto">
          <div className="grid gap-4">
            {/* Primary Sports Hub Quick Access */}
            <div className="rounded-lg bg-primary/10 p-3 border border-primary/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                  <Flame className="h-3.5 w-3.5 fill-primary/20" /> Sports Hub
                </span>
                <span className="rounded bg-primary text-primary-foreground px-1.5 py-0.5 text-[9px] font-black uppercase">
                  New
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Individual sports, team leagues, and match analysis.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Link
                  to="/sports/running"
                  onClick={() => setMobileOpen(false)}
                  className="rounded bg-background p-2 font-medium hover:text-primary shadow-xs"
                >
                  🏃 Running
                </Link>
                <Link
                  to="/sports/swimming"
                  onClick={() => setMobileOpen(false)}
                  className="rounded bg-background p-2 font-medium hover:text-primary shadow-xs"
                >
                  🏊 Swimming
                </Link>
                <Link
                  to="/sports/athletics/high-jump"
                  onClick={() => setMobileOpen(false)}
                  className="rounded bg-background p-2 font-medium hover:text-primary shadow-xs"
                >
                  👟 High Jump
                </Link>
                <Link
                  to="/sports/football"
                  onClick={() => setMobileOpen(false)}
                  className="rounded bg-background p-2 font-medium hover:text-primary shadow-xs"
                >
                  ⚽ Football / Soccer
                </Link>
                <Link
                  to="/sports/hockey"
                  onClick={() => setMobileOpen(false)}
                  className="rounded bg-background p-2 font-medium hover:text-primary shadow-xs"
                >
                  🏒 Hockey
                </Link>
                <Link
                  to="/sports/relay"
                  onClick={() => setMobileOpen(false)}
                  className="rounded bg-background p-2 font-medium hover:text-primary shadow-xs"
                >
                  🔄 Relay Events
                </Link>
                <Link
                  to="/sports/game-analysis"
                  onClick={() => setMobileOpen(false)}
                  className="col-span-2 rounded bg-background p-2 font-medium hover:text-primary shadow-xs text-center"
                >
                  📊 Game Analysis Suite
                </Link>
                <Link
                  to="/sports"
                  onClick={() => setMobileOpen(false)}
                  className="col-span-2 text-center text-xs font-bold text-primary py-1"
                >
                  View All Sports Directory &rarr;
                </Link>
              </div>
            </div>

            {/* 7 Core Structured Sections */}
            <div className="grid gap-1 border-t border-border pt-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-2">
                Navigation Menu
              </span>

              {/* 1. Platform */}
              <div className="border-b border-border/50 pb-2 pt-1">
                <Link
                  to="/platform"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-1.5 text-sm font-semibold hover:bg-secondary block"
                >
                  Platform
                </Link>
                <div className="pl-4 pb-1 grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                  <Link to="/platform" onClick={() => setMobileOpen(false)} className="hover:text-primary py-0.5">• How it Works</Link>
                  <Link to="/platform" onClick={() => setMobileOpen(false)} className="hover:text-primary py-0.5">• Technology</Link>
                  <Link to="/platform" onClick={() => setMobileOpen(false)} className="hover:text-primary py-0.5">• Integrations</Link>
                  <Link to="/platform" onClick={() => setMobileOpen(false)} className="hover:text-primary py-0.5">• Security</Link>
                </div>
              </div>

              {/* 2. Solutions */}
              <div className="border-b border-border/50 pb-2 pt-1">
                <Link
                  to="/analytics"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-1.5 text-sm font-semibold hover:bg-secondary block"
                >
                  Solutions
                </Link>
                <div className="pl-4 pb-1 grid grid-cols-1 gap-1 text-xs text-muted-foreground">
                  <Link to="/analytics" onClick={() => setMobileOpen(false)} className="hover:text-primary py-0.5">• Analytics Services</Link>
                  <Link to="/coaches" onClick={() => setMobileOpen(false)} className="hover:text-primary py-0.5">• Coaching Services</Link>
                  <Link to="/ecosystem" onClick={() => setMobileOpen(false)} className="hover:text-primary py-0.5">• Olympic &amp; Elite Programs</Link>
                </div>
              </div>

              {/* 3. ICP */}
              <div className="border-b border-border/50 pb-2 pt-1">
                <div className="rounded-md px-3 py-1.5 text-sm font-semibold text-foreground">
                  ICP
                </div>
                <div className="pl-4 pb-1 grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                  <Link to="/athletes" onClick={() => setMobileOpen(false)} className="hover:text-primary py-0.5">• Athletes</Link>
                  <Link to="/coaches" onClick={() => setMobileOpen(false)} className="hover:text-primary py-0.5">• Coaches &amp; Teams</Link>
                  <Link to="/institution" onClick={() => setMobileOpen(false)} className="hover:text-primary py-0.5">• Institutions / NOCs</Link>
                  <Link to="/ecosystem" onClick={() => setMobileOpen(false)} className="hover:text-primary py-0.5">• Federations</Link>
                </div>
              </div>

              {/* 4. Case Studies & Guides */}
              <div className="border-b border-border/50 pb-2 pt-1">
                <Link
                  to="/resources"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-1.5 text-sm font-semibold hover:bg-secondary block"
                >
                  Case Studies &amp; Guides
                </Link>
                <div className="pl-4 pb-1 grid grid-cols-1 gap-1 text-xs text-muted-foreground">
                  <Link to="/resources" onClick={() => setMobileOpen(false)} className="hover:text-primary py-0.5">• Case Studies (National Federations)</Link>
                  <Link to="/resources" onClick={() => setMobileOpen(false)} className="hover:text-primary py-0.5">• Success Stories (Athlete Outcomes)</Link>
                  <Link to="/resources" onClick={() => setMobileOpen(false)} className="hover:text-primary py-0.5">• Video Guides (Tutorials &amp; Demos)</Link>
                </div>
              </div>

              {/* 5. Resources */}
              <div className="border-b border-border/50 pb-2 pt-1">
                <Link
                  to="/resources"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-1.5 text-sm font-semibold hover:bg-secondary block"
                >
                  Resources &amp; Intelligence
                </Link>
                <div className="pl-4 pb-1 grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                  <Link to="/resources" onClick={() => setMobileOpen(false)} className="hover:text-primary py-0.5">• Insights</Link>
                  <Link to="/reports" onClick={() => setMobileOpen(false)} className="hover:text-primary py-0.5 font-medium text-foreground">• Reports</Link>
                  <Link to="/resources" onClick={() => setMobileOpen(false)} className="hover:text-primary py-0.5">• Blog</Link>
                  <Link to="/resources" onClick={() => setMobileOpen(false)} className="hover:text-primary py-0.5">• Documentation</Link>
                  <Link to="/google-trends" onClick={() => setMobileOpen(false)} className="hover:text-primary py-0.5">• Google Trends</Link>
                  <Link to="/cta-report" onClick={() => setMobileOpen(false)} className="hover:text-primary py-0.5">• CTA Reports</Link>
                </div>
              </div>

              {/* 6. About */}
              <div className="pb-2 pt-1">
                <Link
                  to="/about"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-1.5 text-sm font-semibold hover:bg-secondary block"
                >
                  About SportsMax
                </Link>
                <div className="pl-4 pb-1 grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                  <Link to="/about" onClick={() => setMobileOpen(false)} className="hover:text-primary py-0.5">• Mission</Link>
                  <Link to="/about" onClick={() => setMobileOpen(false)} className="hover:text-primary py-0.5">• Team</Link>
                  <Link to="/ecosystem" onClick={() => setMobileOpen(false)} className="hover:text-primary py-0.5">• Partners</Link>
                  <Link to="/contact" onClick={() => setMobileOpen(false)} className="hover:text-primary py-0.5">• Contact</Link>
                </div>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-border flex flex-col gap-2">
              <Button
                asChild
                className="w-full font-bold text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-900/20 border border-emerald-400/30"
              >
                <Link to="/book-appointment" onClick={() => setMobileOpen(false)}>
                  <Calendar className="h-4 w-4 mr-1.5" />
                  Book Appointment
                </Link>
              </Button>
              {isAuthenticated && user ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between rounded-lg bg-secondary/80 p-2.5">
                    <div className="flex items-center gap-2">
                      <div className="grid h-7 w-7 place-items-center rounded-full bg-primary/20 text-primary text-xs font-bold">
                        {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-3.5 w-3.5" />}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-foreground">{user.name}</div>
                        <div className="text-[10px] text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        logout();
                        setMobileOpen(false);
                      }}
                      className="text-xs text-muted-foreground hover:text-destructive h-8 px-2"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button asChild className="w-full">
                    <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                      Go to Dashboard <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <AuthDialog defaultMode="login">
                    <Button variant="outline" className="w-full">
                      Log in
                    </Button>
                  </AuthDialog>
                  <AuthDialog defaultMode="signup">
                    <Button className="w-full">
                      Register
                    </Button>
                  </AuthDialog>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card text-foreground">
      <div className="content-wrap py-16">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {/* Col 1: Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Brand />
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
              Sports intelligence, biomechanical modeling, automated tactical detection, and team
              load management in one unified platform.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-secondary border border-border px-3 py-1 font-medium text-foreground">
                24+ Sports
              </span>
              <span className="rounded-full bg-secondary border border-border px-3 py-1 font-medium text-foreground">
                Real-Time Telemetry
              </span>
              <span className="rounded-full bg-secondary border border-border px-3 py-1 font-medium text-foreground">
                AI Diagnostics
              </span>
            </div>
            <p className="mt-8 text-xs text-muted-foreground">
              &copy; 2026 SportsMax Technologies Inc. All rights reserved.
            </p>
          </div>

          {/* Col 2: Platform & Solutions */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Platform &amp; Solutions</h3>
            <ul className="mt-4 grid gap-2.5 text-sm text-muted-foreground">
              <li>
                <Link to="/platform" className="hover:text-primary transition">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/platform" className="hover:text-primary transition">
                  Technology &amp; Security
                </Link>
              </li>
              <li>
                <Link to="/platform" className="hover:text-primary transition">
                  Integrations &amp; Sensors
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-primary transition">
                  Analytics Services
                </Link>
              </li>
              <li>
                <Link to="/coaches" className="hover:text-primary transition">
                  Coaching Services
                </Link>
              </li>
              <li>
                <Link to="/ecosystem" className="hover:text-primary transition">
                  Olympic &amp; Elite Programs
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Sports Hub */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <span>Sports Hub</span>
              <span className="rounded bg-primary/15 px-1 py-0.2 text-[8px] font-black uppercase text-primary">
                New
              </span>
            </h3>
            <ul className="mt-4 grid gap-2.5 text-sm text-muted-foreground">
              <li>
                <Link to="/sports/running" className="hover:text-primary transition font-medium">
                  Running (GPS &amp; Pace)
                </Link>
              </li>
              <li>
                <Link to="/sports/swimming" className="hover:text-primary transition">
                  Swimming (SWOLF)
                </Link>
              </li>
              <li>
                <Link to="/sports/athletics/high-jump" className="hover:text-primary transition">
                  High Jump &amp; Track
                </Link>
              </li>
              <li>
                <Link to="/sports/football" className="hover:text-primary transition">
                  Football / Soccer (xG)
                </Link>
              </li>
              <li>
                <Link to="/sports/hockey" className="hover:text-primary transition">
                  Hockey &amp; Ice Sports
                </Link>
              </li>
              <li>
                <Link to="/sports/relay" className="hover:text-primary transition">
                  Relay &amp; Combined
                </Link>
              </li>
              <li>
                <Link to="/sports/game-analysis" className="hover:text-primary transition font-medium text-foreground">
                  Game Analysis Suite
                </Link>
              </li>
              <li>
                <Link
                  to="/sports"
                  className="font-bold text-primary hover:underline transition pt-1 block"
                >
                  All Sports Directory &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: ICP & Case Studies */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              ICP &amp; Proof
            </h3>
            <ul className="mt-4 grid gap-2.5 text-sm text-muted-foreground">
              <li>
                <Link to="/athletes" className="hover:text-primary transition">
                  Athletes Portal
                </Link>
              </li>
              <li>
                <Link to="/coaches" className="hover:text-primary transition">
                  Coaches &amp; Teams
                </Link>
              </li>
              <li>
                <Link to="/institution" className="hover:text-primary transition">
                  Institutions &amp; NOCs
                </Link>
              </li>
              <li>
                <Link to="/ecosystem" className="hover:text-primary transition">
                  Governing Federations
                </Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-primary transition font-medium text-foreground">
                  Case Studies &amp; Success Stories
                </Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-primary transition">
                  Video Guides &amp; Tutorials
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Resources & Company */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Resources &amp; Company
            </h3>
            <ul className="mt-4 grid gap-2.5 text-sm text-muted-foreground">
              <li>
                <Link to="/reports" className="hover:text-primary transition">
                  Telemetry Reports
                </Link>
              </li>
              <li>
                <Link to="/google-trends" className="hover:text-primary transition">
                  Google Trends
                </Link>
              </li>
              <li>
                <Link to="/cta-report" className="hover:text-primary transition">
                  CTA Reports
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition">
                  Mission &amp; Team
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/linkedin" className="text-sky-400 hover:text-sky-300 transition font-medium flex items-center gap-1.5">
                  <span>LinkedIn Hub</span>
                  <span className="rounded bg-sky-500/20 px-1 py-0.2 text-[8px] font-black uppercase text-sky-400">
                    Pro
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary transition">
                  Privacy &amp; Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
