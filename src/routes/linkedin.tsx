import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Building2,
  CheckCircle2,
  ChevronRight,
  Globe2,
  LineChart,
  Linkedin,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { ConnectWithSportsMax } from "@/components/connect-with-sportsmax";
import { Eyebrow, PageIntro } from "@/components/sports-ui";

export const Route = createFileRoute("/linkedin")({
  head: () => ({
    meta: [
      { title: "SportsMax — Sports Intelligence for Your Organization" },
      {
        name: "description",
        content:
          "Connect with SportsMax to unlock advanced sports analytics, athlete performance tracking, tactical analysis, and data-driven coaching intelligence for your team or federation.",
      },
      { property: "og:title", content: "SportsMax — Sports Intelligence Platform" },
      {
        property: "og:description",
        content:
          "AI-powered sports analytics, biomechanics, and tactical intelligence. Share your requirements and our team will follow up within 24 hours.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/linkedin" }],
  }),
  component: LinkedInLandingPage,
});

const CAPABILITIES = [
  {
    icon: TrendingUp,
    title: "Athlete Performance Tracking",
    desc: "GPS kinematics, sprint profiling, workload monitoring, and fatigue prediction for individual athletes and squad rotations.",
  },
  {
    icon: BarChart3,
    title: "Tactical & Match Analysis",
    desc: "Formation detection, pitch density heatmaps, passing networks, and real-time opposition scouting from video feeds.",
  },
  {
    icon: Brain,
    title: "AI-Driven Insights",
    desc: "Machine learning models that surface actionable coaching recommendations, injury risk flags, and performance trends.",
  },
  {
    icon: Users,
    title: "Team & Federation Analytics",
    desc: "Multi-squad telemetry dashboards, comparative benchmarking, and federation-level aggregated reporting.",
  },
  {
    icon: Target,
    title: "Biomechanics & Kinematics",
    desc: "Marker-less motion capture, joint angle analysis, sprint arc modelling, and technique optimization.",
  },
  {
    icon: Globe2,
    title: "24+ Sports Supported",
    desc: "Football, cricket, basketball, athletics, swimming, hockey, tennis, rugby, and more — across individual and team disciplines.",
  },
];

const TRUST_METRICS = [
  { value: "< 50ms", label: "Live match latency" },
  { value: "24+", label: "Sports supported" },
  { value: "99.2%", label: "Tracking precision" },
  { value: "AI-Native", label: "Performance copilot" },
];

const WORKFLOW_STEPS = [
  { step: "01", title: "Share Your Requirements", desc: "Tell us about your sport, team size, and analytical goals." },
  { step: "02", title: "Solutions Review", desc: "Our team reviews your needs and designs a tailored analytics configuration." },
  { step: "03", title: "Platform Onboarding", desc: "Get access to dashboards, integrations, and AI insights within days." },
];

function LinkedInLandingPage() {
  return (
    <>
      {/* Hero Section */}
      <PageIntro
        eyebrow="Welcome from LinkedIn"
        title="Sports Intelligence, Engineered for Performance"
        text="You're here because performance matters. SportsMax delivers AI-powered analytics, biomechanical insights, and tactical intelligence trusted by coaches, federations, and sports organizations worldwide."
      />

      {/* Trust Metrics Bar */}
      <section className="border-b border-border bg-card/60 py-8">
        <div className="content-wrap">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_METRICS.map((m) => (
              <div key={m.label} className="border-l-2 border-primary/50 pl-4">
                <div className="font-display text-2xl font-bold text-foreground">{m.value}</div>
                <div className="text-xs text-muted-foreground">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LinkedIn Attribution Badge + CTA */}
      <section className="py-6 bg-background border-b border-border">
        <div className="content-wrap">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-[#0A66C2]/20 bg-[#0A66C2]/5 p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#0A66C2]/10 text-[#0A66C2]">
                <Linkedin className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-foreground">You arrived from LinkedIn</h3>
                <p className="text-xs text-muted-foreground">
                  Complete the form below to connect with our sports analytics team. We'll respond within 24 hours.
                </p>
              </div>
            </div>
            <a
              href="#connect-form"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0A66C2] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0A66C2]/20 hover:bg-[#094d92] transition-colors"
            >
              Share Your Requirements
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section className="py-14 bg-background">
        <div className="content-wrap">
          <Eyebrow>What SportsMax Delivers</Eyebrow>
          <h2 className="text-balance text-2xl font-semibold sm:text-3xl text-foreground mb-3">
            End-to-End Sports Intelligence Platform
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground mb-10">
            From wearable sensor data to tactical video analysis, SportsMax integrates every performance signal into a unified intelligence layer.
          </p>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((cap) => {
              const Icon = cap.icon;
              return (
                <div
                  key={cap.title}
                  className="group surface-card p-6 flex flex-col gap-3 transition hover:border-primary/35"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary/15">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-display font-bold text-base text-foreground">{cap.title}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">{cap.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-14 bg-card/40 border-t border-border">
        <div className="content-wrap">
          <Eyebrow>How It Works</Eyebrow>
          <h2 className="text-balance text-2xl font-semibold sm:text-3xl text-foreground mb-10">
            Three Steps to Smarter Performance
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {WORKFLOW_STEPS.map((ws, idx) => (
              <div
                key={ws.step}
                className="relative surface-card p-6 flex flex-col gap-3"
              >
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 font-mono text-sm font-bold text-primary">
                  {ws.step}
                </span>
                <h3 className="font-display font-bold text-foreground">{ws.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{ws.desc}</p>
                {idx < WORKFLOW_STEPS.length - 1 && (
                  <ChevronRight className="absolute right-3 top-3 h-4 w-4 text-muted-foreground/40 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Lead Capture Form — Reuses existing component */}
      <div id="connect-form">
        <ConnectWithSportsMax />
      </div>

      {/* Trust & Compliance Section */}
      <section className="py-14 bg-background border-t border-border">
        <div className="content-wrap">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="surface-card p-6 flex flex-col gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Shield className="h-5 w-5" />
              </span>
              <h3 className="font-display font-bold text-base text-foreground mt-2">Data Privacy & Security</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Your information is processed securely. We only collect what's necessary for business follow-up and never share your details with third parties.
              </p>
            </div>

            <div className="surface-card p-6 flex flex-col gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Zap className="h-5 w-5" />
              </span>
              <h3 className="font-display font-bold text-base text-foreground mt-2">Fast Response Time</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Our solutions team reviews every inquiry and responds within 24 hours on business days. Complex requirements may receive a detailed proposal.
              </p>
            </div>

            <div className="surface-card p-6 flex flex-col gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </span>
              <h3 className="font-display font-bold text-base text-foreground mt-2">Tailored Solutions</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Whether you're an individual coach, a university program, or a professional sports franchise — we configure SportsMax to your exact requirements.
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-xl border border-border bg-secondary/50 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#0A66C2]/10 text-[#0A66C2]">
                <Linkedin className="h-4 w-4" />
              </span>
              <div>
                <h4 className="text-xs font-bold text-foreground">Follow SportsMax on LinkedIn</h4>
                <p className="text-xs text-muted-foreground">
                  Stay updated with the latest in sports intelligence, product updates, and industry insights.
                </p>
              </div>
            </div>
            <a
              href="https://www.linkedin.com/company/sportsmax-intelligence"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-[#0A66C2]/20 bg-[#0A66C2]/10 px-4 py-2 text-xs font-semibold text-[#0A66C2] hover:bg-[#0A66C2]/20 transition-colors"
            >
              <Linkedin className="h-3.5 w-3.5" />
              Follow on LinkedIn
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
