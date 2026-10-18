import { createFileRoute } from "@tanstack/react-router";
import { Shield } from "lucide-react";
import { PageIntro } from "@/components/sports-ui";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [{ title: "Privacy Policy — SportsMax" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <>
      <PageIntro
        eyebrow="Legal & Governance"
        title="Privacy Policy"
        text="How SportsMax protects and stewards your biometric data, GPS traces, and athletic telemetry."
      />
      <section className="py-12 bg-background">
        <div className="content-wrap max-w-3xl">
          <div className="surface-card p-8 grid gap-6 text-sm text-muted-foreground leading-relaxed">
            <div>
              <h2 className="text-lg font-bold text-foreground mb-2">1. Sovereign Biometric Ownership</h2>
              <p>
                All personal biometrics, cardiac signals, GPS coordinates, and movement telemetry remain the exclusive property of the individual athlete and authorized team administrators. SportsMax does not sell or distribute identifiable biometric data to third-party advertisers.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground mb-2">2. Encryption at Rest & In Transit</h2>
              <p>
                All telemetry transmitted from field sensors, wearables, and camera feeds is encrypted using TLS 1.3 in transit and AES-256 at rest across compliant data centers.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground mb-2">3. Anonymized Benchmarking</h2>
              <p>
                Cohort percentiles and aggregated biomechanical baseline curves are generated using strictly de-identified, differential privacy-preserving algorithms.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground mb-2">4. Contact Inquiries & Submission Data Handling</h2>
              <p>
                When you submit inquiries or registration details via our Connect with SportsMax or Assistant forms, information including your name, email, role, organization, and sport discipline requirements is transmitted securely to our configured backend services (including Google Apps Script / Google Sheets for lead logging and triage). Video drill upload metadata and authenticated session states are maintained in client storage to provide personalized dashboards. We do not sell this inquiry data to external marketing lists.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground mb-2">5. Data Deletion Rights</h2>
              <p>
                Athletes and organizational users can export their complete telemetry history in raw JSON/GPX format or request full account deletion and removal of stored contact records at any time by contacting governance support.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
