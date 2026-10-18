import { createFileRoute, Link } from "@tanstack/react-router";
import { HelpCircle, Mail, MessageSquare, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageIntro } from "@/components/sports-ui";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [{ title: "Help Center & Support — SportsMax" }],
  }),
  component: HelpPage,
});

function HelpPage() {
  return (
    <>
      <PageIntro
        eyebrow="Support & FAQ"
        title="SportsMax Help Center"
        text="Everything you need to know about setting up sensors, syncing team rosters, and analyzing tactical feeds."
      />
      <section className="py-12 bg-background">
        <div className="content-wrap max-w-4xl">
          <div className="relative mb-10">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search help articles, sensor setup guides..." className="pl-10 h-10 bg-card" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="surface-card p-6">
              <h3 className="font-bold text-base mb-2">How do I pair my Garmin or Apple Watch?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Navigate to your account profile settings and select "Connected Devices". Authorize the OAuth integration to allow automatic background activity synchronization.
              </p>
            </div>
            <div className="surface-card p-6">
              <h3 className="font-bold text-base mb-2">How is the Acute-to-Chronic Workload Ratio calculated?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Acute load is your rolling 7-day training volume. Chronic load is your rolling 28-day average. Dividing acute by chronic provides the ACWR score.
              </p>
            </div>
            <div className="surface-card p-6">
              <h3 className="font-bold text-base mb-2">Can coaches manage multi-sport rosters?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Yes. Coaches can group athletes by sport or discipline (e.g. Sprints, Distance, Football, Swimming) with custom metrics tailored to each event.
              </p>
            </div>
            <div className="surface-card p-6">
              <h3 className="font-bold text-base mb-2">Need live coaching staff support?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                Our sports science engineering team is available 24/7 for collegiate and professional matchday operations.
              </p>
              <Button asChild size="sm" variant="outline">
                <Link to="/contact">Contact Support &rarr;</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
