# Scoring rubric

1-10 scale per sub-criterion. Never give a number without the concrete reason behind it.

- **9-10**: Best-in-class, no friction or ambiguity.
- **7-8**: Solid, with 1-2 possible minor improvements.
- **5-6**: Functional but with clear friction or vagueness.
- **3-4**: Weak, probably costing conversions.
- **1-2**: Absent or actively counterproductive.

## Block 1: Copywriting & persuasion

| Sub-criterion | What to evaluate |
|---|---|
| Value proposition | Is it clear in under 5 seconds what's offered and for whom? Is it in the H1/hero or do you have to look for it? |
| Message hierarchy | Does the copy follow a logical order (problem → solution → proof → action) or is it a flat list of features? |
| CTA strength | Is the button text specific and benefit-oriented ("Start free") or generic ("Submit", "Click here")? Is there one clear main CTA or do several compete? |
| Social proof | Are there testimonials, logos, figures, reviews? Are they specific (name, role, result) or generic? |
| Objection handling | Does the page anticipate obvious doubts (price, time, guarantee, security) or ignore them? |

## Block 2: UX & conversion

| Sub-criterion | What to evaluate |
|---|---|
| Main CTA friction | Number of form fields, number of clicks to conversion. Every extra field is friction. |
| Visual hierarchy | Based on the heading structure and HTML order: is there a clear visual flow toward the CTA, or does everything compete for attention? |
| Steps to convert | Is it one step (leave an email) or multi-step? Is that justified by the offer's complexity? |
| Basic mobile-friendliness | Does it have a viewport meta tag? Is the design responsive by structure (the render can't be seen, but it can be inferred from the framework and meta tags)? |

## Block 3: On-page SEO

| Sub-criterion | What to evaluate |
|---|---|
| Title tag | Does it exist, is it unique, does it describe the page, is it a reasonable length (~50-60 characters)? |
| Meta description | Does it exist, is it persuasive, reasonable length (~150-160 characters)? |
| Single H1 | Is there exactly one H1? Is it consistent with the title? |
| Alt text | Do relevant images have descriptive alt text? |
| Performance signals | Approximate page weight, number of requests if detectable, use of lazy loading. **If PageSpeed Insights data is available, use the real `performance.score` and cite it instead of estimating** (see `references/pagespeed-integration.md`). |
| Structured data | Is there schema.org / JSON-LD? (Bonus, not critical for a simple landing.) |
| `lang` attribute | Does `<html lang="...">` match the content's real language? A common slip in templates/builders (Lovable, etc.) that stay in English by default after the copy is translated. Affects accessibility (screen readers) and language classification in search engines. |

## Score calculation

1. Simple average of each block's sub-criteria → block score (/10).
2. Average of the 3 blocks → overall score (/10).
3. The overall score never replaces the detail — always show the breakdown.
