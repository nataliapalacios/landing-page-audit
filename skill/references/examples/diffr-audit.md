# Audit de Landing Page — Diffr (job-skill-forge.vercel.app)

**Puntaje global: 7.2/10**

⚠️ **Nota de alcance:** el fetch automático no trajo contenido (app 100% client-side rendered, sin
SSR/prerender). El análisis final se hizo sobre un `.mhtml` (snapshot completo del DOM renderizado,
guardado desde el navegador) que el usuario subió — esto sí capturó la página completa, no solo el
above-the-fold. Sigue sin poder evaluarse el flujo post-CTA (formulario de registro), que queda
fuera del alcance de una captura estática.

| Bloque | Puntaje |
|---|---|
| Copywriting y persuasión | 8.0/10 |
| UX y conversión | 8.0/10 (parcial — 2 de 4 criterios no evaluables sin el flujo de registro) |
| SEO on-page | 5.6/10 |

## Checklist

### Copywriting y persuasión
| Criterio | Puntaje | Hallazgo |
|---|---|---|
| Propuesta de valor | 8/10 | Clara en <5s: "Encuentra tu próximo trabajo con IA" + subheading que resume 4 beneficios. |
| Jerarquía del mensaje | 9/10 | Hero → cifras de prueba social → "cómo funciona" en 4 pasos → comparación vs. método tradicional → CTA final. Refuerza la conversión en cada bloque en vez de gastar todo el argumento en el hero. |
| Fuerza del CTA | 7/10 | "Explorar trabajos ahora" / "Empezar ahora" (repetido al final de la página) son accionables pero genéricos; ninguno promete un resultado específico. |
| Prueba social | 7/10 | Barra de cifras justo debajo del hero: "12,500+ Trabajos · 3,400+ Colocaciones · 25 Universidades · 87% Match rate". Fuerte en números, pero sin nombres, logos de empresas ni una cita textual de un usuario real — sigue siendo prueba social "de marca", no testimonial. |
| Manejo de objeciones | 9/10 | La tabla "Diffr vs. Búsqueda tradicional" (3-6 meses vs. 4-8 semanas, 2% vs. 15% respuesta, CV genérico vs. optimizado para ATS) es un manejo de objeciones fuerte y con datos, no solo afirmaciones. |

### UX y conversión
| Criterio | Puntaje | Hallazgo |
|---|---|---|
| Fricción del CTA principal | No evaluable | El formulario/flujo de "Registrarse" no está en este snapshot (probablemente una página o modal aparte). |
| Jerarquía visual | 8/10 | Contraste y espaciado consistentes en toda la página; cada sección repite el patrón título → contenido → CTA sin saturar. |
| Pasos hasta convertir | No evaluable | Requiere ver el flujo post-CTA. |
| Mobile-friendliness básico | 8/10 | Viewport meta tag presente. Layout y espaciado sugieren diseño responsive; no se confirmó el render real en mobile. |

### SEO on-page
| Criterio | Puntaje | Hallazgo |
|---|---|---|
| Title tag | 4/10 | Solo dice "Diffr" — sin keyword ni beneficio. Desaprovecha espacio de ranking. |
| Meta description | 7/10 | Presente y con keywords relevantes ("ofertas reales", "match", "CV", "IA"), pero corta (~72 caracteres vs. ~155-160 disponibles). |
| H1 único | 9/10 | Confirmado: un solo `<h1>` en todo el DOM ("Encuentra tu próximo trabajo con IA"), coherente con el title. |
| Alt text | No aplica | Cero tags `<img>` en el DOM — la página usa iconos SVG/inline, no imágenes tradicionales. No es un defecto. |
| Señales de performance | 6/10 | Según PageSpeed Insights (dato del usuario, mobile): 61/100 de Rendimiento. La llamada propia a la API pegó con rate-limit (429, cuota pública sin key) — dato tomado del reporte que ya había corrido el usuario. Confirma el diagnóstico cualitativo: rendimiento mediocre, consistente con ser una SPA sin prerender. |
| Structured data | 2/10 | Confirmado: no hay JSON-LD en el `<head>` del DOM renderizado. Cero rich snippets posibles hoy. |

**Hallazgo adicional (fuera de la rúbrica original, agregado a `scoring-criteria.md`):** el atributo
`lang` del `<html>` está en `"en"` pero todo el contenido visible está en español. Esto afecta
accesibilidad (lectores de pantalla pronuncian mal) y puede confundir a buscadores sobre el idioma
real de la página. Falla técnica simple, corrección de minutos. *Impacto: Medio, esfuerzo: mínimo.*

## Reporte narrativo

### Copywriting y persuasión
La propuesta de valor está resuelta con claridad: "Encuentra tu próximo trabajo con IA" combinado
con el subheading "Tu asistente inteligente para buscar empleo, mejorar tu CV, practicar
entrevistas y cerrar brechas de habilidades" comunica en segundos qué hace el producto y para
quién.

