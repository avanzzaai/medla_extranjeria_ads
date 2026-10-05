# MEDLA · Extranjería y Movilidad — landing de ads

## Objetivo
Página de destino para tráfico de anuncios (Meta / Google). Una sola conversión:
**reservar y pagar la Asesoría de Extranjería y Movilidad** (45 min, videollamada, 60,50 € IVA incl.,
descontable del trámite si se contrata en 3 días) en el calendario de pago de HighLevel
(`EFi4E6KiwLV8sHBysD5x`), incrustado en la propia página. Conversión secundaria: WhatsApp
(+34 914 32 14 57). Sin menú de navegación que saque al usuario de la página.

## Dirección
**Arquitectura cord.com** (refero: "deep ocean signal station"): lienzo blanco con mucho aire,
un navy casi negro que lleva toda la voz, **un solo acento** reservado para el botón principal,
estados activos y el logo; titulares "estampados" en peso 800 de una sola familia;
tarjetas con radios de 20–32 px que flotan sobre sombras tintadas de navy (nunca grises);
una única banda oscura de contraste a sangre cerca del final.

Traducción a MEDLA: el navy es el teal-navy real de la marca (`#142D37`) y la "bengala" es el
dorado de MEDLA llevado a una versión más luminosa (`#C9A659`) para que funcione como botón con
texto navy (contraste 6,2:1). Para no perder el tono de despacho, una palabra por titular va en
**DM Serif Display itálica** (la serif de medla-asesores.com): grotesk estampada que informa,
serif que tranquiliza.

**Estructura y motion tomados de Tripvanta** (Framer): hero dentro de una tarjeta con foto y
**fotografías circulares orbitando**, barra de "reserva" pegada al borde inferior del hero
(aquí: selector de situación), marquesina de aliados, tarjetas de destinos (aquí: situaciones
migratorias), contadores, 3 pasos, galería que se amplía con el scroll, carrusel de reseñas,
FAQ y una banda final con fotos inclinadas que salen disparadas del centro.

### Mejoras sobre las referencias
- Tripvanta usa Anton condensada y un gris plano; aquí la jerarquía la lleva el peso 800 con
  tracking negativo + una itálica serif: más "despacho", menos "plantilla de viajes".
- Las tarjetas de destino de Tripvanta son iguales; aquí el grid es un bento 7/5 · 4/4/4 · 12
  con la tarjeta de "denegación" en tinta, porque es la situación con urgencia real (1 mes).
- La barra de reserva de Tripvanta pide fechas que no sirven; aquí la barra pregunta la
  situación y esa elección viaja hasta la tarjeta de precio ("Tu consulta: Arraigo").
- El calendario de pago vive dentro de la landing (cord: "una sola acción, sin chrome").
- Prueba social solo real: reseñas de Google con nombre tal cual aparecen; avatares con
  iniciales (sin fotos de stock haciéndose pasar por clientes).

## Tokens

### Color (claro)
| Token | Valor | Uso |
|---|---|---|
| `--ink` | `#142D37` | Titulares, texto principal, banda oscura |
| `--ink-2` | `#45606B` | Texto secundario (6,7:1 sobre blanco) |
| `--ink-3` | `#5F7882` | Metadatos, etiquetas (4,7:1) |
| `--line` | `#DCE4E6` | Hilos y bordes |
| `--wash` | `#EEF3F3` | Fondos de agrupación, hover |
| `--canvas` | `#FFFFFF` | Lienzo y tarjetas |
| `--accent` | `#C9A659` | Botón principal, estados activos, estrellas (texto navy encima) |

### Color (oscuro, `prefers-color-scheme: dark`)
`--canvas #0B1C23` · `--surface #11262F` · `--ink #EEF2F1` · `--ink-2 #A9BCC2` · `--ink-3 #8CA2A9` ·
`--line #22404B` · `--wash #132C36` · `--accent #D4B46A`.

