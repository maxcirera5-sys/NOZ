# NOZ — Shopify Landing Page

**RESPIRA MEJOR. RINDE MÁS.**

A complete, conversion‑focused landing page for the NOZ performance nasal‑strip brand,
built as **reusable Shopify Online Store 2.0 sections** in Liquid + HTML + CSS + vanilla JS.
No frameworks, no external JS/CSS libraries. Compatible with the **Prestige** theme (and any OS 2.0 theme).

Luxury performance aesthetic inspired by WHOOP · Oura · Eight Sleep · Apple · Gymshark —
black background, lime‑green accent (`#C6F000`), white typography, mobile‑first.

---

## 📁 What's included

```
sections/
  noz-hero.liquid            01 · Hero (animated airflow background)
  noz-problem.liquid         02 · Problem (airflow comparison visual)
  noz-how-it-works.liquid    03 · How it works (cards → swipe on mobile)
  noz-benefits.liquid        04 · Benefits (4 cards)
  noz-why-breathing.liquid   05 · Why breathing matters (infographic + count‑up stats)
  noz-who-for.liquid         06 · Who is it for (6 discipline tiles)
  noz-product-reveal.liquid  07 · Product reveal (specs + image)
  noz-email-capture.liquid   08 · Email capture (Shopify native or external)
  noz-faq.liquid             09 · FAQ (accordion)
  noz-footer.liquid          10 · Footer (brand marquee + social + newsletter)

snippets/
  noz-head.liquid            Shared fonts + CSS/JS loader (rendered by every section)
  noz-icon.liquid            Line‑style SVG icon system (currentColor)

assets/
  noz-base.css               Design tokens, typography, 3D package & shared components
  noz.js                     Reveal · carousels · accordions · count‑up · forms ·
                             3D package · card tilt · magnetic buttons · spotlight
  noz-pack-front.jpg         NOZ pouch — front face (for the 3D packaging)
  noz-pack-back.jpg          NOZ pouch — back face (for the 3D packaging)

templates/
  page.noz-landing.json      Ready‑made page that assembles all 10 sections in order
```

Every section is **self‑contained and scoped** to its own `#shopify-section-{id}`, so it never
collides with the theme and can be dropped in individually or all together.

---

## 🚀 Install

### Option A — Full landing page (fastest)
1. In your theme, copy the files into the matching folders (`sections/`, `snippets/`, `assets/`, `templates/`).
   - Via **Shopify admin → Online Store → Themes → ⋯ → Edit code**, or with the **Shopify CLI** (`shopify theme push`).
2. Go to **Online Store → Pages → Add page**, and under **Theme template** choose **`noz-landing`**.
3. Open **Customize** on that page to edit every text, color, image and block in the Theme Editor.

### Option B — Section by section
1. Add `snippets/noz-head.liquid`, `snippets/noz-icon.liquid`, `assets/noz-base.css`, `assets/noz.js`
   and the section files you want to your theme.
2. In the **Theme Customizer**, click **Add section** and pick any **NOZ · …** section.
   Each ships with a preset full of default Spanish copy, so it looks finished immediately.

### Option C — Paste into a single custom section
Each `sections/*.liquid` file is complete on its own (markup + scoped styles + schema).
Paste one into a new custom section file. It only needs the two shared snippets and two assets
above to exist in the theme (they load automatically via `{% render 'noz-head' %}`).

> The shared JS is idempotent and re‑initialises on `shopify:section:load`, so sections work
> correctly when added, removed or reordered live in the Theme Editor.

---

## 🎨 Editing in the Theme Customizer

Everything is editable — no code needed:

- **Text**: headlines, sub‑copy, eyebrows, buttons, FAQ, footer.
- **Colors**: each section has its own **Accent** and **Background** color pickers (default `#C6F000` / `#080808`).
- **Images**: hero, product and discipline tiles accept uploads; when empty, elegant animated/gradient fallbacks show.
- **Blocks**: add / remove / reorder benefits, steps, stats, disciplines, specs, FAQs and footer columns.
- **Product** (section 07) can be linked to a real Shopify product to pull its image and price, or left as a teaser.

---

## ✉️ Email capture

Section 08 and the footer newsletter default to the **native Shopify customer form**
(`{% form 'customer' %}`) and tag subscribers `newsletter, noz-launch` — no setup required;
emails appear under **Customers**.

To use **Klaviyo / Mailchimp / etc.** instead: in section 08 untick *"Usar formulario de Shopify"*
and paste your provider's endpoint into *"URL de envío externa"*.

---

## 🔄 3D rotating packaging (section 07)

The Product Reveal section renders the **NOZ pouch as a real 3D object** that
auto‑rotates and can be **dragged to spin** (with momentum). It's built with pure
CSS 3D transforms + one small vanilla‑JS driver — no Three.js, no libraries.

- Front/back faces ship pre‑cropped from the brand photography (`assets/noz-pack-*.jpg`)
  and can be replaced in the Customizer (*"Cara frontal / trasera del packaging"*).
- **Velocidad de giro** slider controls auto‑rotation speed (set 0 to spin only on drag).
- Side gussets + soft floor shadow + accent glow give it real depth.
- Toggle off (*"Mostrar packaging 3D giratorio"*) to fall back to a flat product image.
- Respects `prefers-reduced-motion` (no auto‑spin; drag still works).

## ✨ Premium UX interactions

Added throughout, all vanilla JS and mobile‑safe:

- **Card 3D tilt** on Benefits and How‑it‑works cards (pointer‑reactive).
- **Magnetic buttons** on primary CTAs.
- **Pointer spotlight** that follows the cursor across the hero.
- **Scroll‑reveal** with staggered delays + a safety net that never leaves content hidden.
- **Count‑up** stats, **marquee**, button **sheen sweep**, smooth in‑page anchors.
- Touch/`hover:none` devices and reduced‑motion users automatically get the calm version.

## ⚙️ Performance, SEO & accessibility

- Pure CSS/SVG animations; **all motion respects `prefers-reduced-motion`**.
- Images use Shopify `image_tag` with responsive `widths`/`sizes` and lazy loading (hero is eager).
- Semantic headings, `aria` on accordions/carousels/forms, visible focus states, AA contrast.
- Font loading is controllable with two optional theme settings (add to
  `config/settings_schema.json`): `noz_disable_local_fonts` (skip the @font-face OTFs)
  and `noz_disable_google_fonts` (skip the Google Fonts fallback).

## 🔤 Fonts (brand: Adobe Source)

Headlines & body use **Source Sans**; technical labels (eyebrows, tags, steps,
stat captions) use **Source Code** — matching the NOZ brandbook.

To use the exact brand OTFs, upload these variable fonts to the theme's **assets** folder:
`SourceSansVariable-Roman.otf`, `SourceSansVariable-Italic.otf`, `SourceCodeVariable-Roman.otf`.
If they're absent, the identical Google webfonts **Source Sans 3** / **Source Code Pro**
load automatically as a pixel‑close fallback — nothing breaks either way.

## 🧩 Brand tokens (from the NOZ brandbook)

| Token | Value |
|---|---|
| Accent (lime) | `#C6F000` |
| Background | `#080808` |
| White | `#FFFFFF` |
| Display / body font | Source Sans (900 / 400‑700) |
| Technical labels | Source Code Pro (600) |

Adjust globally in `assets/noz-base.css` (`:root`) or per‑section in the Customizer.
