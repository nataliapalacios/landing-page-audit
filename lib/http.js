// Helpers shared by the /api functions.

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

// If ACCESS_CODE is set, routes that spend quota/money require the x-access-code header.
export function checkAccess(request) {
  const code = process.env.ACCESS_CODE;
  if (!code) return null;
  if (request.headers.get("x-access-code") === code) return null;
  return json({ error: "unauthorized", message: "Invalid or missing access code." }, 401);
}

// Monthly per-IP limit so the demo can be public without an access code.
// With Upstash Redis (free plan, from the Vercel Marketplace) the counter persists across instances;
// without Redis it falls back to memory, which resets on every cold start. The hard cap is Anthropic's spend limit.
const hits = new Map();
const MONTH_SECONDS = 32 * 24 * 3600;

// The Vercel integration may add a prefix (e.g. STORAGE_KV_REST_API_URL): match by suffix.
const envBySuffix = (...suffixes) =>
  Object.keys(process.env)
    .filter((k) => suffixes.some((s) => k.endsWith(s)) && !k.includes("READ_ONLY"))
    .map((k) => process.env[k])[0];

async function increment(key) {
  const url = envBySuffix("KV_REST_API_URL", "REDIS_REST_URL");
  const token = envBySuffix("KV_REST_API_TOKEN", "REDIS_REST_TOKEN");
  if (url && token) {
    try {
      const res = await fetch(`${url}/pipeline`, {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
        body: JSON.stringify([["INCR", key], ["EXPIRE", key, MONTH_SECONDS, "NX"]]),
        signal: AbortSignal.timeout(3000),
      });
      const [incr] = await res.json();
      if (typeof incr?.result === "number") return incr.result;
    } catch {
      // If Redis fails, don't block the demo: fall back to the in-memory counter.
    }
  }
  if (hits.size > 5000) hits.clear();
  const count = (hits.get(key) || 0) + 1;
  hits.set(key, count);
  return count;
}

export async function rateLimit(request) {
  const max = Number(process.env.RATE_LIMIT_PER_MONTH ?? 3);
  if (!max) return null;
  const ip = (request.headers.get("x-forwarded-for") || "local").split(",")[0].trim();
  const count = await increment(`lpa:${new Date().toISOString().slice(0, 7)}:${ip}`);
  if (count <= max) return null;
  return json(
    {
      error: "rate_limited",
      message: `Demo limit: ${max} audits per month. For unlimited use, clone the repo and deploy it with your own API key.`,
    },
    429,
  );
}

// Minimal SSRF guard: http(s) only, and nothing pointing at the internal network.
export function validateUrl(raw) {
  let url;
  try {
    url = new URL(String(raw || "").trim());
  } catch {
    return { error: "Invalid URL." };
  }
  if (!["http:", "https:"].includes(url.protocol)) return { error: "Only http(s) URLs are accepted." };
  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  const privateHost =
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    host === "::1" ||
    host === "0.0.0.0" ||
    /^127\./.test(host) ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^169\.254\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host) ||
    /^f[cd][0-9a-f]{2}:/.test(host);
  if (privateHost) return { error: "Internal addresses can't be audited." };
  return { url: url.toString() };
}
