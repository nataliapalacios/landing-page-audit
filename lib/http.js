// Helpers compartidos por las funciones de /api.

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

// Si ACCESS_CODE está definido, las rutas que gastan cuota/dinero exigen el header x-access-code.
export function checkAccess(request) {
  const code = process.env.ACCESS_CODE;
  if (!code) return null;
  if (request.headers.get("x-access-code") === code) return null;
  return json({ error: "unauthorized", message: "Código de acceso inválido o faltante." }, 401);
}

// Límite diario por IP para que la demo pueda ser pública sin código de acceso.
// Es best-effort (memoria de cada instancia); el tope duro es el spend limit de la consola de Anthropic.
const hits = new Map();

export function rateLimit(request) {
  const max = Number(process.env.RATE_LIMIT_PER_DAY ?? 5);
  if (!max) return null;
  const ip = (request.headers.get("x-forwarded-for") || "local").split(",")[0].trim();
  const key = `${new Date().toISOString().slice(0, 10)}|${ip}`;
  const count = (hits.get(key) || 0) + 1;
  if (hits.size > 5000) hits.clear();
  hits.set(key, count);
  if (count <= max) return null;
  return json(
    { error: "rate_limited", message: `Límite de la demo: ${max} auditorías por día. Para uso sin límite, cloná el repo y deployalo con tu propia API key.` },
    429,
  );
}

// Guard mínimo contra SSRF: solo http(s) y nada que apunte a la red interna.
export function validateUrl(raw) {
  let url;
  try {
    url = new URL(String(raw || "").trim());
  } catch {
    return { error: "URL inválida." };
  }
  if (!["http:", "https:"].includes(url.protocol)) return { error: "Solo se aceptan URLs http(s)." };
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
  if (privateHost) return { error: "No se pueden auditar direcciones internas." };
  return { url: url.toString() };
}
