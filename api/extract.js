// POST { url, html? } -> signals extracted from the page.
// Without html: fetches server-side. With html (from an uploaded .mhtml/.html): parses it directly.
import { extractPage } from "../lib/extract.js";
import { json, validateUrl } from "../lib/http.js";

const MAX_HTML_BYTES = 5 * 1024 * 1024;
const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const { url, error } = validateUrl(body.url);
  if (error) return json({ error: "invalid_url", message: error }, 400);

  if (body.html) {
    const page = extractPage(String(body.html), url, body.source === "html" ? "html" : "mhtml");
    return json({ page });
  }

  let res;
  try {
    res = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
      headers: { "user-agent": BROWSER_UA, "accept-language": "es,en;q=0.8,fr;q=0.6" },
    });
  } catch (e) {
    return json({ needsFallback: true, reason: `Couldn't connect to the page (${e.name === "TimeoutError" ? "timeout" : e.message}).` });
  }

  if (!res.ok) {
    const blocked = [401, 403, 429, 503].includes(res.status);
    return json({
      needsFallback: true,
      reason: blocked
        ? `The page blocked the automatic fetch (HTTP ${res.status}, probably Cloudflare/anti-bot).`
        : `The page responded HTTP ${res.status}. Check that the URL is correct and online.`,
    });
  }

  const html = (await res.text()).slice(0, MAX_HTML_BYTES);
  const page = extractPage(html, res.url || url, "fetch");
  if (page.isShell) {
    return json({
      needsFallback: true,
      reason: `The initial HTML has almost no content (${page.textLength} characters of text): it's an SPA without SSR/prerendering, so the content only exists after JavaScript runs.`,
      page,
    });
  }
  return json({ page });
}
