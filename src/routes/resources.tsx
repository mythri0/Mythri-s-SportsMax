import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Code,
  FileText,
  HelpCircle,
  Lightbulb,
  Search,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoBadge, PageIntro, SectionHead } from "@/components/sports-ui";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources, Research & Documentation — SportsMax" },
      {
        name: "description",
        content:
          "Sports science articles, case studies, athletic intelligence knowledge base, and developer API documentation.",
      },
    ],
  }),
  component: ResourcesPage,
});

const articles = [
  { title: "The Biomechanics of Fosbury Flop Apex Clearance", category: "Sports Science", date: "Sep 28, 2026", readTime: "5 min read" },
  { title: "Understanding Acute-to-Chronic Workload Ratio in Elite Runners", category: "Load Management", date: "Sep 15, 2026", readTime: "8 min read" },
  { title: "How Expected Goals (xG) is Evolving with Optical Tracking", category: "Tactical Analytics", date: "Aug 30, 2026", readTime: "6 min read" },
];

const caseStudies = [
  {
    type: "National Federation Implementation",
    team: "French Athletics Federation (FFA)",
    metric: "-42% Soft Tissue Injuries",
    deployment: "High-Performance Olympic Center — Paris",
    story: "Deployed optical biomechanics & continuous ACWR tracking across 38 national squad sprinters and decathletes preparing for European and World Championships."
  },
  {
    type: "High-Performance Center Deployment",
    team: "National Swimming Institute (FIN)",
    metric: "+8.4% Turn Efficiency & Stroke Index",
    deployment: "Federal Aquatic Training Center",
    story: "Implemented multi-angle Swolf and stroke rate computer vision cameras during live taper cycles across 100m and 200m freestyle teams."
  },
  {
    type: "Club & League Integration",
    team: "Premier League Elite Academy",
    metric: "+1.34 xG Differential & 22% Faster Press Recoveries",
    deployment: "First Team & Under-21 Tactical Analysis Center",
    story: "Integrated automated pitch telemetry and real-time press resistance heatmaps into halftime coaching headsets and debrief monitors."
  },
];

const successStories = [
  {
    athlete: "Elena Rostova (Marathon / 10,000m)",
    badge: "World Championships Finalist",
    metric: "2h 19m 40s (PR -2m 15s)",
    quote: "SportsMax ACWR and live biomechanical fatigue detection showed my coach exactly when my ground contact time became asymmetrical.",
    tags: ["Running", "ACWR Load", "GPS Telemetry"]
  },
  {
    athlete: "Men's 4x100m National Relay Squad",
    badge: "Continental Gold Medalists",
    metric: "0.28s Shaved on Handover Window",
    quote: "Optical velocity synchronization in the exchange zone eliminated our deceleration spikes between runner 2 and 3.",
    tags: ["Relay", "Optical Tracking", "Split Telemetry"]
  },
  {
    athlete: "High Jump Olympic Development Program",
    badge: "National Podium Sweep",
    metric: "2.34m Clearance Peak (+5cm PR)",
    quote: "Curve acceleration and takeoff angle telemetry gave our jumpers millimeter precision on bar clearance apex points.",
    tags: ["High Jump", "Kinematics", "Apex Trajectory"]
  }
];

const videoGuides = [
  {
    title: "Platform Walkthrough: Setting Up Olympic Macrocycles",
    duration: "14:20",
    category: "Platform Walkthrough",
    description: "Full guide on structuring 4-year Olympic cycles, peak timing weeks, and connecting squad wearables."
  },
  {
    title: "Coaching Cues: Automated Live Feedback Workflows",
    duration: "08:45",
    category: "Coaching Cue Demos",
    description: "How to trigger instant audio/tablet cues to field coaches during sprint starts and tactical drills."
  },
  {
    title: "Analytics Tutorial: Decoding Acute-to-Chronic Workload Ratios",
    duration: "11:15",
    category: "Analytics Tutorial",
    description: "Deep dive into sweet spot calibration (0.8 - 1.3 ACWR) and preventing spike-induced soft tissue strain."
  },
  {
    title: "Match Suite Masterclass: Formation Detection & Press Resistance",
    duration: "16:05",
    category: "How-To Video",
    description: "Step-by-step video on importing live optical camera feeds and extracting automated player passing radar matrices."
  }
];

