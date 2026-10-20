// POST { url, html? } -> señales extraídas de la página.
// Sin html: hace el fetch server-side. Con html (desde un .mhtml/.html subido): lo parsea directo.
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
    return json({ needsFallback: true, reason: `No se pudo conectar con la página (${e.name === "TimeoutError" ? "timeout" : e.message}).` });
  }

  if (!res.ok) {
    const blocked = [401, 403, 429, 503].includes(res.status);
    return json({
      needsFallback: true,
      reason: blocked
        ? `La página bloqueó el fetch automático (HTTP ${res.status}, probablemente Cloudflare/anti-bot).`
        : `La página respondió HTTP ${res.status}. Confirmá que la URL es correcta y está online.`,
    });
  }

  const html = (await res.text()).slice(0, MAX_HTML_BYTES);
  const page = extractPage(html, res.url || url, "fetch");
  if (page.isShell) {
    return json({
      needsFallback: true,
      reason: `El HTML inicial casi no tiene contenido (${page.textLength} caracteres de texto): es una SPA sin SSR/prerender, el contenido solo existe después de ejecutar JavaScript.`,
      page,
    });
  }
  return json({ page });
}
