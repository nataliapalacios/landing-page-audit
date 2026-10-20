// POST { page, pagespeed, reportLanguage } -> reporte Markdown en streaming (Fases 2-4 del skill).
import Anthropic from "@anthropic-ai/sdk";
import { systemPrompt } from "../lib/prompt.js";
import { checkAccess, json, rateLimit } from "../lib/http.js";

const client = new Anthropic();
// Sonnet + effort low: ~3-4x más barato que Opus para una tarea guiada por rúbrica.
const MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-5-5";
const EFFORT = process.env.CLAUDE_EFFORT || "low";

export async function POST(request) {
  const denied = checkAccess(request);
  if (denied) return denied;
  if (!process.env.ANTHROPIC_API_KEY) {
    return json({ error: "config", message: "Falta ANTHROPIC_API_KEY en las variables de entorno." }, 500);
  }

  const body = await request.json().catch(() => ({}));
  if (!body.page?.url) return json({ error: "bad_request", message: "Falta el contenido extraído de la página." }, 400);

  // Se cuenta recién acá, para que los errores de config o de input no consuman cupo.
  const limited = await rateLimit(request);
  if (limited) return limited;

  const input = {
    auditDate: new Date().toISOString().slice(0, 10),
    reportLanguage: body.reportLanguage || "español",
    page: body.page,
    pagespeed: body.pagespeed || { error: "no_data", message: "PageSpeed no se corrió." },
  };

  const stream = client.beta.messages.stream({
    model: MODEL,
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    output_config: { effort: EFFORT },
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: [{ type: "text", text: systemPrompt(), cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content: JSON.stringify(input) }],
  });

  const encoder = new TextEncoder();
  const body$ = new ReadableStream({
    async start(controller) {
      const write = (s) => controller.enqueue(encoder.encode(s));
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") write(event.delta.text);
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") write("\n\n> ⚠️ El modelo declinó completar este análisis.");
        if (final.stop_reason === "max_tokens") write("\n\n> ⚠️ El reporte se cortó por largo máximo.");
      } catch (e) {
        write(`\n\n> ⚠️ Error generando el reporte: ${e.message}`);
      } finally {
        controller.close();
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body$, {
    headers: { "content-type": "text/markdown; charset=utf-8", "cache-control": "no-store" },
  });
}
