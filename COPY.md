# COPY — MEDLA · Extranjería y Movilidad (landing de ads)

Revisado el 2 de octubre de 2026. Todo el copy vive en `index.html` (y las variantes de anuncio en
`assets/js/main.js`). Aquí está el **porqué** de cada mensaje y la **fuente** de cada dato.

## 1 · Dónde está la demanda (y por qué el orden de la página)

| # | Servicio | Dato de demanda | Fuente |
|---|---|---|---|
| 1 | **Regularización extraordinaria 2026** | 1.174.978 solicitudes (16 abr – 30 jun 2026). Plazo de resolución: 3 meses con **silencio negativo** → desde el 30/09/2026 todas las solicitudes sin respuesta pueden recurrirse. El permiso concedido dura 1 año y después hay que pasar a un permiso ordinario. | [La Moncloa, balance 2/7/2026](https://www.lamoncloa.gob.es/serviciosdeprensa/notasprensa/inclusion/paginas/2026/020726-balance-regularizacion-extraordinaria.aspx) · [La Moncloa, plazos y requisitos](https://www.lamoncloa.gob.es/serviciosdeprensa/notasprensa/inclusion/paginas/2026/proceso-regularizacion-migratoria.aspx) · [BOE RD 316/2026](https://www.boe.es/buscar/doc.php?id=BOE-A-2026-8284) |
| 2 | **Arraigo** | 221.802 autorizaciones concedidas en 2025; 542.953 personas con arraigo vigente (30/06/2026). Requiere 2 años de permanencia (ausencias ≤ 90 días), salvo el arraigo familiar. | [OPI, flujo de arraigo](https://www.inclusion.gob.es/web/opi/estadisticas/catalogo/flujo_arraigo) · [La Moncloa, 30/9/2026](https://www.lamoncloa.gob.es/serviciosdeprensa/notasprensa/inclusion/Paginas/2026/300926-afiliados-extranjeros-anual.aspx) · RD 1155/2024 |
| 3 | **Nacionalidad** | 295.107 solicitudes en 2025 (récord); 256.393 pendientes a 31/12/2025; 24.910 denegaciones en 2025 frente a ~7.400 en 2023 (×3). | [The Objective, datos de la Subdirección General de Nacionalidad](https://theobjective.com/espana/2026-04-23/justicia-nacionalidad-256000-expedientes-aluvion-solicitudes/) · [Estadísticas de nacionalidad 2025](https://machelindiaz.com/estadisticas-de-nacionalidad-a-31-12-2025-solicitudes-resoluciones-y-pendientes-datos-oficiales/) · [Ministerio de Justicia](https://www.mjusticia.gob.es/es/ciudadania/nacionalidad/estadisticas-datos-basicos) |
| 4 | **Renovaciones y cambios de permiso** | Todo el volumen anterior desemboca aquí: los ~1,17 M de la regularización tendrán que pasar a permiso ordinario al cumplir 1 año; las solicitudes de residencia y trabajo crecieron ~50 % con el nuevo reglamento. | [La Moncloa, 21/11/2025](https://www.lamoncloa.gob.es/serviciosdeprensa/notasprensa/inclusion/paginas/2025/211125-solicitudes-residencia-trabajo.aspx) |
| 5 | **Visados desde fuera** (estudios, nómada digital, no lucrativa) | Menor volumen, mayor ticket; encaja con la oficina de CDMX. Estudiantes de estudios superiores: hasta 30 h/semana de trabajo (RD 1155/2024). Nómada digital: 200 % del SMI ≈ 2.849 €/mes en 2026. No lucrativa: 400 % del IPREM ≈ 2.400 €/mes. | [SMI 2026 (artículo de MEDLA: 17.094 €/año)](https://medla-asesores.com/smi-2026-en-espana-cifras-oficiales-retroactividad-y-como-aplicarlo-sin-errores/) · [Estancia por estudios, nuevo reglamento](https://www.abogadadeextranjeria.es/cambios-para-los-estudiantes-con-el-nuevo-reglamento/) |

Perfil del público (para el tono): en la regularización, Colombia 25,9 %, Marruecos 13,3 %, Venezuela 11,8 %,
Perú 8,8 %, Honduras 4,9 %; el 59 % tiene menos de 34 años. → Español neutro latinoamericano, **tú**, sin
"vosotros", frases cortas, la palabra que usa la gente ("papeles") y cada término técnico explicado
("silencio negativo", "apostillar").

## 2 · Copy por sección

| Sección | Titular | Por qué |
|---|---|---|
| Aviso (encima del hero) | **Regularización 2026:** ¿3 meses sin respuesta? Tu solicitud se considera denegada y puedes recurrir. | Es la urgencia real de este momento (silencio negativo desde el 30/09). Se oculta en las variantes `regularizacion` y `recurso`. **Retirarlo cuando deje de ser noticia** (≈ enero 2027). |
| Hero | Tus papeles en España, *en regla.* | "Papeles" es la palabra del público; la entradilla nombra los 4 servicios de más demanda y la promesa concreta (vía, lo que falta, plazos) en 45 min. |
| Selector | Regularización · Arraigo · Nacionalidad · Visados · Renovación · Recurso | Mismo orden que la demanda. |
| Situaciones | ¿Cuál es tu caso? *Empieza* por aquí. | Regularización primero y en la tarjeta oscura; cada tarjeta lleva un dato verificable (2 años, 221.802, ×3, 30 h, 2.850 €, 2.400 €). |
| Cifras | Nunca hubo tantos expedientes de extranjería en España. *Por eso* cada error cuesta meses. | Sustituye las cifras de marca por datos oficiales con fuente visible; los datos de MEDLA (6+ años, 200+ casos, publicados en su web) pasan a una línea. |
| Cómo funciona | Tres pasos. El primero dura *45 minutos.* | Sin cambios de fondo; "autorización" → "permiso", "legalizar" → "apostillar". |
| Lo que te llevas | Sales de la llamada con un *plan,* no con más dudas. | Se quitó "lo que cuesta el trámite completo" (no confirmado) → "tu siguiente paso". |
| Opiniones | «Los mejores abogados en temas de *extranjería.*» | Reseñas reales de Google, sin cambios. |
| Preguntas | Lo que nos preguntan *antes* de reservar. | Nuevas: regularización sin respuesta, denegación y plazos, reagrupación. Sin "vosotros". |

## 3 · Variantes para anuncios (`?caso=`)

Cada conjunto de anuncios enlaza a su variante; el titular repite la promesa del anuncio y la situación
queda preseleccionada en la tarjeta de precio. Sin parámetro se ve la versión general.

| URL | Titular |
|---|---|
| `/?caso=regularizacion` | Regularización 2026: *aún puedes actuar.* |
| `/?caso=arraigo` | Dos años en España. *Ya toca tener papeles.* |
| `/?caso=nacionalidad` | Tu nacionalidad española, *sin sustos.* |
| `/?caso=visados` | Múdate a España *con el visado correcto.* |
| `/?caso=renovacion` | Renueva tu permiso *antes de que venza.* |
| `/?caso=recurso` | Te lo denegaron. *Todavía hay plazo.* |

## 4 · Cuidados legales del copy
- Nunca se promete aprobación (FAQ explícita).
- Plazos: recurso de reposición 1 mes contra denegación expresa; contra silencio, en cualquier momento;
  contencioso 2 meses. En la regularización se avisa de que a veces conviene esperar.
- Importes de nómada digital y no lucrativa marcados como aproximados ("unos").

## 5 · Por confirmar con MEDLA
- Que acepten casos de **recurso de regularización** y de **paso de la regularización a permiso ordinario**
  (tienen página y artículos de regularización, pero conviene confirmarlo antes de invertir en anuncios).
- Correo `extranjeria@medla-asesores.com` (sale de su página de Extranjería).
