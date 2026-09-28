# NOZ – Rediseño del tema Shopify (Horizon)

Copia de los archivos modificados del tema **"NOZ – Rediseño (borrador)"** (tema sin publicar en `kdtwha-wq.myshopify.com`, duplicado del tema Horizon en vivo). Solo se incluyen los archivos que cambian respecto a Horizon; el resto del tema es el original.

## Archivos

| Archivo | Qué hace |
|---|---|
| `assets/noz-custom.css` | Sistema visual: Titillium Black, botones rectos con destello, marquesina, manifiesto, cifras, pasos, CTA final y escena 3D del sobre. |
| `assets/noz-motion.js` | Animaciones con GSAP + ScrollTrigger: barra de progreso, titulares letra a letra, parallax del vídeo, manifiesto que se ilumina, contadores, "Cómo funciona" horizontal (escritorio) y el sobre que gira/enseña el dorso/suelta la tira al hacer scroll. |
| `snippets/stylesheets.liquid` | Carga `noz-custom.css`, GSAP 3.12.5 (cdnjs) y `noz-motion.js`. |
| `templates/index.json` | Portada: hero con vídeo → marquesina → manifiesto → sobre → beneficios → cifras → producto → cómo funciona → ideal para → CTA. |
| `templates/product.json` | Ficha de producto traducida y con campos legibles. |
| `config/settings_data.json` | Tipografías Titillium, botones y campos de formulario legibles sobre fondo negro. |
| `sections/header-group.json` | Barra de anuncios lima, header transparente sobre el vídeo. |
| `sections/footer-group.json` | Pie en español, newsletter, Instagram @noz.balance. |
| `media/` | Frente y dorso del sobre (renderizados de `Packaging.pdf`) y foto de la tira. Ya están subidos a *Contenido → Archivos* en Shopify; la portada los usa desde el CDN. |

## Accesibilidad y rendimiento

- Sin JavaScript o si GSAP no carga, todo el contenido se ve completo (sin movimiento).
- Con `prefers-reduced-motion: reduce` se desactivan las animaciones.
- El "pin" horizontal de "Cómo funciona" solo se activa en escritorio (≥ 990px).

## Cómo aplicarlo

Los archivos ya están en el tema borrador. Para revisarlo: *Tienda online → Temas → NOZ – Rediseño (borrador) → Vista previa*. Publicar el tema se hace desde el admin de Shopify.

Para restaurarlo en otro tema Horizon, sube estos archivos con Shopify CLI (`shopify theme push --only ...`) o el editor de código del tema.
