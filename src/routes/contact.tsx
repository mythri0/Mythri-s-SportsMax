import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  Bot,
  BrainCircuit,
  Mail,
  Shield,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { ConnectWithSportsMax } from "@/components/connect-with-sportsmax";
import { Eyebrow, PageIntro } from "@/components/sports-ui";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Connect with SportsMax — Sports Analytics Enquiry" },
      {
        name: "description",
        content:
          "Connect with the SportsMax sports intelligence team. Discuss athlete performance analytics, team telemetry, tactical computer vision, and partnership opportunities.",
      },
      { property: "og:title", content: "Connect with SportsMax" },
      {
        property: "og:description",
        content:
          "Start a conversation about smarter sports performance intelligence and interact with the SportsMax Assistant.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const TRUST_SIGNALS = [
  {
    icon: Users,
    title: "Elite Federations & Clubs",
    desc: "Multi-squad telemetry, load management, and federation-level reporting.",
  },
  {
    icon: BrainCircuit,
    title: "Tactical & Match Analysis",
    desc: "Formation detection, pitch density models, and AI coaching automation.",
  },
  {
    icon: BarChart3,
    title: "Biomechanics & Kinematics",
    desc: "Kinematic data pipelines, sprint arcs, and injury-risk flags.",
  },
];

const METRICS = [
  { label: "< 50ms", desc: "Live match latency" },
  { label: "24+ Sports", desc: "Supported disciplines" },
  { label: "99.2%", desc: "Tracking precision" },
  { label: "AI-Native", desc: "Performance copilot" },
];

function ContactPage() {
  return (
    <>
      <PageIntro
        eyebrow="Direct Inquiry & AI Assistant"
        title="Connect with SportsMax"
        text="Tell us about your athletes, sports organization, or analytical goals. Our solutions team will review your requirement and follow up promptly."
      />

      {/* Trust & Metric Banner */}
      <section className="border-b border-border bg-card/60 py-8">
        <div className="content-wrap">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {METRICS.map((m) => (
              <div key={m.label} className="border-l-2 border-primary/50 pl-4">
                <div className="font-display text-2xl font-bold text-foreground">{m.label}</div>
                <div className="text-xs text-muted-foreground">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Connect with SportsMax Form + Assistant Chatbot */}
      <ConnectWithSportsMax />

      {/* Additional Support & Signals */}
      <section className="py-14 bg-background border-t border-border">
        <div className="content-wrap grid gap-8 md:grid-cols-3">
          {TRUST_SIGNALS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="surface-card p-6 flex flex-col gap-2">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-display font-bold text-base text-foreground mt-2">{s.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="content-wrap mt-8">
          <div className="rounded-xl border border-border bg-secondary/50 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <Mail className="h-4 w-4" />
              </span>
              <div>
                <h4 className="text-xs font-bold text-foreground">Need immediate direct contact?</h4>
                <p className="text-xs text-muted-foreground">
                  Email our solutions desk directly at{" "}
                  <a href="mailto:hello@sportsmax.ai" className="text-primary font-semibold hover:underline">
                    hello@sportsmax.ai
                  </a>
                </p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground font-mono">Mon–Fri, response within 24h</span>
          </div>
        </div>
      </section>
    </>
  );
}
