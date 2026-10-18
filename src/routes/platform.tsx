import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Cpu,
  Database,
  Layers,
  Link2,
  Radio,
  Server,
  Shield,
  Sparkles,
  Workflow as WorkflowIcon,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoBadge, PageIntro, SectionHead, Workflow } from "@/components/sports-ui";

export const Route = createFileRoute("/platform")({
  head: () => ({
    meta: [
      { title: "Platform Architecture & Technology — SportsMax" },
      {
        name: "description",
        content:
          "Explore the SportsMax intelligence platform: overview, how it works, biomechanical technology stack, and third-party hardware integrations.",
      },
    ],
  }),
  component: PlatformPage,
});

export function PlatformPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "how-it-works" | "technology" | "integrations">("overview");

  return (
    <>
      <PageIntro
        eyebrow="Platform Architecture"
        title="Engineered for Continuous Athletic Superiority"
        text="SportsMax integrates wearable sensor streams, high-speed optical computer vision, and machine learning models to synthesize raw human movement into actionable intelligence."
        action={
          <div className="flex flex-col items-end gap-3">
            <DemoBadge />
            <div className="inline-flex rounded-lg border border-border bg-secondary p-1">
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className={`rounded px-3 py-1.5 text-xs font-bold transition ${
                  activeTab === "overview" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("how-it-works")}
                className={`rounded px-3 py-1.5 text-xs font-bold transition ${
                  activeTab === "how-it-works" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                How It Works
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("technology")}
                className={`rounded px-3 py-1.5 text-xs font-bold transition ${
                  activeTab === "technology" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Technology
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("integrations")}
                className={`rounded px-3 py-1.5 text-xs font-bold transition ${
                  activeTab === "integrations" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Integrations
              </button>
            </div>
          </div>
        }
      />

      <section className="py-12 bg-background">
        <div className="content-wrap">
          {/* Tab 1: Overview */}
          {activeTab === "overview" && (
            <div className="grid gap-12">
              <SectionHead
                eyebrow="End-to-End Pipeline"
                title="Unified Sports Intelligence Foundation"
                text="From individual runners on tracks to premier league football stadiums, SportsMax scales seamlessly across sports."
              />

              <div className="grid gap-6 md:grid-cols-3">
                <div className="surface-card p-6">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Database className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-xl font-bold">1. Universal Ingestion</h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    Stream data from GPS watches, chest straps, force plates, optical video cameras, and ball tracking chips at sub-50ms latency.
                  </p>
                  <ul className="mt-4 grid gap-1.5 text-xs text-foreground font-medium">
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> BLE & ANT+ direct feeds</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> 120fps video stream ingestion</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Standardized FIT/GPX/JSON pipelines</li>
                  </ul>
                </div>

                <div className="surface-card p-6">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent/15 text-accent">
                    <BrainCircuit className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-xl font-bold">2. Biomechanical AI Engine</h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    Proprietary physics and machine learning models infer center-of-mass kinematics, joint torque loads, and tactical pitch spatial patterns.
                  </p>
                  <ul className="mt-4 grid gap-1.5 text-xs text-foreground font-medium">
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-accent" /> Acute-to-chronic workload ratios</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-accent" /> Expected Goals (xG) & threat matrices</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-accent" /> Dynamic fatigue modeling</li>
                  </ul>
                </div>

                <div className="surface-card p-6">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-chart-3/15 text-chart-3">
                    <Zap className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-xl font-bold">3. Automated Execution</h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    Deliver instantaneous tactical cues to head coaches, training prescriptions to athletes, and automated post-match debrief packages.
                  </p>
                  <ul className="mt-4 grid gap-1.5 text-xs text-foreground font-medium">
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-chart-3" /> Live match pitch-side displays</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-chart-3" /> Push alerts for overtraining spikes</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-chart-3" /> One-click tactical dossiers</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: How It Works */}
          {activeTab === "how-it-works" && (
            <div className="grid gap-8">
              <SectionHead
                eyebrow="Process Workflow"
                title="How Data Transforms Into Strategy"
                text="The automated cycle runs before, during, and after every training session and competitive fixture."
              />
              <Workflow
                title="Biomechanical & Tactical Synthesis Engine"
                description="From field-level sensors to coaching staff decisions."
                steps={[
                  "Capture Telemetry",
                  "Filter & Clean",
                  "Kinematic Extraction",
                  "Pattern Detection",
                  "Alert Generation",
                  "Actionable Cue",
                ]}
              />
            </div>
          )}

          {/* Tab 3: Technology */}
          {activeTab === "technology" && (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="surface-card p-6">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Core Tech</span>
                <h3 className="text-xl font-bold mt-2">Computer Vision & Optical Tracking</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Real-time multi-camera pose estimation tracks 24 anatomical keypoints at 120 frames per second without requiring reflective markers.
                </p>
              </div>

              <div className="surface-card p-6">
                <span className="text-xs font-bold uppercase tracking-wider text-accent">Real-Time Core</span>
                <h3 className="text-xl font-bold mt-2">High-Throughput Edge Pipeline</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Built on ultra-low latency WebSocket streams with sub-50ms round-trip delivery for live coaching pitch-side dashboards.
                </p>
              </div>
            </div>
          )}

          {/* Tab 4: Integrations */}
          {activeTab === "integrations" && (
            <div className="surface-card p-8">
              <SectionHead
                eyebrow="Device Ecosystem"
                title="Native Wearable & Hardware Integrations"
                text="SportsMax syncs directly with industry-standard hardware, devices, and tracking systems."
              />
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 mt-6">
                {["Garmin Connect", "Polar Flow", "Catapult Sports", "StatsPerform / Opta", "Wahoo Fitness", "Apple Health", "WHOOP Strap", "Kinexon Real-Time"].map((brand) => (
                  <div key={brand} className="rounded-lg border border-border bg-secondary/50 p-4 text-center">
                    <div className="font-bold text-sm text-foreground">{brand}</div>
                    <span className="text-[10px] text-primary font-semibold mt-1 block">Verified API Sync</span>
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
