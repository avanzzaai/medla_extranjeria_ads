# MEDLA · Extranjería y Movilidad — landing de ads

Página estática (HTML + CSS + GSAP por CDN). Conversión: reservar y pagar la Asesoría de Extranjería
y Movilidad (60,50 €) en el calendario de HighLevel `EFi4E6KiwLV8sHBysD5x`, incrustado en `#reserva`.

- Local: `python3 -m http.server 4325` dentro de esta carpeta → http://localhost:4325/
- QA con motion real (Chrome headless por CDP): `node tools/qa.mjs 1440` · `375` · `768` · `375 reduce` → capturas en `/tmp/medla-ext-qa`
- Imagen OG: `node tools/og.mjs` (renderiza `tools/og.html` con el servidor arrancado)

## Medición (conversiones por URL)
Todos los botones de la landing pasan por una sub-página, así cada clic se puede medir como visita a una URL
(conversiones personalizadas de Meta o de Google Ads, sin depender de eventos de JS):

| URL | Qué significa | Qué hace |
|---|---|---|
| `/agendar/` | Clic en cualquier botón de agendar | Muestra precio + calendario de pago de GHL |
| `/whatsapp/` | Clic en cualquier botón de WhatsApp | Página de gracias + abre WhatsApp con el mensaje listo (1,5 s) |
| `/gracias/` | Reserva completada (en `/agendar/` o en el calendario de la landing) | Página de agradecimiento |

- La reserva completada se detecta con el aviso que envía el propio widget de GHL
  (`postMessage(["msgsndr-booking-complete", …])`); no hace falta tocar la configuración del calendario.
- Cada enlace añade `origen` (qué botón: `cta_hero`, `wa_cases`, `case_select`…), `motivo` (situación elegida)
  y conserva `utm_*`, `gclid`, `gbraid`, `wbraid`, `fbclid`, `msclkid`, `ttclid` y `caso` (gana el último anuncio).
- Eventos en `dataLayer`: `cta_click`, `agendar_view`, `whatsapp_click`, `reserva_completada`, `gracias_view`,
  `landing_variant`, `faq_open`, `calendar_view`. Con el píxel de Meta instalado: `InitiateCheckout` en /agendar/,
  `Contact` en /whatsapp/ y `ReservaCompletada` (personalizado) al reservar.
- Las tres sub-páginas llevan `noindex`. Falta pegar el GTM / píxel de MEDLA (con su banner de cookies)
  en las cuatro páginas.
- `assets/js/common.js` es compartido; `main.js` es la landing y `pages.js` las sub-páginas.

## Publicación
- Repositorio: https://github.com/avanzzaai/medla_extranjeria_ads (rama `main`).
- Vercel: proyecto `medla-extranjeria-ads` (equipo avanzza-ai) → https://medla-extranjeria-ads.vercel.app/
  Cada push a `main` despliega a producción.
- `.vercelignore` deja fuera `tools/` y los `.md`.
- Si se usa un dominio propio, actualizar `canonical`, `og:url`, `og:image` y el JSON-LD de `index.html`.

## Variantes para anuncios
`?caso=regularizacion | arraigo | nacionalidad | visados | renovacion | recurso` cambia el titular y la
entradilla del hero y preselecciona la situación (detalle y fuentes en `COPY.md`). Se registra en
`dataLayer` como `landing_variant`. El aviso de regularización encima del hero se retira cuando deje de ser
actualidad.
