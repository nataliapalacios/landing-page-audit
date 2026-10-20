---
name: landing-page-audit
description: >-
  Audits a landing page from its URL and delivers a full diagnosis of copywriting,
  UX/conversion and on-page SEO, with a score per block and actionable recommendations prioritized
  by impact. Use this skill when the user asks to "audit a landing page", "review my landing",
  "conversion audit", "why isn't my page converting", "landing page analysis", "/audit-landing",
  or gives a URL and asks for feedback on that page's copy, design or SEO. The output is two
  deliverables: a scored checklist per criterion and a narrative report with findings and recommendations.
disable-model-invocation: true
---

# Landing Page Audit

Auditing a landing page means much more than "reading it and giving an opinion". This skill follows
a fixed three-block rubric (copy, UX/conversion, on-page SEO) so the result is consistent,
comparable across audits, and actionable — not a loose opinion.

## The flow

```
0. Receive the URL          confirm the page's expected language
1. Fetch the content        HTML, text, structure, meta tags -> see edge cases if it fails
1b. PageSpeed Insights      objective technical data (Lighthouse), optional but recommended -> references/pagespeed-integration.md
2. Analyze in 3 blocks      copy / UX-conversion / on-page SEO  -> references/scoring-criteria.md
3. Score                    /10 per block + overall, with a justification per criterion
4. Deliver                  checklist + narrative report + technical data -> references/report-format.md
```

## Phase 0: Receive the input

The only required input is the landing page URL. If the user doesn't provide it, ask for it.
If the page is in a different language than the report, the copy analysis is done in the page's
original language (don't translate the quoted copy; write the report in the user's language).

## Phase 1: Fetch the content

Fetch the page's HTML/text with the available fetch tool. Extract:
- Full visible text (headings, body copy, CTAs, footer)
- Heading structure (H1, H2, H3...)
- All CTAs and their exact text
- Forms: number of fields, field types
- Meta tags: title, meta description, viewport, og:tags
- Images: presence/absence of alt text
- Social proof signals: testimonials, client logos, figures, reviews

If the fetch fails (blocking, JS-heavy with no content in the initial HTML, paywall), don't invent
content. Apply the fallback in `references/edge-cases.md` and tell the user explicitly.

Keep the extracted content before analyzing — if the page is very long, no file on disk is needed
(this runs in a single session), but keep the full text at hand to quote concrete findings in the report.

## Phase 1b: PageSpeed Insights (objective technical data)

Complement the manual analysis with real Lighthouse data via the public PageSpeed Insights API.
It's a recommended step, not a blocking one — if it fails or the quota is exhausted, carry on with
the rest of the audit. Full details of the call, the fields to extract and error handling
(including what to do on a 429 due to a missing API key) in `references/pagespeed-integration.md`.

This data is shown in its own report section, separate from the manual rubric — it's automated
measurement, it doesn't replace the judgment of the copy/UX/SEO blocks, but it does inform the
"Performance signals" sub-criterion with a real number instead of an estimate.

## Phase 2: Analyze in 3 blocks

Read `references/scoring-criteria.md` — it holds the full rubric with each block's sub-criteria.
In short:

- **Copywriting & persuasion**: value proposition clarity, message hierarchy, CTA strength,
  social proof, objection handling.
- **UX & conversion**: friction in the main CTA/form, visual hierarchy, steps to convert,
  basic mobile-friendliness.
- **On-page SEO**: title, meta description, single H1, alt text, performance signals, structured
  data if present.

Every sub-criterion is evaluated with concrete evidence from the page, never with a generic opinion.
A finding without a verbatim quote or a concrete reference to the page's content is not valid.

## Phase 3: Score

Score 1-10 per sub-criterion, average per block, overall average. See the exact scale and what each
range means in `references/scoring-criteria.md`. The score always comes with the reason — never a
number alone.

## Phase 4: Deliver

Two deliverables in a single report (see `references/report-format.md` for the exact template):

1. **Scored checklist**: scannable table, one row per sub-criterion, score + a one-line finding.
2. **Narrative report**: for each block, 2-4 paragraphs with specific findings (quoting the page's
   real copy) and recommendations prioritized by impact (high/medium/low).

Always close with a top 3 quick wins — the highest-impact, lowest-effort changes.

Deliver as a Markdown file (the user may ask for .docx if they prefer it for sharing).

## Edge cases

See `references/edge-cases.md` for: scraping blocks, multilingual landings, pages that are just an
embed (Typeform/Calendly), very long pages.

## Self-improvement

This skill is never finished. Improve it with use.

- When the user corrects how a step was done, update the corresponding reference file
  (or this SKILL.md) so the correction sticks. Don't fix it for that run only.
- When a correction is a hard rule ("always do X", "never do Y"), add it here as a permanent rule.
- When the user says an output turned out genuinely good, save it in `references/examples/` so it
  serves as a model in future runs.
- Keep the skill small: when adding something, run the deletion test and cut whatever doesn't
  change behavior.
