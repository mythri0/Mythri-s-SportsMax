import { createFileRoute } from "@tanstack/react-router";
import { Youtube, Play, Sparkles } from "lucide-react";
import { PageIntro, SectionHead } from "@/components/sports-ui";
import { YouTubeLeadForm } from "@/components/youtube-lead-form";

export const Route = createFileRoute("/youtube")({
  head: () => ({
    meta: [
      { title: "YouTube Sports Analysis & Intelligence Hub — SportsMax" },
      {
        name: "description",
        content:
          "Watch exclusive SportsMax sports tactical breakdowns, data engineering video series, and connect with our team directly.",
      },
    ],
  }),
  component: YouTubePublicPage,
});

function YouTubePublicPage() {
  return (
    <>
      <PageIntro
        eyebrow="SportsMax Video Hub"
        title="Tactical Breakdown & Athlete Intelligence on YouTube"
        text="Explore deep performance breakdowns, athlete movement telemetry, and modern sports engineering insights."
      />

      <section className="py-12">
        <div className="content-wrap">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
            {/* Left Column: Video Highlights & Value Proposition */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <SectionHead
                  eyebrow="Featured Analysis"
                  title="Transforming Raw Match Footage into Actionable Metrics"
                />
                <p className="mt-4 leading-7 text-muted-foreground text-sm">
                  Our YouTube channels break down key physical KPIs, heatmaps, tracking telemetry, and game intelligence across football, athletics, and high-performance programs.
                </p>
              </div>

              {/* Video Feature Card */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 text-red-500 mb-4">
                  <Youtube className="h-6 w-6" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Official SportsMax YouTube Channel
                  </span>
                </div>
                <div className="relative aspect-video rounded-xl bg-slate-950 flex flex-col items-center justify-center border border-slate-800/80 p-6 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600/20 text-red-500 ring-1 ring-red-500/30 mb-3">
                    <Play className="h-7 w-7 fill-current ml-1" />
                  </div>
                  <h4 className="text-base font-semibold text-white">Full Match Telemetry & Kinematics</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    Watch our automated tracking pipelines and multi-angle camera synchronization.
                  </p>
                </div>
              </div>

              {/* Value Highlights */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                    <Sparkles className="h-4 w-4" />
                    <span>Scouting & Recruitment</span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    Custom highlight reels with integrated speed, velocity, and biomechanics overlays.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                    <Sparkles className="h-4 w-4" />
                    <span>Tactical Breakdowns</span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    Automated event detection and pitch territory control maps.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Lead Form */}
            <div className="lg:col-span-5">
              <YouTubeLeadForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
