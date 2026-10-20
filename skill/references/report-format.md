# Final report format

A single Markdown file with this exact structure.

```markdown
# Landing Page Audit — [name/URL]

**Overall score: X.X/10**

| Block | Score |
|---|---|
| Copywriting & persuasion | X/10 |
| UX & conversion | X/10 |
| On-page SEO | X/10 |

## Checklist

### Copywriting & persuasion
| Criterion | Score | Finding |
|---|---|---|
| Value proposition | X/10 | [one line] |
| Message hierarchy | X/10 | [one line] |
| CTA strength | X/10 | [one line] |
| Social proof | X/10 | [one line] |
| Objection handling | X/10 | [one line] |

### UX & conversion
[same table structure]

### On-page SEO
[same table structure]

## Narrative report

### Copywriting & persuasion
[2-4 paragraphs, quoting the page's real copy in quotation marks, with recommendations marked
as Impact: High/Medium/Low]

### UX & conversion
[same]

### On-page SEO
[same]

## Top 3 quick wins
1. [highest impact / lowest effort change]
2. [...]
3. [...]

## Technical data (PageSpeed Insights)

*Optional section — include it only if the API responded. Otherwise omit the whole section, don't
leave it with empty placeholders.*

| Metric | Score (mobile) |
|---|---|
| Performance | X/100 |
| Accessibility | X/100 |
| Best practices | X/100 |
| SEO (Lighthouse) | X/100 |

**Core Web Vitals (lab data):** LCP [value], CLS [value], TBT [value].

**Field data (real users):** [present / not available — normal for low-traffic sites].

*Run on [date] via the PageSpeed Insights API.*
```

Report rules:
- Every finding must be traceable to something concrete on the page (a quote, a structural fact),
  never an opinion without evidence.
- Recommendations are actionable: not "improve the copy", but what to change and why.
- The tone is direct and analytical, with no filler or empty praise.
- Section headings and labels are written in the report's language (translate this template's
  headings when the report is not in English).
