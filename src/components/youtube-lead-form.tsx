import { useState } from "react";
import { Youtube, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface YouTubeLeadFormProps {
  videoId?: string;
  videoTitle?: string;
}

export function YouTubeLeadForm({ videoId, videoTitle }: YouTubeLeadFormProps) {
  const [fullName, setFullName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [requirement, setRequirement] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [leadNumber, setLeadNumber] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !workEmail) {
      setErrorMessage("Please fill in both your full name and work email.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/youtube/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          fullName,
          workEmail,
          organization,
          requirement,
          phone,
          videoId,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setStatus("error");
        setErrorMessage(data.error || "Failed to submit inquiry. Please try again.");
      } else {
        setStatus("success");
        setLeadNumber(data.leadNumber || null);
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error connecting to SportsMax lead services. Please retry.");
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 backdrop-blur-sm shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600/10 text-red-500 ring-1 ring-red-500/20">
          <Youtube className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Connect with SportsMax</h3>
          <p className="text-xs text-slate-400">
            {videoTitle ? `Inquiry regarding: ${videoTitle}` : "Get tailored sports analytics & intelligence briefings"}
          </p>
        </div>
      </div>

      {status === "success" ? (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-6 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400 mb-3" />
          <h4 className="text-lg font-semibold text-emerald-200 mb-1">Inquiry Received</h4>
          <p className="text-sm text-slate-300 mb-3">
            Thank you for reaching out via our YouTube channel. Our analytics team will review your requirements.
          </p>
          {leadNumber && (
            <p className="text-xs font-mono text-emerald-400/90 bg-emerald-900/30 py-1.5 px-3 rounded inline-block">
              Reference: {leadNumber}
            </p>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {status === "error" && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-950/20 p-3 text-xs text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Coach Alex Smith"
                className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Work Email *</label>
              <input
                type="email"
                required
                value={workEmail}
                onChange={(e) => setWorkEmail(e.target.value)}
                placeholder="alex@fcclub.com"
                className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Organization / Club</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Metro Athletics"
                className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">How can SportsMax assist your team?</label>
            <textarea
              rows={3}
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              placeholder="Tell us about your team's tactical analysis, performance metrics, or scouting needs..."
              className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition-all hover:bg-red-500 disabled:opacity-50"
          >
            {status === "submitting" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting Inquiry...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit Lead to SportsMax
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
