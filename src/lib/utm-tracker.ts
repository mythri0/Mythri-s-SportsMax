/**
 * UTM Parameter Tracking Utility
 *
 * Captures UTM parameters from the URL query string on page load,
 * stores them in sessionStorage so they persist across navigation,
 * and provides retrieval for form submissions.
 *
 * Standard UTM parameters:
 *   utm_source   — traffic source (e.g., "linkedin", "youtube")
 *   utm_medium   — marketing medium (e.g., "organic_social", "paid_social")
 *   utm_campaign — campaign name (e.g., "sportsmax_launch")
 *   utm_content  — specific content (e.g., LinkedIn post ID)
 *   utm_term     — search term (rarely used for social)
 */

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

const STORAGE_KEY = "smx_utm_params";
const LANDING_PAGE_KEY = "smx_landing_page";

export interface UtmParams {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  landingPage: string;
}

/**
 * Captures UTM parameters from the current URL and stores them
 * in sessionStorage. Only overwrites if new UTM params are present.
 * Should be called once on app mount (client-side only).
 */
export function captureUtmParams(): void {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  const params: Record<string, string> = {};
  let hasUtm = false;

  for (const key of UTM_KEYS) {
    const val = url.searchParams.get(key);
    if (val) {
      params[key] = val.trim();
      hasUtm = true;
    }
  }

  // Only overwrite stored UTM if the current URL has UTM params
  if (hasUtm) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(params));
    } catch {
      // sessionStorage unavailable (private browsing, etc.)
    }
  }

  // Always record landing page on first visit in this session
  try {
    if (!sessionStorage.getItem(LANDING_PAGE_KEY)) {
      sessionStorage.setItem(LANDING_PAGE_KEY, window.location.pathname + window.location.search);
    }
  } catch {
    // ignore
  }
}

/**
 * Retrieves stored UTM parameters and landing page from sessionStorage.
 * Returns empty strings for any missing values.
 */
export function getUtmParams(): UtmParams {
  const defaults: UtmParams = {
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    utmContent: "",
    utmTerm: "",
    landingPage: "",
  };

  if (typeof window === "undefined") return defaults;

  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Record<string, string>;
      defaults.utmSource = parsed["utm_source"] || "";
      defaults.utmMedium = parsed["utm_medium"] || "";
      defaults.utmCampaign = parsed["utm_campaign"] || "";
      defaults.utmContent = parsed["utm_content"] || "";
      defaults.utmTerm = parsed["utm_term"] || "";
    }
  } catch {
    // ignore
  }

  try {
    defaults.landingPage = sessionStorage.getItem(LANDING_PAGE_KEY) || "";
  } catch {
    // ignore
  }

  return defaults;
}

export const getStoredUtmParams = getUtmParams;

/**
 * Checks if the current visitor arrived from a specific source (e.g., "linkedin").
 */
export function isFromSource(source: string): boolean {
  const params = getUtmParams();
  return params.utmSource.toLowerCase() === source.toLowerCase();
}
