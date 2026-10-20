---
name: landing-page-audit
description: >-
  Audita una landing page a partir de su URL y entrega un diagnóstico completo de copywriting,
  UX/conversión y SEO on-page, con puntaje por bloque y recomendaciones accionables priorizadas
  por impacto. Usar este skill cuando el usuario pida "auditar landing page", "revisar mi landing",
  "audit de conversión", "por qué no convierte mi página", "análisis de landing page", "/audit-landing",
  o dé una URL y pida feedback sobre copy, diseño o SEO de esa página. El output son dos entregables:
  un checklist con puntaje por criterio y un reporte narrativo con hallazgos y recomendaciones.
disable-model-invocation: true
---

# Landing Page Audit

Auditar una landing page significa mucho más que "leerla y opinar". Este skill sigue una rúbrica
fija de tres bloques (copy, UX/conversión, SEO on-page) para que el resultado sea consistente,
comparable entre auditorías, y accionable — no una opinión suelta.

## El flujo

```
0. Recibir la URL          confirmar idioma esperado de la página
1. Fetch del contenido     HTML, texto, estructura, meta tags -> ver casos borde si falla
1b. PageSpeed Insights     datos técnicos objetivos (Lighthouse), opcional pero recomendado -> references/pagespeed-integration.md
2. Analizar en 3 bloques   copy / UX-conversión / SEO on-page  -> references/scoring-criteria.md
3. Puntuar                 /10 por bloque + global, con justificación por criterio
4. Entregar                checklist + reporte narrativo + datos técnicos -> references/report-format.md
```

## Fase 0: Recibir el input

El único input requerido es la URL de la landing page. Si el usuario no la da, pedirla.
Si la página está claramente en un idioma distinto al español, avisar que el análisis de copy
se hace en el idioma original de la página (no traducir el copy analizado, sí el reporte si el
usuario lo pide en español).

## Fase 1: Fetch del contenido

Traer el HTML/texto de la página con la herramienta de fetch disponible. Extraer:
- Texto visible completo (headings, body copy, CTAs, footer)
- Estructura de headings (H1, H2, H3...)
- Todos los CTAs y sus textos exactos
- Formularios: cantidad de campos, tipo de campos
- Meta tags: title, meta description, viewport, og:tags
- Imágenes: presencia/ausencia de alt text
- Señales de prueba social: testimonios, logos de clientes, cifras, reviews

Si el fetch falla (bloqueo, JS-heavy sin contenido en el HTML inicial, paywall), no inventar
contenido. Aplicar el fallback de `references/edge-cases.md` y decírselo al usuario explícitamente.

Guardar el contenido extraído antes de analizar — si la página es muy larga, no hace falta un
archivo en disco (esto corre en una sola sesión), pero sí mantener el texto completo a mano para
poder citar hallazgos concretos en el reporte.

## Fase 1b: PageSpeed Insights (datos técnicos objetivos)

Complementar el análisis manual con datos reales de Lighthouse vía la API pública de PageSpeed
Insights. Es un paso recomendado, no bloqueante — si falla o se satura la cuota, seguir con el
resto del audit igual. Detalle completo de la llamada, los campos a extraer y el manejo de
errores (incluyendo qué hacer ante un 429 por falta de API key) en
`references/pagespeed-integration.md`.

Estos datos se muestran en su propia sección del reporte, separados de la rúbrica manual — son
medición automática, no reemplazan el juicio de los bloques de copy/UX/SEO, pero sí informan el
sub-criterio "Señales de performance" con un número real en vez de una estimación.

## Fase 2: Analizar en 3 bloques

Leer `references/scoring-criteria.md` — ahí está la rúbrica completa con los sub-criterios de
cada bloque. En resumen:

- **Copywriting y persuasión**: claridad de la propuesta de valor, jerarquía del mensaje, fuerza
  de los CTAs, prueba social, manejo de objeciones.
- **UX y conversión**: fricción en el CTA/formulario principal, jerarquía visual, pasos hasta
  convertir, mobile-friendliness básico.
- **SEO on-page**: title, meta description, H1 único, alt text, señales de performance, structured
  data si existe.

Cada sub-criterio se evalúa con evidencia concreta de la página, nunca con una opinión genérica.
Un hallazgo sin cita textual o referencia concreta al contenido de la página no es válido.

## Fase 3: Puntuar

Puntaje 1-10 por sub-criterio, promedio por bloque, promedio global. Ver la escala exacta y qué
significa cada tramo en `references/scoring-criteria.md`. El puntaje siempre va acompañado de la
razón — nunca un número solo.

## Fase 4: Entregar

Dos entregables en un solo reporte (ver `references/report-format.md` para el template exacto):

1. **Checklist con puntaje**: tabla escaneable, un renglón por sub-criterio, puntaje + un hallazgo
   de una línea.
2. **Reporte narrativo**: por cada bloque, 2-4 párrafos con hallazgos específicos (citando el copy
   real de la página) y recomendaciones priorizadas por impacto (alto/medio/bajo).

Cerrar siempre con un top 3 de quick wins — los cambios de mayor impacto y menor esfuerzo.

Entregar como archivo Markdown (el usuario puede pedir .docx si lo prefiere para compartir).

## Casos borde

Ver `references/edge-cases.md` para el detalle de: bloqueo de scraping, landing multi-idioma,
páginas que son solo un embed (Typeform/Calendly), páginas muy largas.

## Self-improvement

Este skill nunca está terminado. Mejorarlo con el uso.

- Cuando el usuario corrija cómo se hizo un paso, actualizar el reference file correspondiente
  (o este SKILL.md) para que la corrección quede fija. No arreglarlo solo para esa corrida.
- Cuando una corrección sea una regla dura ("siempre hacé X", "nunca hagas Y"), agregarla como
  regla permanente acá.
- Cuando el usuario diga que un output quedó genuinamente bueno, guardarlo en
  `references/examples/` para que sirva de modelo en futuras corridas.
- Mantener el skill chico: al agregar algo, correr el test de eliminación y cortar lo que no
  cambie el comportamiento.
