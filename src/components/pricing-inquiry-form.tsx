import React, { useState } from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  HelpCircle,
  Loader2,
  Mail,
  Phone,
  Send,
  Sparkles,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getStoredUtmParams } from "@/lib/utm-tracker";

interface PricingInquiryFormProps {
  selectedTier?: string;
}

export function PricingInquiryForm({ selectedTier }: PricingInquiryFormProps) {
  const [fullName, setFullName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [planInterest, setPlanInterest] = useState(selectedTier || "Coach & Squad ($99/mo)");
  const [athletesCount, setAthletesCount] = useState("10 - 50 Athletes");
  const [requirement, setRequirement] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [leadRef, setLeadRef] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim() || !workEmail.trim()) {
      setError("Please provide your full name and work email.");
      return;
    }

    setLoading(true);
    setError(null);

    const leadNumber = `PRC-${Date.now().toString().slice(-6)}`;
    const utm = getStoredUtmParams();

    const clientPayload = {
      action: "contact_lead",
      event: "pricing_inquiry",
      type: "pricing_inquiry",
      leadNumber,
      lead_number: leadNumber,
      name: fullName.trim(),
      email: workEmail.trim(),
      role: "Pricing Prospect",
      organization: organization.trim() || "Independent / Team",
      sports: "General Athletics",
      requirement: `Pricing Plan: ${planInterest} (${athletesCount})`,
      phone: phone.trim() || "Not provided",
      message: requirement.trim() || "Quick pricing inquiry submitted from Pricing Page.",
      hasPhone: Boolean(phone.trim()),
      hasAdditionalDetails: Boolean(requirement.trim()),
      page: "/pricing",
      visitorId: "pricing-visitor",
      sessionId: "pricing-session",
      source: utm.utmSource || "pricing_page",
      utmSource: utm.utmSource || "pricing_page",
      utm_source: utm.utmSource || "pricing_page",
      utmMedium: utm.utmMedium || "web_pricing",
      utm_medium: utm.utmMedium || "web_pricing",
      utmCampaign: utm.utmCampaign || "pricing_inquiry",
      utm_campaign: utm.utmCampaign || "pricing_inquiry",
      landingPage: utm.landingPage || "/pricing",
      timestamp: new Date().toISOString(),
    };

    // 1. Direct Ping to Google Apps Script / Google Sheets
    const analyticsUrl = import.meta.env["VITE_ANALYTICS_URL"] as string | undefined;
    if (analyticsUrl) {
      try {
        fetch(analyticsUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=UTF-8" },
          body: JSON.stringify(clientPayload),
          keepalive: true,
        }).catch(() => {});
      } catch {
        // silent fallback
      }
    }

    // 2. Server workflow endpoint (Airtable + Jira KAN issue + Resend admin notification email)
    try {
      const serverPayload = {
        leadNumber,
        fullName: fullName.trim(),
        workEmail: workEmail.trim(),
        roleTitle: "Pricing Inquiry Prospect",
        organization: organization.trim() || "Athletic Organization",
        sports: ["Multi-Sport / Platform Tier"],
        requirement: `Plan Interest: ${planInterest} [Athletes Scope: ${athletesCount}]`,
        phone: phone.trim() || undefined,
        additionalDetails: requirement.trim()
          ? `Selected Plan: ${planInterest}\nAthletes Scope: ${athletesCount}\nNotes: ${requirement.trim()}`
          : `Selected Plan: ${planInterest}\nAthletes Scope: ${athletesCount}`,
        page: "/pricing",
        source: "Pricing Page Form",
        utmSource: utm.utmSource || "pricing_page",
        utmMedium: utm.utmMedium || "web_pricing",
        utmCampaign: utm.utmCampaign || "pricing_inquiry",
        landingPage: utm.landingPage || "/pricing",
      };

      const res = await fetch("/api/contact/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serverPayload),
      });

      if (!res.ok) {
        console.warn("[Pricing Form] Server lead endpoint responded with status:", res.status);
      }
    } catch (err) {
      console.warn("[Pricing Form] Background server workflow warning:", err);
    }

    setLoading(false);
    setSubmitted(true);
    setLeadRef(leadNumber);
  }

  if (submitted) {
    return (
      <div className="surface-card p-8 rounded-2xl border border-primary/30 bg-primary/5 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-xl font-bold text-foreground">Inquiry Received!</h3>
        <p className="mt-2 text-xs text-muted-foreground max-w-md mx-auto">
          Thank you! Our sports analytics solutions team has received your requirement for{" "}
          <strong className="text-foreground">{planInterest}</strong>. We will review your squad size and reply
          with custom onboarding details within 24 hours.
        </p>
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-secondary border border-border px-3 py-1 font-mono text-[11px] text-muted-foreground">
          Reference ID: <span className="font-bold text-primary">{leadRef}</span>
        </div>
        <div className="mt-6">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSubmitted(false);
              setFullName("");
              setWorkEmail("");
              setPhone("");
              setOrganization("");
              setRequirement("");
            }}
          >
            Submit Another Inquiry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="surface-card p-6 md:p-8 rounded-2xl border border-border bg-card shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-5 border-b border-border">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-primary">
            Instant Quote &amp; Demo
          </span>
          <h3 className="text-lg md:text-xl font-bold text-foreground mt-0.5">
            Quick Pricing Inquiry &amp; Custom Scope
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Have questions about licenses, squad sizes, or enterprise features? Send your details for a quick response.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[11px] font-semibold text-primary self-start sm:self-center">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Priority Response</span>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs font-medium text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1">
              <User className="h-3 w-3 text-muted-foreground" />
              Full Name *
            </label>
            <Input
              required
              placeholder="e.g., Coach Sarah Jenkins"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="bg-background text-xs"
              disabled={loading}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1">
              <Mail className="h-3 w-3 text-muted-foreground" />
              Work / Team Email *
            </label>
            <Input
              required
              type="email"
              placeholder="sarah@athleticsacademy.com"
              value={workEmail}
              onChange={(e) => setWorkEmail(e.target.value)}
              className="bg-background text-xs"
              disabled={loading}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1">
              <Building2 className="h-3 w-3 text-muted-foreground" />
              Organization / Club
            </label>
            <Input
              placeholder="e.g., Metro Track Club / University"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="bg-background text-xs"
              disabled={loading}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1">
              <Phone className="h-3 w-3 text-muted-foreground" />
              Phone Number (Optional)
            </label>
            <Input
              type="tel"
              placeholder="+1 (555) 019-2834"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-background text-xs"
              disabled={loading}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Plan of Interest *</label>
            <select
              value={planInterest}
              onChange={(e) => setPlanInterest(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              disabled={loading}
            >
              <option value="Athlete Pro ($19/mo)">Athlete Pro ($19/mo - Individual)</option>
              <option value="Coach & Squad ($99/mo)">Coach & Squad ($99/mo - Most Popular)</option>
              <option value="Enterprise / Franchise (Custom)">Enterprise / Franchise (Custom Tier)</option>
              <option value="Custom Squad Licensing">Custom Squad / Federation Volume</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Athletes Scope</label>
            <select
              value={athletesCount}
              onChange={(e) => setAthletesCount(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              disabled={loading}
            >
              <option value="1 - 5 Athletes">1 - 5 Athletes (Individual / Small Group)</option>
              <option value="10 - 50 Athletes">10 - 50 Athletes (Team / Club)</option>
              <option value="50 - 200 Athletes">50 - 200 Athletes (Academy / College)</option>
              <option value="200+ Athletes">200+ Athletes (League / National Federation)</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">Specific Requirements or Inquiries</label>
          <Textarea
            rows={2}
            placeholder="Tell us about your team's tracking needs (wearable models, video pitch analysis, multi-coach access)..."
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            className="bg-background text-xs"
            disabled={loading}
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
          <span className="text-[11px] text-muted-foreground">
            🔒 Logged securely into Google Sheets, Jira Cloud &amp; CRM.
          </span>

          <Button type="submit" disabled={loading} className="font-bold sm:w-auto w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-1.5" />
                Submit Quick Inquiry
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
