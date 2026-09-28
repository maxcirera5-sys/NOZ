# NOZ – Rediseño del tema Shopify (Horizon)

Copia de los archivos modificados del tema **"NOZ – Rediseño (borrador)"** (tema sin publicar en `kdtwha-wq.myshopify.com`, duplicado del tema Horizon en vivo). Solo se incluyen los archivos que cambian respecto a Horizon; el resto del tema es el original.

## Archivos

| Archivo | Qué hace |
|---|---|
| `assets/noz-custom.css` | Sistema visual: Titillium Black, botones rectos con destello, marquesina, sección del sobre con beneficios, cómo funciona, ideal para y CTA final. |
| `assets/noz-motion.js` | Botón "Ver dorso" del sobre (funciona sin GSAP) y animaciones ligeras con GSAP + ScrollTrigger: barra de progreso, titulares letra a letra, parallax suave del vídeo, una entrada por bloque y el sobre que se inclina al cruzar la pantalla. Sin secciones fijadas (sin scroll secuestrado). |
| `snippets/stylesheets.liquid` | Carga `noz-custom.css`, GSAP 3.12.5 (cdnjs) y `noz-motion.js`. |
| `templates/index.json` | Portada (patrón "producto + beneficios" de UI/UX Pro Max): hero con vídeo → marquesina → sobre + 3 beneficios → cómo funciona (+ ingredientes y precauciones) → ideal para → CTA. |
| `templates/product.json` | Ficha de producto traducida y con campos legibles. |
| `config/settings_data.json` | Tipografías Titillium, botones y campos de formulario legibles sobre fondo negro. |
| `sections/header-group.json` | Barra de anuncios lima, header transparente sobre el vídeo. |
| `sections/footer-group.json` | Pie en español, newsletter, Instagram @noz.balance. |
| `media/` | Frente y dorso del sobre (renderizados de `Packaging.pdf`), foto de la tira y `icons/` con los 10 iconos del packaging recortados del PDF con fondo transparente. Todos están en *Contenido → Archivos* de Shopify; la portada los carga con su URL del CDN. |

## Accesibilidad y rendimiento

- Sin JavaScript o si GSAP no carga, todo el contenido se ve completo (sin movimiento).
- Horizon hace scroll dentro de `.page-wrapper` en escritorio (≥ 990px) y en la ventana en móvil: las apariciones usan `IntersectionObserver` y los efectos con scrub usan ScrollTrigger con el contenedor que realmente se desplaza.
- Con `prefers-reduced-motion: reduce` se desactivan las animaciones.
- El hero se queda fijo (`position: sticky`, sin JS) y el resto de la página sube por encima; al bajar, el vídeo se acerca y se oscurece para que el paso sea continuo. Ninguna otra sección se fija.
- Estilos acotados a `.noz-*`, al hero y a los botones de compra: no alteran carrito, filtros ni otras plantillas.
- Imágenes servidas con URL absoluta del CDN de Shopify (no dependen de `file_url`).
- El sobre se puede girar con un botón accesible (`aria-pressed`).

## Cómo aplicarlo

Los archivos ya están en el tema borrador. Para revisarlo: *Tienda online → Temas → NOZ – Rediseño (borrador) → Vista previa*. Publicar el tema se hace desde el admin de Shopify.

Para restaurarlo en otro tema Horizon, sube estos archivos con Shopify CLI (`shopify theme push --only ...`) o el editor de código del tema.
