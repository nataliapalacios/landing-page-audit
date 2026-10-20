# Landing Page Audit

**▶ Live demo: [landing-page-audit-xi.vercel.app](https://landing-page-audit-xi.vercel.app/)**
(3 audits per month per IP · "See a sample report" button, free and instant)

Audits a landing page from its URL and delivers a diagnosis of **copywriting, UX/conversion and
on-page SEO**, plus **PageSpeed Insights technical data**, with a justified score per criterion and
a top 3 of quick wins. Reports in English, Spanish or French.

It replaces running the analysis in 4 separate places (copy review, UX review, SEO check, PageSpeed)
with a single report built on a fixed rubric, comparable across audits.

It comes in two formats that share the same rubric (`skill/references/`):

| Format | What for | Cost |
|---|---|---|
| **Web app** (Vercel) | Paste a URL in the browser and download the `.md` report. Works for clients or the team. | Vercel Hobby free + Claude API per use (~US$0.04–0.06 per audit) |
| **Claude Skill** (`skill/`) | Run it inside Claude Code / Claude Desktop. | Included in your Claude plan |

## How it works

```
URL ─┬─> /api/extract   server-side fetch + deterministic extraction (title, meta, H1-H3, CTAs,
     │                  forms, alt text, JSON-LD, lang, visible text)
     │                  └─ if it's an SPA with no content or it blocks the fetch → asks for an .mhtml (never invents)
     └─> /api/psi       PageSpeed Insights in parallel (non-blocking: if it fails, the section is omitted)
            │
            └─> /api/audit   Claude applies the rubric and streams the report back
```

- Everything measurable is measured in code; Claude only judges on that evidence and quotes the real copy.
- The system prompt is built from the same files in `skill/references/` → improve the rubric and
  both the web app and the skill improve at once.
- Nothing is stored: no database, no login, no state.

## Costs

~75% of the cost is the text Claude writes, not what it reads. So the levers are:

| Lever | Default | Effect |
|---|---|---|
| Model | `claude-sonnet-5-5` | Half Opus's price per token; the fixed rubric does the heavy lifting |
| Reasoning effort | `low` | Fewer "thinking" tokens before writing |
| Page text sent | 15,000 characters | Hero + first scrolls, where conversion is decided |
| Prompt caching | rubric + example | That part costs ~10% on back-to-back audits (5-min cache) |

Result: **~US$0.04–0.06 per audit**. For maximum quality: `CLAUDE_MODEL=claude-opus-5-5`,
`CLAUDE_EFFORT=medium` (~US$0.15).

## Public demo (portfolio)

The app is designed so anyone can try it without signing up:

- **"See a sample report" button**: shows the real Diffr audit instantly, at no cost.
- **Per-IP limit** (`RATE_LIMIT_PER_MONTH`, default 3/month). The counter lives in Upstash Redis
  (free plan, connected in one click from the Vercel Marketplace). Without Redis it stays in memory
  and resets on every cold start, so in practice it doesn't limit.
- **Hard spend cap**: in [console.anthropic.com](https://console.anthropic.com), create a workspace
  just for this demo, use an API key from that workspace, and set a monthly spend limit under
  Limits. If the cap is reached, the app returns an error and stops spending.
- `ACCESS_CODE` stays empty; use it only if you want to lock the app.

## Deploy on Vercel (5 minutes)

1. Fork / push this repo to your GitHub.
2. In [vercel.com/new](https://vercel.com/new), import the repo. No framework or build settings
   needed: it's detected automatically.
3. In **Settings → Environment Variables** add (as *Secret*):
   - `ANTHROPIC_API_KEY` — required.
   - `PAGESPEED_API_KEY` — recommended (free, no billing account needed; see `.env.example`).
     Without it the public quota often returns 429.
   - `ACCESS_CODE` — optional: locks the app behind a code (skip it for a public demo).
4. Deploy. Done.
5. If the URL will be public: connect Upstash Redis (**Storage → Upstash for Redis**, then
   Redeploy) and set the spend limit in the Anthropic console (see "Public demo").

## Run locally

```bash
npm install
```

```bash
cp .env.example .env
```

```bash
npm run dev
```

Opens at `http://localhost:3000`. The local server (`scripts/dev.js`) mimics Vercel's routing, no
Vercel CLI needed.

## If the page can't be read (SPAs, Cloudflare)

Many modern landings (Lovable, Vite/React without SSR) arrive empty to the fetch. The app detects
it and asks for an `.mhtml`: in Chrome/Edge, with the page loaded, **Ctrl/Cmd + S → "Webpage,
Single File"**, and upload it. It's parsed in the browser and only the cleaned HTML is sent.

## Structure

```
├── index.html               # UI (static, no build)
├── api/
│   ├── extract.js           # fetch + extraction / .mhtml parsing
│   ├── psi.js               # PageSpeed Insights
│   └── audit.js             # Claude + rubric → streamed report
├── lib/                     # extraction, prompt, HTTP helpers, rate limit
├── scripts/dev.js           # local server
└── skill/                   # the original Claude skill (source of truth for the rubric)
    ├── SKILL.md
    └── references/
        ├── scoring-criteria.md
        ├── report-format.md
        ├── edge-cases.md
        ├── pagespeed-integration.md
        └── examples/diffr-audit.md
```

## Using it as a Claude Skill

Copy the `skill/` folder into your skills directory as `landing-page-audit/` and invoke it with
"Audit this landing: https://…". See [`skill/SKILL.md`](./skill/SKILL.md) and the real example on
[Diffr](./skill/references/examples/diffr-audit.md).

## Known limits

- It doesn't evaluate the post-CTA flow (sign-up, checkout): it's marked "Not assessable".
- Mobile-friendliness is inferred from structure, not from a real render (PageSpeed mobile complements it).
- `.mhtml` uploads are limited to ~4.5 MB after stripping scripts and styles (Vercel's limit).

## About this series

Part of a series of marketing, sales and product automations documented in the open.
Same method for all of them: a working MVP first, tested on a real case, then documented and published.

— Nat, Viridis · DMK France Community

*Inspired by [Louise de Sadeleer](https://github.com/louisedesadeleer)'s approach of publishing
documented automations in the open.*

## License

MIT — use it, adapt it, improve it.
