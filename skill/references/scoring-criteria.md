# Rúbrica de puntaje

Escala 1-10 por sub-criterio. Nunca dar un número sin la razón concreta detrás.

- **9-10**: Best-in-class, sin fricción ni ambigüedad.
- **7-8**: Sólido, con 1-2 mejoras menores posibles.
- **5-6**: Funcional pero con fricción o vaguedad clara.
- **3-4**: Débil, probablemente está costando conversiones.
- **1-2**: Ausente o activamente contraproducente.

## Bloque 1: Copywriting y persuasión

| Sub-criterio | Qué evaluar |
|---|---|
| Propuesta de valor | ¿Se entiende en menos de 5 segundos qué se ofrece y para quién? ¿Está en el H1/hero o hay que buscarla? |
| Jerarquía del mensaje | ¿El copy sigue un orden lógico (problema → solución → prueba → acción) o es una lista plana de features? |
| Fuerza del CTA | ¿El texto del botón es específico y orientado a beneficio ("Empezá gratis") o genérico ("Enviar", "Click aquí")? ¿Hay un solo CTA principal claro o compiten varios? |
| Prueba social | ¿Hay testimonios, logos, cifras, reviews? ¿Son específicos (nombre, cargo, resultado) o genéricos? |
| Manejo de objeciones | ¿La página anticipa dudas obvias (precio, tiempo, garantía, seguridad) o las ignora? |

## Bloque 2: UX y conversión

| Sub-criterio | Qué evaluar |
|---|---|
| Fricción del CTA principal | Cantidad de campos del formulario, cantidad de clics hasta la conversión. Cada campo de más es fricción. |
| Jerarquía visual | Basado en la estructura de headings y orden del HTML: ¿hay un flujo visual claro hacia el CTA, o todo compite por atención? |
| Pasos hasta convertir | ¿Es de un paso (dejar el email) o multi-paso? ¿Está justificado por la complejidad de la oferta? |
| Mobile-friendliness básico | ¿Tiene viewport meta tag? ¿El diseño es responsive por estructura (no se puede ver el render, pero sí inferir de la marca/framework y meta tags)? |

## Bloque 3: SEO on-page

| Sub-criterio | Qué evaluar |
|---|---|
| Title tag | ¿Existe, es único, describe la página, tiene largo razonable (~50-60 caracteres)? |
| Meta description | ¿Existe, es persuasiva, largo razonable (~150-160 caracteres)? |
| H1 único | ¿Hay exactamente un H1? ¿Es coherente con el title? |
| Alt text | ¿Las imágenes relevantes tienen alt text descriptivo? |
| Señales de performance | Peso aproximado de la página, cantidad de requests si es detectable, uso de lazy loading. **Si hay datos de PageSpeed Insights disponibles, usar el `performance.score` real y citarlo en vez de estimar** (ver `references/pagespeed-integration.md`). |
| Structured data | ¿Hay schema.org / JSON-LD? (Bonus, no crítico para una landing simple). |
| Atributo `lang` | ¿El `<html lang="...">` coincide con el idioma real del contenido? Descuido común en templates/builders (Lovable, etc.) que quedan en inglés por defecto tras traducir el copy. Afecta accesibilidad (lectores de pantalla) y clasificación de idioma en buscadores. |

## Cálculo del puntaje

1. Promedio simple de los sub-criterios de cada bloque → puntaje del bloque (/10).
2. Promedio de los 3 bloques → puntaje global (/10).
3. El puntaje global nunca reemplaza el detalle — siempre mostrar el desglose.
