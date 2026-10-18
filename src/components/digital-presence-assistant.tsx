import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "@tanstack/react-router";
import {
  MessageCircle,
  X,
  Navigation,
  Sparkles,
  ClipboardList,
  FileSpreadsheet,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectWithSportsMaxForm } from "@/components/connect-with-sportsmax";

// Utility: Time-based greeting
function getTimeBasedGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good Morning! 🌅";
  if (hour >= 12 && hour < 17) return "Good Afternoon! ☀️";
  if (hour >= 17 && hour < 21) return "Good Evening! 🌆";
  return "Good Night! 🌙";
}

// Utility: Navigation Suggestions
const SUGGESTION_MAP: Record<string, { next: string; text: string }> = {
  "/dashboard": { next: "/run-analytics", text: "You may want to explore Run Analytics next." },
  "/run-analytics": { next: "/athlete-performance", text: "Want deeper athlete insights? Try Athlete Performance." },
  "/athlete-performance": { next: "/recommendations", text: "You may want to explore Recommendations next." },
  "/insights": { next: "/recommendations", text: "Looking for actionable guidance? Check Recommendations." },
  "/recommendations": { next: "/dashboard", text: "Want to explore your overall activity? Return to Dashboard." },
  "/": { next: "/sports", text: "Ready to explore? Check out our Sports directory." },
};

function getNavigationSuggestion(currentPath: string) {
  return SUGGESTION_MAP[currentPath] || { next: "/", text: "Want to explore another SportsMax feature?" };
}

