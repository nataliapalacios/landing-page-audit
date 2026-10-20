# Landing Page Audit

Audita una landing page a partir de su URL y entrega un diagnóstico de **copywriting, UX/conversión
y SEO on-page**, más **datos técnicos de PageSpeed Insights**, con puntaje justificado por criterio
y un top 3 de quick wins.

Reemplaza el proceso de correr el análisis en 4 lugares por separado (lectura de copy, revisión UX,
chequeo SEO, PageSpeed) por un solo reporte con una rúbrica fija, comparable entre auditorías.

Viene en dos formatos que comparten la misma rúbrica (`skill/references/`):

| Formato | Para qué | Costo |
|---|---|---|
| **Webapp** (Vercel) | Pegar una URL en el navegador y bajar el reporte `.md`. Sirve para clientes o el equipo. | Vercel Hobby gratis + API de Claude por uso (~US$0.10–0.20 por audit) |
| **Skill de Claude** (`skill/`) | Correrlo dentro de Claude Code / Claude Desktop. | Incluido en tu plan de Claude |

## Cómo funciona

```
URL ─┬─> /api/extract   fetch server-side + extracción determinística (title, meta, H1-H3, CTAs,
     │                  formularios, alt text, JSON-LD, lang, texto visible)
     │                  └─ si es una SPA sin contenido o bloquea el fetch → pide un .mhtml (no inventa)
     └─> /api/psi       PageSpeed Insights en paralelo (no bloquea: si falla, se omite la sección)
            │
            └─> /api/audit   Claude aplica la rúbrica y devuelve el reporte en streaming
```

- Todo lo medible se mide con código; Claude solo juzga sobre esa evidencia y cita el copy real.
- El system prompt se arma con los mismos archivos de `skill/references/` → si mejorás la rúbrica,
  mejora la webapp y el skill a la vez.
- Prompt caching sobre la rúbrica: a partir del segundo audit, esa parte del input cuesta ~10%.
- Nada se guarda: sin base de datos, sin login, sin estado.

## Deploy en Vercel (5 minutos)

1. Fork / subí este repo a tu GitHub.
2. En [vercel.com/new](https://vercel.com/new) importá el repo. No hace falta configurar framework
   ni build: se detecta solo.
3. En **Settings → Environment Variables** agregá:
   - `ANTHROPIC_API_KEY` — obligatoria.
   - `PAGESPEED_API_KEY` — recomendada (gratis, ver `.env.example`). Sin ella la cuota pública
     devuelve 429 seguido.
   - `ACCESS_CODE` — recomendada si la URL va a ser pública, para que nadie más gaste tus créditos.
4. Deploy. Listo.

## Correr local

```bash
npm install
```

```bash
cp .env.example .env
```

```bash
npm run dev
```

Abre en `http://localhost:3000`. El servidor local (`scripts/dev.js`) imita el ruteo de Vercel, no
hace falta la CLI de Vercel.

## Si la página no se puede leer (SPAs, Cloudflare)

Muchas landings modernas (Lovable, Vite/React sin SSR) llegan vacías al fetch. La app lo detecta y
pide un `.mhtml`: en Chrome/Edge, con la página cargada, **Ctrl/Cmd + S → "Página web, un solo
archivo"**, y subirlo. Se parsea en el navegador y solo viaja el HTML limpio.

## Estructura

```
├── index.html               # UI (estática, sin build)
├── api/
│   ├── extract.js           # fetch + extracción / parseo del .mhtml
│   ├── psi.js               # PageSpeed Insights
│   └── audit.js             # Claude + rúbrica → reporte en streaming
├── lib/                     # extracción, prompt, helpers HTTP
├── scripts/dev.js           # servidor local
└── skill/                   # el skill original de Claude (fuente de verdad de la rúbrica)
    ├── SKILL.md
    └── references/
        ├── scoring-criteria.md
        ├── report-format.md
        ├── edge-cases.md
        ├── pagespeed-integration.md
        └── examples/diffr-audit.md
```

## Usarlo como Skill de Claude

Copiar la carpeta `skill/` a tu directorio de skills como `landing-page-audit/` e invocarlo con
"Audita esta landing: https://…". Ver [`skill/SKILL.md`](./skill/SKILL.md) y el ejemplo real sobre
[Diffr](./skill/references/examples/diffr-audit.md).

## Límites conocidos

- No evalúa el flujo post-CTA (registro, checkout): queda marcado como "No evaluable".
- Mobile-friendliness se infiere de la estructura, no de un render real (PageSpeed mobile lo complementa).
- Uploads de `.mhtml` limitados a ~4.5 MB después de limpiar scripts y estilos (límite de Vercel).

## Sobre esta serie

Parte de una serie de automatizaciones de marketing, ventas y producto documentadas en abierto.
Mismo método en todas: MVP funcional primero, probado con un caso real, después documentado y publicado.

— Nat, Viridis · Comunidad DMK Francia

*Inspirado en el enfoque de [Louise de Sadeleer](https://github.com/louisedesadeleer) de publicar
automatizaciones documentadas en abierto.*

## Licencia

MIT — usalo, adaptalo, mejoralo.