export function ResourcesPage() {
  const [activeTab, setActiveTab] = useState<"case-studies" | "success-stories" | "video-guides" | "blog" | "knowledge-base" | "api">("case-studies");

  return (
    <>
      <PageIntro
        eyebrow="Proof & Education"
        title="Case Studies, Success Stories & Video Guides"
        text="Explore detailed national federation deployments, athlete outcome metrics, video tutorials, sports science research, and developer API documentation."
        action={
          <div className="flex flex-col items-end gap-3">
            <DemoBadge />
            <div className="flex flex-wrap gap-1 bg-secondary p-1 rounded-lg border border-border">
              <button
                type="button"
                onClick={() => setActiveTab("case-studies")}
                className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                  activeTab === "case-studies" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Case Studies
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("success-stories")}
                className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                  activeTab === "success-stories" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Success Stories
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("video-guides")}
                className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                  activeTab === "video-guides" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Video Guides
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("blog")}
                className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                  activeTab === "blog" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Blog &amp; Articles
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("knowledge-base")}
                className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                  activeTab === "knowledge-base" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Guides
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("api")}
                className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                  activeTab === "api" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                API Specs
              </button>
            </div>
          </div>
        }
      />

      <section className="py-12 bg-background">
        <div className="content-wrap">
          {/* Tab 1: Case Studies */}
          {activeTab === "case-studies" && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {caseStudies.map((cs) => (
                <div key={cs.team} className="surface-card p-6 flex flex-col justify-between hover:border-primary/50 transition">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{cs.type}</span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{cs.team}</h3>
                    <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">{cs.deployment}</p>
                    <div className="mt-3 inline-block rounded bg-primary/10 text-primary font-mono font-bold text-sm px-2.5 py-1">
                      {cs.metric}
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{cs.story}</p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs font-semibold text-primary">
                    <span>Full Implementation Study</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Success Stories */}
          {activeTab === "success-stories" && (
            <div className="grid gap-6 sm:grid-cols-3">
              {successStories.map((story) => (
                <div key={story.athlete} className="surface-card p-6 flex flex-col justify-between hover:border-primary/50 transition">
                  <div>
                    <span className="rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-wider px-2 py-0.5">
                      {story.badge}
                    </span>
                    <h3 className="text-base font-bold text-foreground mt-3">{story.athlete}</h3>
                    <div className="mt-2 inline-block rounded bg-primary/10 text-primary font-mono font-bold text-sm px-2.5 py-1">
                      {story.metric}
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground italic leading-relaxed">
                      "{story.quote}"
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-border flex flex-wrap gap-1.5">
                    {story.tags.map((t) => (
                      <span key={t} className="rounded bg-secondary text-foreground text-[10px] font-semibold px-2 py-0.5">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Video Guides */}
          {activeTab === "video-guides" && (
            <div className="grid gap-6 sm:grid-cols-2">
              {videoGuides.map((vg) => (
                <div key={vg.title} className="surface-card p-6 flex flex-col justify-between hover:border-primary/50 transition">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{vg.category}</span>
                      <span className="rounded bg-secondary text-muted-foreground text-[10px] font-mono px-2 py-0.5">
                        ⏱ {vg.duration}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-foreground mt-1">{vg.title}</h3>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{vg.description}</p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-border flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary inline-flex items-center gap-1.5">
                      ▶ Watch Walkthrough Video
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">1080p 60fps</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Knowledge Base */}
          {activeTab === "knowledge-base" && (
            <div className="surface-card p-8">
              <SectionHead eyebrow="Sports Science Guide" title="Frequently Consulted Methodologies" />
              <div className="grid gap-4 sm:grid-cols-2 mt-4 text-xs">
                <div className="border border-border rounded-lg p-4 bg-secondary/30">
                  <h4 className="font-bold text-sm text-foreground">How is SWOLF calculated?</h4>
                  <p className="text-muted-foreground mt-1 leading-relaxed">
                    SWOLF combines swim time in seconds plus stroke count for a single pool length. Lower scores represent greater hydrodynamic efficiency.
                  </p>
                </div>
                <div className="border border-border rounded-lg p-4 bg-secondary/30">
                  <h4 className="font-bold text-sm text-foreground">What constitutes the ACWR sweet spot?</h4>
                  <p className="text-muted-foreground mt-1 leading-relaxed">
                    A ratio between 0.8 and 1.3 represents safe progressive adaptation. Spikes above 1.5 increase relative risk of soft-tissue fatigue by 2x to 4x.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: API */}
          {activeTab === "api" && (
            <div className="surface-card p-8">
              <SectionHead eyebrow="Developers" title="REST & Streaming WebSocket API" />
              <p className="text-xs text-muted-foreground mb-6">
                Ingest telemetry and query athlete records programmatically using SportsMax Developer APIs.
              </p>
              <div className="rounded-lg bg-secondary p-4 font-mono text-xs overflow-x-auto border border-border">
                <p className="text-muted-foreground">// Sample GET /v1/athletes/:id/telemetry/latest</p>
                <pre className="text-foreground mt-2">{`{
  "athleteId": "ath_94821",
  "sport": "running",
  "timestamp": "2026-10-03T06:45:00Z",
  "metrics": {
    "pace": 5.14,
    "cadence": 170,
    "heartRate": 156,
    "vo2MaxEst": 54.2
  }
}`}</pre>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
