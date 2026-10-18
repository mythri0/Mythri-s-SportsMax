import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Briefcase, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageIntro } from "@/components/sports-ui";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [{ title: "Careers — SportsMax Technologies" }],
  }),
  component: CareersPage,
});

const openings = [
  { role: "Senior Computer Vision Engineer", dept: "Machine Learning", loc: "San Francisco / Remote", type: "Full-Time" },
  { role: "Lead Sports Scientist (Biomechanics)", dept: "Athletic Research", loc: "London / Hybrid", type: "Full-Time" },
  { role: "Staff Full-Stack Engineer (Real-time Telemetry)", dept: "Platform Infrastructure", loc: "Remote", type: "Full-Time" },
];

function CareersPage() {
  return (
    <>
      <PageIntro
        eyebrow="Join Our Team"
        title="Build the Future of Athletic Performance"
        text="We are sports scientists, machine learning researchers, and engineers obsessed with pushing the boundaries of human potential."
      />
      <section className="py-12 bg-background">
        <div className="content-wrap max-w-4xl">
          <div className="grid gap-4">
            {openings.map((job) => (
              <div key={job.role} className="surface-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{job.dept}</span>
                  <h3 className="text-lg font-bold text-foreground mt-1">{job.role}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                    <span>{job.loc}</span>
                    <span>•</span>
                    <span>{job.type}</span>
                  </div>
                </div>
                <Button size="sm">
                  Apply Now <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
