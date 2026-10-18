import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, Clock, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoBadge, PageIntro } from "@/components/sports-ui";

export const Route = createFileRoute("/book-appointment")({
  head: () => ({
    meta: [
      { title: "Book Appointment — SportsMax High-Performance Consultation" },
      {
        name: "description",
        content:
          "Schedule a 1-on-1 performance consultation with SportsMax sports scientists and tactical analysts.",
      },
    ],
  }),
  component: BookAppointmentPage,
});

export function BookAppointmentPage() {
  return (
    <>
      <PageIntro
        eyebrow="Consultation & Strategy"
        title="Book High-Performance Appointment"
        text="Connect with our lead sports scientists, telemetry engineers, and Olympic advisors for a personalized walkthrough or tactical evaluation."
        action={
          <div className="flex flex-col items-end gap-2">
            <DemoBadge />
            <span className="text-xs text-muted-foreground font-mono">Slots open for next 14 days</span>
          </div>
        }
      />

      <section className="py-12 bg-background">
        <div className="content-wrap max-w-4xl">
          <div className="surface-card p-8 sm:p-10 border border-border shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                <Calendar className="h-6 w-6" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-foreground">Schedule Your Session</h2>
                <p className="text-xs text-muted-foreground">Select appointment type, preferred date and time.</p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-3 mb-8">
              <div className="rounded-xl border border-primary/40 bg-primary/5 p-4 relative">
                <span className="absolute top-3 right-3 text-primary text-xs font-bold">Recommended</span>
                <Clock className="h-5 w-5 text-primary mb-2" />
                <h3 className="font-bold text-sm text-foreground">Olympic / NOC Advisory</h3>
                <p className="text-xs text-muted-foreground mt-1">45 min • Quadrennial telemetry & squad benchmarking</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition">
                <Sparkles className="h-5 w-5 text-accent mb-2" />
                <h3 className="font-bold text-sm text-foreground">Coach Tactical Demo</h3>
                <p className="text-xs text-muted-foreground mt-1">30 min • Game analysis suite & optical tracking</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition">
                <ShieldCheck className="h-5 w-5 text-emerald-500 mb-2" />
                <h3 className="font-bold text-sm text-foreground">Institution Integration</h3>
                <p className="text-xs text-muted-foreground mt-1">30 min • Academy & university athletic setup</p>
              </div>
            </div>

            <div className="rounded-xl border border-border/70 bg-secondary/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-foreground">Ready to customize this appointment flow?</h4>
                <p className="text-xs text-muted-foreground">
                  You can plug in your calendar provider (Calendly, Cal.com, or custom booking forms) right here.
                </p>
              </div>
              <Button asChild className="shrink-0 font-bold">
                <Link to="/contact">
                  Speak to Advisory Team <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
