# Formato del reporte final

Un solo archivo Markdown con esta estructura exacta.

```markdown
# Audit de Landing Page — [nombre/URL]

**Puntaje global: X.X/10**

| Bloque | Puntaje |
|---|---|
| Copywriting y persuasión | X/10 |
| UX y conversión | X/10 |
| SEO on-page | X/10 |

## Checklist

### Copywriting y persuasión
| Criterio | Puntaje | Hallazgo |
|---|---|---|
| Propuesta de valor | X/10 | [una línea] |
| Jerarquía del mensaje | X/10 | [una línea] |
| Fuerza del CTA | X/10 | [una línea] |
| Prueba social | X/10 | [una línea] |
| Manejo de objeciones | X/10 | [una línea] |

### UX y conversión
[misma estructura de tabla]

### SEO on-page
[misma estructura de tabla]

## Reporte narrativo

### Copywriting y persuasión
[2-4 párrafos, citando copy real de la página entre comillas, con recomendaciones marcadas
como Impacto: Alto/Medio/Bajo]

### UX y conversión
[ídem]

### SEO on-page
[ídem]

## Top 3 quick wins
1. [cambio de mayor impacto / menor esfuerzo]
2. [...]
3. [...]

## Datos técnicos (PageSpeed Insights)

*Sección opcional — incluir solo si la API respondió. Si no, omitir esta sección entera, no
dejarla con placeholders vacíos.*

| Métrica | Puntaje (mobile) |
|---|---|
| Rendimiento | X/100 |
| Accesibilidad | X/100 |
| Prácticas recomendadas | X/100 |
| SEO (Lighthouse) | X/100 |

**Core Web Vitals (datos de laboratorio):** LCP [valor], CLS [valor], TBT [valor].

**Datos de campo (usuarios reales):** [presente / no disponible — normal en sitios de bajo tráfico].

*Corrido el [fecha] vía PageSpeed Insights API.*
```

Reglas del reporte:
- Cada hallazgo debe poder trazarse a algo concreto de la página (una cita, un dato estructural),
  nunca una opinión sin evidencia.
- Las recomendaciones son accionables: no "mejorar el copy", sino qué cambiar y por qué.
- El tono es directo y analítico, sin relleno ni elogios vacíos — consistente con la voz de marca
  del usuario.
