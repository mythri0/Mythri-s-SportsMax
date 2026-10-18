import { createFileRoute } from "@tanstack/react-router";
import { PageIntro } from "@/components/sports-ui";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [{ title: "Terms of Service — SportsMax" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Legal & Governance"
        title="Terms of Service"
        text="The terms and standards governing use of the SportsMax intelligence platform."
      />
      <section className="py-12 bg-background">
        <div className="content-wrap max-w-3xl">
          <div className="surface-card p-8 grid gap-6 text-sm text-muted-foreground leading-relaxed">
            <div>
              <h2 className="text-lg font-bold text-foreground mb-2">1. Athletic Guidance Disclaimer</h2>
              <p>
                SportsMax provides performance analytics and training suggestions based on sensor inputs and statistical models. It does not replace certified sports medicine advice or clinical cardiology diagnostics. Athletes should consult qualified medical personnel for any physical symptoms.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground mb-2">2. Acceptable Use</h2>
              <p>
                Users agree not to tamper with sensor data streams, attempt unauthorized extraction of other teams' proprietary tactical models, or misuse automated scraping tools against our APIs.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground mb-2">3. Service Availability</h2>
              <p>
                We strive for 99.9% uptime across our live matchday streaming services. Scheduled maintenance is timed around major global competition windows.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
