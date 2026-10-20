// GET ?url=...&strategy=mobile -> PageSpeed Insights summary (skill phase 1b).
// Never blocks the audit: on any error it returns { error } and the report omits the section.
import { checkAccess, json, validateUrl } from "../lib/http.js";

const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];

export async function GET(request) {
  const denied = checkAccess(request);
  if (denied) return denied;

  const params = new URL(request.url).searchParams;
  const { url, error } = validateUrl(params.get("url"));
  if (error) return json({ error: "invalid_url", message: error }, 400);
  const strategy = params.get("strategy") === "desktop" ? "desktop" : "mobile";

  const api = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  api.searchParams.set("url", url);
  api.searchParams.set("strategy", strategy);
  for (const c of CATEGORIES) api.searchParams.append("category", c);
  if (process.env.PAGESPEED_API_KEY) api.searchParams.set("key", process.env.PAGESPEED_API_KEY);

  let res;
  try {
    res = await fetch(api, { signal: AbortSignal.timeout(80000) });
  } catch (e) {
    return json({ error: "unreachable", message: `PageSpeed didn't respond (${e.name === "TimeoutError" ? "timeout" : e.message}).` });
  }

  if (res.status === 429) {
    return json({
      error: "rate_limited",
      message: process.env.PAGESPEED_API_KEY
        ? "PageSpeed returned 429 (API key quota exhausted)."
        : "PageSpeed returned 429: the keyless public quota is saturated. Set PAGESPEED_API_KEY (free) for reliable use.",
    });
  }
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    return json({ error: "psi_error", message: detail?.error?.message || `PageSpeed returned HTTP ${res.status}.` });
  }

  const data = await res.json();
  const lh = data.lighthouseResult || {};
  const score = (c) => (lh.categories?.[c]?.score == null ? null : Math.round(lh.categories[c].score * 100));
  const audit = (id) => lh.audits?.[id]?.displayValue || null;
  const field = data.loadingExperience?.metrics;

  return json({
    strategy,
    fetchedAt: lh.fetchTime || new Date().toISOString(),
    scores: {
      performance: score("performance"),
      accessibility: score("accessibility"),
      bestPractices: score("best-practices"),
      seo: score("seo"),
    },
    lab: {
      lcp: audit("largest-contentful-paint"),
      cls: audit("cumulative-layout-shift"),
      tbt: audit("total-blocking-time"),
      fcp: audit("first-contentful-paint"),
    },
    field: field
      ? Object.fromEntries(Object.entries(field).map(([k, v]) => [k, { p75: v.percentile, category: v.category }]))
      : null,
  });
}
