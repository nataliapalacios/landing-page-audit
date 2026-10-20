# Landing Page Audit

Audita una landing page a partir de su URL y entrega un diagnóstico de **copywriting, UX/conversión
y SEO on-page**, más **datos técnicos de PageSpeed Insights**, con puntaje justificado por criterio
y un top 3 de quick wins.

Reemplaza el proceso de correr el análisis en 4 lugares por separado (lectura de copy, revisión UX,
chequeo SEO, PageSpeed) por un solo reporte con una rúbrica fija, comparable entre auditorías.

Viene en dos formatos que comparten la misma rúbrica (`skill/references/`):

| Formato | Para qué | Costo |
|---|---|---|
| **Webapp** (Vercel) | Pegar una URL en el navegador y bajar el reporte `.md`. Sirve para clientes o el equipo. | Vercel Hobby gratis + API de Claude por uso (~US$0.04–0.06 por audit) |
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
- Nada se guarda: sin base de datos, sin login, sin estado.

## Costos

~75% del costo es el texto que escribe Claude, no el que lee. Por eso las palancas son:

| Palanca | Default | Efecto |
|---|---|---|
| Modelo | `claude-sonnet-5-5` | Mitad de precio por token que Opus; la rúbrica fija hace el trabajo pesado |
| Esfuerzo de razonamiento | `low` | Menos tokens de "pensamiento" antes de escribir |
| Texto de la página enviado | 15.000 caracteres | Hero + primeros scrolls, donde se decide la conversión |
| Prompt caching | rúbrica + ejemplo | Esa parte cuesta ~10% en audits seguidos (caché de 5 min) |

Resultado: **~US$0.04–0.06 por audit**. Para máxima calidad: `CLAUDE_MODEL=claude-opus-5-5`,
`CLAUDE_EFFORT=medium` (~US$0.15).

## Demo pública (portfolio)

La app está pensada para que cualquiera la pruebe sin registrarse:

- **Botón "Ver un reporte de ejemplo"**: muestra la auditoría real de Diffr al instante, sin costo.
- **Límite por IP** (`RATE_LIMIT_PER_DAY`, default 5/día): frena el abuso casual.
- **Tope duro de gasto**: en [console.anthropic.com](https://console.anthropic.com) → Settings →
  Limits, fijá un *spend limit* mensual (ej. US$10 ≈ 200 audits). Mejor aún: creá un workspace
  aparte solo para esta demo y usá una API key de ese workspace. Si se alcanza el tope, la app
  devuelve un error y no gasta más.
- `ACCESS_CODE` queda vacío; usalo solo si querés cerrarla.

## Deploy en Vercel (5 minutos)

1. Fork / subí este repo a tu GitHub.
2. En [vercel.com/new](https://vercel.com/new) importá el repo. No hace falta configurar framework
   ni build: se detecta solo.
3. En **Settings → Environment Variables** agregá:
   - `ANTHROPIC_API_KEY` — obligatoria.
   - `PAGESPEED_API_KEY` — recomendada (gratis, ver `.env.example`). Sin ella la cuota pública
     devuelve 429 seguido.
   - `ACCESS_CODE` — opcional: cierra la app con un código (no la uses si es una demo pública).
4. Deploy. Listo.
5. Si la URL va a ser pública: configurá el spend limit en la consola de Anthropic (ver "Demo pública").

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
