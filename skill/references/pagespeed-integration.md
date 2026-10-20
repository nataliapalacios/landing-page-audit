# PageSpeed Insights integration

Objective technical data (Lighthouse) that complements the manual rubric. It doesn't replace the
copy/UX analysis — it's a different source, and the report shows it in its own section so judgment
isn't mixed with automated measurement.

## How to call the API

Public endpoint, no auth needed for low volume (although the shared keyless quota runs out fast —
see "Error handling" below):

```
GET https://www.googleapis.com/pagespeedonline/v5/runPagespeed
    ?url={URL_TO_AUDIT}
    &strategy=mobile
    &category=performance
    &category=accessibility
    &category=seo
    &category=best-practices
```

`strategy` can be `mobile` or `desktop` — run mobile by default (mobile-first indexing), and offer
desktop if the user specifically asks for it.

**For reliable / repeated use:** get a free API key in Google Cloud Console
("PageSpeed Insights API" → enable → create credential) and add it as `&key=...`. Without a key,
the quota shared by every internet user runs out easily (see real case below).

**Recommended setup before using this skill seriously (not just to try it once):**
1. Go to [console.cloud.google.com](https://console.cloud.google.com), create or pick a project.
2. Search for "PageSpeed Insights API" and enable it (free, no card or billing account needed).
3. "APIs & Services" → "Credentials" → "Create credentials" → "API key".
4. Restrict the key so it only works for this API (security good practice).
5. Use the key as `&key=YOUR_KEY` in the call, or store it as an environment variable.

Without this setup the skill still works — the PageSpeed step may just fail due to quota, in which
case fall back as described below.

## Why not add another platform (GTmetrix, WebPageTest) by default?

With an API key, PageSpeed Insights already covers performance + accessibility + best practices +
technical SEO + Core Web Vitals (lab and field) in a single call, with a free quota of 25,000
requests/day. That used to require running 3-4 separate tools and synthesizing by hand.

Adding a second platform adds complexity without solving a real problem the key doesn't already
solve. GTmetrix (very small free quota: 5 tests/day) and WebPageTest (generous quota, but built for
deep visual debugging — waterfall, filmstrip, multi-device) were evaluated.

**When WebPageTest is worth adding:** if a specific audit needs visual detail PSI doesn't give
(request waterfall, load video, testing from specific locations/devices). It's not part of the
default flow — it's added as an optional step only if the user asks for it in a specific case.

## What to extract from the response

From `lighthouseResult.categories`:
- `performance.score` (0-1, multiply by 100)
- `accessibility.score`
- `seo.score`
- `best-practices.score`

From `lighthouseResult.audits`, the most quotable Core Web Vitals:
- `largest-contentful-paint` → `displayValue`
- `cumulative-layout-shift` → `displayValue`
- `total-blocking-time` → `displayValue`

From `loadingExperience` (if present): real field data (CrUX) — not always available for
low-traffic sites, in which case the field comes back empty or missing. Don't treat its absence as
an error; just report "not enough field data" (this is normal for new/low-traffic sites, it's what
happened with Diffr — see `examples/diffr-audit.md`).

## Error handling

**Real case (Diffr, Aug 21 2026):** the endpoint returned `429` (rate limit) on two consecutive
attempts, called without an API key. This is expected without a key.

- **If it returns 429 without a key:** don't retry more than once. Tell the user explicitly that
  the public quota is saturated right now and that, for reliable use (especially if the skill will
  be published and used often), a free API key is worth generating. Meanwhile, continue the rest of
  the audit with the manual rubric — PageSpeed is a complement, not a blocker.
- **If the URL isn't reachable by Lighthouse** (login, geo-blocking, etc.): report it and continue
  without this section.
- **If field data (CrUX) is missing:** normal for low-traffic sites, not an error — report only the
  lab data (Lighthouse) and clarify there's no real-user data yet.

## How it shows up in the report

A new, separate section in `report-format.md`: "Technical data (PageSpeed Insights)". The
"Performance signals" sub-criterion in `scoring-criteria.md` must use the real `performance.score`
when available, instead of estimating qualitatively — and cite the source ("according to PageSpeed
Insights, run on [date]").
