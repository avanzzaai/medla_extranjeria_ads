# MEDLA · Extranjería y Movilidad — landing de ads

Página estática (HTML + CSS + GSAP por CDN). Conversión: reservar y pagar la Asesoría de Extranjería
y Movilidad (60,50 €) en el calendario de HighLevel `EFi4E6KiwLV8sHBysD5x`, incrustado en `#reserva`.

- Local: `python3 -m http.server 4325` dentro de esta carpeta → http://localhost:4325/
- QA con motion real (Chrome headless por CDP): `node tools/qa.mjs 1440` · `375` · `768` · `375 reduce` → capturas en `/tmp/medla-ext-qa`
- Imagen OG: `node tools/og.mjs` (renderiza `tools/og.html` con el servidor arrancado)

## Medición
Cada CTA lleva `data-track`; `main.js` empuja el evento a `dataLayer` (GTM) y, si existe `fbq`,
a Meta: `BookingIntent` (CTAs y tarjetas de situación), `Contact` (WhatsApp), `ViewContent` (calendario).
La compra real la registra HighLevel/Stripe al confirmar la reserva. Falta pegar el GTM / píxel de MEDLA
(con su banner de cookies).

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