### Tipografía
- **Figtree** 400 / 600 / 700 / 800 — todo el sistema. Display 800, `letter-spacing -0.035em`.
- **DM Serif Display** itálica — una palabra emocional por titular.
- Escala: h1 `clamp(3rem, 7vw, 7rem)` · h2 `clamp(2.25rem, 4.6vw, 4.25rem)` · h3 `clamp(1.375rem, 1.9vw, 1.75rem)` ·
  lead `clamp(1.125rem, 1.4vw, 1.3125rem)` · body `1.0625rem` · label `0.75rem` 600 mayúsculas `+0.14em`.
- Párrafos `max-width: 62ch`.

### Espacio, forma, sombra
- Escala 4/8: `--s-1 4px` … `--s-12 96px`. Secciones `padding-block: clamp(6rem, 12vw, 14rem)`.
- Contenedor único `--container: 1240px`, gutter `clamp(1rem, 4vw, 2.5rem)`.
- Radios: tarjeta 24 px · contenedor grande 32 px · insignia 6 px · botones/píldoras 999 px.
- Sombras tintadas: `--sh-1 0 4px 12px rgb(20 45 55 / .05)` · `--sh-2 0 12px 48px rgb(20 45 55 / .09)`.

### Motion
- Curvas: `--ease-out cubic-bezier(.22,1,.36,1)` · `--ease-spring cubic-bezier(.32,.72,0,1)`; GSAP `expo.out`, `power3.out`, `back.out(1.6)` solo en las órbitas.
- Duraciones: micro 0.2–0.3 s · entradas 0.7–1.2 s · scroll atado al progreso.

## Inventario de motion
1. **Entrada de página**: cortina navy con el isotipo que sube (`expo.inOut`, 1 s).
2. **Hero** (timeline): la tarjeta crece de 0.92, la foto hace zoom de 1.25 a 1, palabras del h1 suben desde máscara con stagger, órbitas aparecen con `back.out` en orden aleatorio y luego flotan; parallax por cursor en desktop; al hacer scroll las órbitas se abren hacia fuera (scrub).
3. **Marquesina de aliados**: velocidad constante que se acelera con la velocidad del scroll.
4. **Situaciones**: revelado por lotes (`ScrollTrigger.batch`) + parallax interno de cada foto.
5. **Contadores** al entrar en vista.
6. **Cómo funciona**: columna izquierda sticky, línea de progreso con scrub y pasos que se activan.
7. **Zoom de galería** (pin + scrub): la foto central crece hasta cubrir la pantalla, las laterales salen, la cita se ilumina palabra a palabra.
8. **Resumen de consulta**: checklist que se marca en secuencia.
9. **Banda final**: fotos inclinadas que salen del centro (scrub).
10. **Micro**: botón con flecha en círculo que se desplaza, tarjetas que suben 4 px, acordeón con `grid-template-rows`, chips con estado pulsado, barra fija móvil que entra al pasar el hero.
- `gsap.matchMedia()` con `motion` + `reduce` (cobertura total). Con movimiento reducido todo queda visible y estático.

## Secciones y objetivo
| # | Sección | Trabajo de conversión |
|---|---|---|
| 1 | Hero en tarjeta + selector de situación | Promesa concreta, precio visible, CTA |
| 2 | Aliados (marquesina) | Confianza rápida |
| 3 | ¿Cuál es tu caso? (bento) | Autoidentificación → lleva a reserva con motivo |
| 4 | Cifras | Respaldo |
| 5 | Cómo funciona (3 pasos) | Quitar miedo al pago: qué pasa después |
| 6 | Zoom + cita | Emoción |
| 7 | Lo que sales sabiendo | Valor tangible de 45 min |
| 8 | Reseñas de Google | Prueba social real |
| 9 | Reserva (precio + calendario GHL) | **Conversión** |
| 10 | Preguntas | Objeciones (garantías, WhatsApp, documentos, plazos) |
| 11 | Banda oscura final | Último empujón |
