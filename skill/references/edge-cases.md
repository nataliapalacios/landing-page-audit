# Edge cases

## The page blocks scraping (Cloudflare, JS-heavy without SSR)
In practice this is the MOST COMMON case, not an exception — any SPA without SSR/prerender
(Lovable, Vite/React, apps built with modern builders) will hit it. Don't invent content.
Tell the user explicitly that the automatic fetch failed.

**Ask for, in this order of preference:**
1. **An `.mhtml` file** ("Save as" → "Webpage, Single File" in Chrome/Edge, with the page fully
   loaded). It's the best option: it captures the full, already rendered DOM, with the whole page
   (not just above the fold), which allows evaluating all 3 blocks instead of a fragment. How to
   process it: it's a multipart MIME. Find the part with `Content-Type: text/html` and a
   `Content-Location` equal to the page URL, take the body after the first `\r\n\r\n`, decode it with
   `quopri.decodestring` (it comes as `Content-Transfer-Encoding: quoted-printable`), and parse the
   resulting HTML with BeautifulSoup to extract headings, CTAs (`<a>`/`<button>`), forms,
   images/alt text and the full visible text.
2. **A screenshot** (ideally one of the hero and one or two more while scrolling) if the user can't
   generate an `.mhtml`. It works for UX/visual hierarchy, but limits the copy and SEO analysis to the
   visible fragment — state that explicitly in the report.
3. **Hand-pasted HTML or "View source"** — usually useless for an SPA (it brings the empty shell,
   same as the automatic fetch), but confirm it with the user if they insist on this route.

In any of the three cases, mark in the report which criteria couldn't be evaluated due to lack of
access, and which method was used to complete the rest.

## Multilingual landing page / language selector
Detect the language the page loads in by default and audit that one. If the user asks to audit a
specific version (e.g. the French one), use that URL directly if it exists as a separate URL; if
it's a JS toggle without its own URL, warn that only the version the fetch loaded could be audited.

## The landing is just an embed (Typeform, Calendly, an iframe)
Audit whatever is visible in the surrounding HTML (context, copy around the embed, entry CTA) and
mark explicitly in the report that the embed's content itself is outside the fetch's reach. Don't
score sub-criteria that depend on inaccessible content — omit them and say why, instead of forcing
a number.

## Very long page (extensive scroll, multiple sections)
Prioritize above the fold and the first 2-3 scrolls for the detailed copy and UX analysis (that's
where most of the conversion is decided). Summarize the rest of the page in 1-2 lines per section
without going into the same level of detail, unless the user asks otherwise.

## Invalid URL or page down
Confirm it with the user before assuming anything else. Don't audit a cached version or a guess of
how the page "should" look.
