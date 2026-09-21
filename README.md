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
  noz-base.css               Design tokens, typography & shared components
  noz.js                     Reveal‑on‑scroll · carousels · accordions · count‑up · forms

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

## ⚙️ Performance, SEO & accessibility

- Pure CSS/SVG animations; **all motion respects `prefers-reduced-motion`**.
- Images use Shopify `image_tag` with responsive `widths`/`sizes` and lazy loading (hero is eager).
- Semantic headings, `aria` on accordions/carousels/forms, visible focus states, AA contrast.
- Optional font control: add a checkbox setting `noz_disable_fonts` to `config/settings_schema.json`
  to skip the Google Fonts request and fall back to the system stack (Titillium/Inter are the brand fonts).

## 🧩 Brand tokens (from the NOZ brandbook)

| Token | Value |
|---|---|
| Accent (lime) | `#C6F000` |
| Background | `#080808` |
| White | `#FFFFFF` |
| Headline font | Titillium Web (900) |
| Body font | Inter |

Adjust globally in `assets/noz-base.css` (`:root`) or per‑section in the Customizer.
