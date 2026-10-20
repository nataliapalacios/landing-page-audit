// Extracción determinística de señales de la landing (Fase 1 del skill).
// Lo que se puede medir se mide acá; Claude solo juzga sobre esta evidencia.
import { parse } from "node-html-parser";

// Hero + primeros scrolls es donde se decide la conversión (ver edge-cases.md); el resto encarece sin cambiar el reporte.
const MAX_TEXT_CHARS = 15000;
// Por debajo de esto el HTML es un "shell" de SPA (Lovable, Vite/React sin SSR): pedir .mhtml.
const SHELL_TEXT_THRESHOLD = 300;

const clean = (s) => (s || "").replace(/\s+/g, " ").trim();

export function extractPage(html, url, source = "fetch") {
  const root = parse(html, { comment: false, blockTextElements: { script: true, style: true } });

  const meta = (sel) => clean(root.querySelector(sel)?.getAttribute("content"));
  const og = {};
  for (const m of root.querySelectorAll('meta[property^="og:"]')) {
    og[m.getAttribute("property")] = clean(m.getAttribute("content"));
  }

  const jsonLdTypes = [];
  for (const s of root.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      const data = JSON.parse(s.text);
      const items = Array.isArray(data) ? data : data["@graph"] || [data];
      for (const it of items) if (it && it["@type"]) jsonLdTypes.push([].concat(it["@type"]).join("/"));
    } catch {
      jsonLdTypes.push("(JSON-LD inválido)");
    }
  }
  const scriptCount = root.querySelectorAll("script[src]").length;

  // A partir de acá solo interesa el contenido visible.
  root.querySelectorAll("script, style, noscript, svg, template").forEach((n) => n.remove());

  const headings = root
    .querySelectorAll("h1, h2, h3")
    .map((h) => ({ level: h.tagName.toLowerCase(), text: clean(h.text).slice(0, 200) }))
    .filter((h) => h.text);

  const ctas = [];
  const seen = new Set();
  for (const el of root.querySelectorAll('a, button, input[type="submit"]')) {
    const text = clean(el.text || el.getAttribute("value") || el.getAttribute("aria-label"));
    if (!text || text.length > 80) continue;
    const href = el.getAttribute("href") || "";
    const isButtonish =
      el.tagName === "BUTTON" ||
      el.tagName === "INPUT" ||
      /btn|button|cta/i.test(el.getAttribute("class") || "") ||
      /^(https?:|\/|#)/.test(href);
    if (!isButtonish) continue;
    const key = `${text}|${href}`;
    if (seen.has(key)) continue;
    seen.add(key);
    ctas.push({ text, href: href.slice(0, 150), tag: el.tagName.toLowerCase() });
  }

  const forms = root.querySelectorAll("form").map((f) => ({
    fields: f
      .querySelectorAll("input, select, textarea")
      .filter((i) => !["hidden", "submit", "button"].includes((i.getAttribute("type") || "").toLowerCase()))
      .map((i) => ({
        tag: i.tagName.toLowerCase(),
        type: i.getAttribute("type") || "",
        name: i.getAttribute("name") || i.getAttribute("placeholder") || "",
        required: i.hasAttribute("required"),
      })),
  }));

  const imgs = root.querySelectorAll("img");
  const missingAlt = imgs.filter((i) => !clean(i.getAttribute("alt"))).length;

  const text = clean((root.querySelector("body") || root).text);

  return {
    url,
    source, // "fetch" | "mhtml" | "html"
    htmlBytes: Buffer.byteLength(html),
    lang: root.querySelector("html")?.getAttribute("lang") || "",
    title: clean(root.querySelector("title")?.text),
    metaDescription: meta('meta[name="description"]'),
    viewport: meta('meta[name="viewport"]'),
    robots: meta('meta[name="robots"]'),
    canonical: root.querySelector('link[rel="canonical"]')?.getAttribute("href") || "",
    og,
    jsonLdTypes,
    externalScripts: scriptCount,
    headings: headings.slice(0, 80),
    h1Count: headings.filter((h) => h.level === "h1").length,
    ctas: ctas.slice(0, 40),
    forms,
    images: {
      total: imgs.length,
      missingAlt,
      lazy: imgs.filter((i) => i.getAttribute("loading") === "lazy").length,
      samples: imgs.slice(0, 15).map((i) => ({ src: (i.getAttribute("src") || "").slice(0, 120), alt: clean(i.getAttribute("alt")) })),
    },
    textLength: text.length,
    text: text.slice(0, MAX_TEXT_CHARS),
    truncated: text.length > MAX_TEXT_CHARS,
    isShell: text.length < SHELL_TEXT_THRESHOLD,
  };
}
