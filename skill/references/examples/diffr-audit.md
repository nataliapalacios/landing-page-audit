# Landing Page Audit — Diffr (job-skill-forge.vercel.app)

**Overall score: 7.2/10**

⚠️ **Scope note:** the automatic fetch returned no content (100% client-side rendered app, no
SSR/prerender). The final analysis was done on an `.mhtml` (full snapshot of the rendered DOM, saved
from the browser) uploaded by the user — this did capture the whole page, not just above the fold.
The post-CTA flow (sign-up form) still can't be evaluated; it's outside the reach of a static capture.
The page is in Spanish: its copy is quoted in the original language.

| Block | Score |
|---|---|
| Copywriting & persuasion | 8.0/10 |
| UX & conversion | 8.0/10 (partial — 2 of 4 criteria not assessable without the sign-up flow) |
| On-page SEO | 5.6/10 |

## Checklist

### Copywriting & persuasion
| Criterion | Score | Finding |
|---|---|---|
| Value proposition | 8/10 | Clear in <5s: "Encuentra tu próximo trabajo con IA" (find your next job with AI) + a subheading summarizing 4 benefits. |
| Message hierarchy | 9/10 | Hero → social-proof figures → 4-step "how it works" → comparison vs. the traditional method → final CTA. Reinforces conversion in every block instead of spending the whole argument in the hero. |
| CTA strength | 7/10 | "Explorar trabajos ahora" / "Empezar ahora" (repeated at the end of the page) are actionable but generic; neither promises a specific outcome. |
| Social proof | 7/10 | Figures bar right below the hero: "12,500+ Trabajos · 3,400+ Colocaciones · 25 Universidades · 87% Match rate". Strong on numbers, but no names, company logos or a verbatim quote from a real user — still "brand" social proof, not testimonial. |
| Objection handling | 9/10 | The "Diffr vs. Búsqueda tradicional" table (3-6 months vs. 4-8 weeks, 2% vs. 15% response rate, generic CV vs. ATS-optimized) is strong, data-backed objection handling, not just claims. |

### UX & conversion
| Criterion | Score | Finding |
|---|---|---|
| Main CTA friction | Not assessable | The "Registrarse" (sign up) form/flow isn't in this snapshot (probably a separate page or modal). |
| Visual hierarchy | 8/10 | Consistent contrast and spacing across the page; each section repeats the title → content → CTA pattern without clutter. |
| Steps to convert | Not assessable | Requires seeing the post-CTA flow. |
| Basic mobile-friendliness | 8/10 | Viewport meta tag present. Layout and spacing suggest responsive design; the actual mobile render wasn't confirmed. |

### On-page SEO
| Criterion | Score | Finding |
|---|---|---|
| Title tag | 4/10 | Just says "Diffr" — no keyword or benefit. Wastes ranking real estate. |
| Meta description | 7/10 | Present and with relevant keywords ("ofertas reales", "match", "CV", "IA"), but short (~72 characters vs. ~155-160 available). |
| Single H1 | 9/10 | Confirmed: a single `<h1>` in the whole DOM ("Encuentra tu próximo trabajo con IA"), consistent with the title. |
| Alt text | N/A | Zero `<img>` tags in the DOM — the page uses SVG/inline icons, not traditional images. Not a defect. |
| Performance signals | 6/10 | According to PageSpeed Insights (user-provided, mobile): 61/100 Performance. The skill's own API call hit a rate limit (429, keyless public quota) — data taken from the report the user had already run. Confirms the qualitative diagnosis: mediocre performance, consistent with an SPA without prerendering. |
| Structured data | 2/10 | Confirmed: no JSON-LD in the `<head>` of the rendered DOM. Zero possible rich snippets today. |

**Additional finding (outside the original rubric, added to `scoring-criteria.md`):** the `<html>`
`lang` attribute is set to `"en"` but all visible content is in Spanish. This hurts accessibility
(screen readers mispronounce) and can confuse search engines about the page's real language. Simple
technical slip, a minutes-long fix. *Impact: Medium, effort: minimal.*

## Narrative report

### Copywriting & persuasion
The value proposition is clearly solved: "Encuentra tu próximo trabajo con IA" combined with the
subheading "Tu asistente inteligente para buscar empleo, mejorar tu CV, practicar entrevistas y
cerrar brechas de habilidades" communicates in seconds what the product does and for whom.

