# Integración con PageSpeed Insights

Datos técnicos objetivos (Lighthouse) que complementan la rúbrica manual. No reemplazan el
análisis de copy/UX — son una fuente distinta, y el reporte los muestra en su propia sección para
no mezclar juicio con medición automática.

## Cómo llamar la API

Endpoint público, sin necesidad de auth para volumen bajo (aunque la cuota compartida sin key se
agota rápido — ver "Manejo de errores" abajo):

```
GET https://www.googleapis.com/pagespeedonline/v5/runPagespeed
    ?url={URL_A_AUDITAR}
    &strategy=mobile
    &category=performance
    &category=accessibility
    &category=seo
    &category=best-practices
```

`strategy` puede ser `mobile` o `desktop` — correr mobile por default (mobile-first indexing), y
ofrecer desktop si el usuario lo pide específicamente.

**Para uso confiable / repetido:** conseguir una API key gratuita en Google Cloud Console
("PageSpeed Insights API" → habilitar → crear credencial) y agregarla como `&key=...`. Sin key,
la cuota compartida entre todos los usuarios de internet se agota fácil (ver caso real abajo).

**Setup recomendado antes de usar este skill en serio (no solo para probarlo una vez):**
1. Entrar a [console.cloud.google.com](https://console.cloud.google.com), crear o elegir un proyecto.
2. Buscar "PageSpeed Insights API" y habilitarla (gratis, sin tarjeta para este uso).
3. "APIs y servicios" → "Credenciales" → "Crear credenciales" → "Clave de API".
4. Restringir la key para que solo sirva para esta API (buena práctica de seguridad).
5. Usar la key como `&key=TU_KEY` en la llamada, o guardarla como variable de entorno.

Sin este setup, el skill sigue funcionando igual — solo que el paso de PageSpeed puede fallar por
cuota, y en ese caso hay que caer al fallback (ver abajo).

## ¿Por qué no sumar otra plataforma (GTmetrix, WebPageTest) por default?

Con API key, PageSpeed Insights ya cubre performance + accesibilidad + best practices + SEO
técnico + Core Web Vitals (lab y campo) en una sola llamada, con cuota de 25,000 requests/día
gratis. Es lo que antes requería correr 3-4 herramientas separadas y sintetizar a mano.

Sumar una segunda plataforma agrega complejidad sin resolver un problema real que la key no
resuelva ya. Se evaluó GTmetrix (cuota gratis muy chica: 5 tests/día) y WebPageTest (cuota
generosa, pero pensado para debugging visual profundo — waterfall, filmstrip, multi-dispositivo).

**Cuándo sí vale la pena agregar WebPageTest:** si en algún audit puntual se necesita el detalle
visual que PSI no da (waterfall de requests, video de carga, testing desde ubicaciones/dispositivos
específicos). No es parte del flujo default — se agrega como paso opcional solo si el usuario lo
pide para un caso específico, no como parte estándar del skill.

## Qué extraer de la respuesta

De `lighthouseResult.categories`:
- `performance.score` (0-1, multiplicar por 100)
- `accessibility.score`
- `seo.score`
- `best-practices.score`

De `lighthouseResult.audits`, los Core Web Vitals más citables:
- `largest-contentful-paint` → `displayValue`
- `cumulative-layout-shift` → `displayValue`
- `total-blocking-time` → `displayValue`

De `loadingExperience` (si existe): datos de campo reales (CrUX) — no siempre están disponibles
para sitios con poco tráfico, en cuyo caso el campo viene vacío o falta. No tratar su ausencia
como un error; solo reportar "sin datos de campo suficientes" (esto es normal en sitios nuevos/bajo
tráfico, es lo que pasó con Diffr — ver `examples/diffr-audit.md`).

## Manejo de errores

**Caso real (Diffr, 21 ago 2026):** el endpoint devolvió `429` (rate limit) en dos intentos
consecutivos, llamando sin API key. Esto es esperable sin key.

- **Si devuelve 429 sin key:** no reintentar más de una vez. Decirle al usuario explícitamente
  que la cuota pública está saturada en este momento y que, para un uso confiable (especialmente
  si el skill se va a publicar y usar seguido), conviene generar una API key gratuita. Mientras
  tanto, seguir el resto del audit con la rúbrica manual — PageSpeed es un complemento, no un
  bloqueante.
- **Si la URL no es alcanzable por Lighthouse** (login, bloqueo geográfico, etc.): reportarlo y
  seguir sin esta sección.
- **Si faltan datos de campo (CrUX):** normal en sitios de bajo tráfico, no es un error — reportar
  solo los datos de laboratorio (Lighthouse) y aclarar que no hay datos de usuarios reales aún.

## Cómo se refleja en el reporte

Sección nueva y separada en `report-format.md`: "Datos técnicos (PageSpeed Insights)". El
sub-criterio "Señales de performance" de la rúbrica de `scoring-criteria.md` debe usar el puntaje
real de `performance.score` cuando esté disponible, en vez de estimarlo cualitativamente — y
citar la fuente ("según PageSpeed Insights, corrida el [fecha]").