Con la página completa a la vista, la jerarquía del mensaje es más fuerte de lo que parecía desde
el hero solo: después de la promesa viene una barra de cifras ("12,500+ Trabajos · 3,400+
Colocaciones · 25 Universidades · 87% Match rate"), después el "cómo funciona" en 4 pasos, y
después una tabla comparativa "Diffr vs. Búsqueda tradicional" que convierte objeciones en datos
concretos (3-6 meses vs. 4-8 semanas buscando, 2% vs. 15% de tasa de respuesta, CV genérico vs.
optimizado para ATS). Es una estructura de página de ventas clásica y bien ejecutada, no solo un
hero bonito. *Impacto: ya está bien resuelto, no es una recomendación.*

La prueba social existe y es más fuerte de lo que el hero solo sugería, pero sigue siendo
enteramente cuantitativa — cifras de la propia empresa, sin un nombre, logo de empresa empleadora,
o cita textual de un usuario real que las respalde. Las cifras solas se pueden poner en duda; un
testimonio con nombre y resultado específico ("Conseguí trabajo en 3 semanas — María, Data
Analyst") las hace creíbles. *Impacto: Medio.*

Los CTAs ("Explorar trabajos ahora", "Empezar ahora" repetido al final) son accionables pero
genéricos — ninguno está atado al beneficio específico que promete el H1. Algo como "Ver mis
matches ahora" conectaría más directo con la promesa central. *Impacto: Bajo-Medio.*

### UX y conversión
La jerarquía visual se mantiene consistente en toda la página, no solo en el hero: cada sección
repite el patrón título → contenido de apoyo → refuerzo de CTA, con un CTA final ("Empezar ahora")
que le da una segunda oportunidad de conversión a quien llegó hasta el final sin actuar antes —
un patrón correcto para páginas con contenido largo.

Sigue sin poder evaluarse la fricción real de conversión (cantidad de campos del formulario de
"Registrarse", pasos hasta activar la cuenta), porque ese flujo vive fuera de esta página y no
quedó capturado en el snapshot. *Recomendación: correr una segunda pasada específicamente sobre el
flujo de registro — suele ser donde se pierde más conversión que en el contenido de la landing.*

### SEO on-page
Este es el bloque más débil, y por una razón estructural más que de contenido: la página es una
SPA 100% client-side rendered — el HTML que llega a un crawler que no ejecuta JavaScript
(o lo ejecuta con presupuesto limitado, como pasa con parte del crawl budget de Google en sitios
grandes, y con la mayoría de bots que no son Googlebot) está vacío salvo por los meta tags. Todo
el copy, los headings y el contenido semántico existen solo después de que corre
`index-DFJ6tuSG.js`. *Impacto: Alto.* La solución no es reescribir copy, es técnica: prerender o
SSR (Next.js, Astro, o un servicio de prerendering como Prerender.io) para que el HTML inicial
tenga el contenido real.

El title tag ("Diffr") y la ausencia total de structured data son quick wins baratos: el title no
usa nada del espacio disponible para keyword o beneficio, y no hay ni un `<script type="application/ld+json">`
en el head, lo que deja fuera cualquier posibilidad de rich snippet (rating, FAQ, etc.) en
resultados de búsqueda. *Impacto: Medio-Alto, esfuerzo bajo.*

La meta description sí está bien encaminada — tiene keywords relevantes y es persuasiva — pero
usa menos de la mitad del espacio disponible en el snippet de Google. *Impacto: Bajo.*

Un hallazgo puntual confirmado en el DOM: `<html lang="en">` con contenido 100% en español. Es un
descuido técnico típico de templates en inglés (este sitio corre sobre Lovable) que nadie ajustó
al traducir el copy. *Impacto: Medio, esfuerzo: mínimo — es una línea de código.*

## Top 3 quick wins
1. **Prerender/SSR del contenido crítico.** Es el cambio de mayor impacto en SEO: hoy el sitio
   es efectivamente invisible para cualquier crawler que no ejecute JS. Esfuerzo medio (requiere
   trabajo técnico), pero es la base de todo lo demás en SEO.
2. **Reescribir el title tag** de "Diffr" a algo como "Diffr — Buscá empleo con IA, mejorá tu CV
   y practicá entrevistas". Esfuerzo mínimo, impacto directo en CTR de búsqueda.
3. **Corregir `lang="en"` a `lang="es"`** y agregar structured data básico (Organization/WebSite).
   Ambos son cambios de minutos con impacto directo en accesibilidad y SEO técnico.

## Datos técnicos (PageSpeed Insights)

⚠️ Estos valores son del reporte que el usuario ya había corrido en pagespeed.web.dev — la
llamada propia del skill a la API pegó con `429` (cuota pública saturada, sin API key configurada).

| Métrica | Puntaje (mobile) |
|---|---|
| Rendimiento | 61/100 |
| Accesibilidad | 90/100 |
| Prácticas recomendadas | 100/100 |
| SEO (Lighthouse) | 100/100 |

**Datos de campo (usuarios reales):** no disponibles — normal en un sitio de bajo tráfico como
este, en fase Beta.

*Nota de contradicción aparente:* Lighthouse da 100/100 en SEO propio, pero nuestra rúbrica
puntuó 5.6/10 en el bloque SEO. No es un error — Lighthouse audita señales técnicas básicas
(¿hay title? ¿hay meta description? ¿es crawleable?, todas presentes acá) y no evalúa la calidad
del title/meta description ni la ausencia de structured data con el mismo nivel de detalle que
nuestra rúbrica. Vale aclarar esto en cualquier reporte que combine ambas fuentes, para que no
parezca que se contradicen sin explicación.

*Corrido el 21 ago 2026, dato aportado por el usuario vía pagespeed.web.dev.*