// Format path for display
function formatPathName(path: string) {
  if (path === "/") return "Home";
  return path
    .replace(/^\//, "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function DigitalPresenceAssistant() {
  const location = useLocation();
  const currentPath = location.pathname;

  const [isOpen, setIsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [popupMsg, setPopupMsg] = useState<{ title: string; desc: string } | null>(null);
  
  const [visitorState, setVisitorState] = useState({
    isNew: false,
    visitorId: "",
    sessionId: "",
  });

  const prevPathRef = useRef<string | null>(null);
  const hasGreetedSession = useRef(false);

  // Initialize tracking
  useEffect(() => {
    let vId = localStorage.getItem("smx_visitorId");
    let isNew = false;
    if (!vId) {
      vId = "v_" + Math.random().toString(36).substring(2, 9);
      localStorage.setItem("smx_visitorId", vId);
      isNew = true;
    }
    const sId = "s_" + Math.random().toString(36).substring(2, 9);
    
    setVisitorState({ isNew, visitorId: vId, sessionId: sId });
    
    // Feature 1 & 2: Time-based & New/Returning Greeting
    if (!hasGreetedSession.current) {
      const timeGreeting = getTimeBasedGreeting();
      const userGreeting = isNew ? "Welcome to SportsMax!" : "Welcome back!";
      
      setPopupMsg({
        title: timeGreeting,
        desc: `${userGreeting} 👋`,
      });
      
      trackEvent("greeting_shown", { type: isNew ? "new" : "returning", visitorId: vId });
      
      setTimeout(() => setPopupMsg(null), 5000);
      hasGreetedSession.current = true;
    }
  }, []);

  // Track Navigation & Popup Context
  useEffect(() => {
    if (prevPathRef.current && prevPathRef.current !== currentPath) {
      const prevName = formatPathName(prevPathRef.current);
      const currName = formatPathName(currentPath);
      const suggestion = getNavigationSuggestion(currentPath);
      
      setPopupMsg({
        title: "Navigation Insight",
        desc: `Previously you were viewing ${prevName}. Now you're exploring ${currName}. ${suggestion.text}`,
      });

      trackEvent("navigation_context_shown", {
        from: prevPathRef.current,
        to: currentPath,
        suggestion: suggestion.next,
      });

      setTimeout(() => setPopupMsg(null), 6000);
    }
    prevPathRef.current = currentPath;
  }, [currentPath]);

  // Analytics — sends event to Google Apps Script backend, falls back to console.log in dev
  const trackEvent = (eventName: string, data: Record<string, unknown>) => {
    const payload = {
      event: eventName,
      ...data,
      timestamp: new Date().toISOString(),
      visitorId: visitorState.visitorId,
      sessionId: visitorState.sessionId,
      path: currentPath,
      referrer: typeof document !== "undefined" ? document.referrer : "",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    };

    // Always log for debugging
    console.log(`[Analytics Track] ${eventName}:`, payload);

    const analyticsUrl = import.meta.env["VITE_ANALYTICS_URL"] as string | undefined;

    if (!analyticsUrl) {
      // URL not configured — skip network send (expected in local dev without .env)
      return;
    }

    // IMPORTANT: We use text/plain;charset=UTF-8 intentionally.
    // application/json triggers a CORS preflight (OPTIONS) which Google Apps Script
    // /exec does NOT handle, causing the browser to block the request.
    // text/plain is a CORS-safe "simple" content type — no preflight is sent.
    // The body is still valid JSON; Apps Script reads it via JSON.parse(e.postData.contents).
    const body = JSON.stringify(payload);

    // Try sendBeacon first — fire-and-forget, survives page unloads, no preflight
    const sent =
      typeof navigator !== "undefined" &&
      typeof navigator.sendBeacon === "function" &&
      navigator.sendBeacon(
        analyticsUrl,
        new Blob([body], { type: "text/plain;charset=UTF-8" }),
      );

    if (!sent) {
      // Beacon unavailable or returned false — fall back to fetch
      fetch(analyticsUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          // text/plain avoids an OPTIONS preflight; body remains JSON
          "Content-Type": "text/plain;charset=UTF-8",
        },
        body,
        keepalive: true,
      }).catch(() => {
        // Silently swallow network errors so analytics never breaks the UI
      });
    }
  };

  const handleOpenChatbot = () => {
    setIsOpen(true);
    setPopupMsg(null); // Hide popup when chatbot opens
    trackEvent("chatbot_opened", {});
  };

  const handleSuggestionClick = (path: string) => {
    trackEvent("chatbot_suggestion_clicked", { target: path });
    // Note: Use router push if needed, relying on native <a> for simplicity here
    window.location.href = path;
  };

  const currentSuggestion = getNavigationSuggestion(currentPath);
  const timeGreeting = getTimeBasedGreeting();

  return (
    <>
      {/* Toast Popup */}
      {popupMsg && !isOpen && (
        <div className="fixed top-24 right-6 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
          <div className="bg-card border shadow-lg rounded-xl p-4 max-w-sm flex items-start gap-3">
            <div className="mt-1 text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold mb-1">{popupMsg.title}</h4>
              <p className="text-sm text-muted-foreground">{popupMsg.desc}</p>
            </div>
            <button 
              onClick={() => setPopupMsg(null)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Chatbot Interface */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-88 max-w-[calc(100vw-2rem)] bg-card border border-border shadow-2xl rounded-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
          <div className="bg-primary p-4 text-primary-foreground flex justify-between items-center shrink-0">
            <h3 className="font-semibold flex items-center gap-2 text-sm">
              <MessageCircle className="w-5 h-5" /> SportsMax AI Copilot
            </h3>
            <button onClick={() => setIsOpen(false)} className="hover:opacity-80 p-1" aria-label="Close Chat">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 bg-muted/30 max-h-[420px] overflow-y-auto flex flex-col gap-3">
            <div className="bg-background border border-border rounded-xl p-3 text-xs shadow-xs">
              {timeGreeting} 👋 {visitorState.isNew ? "Welcome to SportsMax!" : "Welcome back!"}{" "}
              You are exploring <strong>{formatPathName(currentPath)}</strong>.
            </div>

            {/* THREE RELEVANT QUESTIONS SECTION */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 space-y-2.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Frequently Asked Questions
              </div>

              {/* Question 1 */}
              <div className="rounded-lg bg-card border border-border p-2.5 text-xs space-y-1.5">
                <div className="font-bold text-foreground">
                  1. How does the School & College Institution hierarchy work?
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  SportsMax organizes educational athletics across 3 tiers: <strong>Tier 1: Institution</strong> (Schools/Colleges), <strong>Tier 2: Coaches</strong> (upload match videos & tactical forms), and <strong>Tier 3: Students</strong> (individual analytics dashboards).
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-[11px] h-7 font-semibold"
                  onClick={() => handleSuggestionClick("/institution")}
                >
                  Explore Institution Hub &rarr;
                </Button>
              </div>

              {/* Question 2 */}
              <div className="rounded-lg bg-card border border-border p-2.5 text-xs space-y-1.5">
                <div className="font-bold text-foreground">
                  2. How do Coaches upload tactical video footage and drills?
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Coaches can drag-and-drop match or practice recordings (.mp4, .mov), attach drill parameters, and specify coaching objectives. The AI optical tracking engine extracts kinematic velocities and spacing automatically.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-[11px] h-7 font-semibold"
                  onClick={() => handleSuggestionClick("/institution#coach-upload-section")}
                >
                  Open Coach Video Upload Portal &rarr;
                </Button>
              </div>

              {/* Question 3 */}
              <div className="rounded-lg bg-card border border-border p-2.5 text-xs space-y-1.5">
                <div className="font-bold text-foreground">
                  3. Where can Student Athletes view their individual analytics?
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Every enrolled student receives a dedicated analytics card displaying session attendance, peak velocity/pace, workload scores (ACWR), and biomechanical skill trajectories.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-[11px] h-7 font-semibold"
                  onClick={() => handleSuggestionClick("/institution#student-analytics-section")}
                >
                  View Student Analytics Dashboard &rarr;
                </Button>
              </div>
            </div>

            {/* Path Suggestion Footer */}
            <div className="bg-background border border-border rounded-xl p-3 text-xs space-y-2">
              <div className="font-medium flex items-center gap-1.5 text-primary">
                <Navigation className="w-3.5 h-3.5" /> Recommended Next Step
              </div>
              <p className="text-muted-foreground text-[11px]">{currentSuggestion.text}</p>
              <Button
                size="sm"
                className="w-full text-xs h-7"
                onClick={() => handleSuggestionClick(currentSuggestion.next)}
              >
                Go to {formatPathName(currentSuggestion.next)}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Lead Form Modal */}
      {isFormOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Connect with SportsMax Form"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl p-2 sm:p-3 animate-in zoom-in-95 duration-200">
            {/* Modal Close Button */}
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-5 right-5 z-20 grid h-8 w-8 place-items-center rounded-xl bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close inquiry form"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Embedded Sports Analytics Inquiry Form */}
            <ConnectWithSportsMaxForm onClose={() => setIsFormOpen(false)} />
          </div>
        </div>
      )}

      {/* Floating Form Button (Positioned ABOVE the Chatbot button) */}
      <button
        type="button"
        id="floating-sportsmax-form-button"
        aria-label="Open Sports Analytics Inquiry Form"
        onClick={() => {
          setIsFormOpen((prev) => !prev);
          if (isOpen) setIsOpen(false);
        }}
        className="fixed bottom-22 right-6 z-50 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 p-3.5 rounded-full shadow-xl hover:shadow-emerald-500/30 hover:scale-105 transition-all duration-200 flex items-center justify-center group"
      >
        {isFormOpen ? (
          <X className="w-5 h-5 text-slate-950 stroke-[2.5]" />
        ) : (
          <ClipboardList className="w-5 h-5 text-slate-950 stroke-[2.5]" />
        )}

        {/* Hover Tooltip */}
        <span className="hidden group-hover:block absolute right-14 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 whitespace-nowrap shadow-xl pointer-events-none">
          Connect with SportsMax (Form)
        </span>
      </button>

      {/* Floating Chatbot FAB */}
      <button
        onClick={() => {
          if (isOpen) {
            setIsOpen(false);
          } else {
            handleOpenChatbot();
            if (isFormOpen) setIsFormOpen(false);
          }
        }}
        className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground p-4 rounded-full shadow-xl hover:shadow-primary/25 hover:scale-105 transition-all duration-200 group"
        aria-label="Open Assistant Chatbot"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        <span className="hidden group-hover:block absolute right-16 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 whitespace-nowrap shadow-xl pointer-events-none">
          SportsMax Assistant
        </span>
      </button>
    </>
  );
}
