# Casos borde

## La página bloquea el scraping (Cloudflare, JS-heavy sin SSR)
Este es, en la práctica, el caso MÁS COMÚN, no una excepción — cualquier SPA sin SSR/prerender
(Lovable, Vite/React, apps armadas con builders modernos) va a pegar acá. No inventar contenido.
Decirle al usuario explícitamente que el fetch automático falló.

**Pedir, en este orden de preferencia:**
1. **Un `.mhtml`** ("Guardar como" → "Página web, un solo archivo" en Chrome/Edge, con la página
   ya cargada). Es la mejor opción: captura el DOM completo ya renderizado, con toda la página
   (no solo el above-the-fold), lo que permite evaluar los 3 bloques completos en vez de solo un
   fragmento. Cómo procesarlo: es un MIME multipart. Buscar la parte con
   `Content-Type: text/html` y `Content-Location` igual a la URL de la página, tomar el body
   después del primer `\r\n\r\n`, decodificar con `quopri.decodestring` (viene en
   `Content-Transfer-Encoding: quoted-printable`), y parsear el HTML resultante con BeautifulSoup
   para extraer headings, CTAs (`<a>`/`<button>`), formularios, imágenes/alt text y el texto
   visible completo.
2. **Un screenshot** (idealmente uno del hero y uno o dos más scrolleando) si el usuario no puede
   generar un `.mhtml`. Sirve para UX/jerarquía visual, pero limita el análisis de copy y SEO al
   fragmento visible — dejarlo explícito en el reporte.
3. **HTML pegado a mano o el "Ver código fuente"** — normalmente inútil en una SPA (trae el shell
   vacío, igual que el fetch automático), pero confirmarlo con el usuario si insiste en esta vía.

En cualquiera de los tres casos, marcar en el reporte qué criterios no se pudieron evaluar por
falta de acceso, y con qué método sí se completó el resto.

## Landing page en varios idiomas / selector de idioma
Detectar el idioma en el que carga por defecto y auditar ese. Si el usuario pide auditar una
versión específica (ej. la de francés para DMK Francia), usar esa URL directamente si existe
como URL separada; si es un toggle de JS sin URL propia, avisar que solo se pudo auditar la
versión que cargó el fetch.

## La landing es solo un embed (Typeform, Calendly, un iframe)
Auditar lo que sea visible en el HTML circundante (contexto, copy alrededor del embed, CTA de
entrada) y marcar explícitamente en el reporte que el contenido del embed en sí queda fuera del
alcance del fetch. No puntuar sub-criterios que dependan de contenido inaccesible — omitirlos y
decir por qué, en vez de forzar un número.

## Página muy larga (scroll extenso, múltiples secciones)
Priorizar el above-the-fold y los primeros 2-3 scrolls para el análisis detallado de copy y UX
(es donde se decide la mayoría de la conversión). El resto de la página se resume en 1-2 líneas
por sección sin bajar al mismo nivel de detalle, salvo que el usuario pida lo contrario.

## URL inválida o página caída
Confirmarlo con el usuario antes de asumir cualquier otra cosa. No auditar una versión cacheada
o una suposición de cómo "debería" verse la página.
