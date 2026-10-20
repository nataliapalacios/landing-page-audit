// POST { page, pagespeed, reportLanguage } -> streamed Markdown report (skill phases 2-4).
import Anthropic from "@anthropic-ai/sdk";
import { systemPrompt } from "../lib/prompt.js";
import { checkAccess, json, rateLimit } from "../lib/http.js";

const client = new Anthropic();
// Sonnet + low effort: ~3-4x cheaper than Opus for a rubric-driven task.
const MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-5-5";
const EFFORT = process.env.CLAUDE_EFFORT || "low";

export async function POST(request) {
  const denied = checkAccess(request);
  if (denied) return denied;
  if (!process.env.ANTHROPIC_API_KEY) {
    return json({ error: "config", message: "ANTHROPIC_API_KEY is missing from the environment variables." }, 500);
  }

  const body = await request.json().catch(() => ({}));
  if (!body.page?.url) return json({ error: "bad_request", message: "The page's extracted content is missing." }, 400);

  // Counted only here, so config or input errors don't use up quota.
  const limited = await rateLimit(request);
  if (limited) return limited;

  const input = {
    auditDate: new Date().toISOString().slice(0, 10),
    reportLanguage: body.reportLanguage || "English",
    page: body.page,
    pagespeed: body.pagespeed || { error: "no_data", message: "PageSpeed wasn't run." },
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
        if (final.stop_reason === "refusal") write("\n\n> ⚠️ The model declined to complete this analysis.");
        if (final.stop_reason === "max_tokens") write("\n\n> ⚠️ The report was cut off at the maximum length.");
      } catch (e) {
        write(`\n\n> ⚠️ Error generating the report: ${e.message}`);
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
