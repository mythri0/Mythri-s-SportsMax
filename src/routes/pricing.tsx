import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoBadge, PageIntro, SectionHead } from "@/components/sports-ui";
import { AuthDialog } from "@/components/site-shell";
import { PricingInquiryForm } from "@/components/pricing-inquiry-form";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing & Plans — SportsMax" },
      {
        name: "description",
        content:
          "Transparent pricing for individual athletes, coaching staffs, sports teams, and enterprise leagues. Start with a 14-day free trial.",
      },
    ],
  }),
  component: PricingPage,
});

export function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("annual");

  return (
    <>
      <PageIntro
        eyebrow="Pricing Plans"
        title="Predictable Investment for Proven Performance"
        text="Choose the plan that fits your athletic ambitions. From dedicated individual runners to collegiate athletic departments and professional sports franchises."
        action={
          <div className="flex flex-col items-end gap-3">
            <DemoBadge />
            <div className="inline-flex rounded-lg border border-border bg-secondary p-1">
              <button
                type="button"
                onClick={() => setBillingPeriod("monthly")}
                className={`rounded px-3 py-1.5 text-xs font-bold transition ${
                  billingPeriod === "monthly" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingPeriod("annual")}
                className={`rounded px-3 py-1.5 text-xs font-bold transition ${
                  billingPeriod === "annual" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Annual (Save 20%)
              </button>
            </div>
          </div>
        }
      />

      <section className="py-12 bg-background">
        <div className="content-wrap">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Plan 1: Individual */}
            <div className="surface-card p-8 flex flex-col justify-between border hover:border-primary/40 transition">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Individual Plan</span>
                <h3 className="text-2xl font-bold mt-1 text-foreground">Athlete Pro</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  For competitive runners, swimmers, and individual athletes seeking deep biometric precision.
                </p>

                <div className="mt-6">
                  <span className="text-4xl font-extrabold text-foreground">
                    {billingPeriod === "annual" ? "$19" : "$24"}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">/ month</span>
                </div>

                <ul className="mt-6 grid gap-2.5 text-xs text-foreground font-medium">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> Unlimited wearable data sync (Garmin, Polar, Apple)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> Full SWOLF, cadence & cardiac drift modeling</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> Automated AI training recommendations</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> Verified personal best logging</li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <AuthDialog>
                  <Button variant="outline" className="w-full font-bold">
                    Start 14-Day Free Trial
                  </Button>
                </AuthDialog>
              </div>
            </div>

            {/* Plan 2: Coach / Team */}
            <div className="surface-card p-8 flex flex-col justify-between border-2 border-primary relative shadow-lg">
              <div className="absolute -top-3.5 right-6 rounded-full bg-primary text-primary-foreground px-3 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-sm">
                Most Popular
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Team Plan</span>
                <h3 className="text-2xl font-bold mt-1 text-foreground">Coach & Squad</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  For coaching staffs, high school/collegiate teams, and athletic clubs up to 35 athletes.
                </p>

                <div className="mt-6">
                  <span className="text-4xl font-extrabold text-foreground">
                    {billingPeriod === "annual" ? "$99" : "$129"}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">/ month</span>
                </div>

                <ul className="mt-6 grid gap-2.5 text-xs text-foreground font-medium">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> Up to 35 athlete profiles included</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> Acute-to-Chronic Workload Ratio (ACWR) governance</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> Proactive soft-tissue injury risk alerts</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> Squad comparison radar charts & reports</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> Multi-coach role permission controls</li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <AuthDialog>
                  <Button className="w-full font-bold shadow-md">
                    Start 14-Day Free Trial &rarr;
                  </Button>
                </AuthDialog>
              </div>
            </div>

            {/* Plan 3: Enterprise */}
            <div className="surface-card p-8 flex flex-col justify-between border hover:border-primary/40 transition">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Enterprise Plan</span>
                <h3 className="text-2xl font-bold mt-1 text-foreground">Franchise & League</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  For professional sports clubs, national federations, stadium tracking, and broadcast data providers.
                </p>

                <div className="mt-6">
                  <span className="text-4xl font-extrabold text-foreground">Custom</span>
                  <span className="text-xs text-muted-foreground ml-1">enterprise tier</span>
                </div>

                <ul className="mt-6 grid gap-2.5 text-xs text-foreground font-medium">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> Unlimited athlete & squad capacity</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> 120fps Optical Computer Vision pitch tracking</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> Real-time sub-50ms WebSocket telemetry feeds</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> Dedicated SportsMax sports scientist engineer</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> Custom tactical algorithms & API access</li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <Button asChild variant="outline" className="w-full font-bold">
                  <Link to="/contact">Contact Enterprise Sales</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Pricing Inquiry Form */}
          <div className="mt-16 max-w-4xl mx-auto">
            <PricingInquiryForm />
          </div>
        </div>
      </section>
    </>
  );
}