With the full page in view, the message hierarchy is stronger than it looked from the hero alone:
after the promise comes a figures bar ("12,500+ Trabajos · 3,400+ Colocaciones · 25 Universidades ·
87% Match rate"), then the 4-step "how it works", then a "Diffr vs. Búsqueda tradicional" comparison
table that turns objections into concrete data (3-6 months vs. 4-8 weeks searching, 2% vs. 15%
response rate, generic CV vs. ATS-optimized). It's a classic, well-executed sales-page structure, not
just a pretty hero. *Impact: already well solved, not a recommendation.*

Social proof exists and is stronger than the hero alone suggested, but it's entirely quantitative —
the company's own figures, with no name, employer logo, or verbatim quote from a real user backing
them. Figures alone can be doubted; a testimonial with a name and a specific result ("I got a job in
3 weeks — María, Data Analyst") makes them credible. *Impact: Medium.*

The CTAs ("Explorar trabajos ahora", "Empezar ahora" repeated at the end) are actionable but
generic — neither is tied to the specific benefit the H1 promises. Something like "Ver mis matches
ahora" (see my matches now) would connect more directly with the core promise. *Impact: Low-Medium.*

### UX & conversion
The visual hierarchy stays consistent across the whole page, not just in the hero: each section
repeats the title → supporting content → CTA reinforcement pattern, with a final CTA ("Empezar
ahora") that gives a second conversion chance to whoever reached the end without acting — the right
pattern for long-content pages.

Real conversion friction (number of fields in the "Registrarse" form, steps to activate the account)
still can't be evaluated, because that flow lives outside this page and wasn't captured in the
snapshot. *Recommendation: run a second pass specifically on the sign-up flow — that's usually where
more conversion is lost than in the landing's content.*

### On-page SEO
This is the weakest block, and for a structural rather than a content reason: the page is a 100%
client-side rendered SPA — the HTML that reaches a crawler that doesn't execute JavaScript (or does
so on a limited budget, as happens with part of Google's crawl budget on large sites, and with most
non-Googlebot bots) is empty except for the meta tags. All the copy, headings and semantic content
only exist after `index-DFJ6tuSG.js` runs. *Impact: High.* The fix isn't rewriting copy, it's
technical: prerender or SSR (Next.js, Astro, or a prerendering service like Prerender.io) so the
initial HTML carries the real content.

The title tag ("Diffr") and the total absence of structured data are cheap quick wins: the title uses
none of the available space for a keyword or benefit, and there isn't a single
`<script type="application/ld+json">` in the head, which rules out any rich snippet (rating, FAQ,
etc.) in search results. *Impact: Medium-High, low effort.*

The meta description is on the right track — it has relevant keywords and is persuasive — but uses
less than half the space available in Google's snippet. *Impact: Low.*

One specific finding confirmed in the DOM: `<html lang="en">` with 100% Spanish content. It's a
typical slip of English templates (this site runs on Lovable) that nobody adjusted when translating
the copy. *Impact: Medium, effort: minimal — it's one line of code.*

## Top 3 quick wins
1. **Prerender/SSR the critical content.** The highest-impact SEO change: today the site is
   effectively invisible to any crawler that doesn't execute JS. Medium effort (requires technical
   work), but it's the foundation for everything else in SEO.
2. **Rewrite the title tag** from "Diffr" to something like "Diffr — Busca empleo con IA, mejora tu
   CV y practica entrevistas". Minimal effort, direct impact on search CTR.
3. **Fix `lang="en"` to `lang="es"`** and add basic structured data (Organization/WebSite). Both are
   minutes-long changes with direct impact on accessibility and technical SEO.

## Technical data (PageSpeed Insights)

⚠️ These values come from the report the user had already run on pagespeed.web.dev — the skill's
own API call hit a `429` (public quota saturated, no API key configured).

| Metric | Score (mobile) |
|---|---|
| Performance | 61/100 |
| Accessibility | 90/100 |
| Best practices | 100/100 |
| SEO (Lighthouse) | 100/100 |

**Field data (real users):** not available — normal for a low-traffic site like this one, in Beta.

*Note on an apparent contradiction:* Lighthouse gives 100/100 on its own SEO score, but our rubric
scored 5.6/10 on the SEO block. It's not an error — Lighthouse audits basic technical signals (is
there a title? a meta description? is it crawlable?, all present here) and doesn't evaluate the
quality of the title/meta description or the absence of structured data with the same level of
detail as our rubric. It's worth clarifying this in any report combining both sources, so they don't
seem to contradict each other without explanation.

*Run on Aug 21 2026, data provided by the user via pagespeed.web.dev.*
