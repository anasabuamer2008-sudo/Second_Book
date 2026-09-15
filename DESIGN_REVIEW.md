# Design & Theme Redesign Brief

## What This Project Is

A bilingual (Arabic/Hebrew) RTL online bookstore called **Second Book** built with Next.js 16 (App Router), Tailwind CSS v4, TypeScript. It sells used books read by the owner. There is no user registration — it's a single-owner storefront.

---

## Current Design System

### Color Palette (warm "library" theme)

**Light mode:**
| Token              | Value     | Role                         |
| ------------------ | --------- | ---------------------------- |
| `--background`     | `#faf8f4` | Page background (warm cream) |
| `--foreground`     | `#221d18` | Text (dark brown)            |
| `--primary`        | `#a15a1f` | Primary actions (leather)    |
| `--primary-light`  | `#b96e2e` | Hover states                 |
| `--primary-dark`   | `#7f4415` | Active/pressed               |
| `--accent`         | `#d97706` | Badges, highlights (amber)   |
| `--accent-dark`    | `#b45309` | Accent hover                 |
| `--surface`        | `#ffffff` | Cards, panels                |
| `--surface-alt`    | `#f3efe8` | Alternate surfaces           |
| `--border`         | `#e5dfd4` | Borders                      |
| `--text-secondary` | `#6f6a62` | Muted text                   |
| `--success`        | `#15803d` | Success states               |
| `--danger`         | `#dc2626` | Errors, delete               |

**Dark mode:**
| Token              | Value     | Role                         |
| ------------------ | --------- | ---------------------------- |
| `--background`     | `#16130e` | Page background (very dark)  |
| `--foreground`     | `#ede7de` | Text (warm off-white)        |
| `--primary`        | `#d97a2e` | Primary actions              |
| `--primary-light`  | `#e29048` | Hover states                 |
| `--primary-dark`   | `#b45309` | Active/pressed               |
| `--accent`         | `#f59e0b` | Badges, highlights           |
| `--accent-dark`    | `#fbbf24` | Accent hover                 |
| `--surface`        | `#211c15` | Cards, panels                |
| `--surface-alt`    | `#2b251d` | Alternate surfaces           |
| `--border`         | `#393229` | Borders                      |
| `--text-secondary` | `#a69f93` | Muted text                   |

### Fonts

| Role          | Arabic      | Hebrew           |
| ------------- | ----------- | ---------------- |
| Display (h1)  | **Amiri**   | **Frank Ruhl Libre** |
| Body (h2-h3, p) | **Cairo** | **Heebo**        |

Configured via `next/font/google` in `src/app/[lang]/layout.tsx` as CSS variables `--font-display-ar`, `--font-display-he`, `--font-sans-ar`, `--font-sans-he`.

### Dark Mode

- Toggled via a `<script>` in `<head>` that reads `localStorage("secondbook-theme")` and adds `.dark` class to `<html>`.
- Theme toggle button in Navbar (client component `ThemeToggle`).
- `.dark` class selector in `globals.css`.

### 3D Book Effect

CSS-only 3D book rendering in `globals.css` — `.book-modal-*`, `.hero-book` classes. Uses hardcoded brown/spine colors.

### Animations

Defined in `globals.css`: `fadeUp`, `revealUp`, `floatY`, `shimmer` (skeleton), `toastIn/Out`, `card lift`, `heroSpin`, `heroFloat`, `drawerFade`, `marquee`, `goldShimmer`, `heroRing`, `sparkleFloat`. These use semantic token references but some hero decorations use hardcoded amber/gold values.

---

## Files You Must Change

### 1. `src/app/globals.css` — Main design system (REQUIRED)

All CSS custom properties in `:root` and `.dark` blocks, plus `@theme inline` tokens, all hardcoded color values in animations and effects (spine gradient `#2b1a0e`, pages `#f4ead0`, `text-gradient-gold`, skeleton gradient, etc).

### 2. `src/app/[lang]/layout.tsx` — Fonts + theme init script

The font selections (Amiri, Frank Ruhl Libre, Cairo, Heebo) are defined here. The theme init IIFE is also here. Change fonts if the new design calls for different ones.

### 3. `src/lib/config.ts` — Hardcoded delivery/brand constants

Not color-related but review DELIVERY_FEE, FREE_DELIVERY_THRESHOLD, PICKUP_LOCATION values.

### 4. `src/components/layout/Navbar.tsx` — Header/nav styling

Uses Tailwind classes referencing theme tokens (e.g. `bg-background/85`, `text-primary`, `ring-primary/25`, `bg-primary/10`). Review if new tokens need different class values.

### 5. `src/components/layout/Footer.tsx` — Footer styling

### 6. `src/components/ui/BookCard.tsx` — Book card styling

### 7. `src/components/ui/Book3D.tsx` — 3D book cover component

Has hardcoded colors for book spines, covers, pages.

### 8. `src/components/ui/BundleCard.tsx` — Bundle/promo card

### 9. `src/components/ui/ThemeToggle.tsx` — Dark mode toggle icon

### 10. `src/components/ui/CartDrawer.tsx` — Slide-over cart

### 11. `src/components/ui/Toast.tsx` — Toast notification

### 12. `src/components/layout/PrivacyBanner.tsx` — Cookie banner

### 13. `src/components/layout/BackToTop.tsx` — Back to top button

### 14. All page files under `src/app/[lang]/`

Each page (`page.tsx`, `about/page.tsx`, `cart/page.tsx`, `checkout/page.tsx`, `orders/page.tsx`, `privacy/page.tsx`) uses Tailwind color classes referencing the tokens. Review all hardcoded `bg-*`, `text-*`, `border-*`, `ring-*` classes.

### 15. `src/dictionaries/ar.json` and `src/dictionaries/he.json`

If any UI labels change with the new design (e.g. button text, section headings).

### 16. `src/components/email/orderEmail.ts`

Email HTML template with inline styles — hardcoded colors for email client compatibility.

### 17. `public/logo.jpg` and `public/icon.jpg`

Brand assets. Replace if the new theme demands a different logo.

---

## Design Direction (Pick One or Describe Your Own)

The current design is a warm, library/leather-bookstore aesthetic. Below are alternative directions. **Pick one** or describe your own vision and Claude will execute it.

### Option A: Modern Minimalist (Clean Tech)
- Near-white backgrounds (`#fafafa` / `#0a0a0a`)
- Single bold accent color (e.g. electric blue `#2563eb`, or violet `#7c3aed`)
- Neutral grays for everything else
- Sharp edges (no rounded corners or minimal `rounded-md`)
- Sans-serif everywhere (Inter, Geist, or system)
- Subtle shadows, thin borders

### Option B: Earthy Natural (Organic Bookshop)
- Sage greens, terracotta, warm stone
- Rounded, soft shapes
- Organic textures (subtle grain/noise)
- Serif display font (Playfair Display, Lora)
- Muted, desaturated palette

### Option C: Bold & Playful (Kids/Young Adult)
- Saturated primary + secondary (e.g. coral `#ff6b6b` + teal `#20c997`)
- Large rounded corners, pill buttons
- Vibrant gradients
- Fun display font (Fredoka, Quicksand)
- High contrast dark mode

### Option D: Elegant Dark-First
- Dark mode is the default
- Deep navy or charcoal base
- Gold or copper accent (luxury feel)
- Thin serif fonts
- Glass-morphism surfaces

### Option E: Your custom direction
Describe the vibe, colors, and feel you want.

---

## Rules for Claude

1. **Do NOT break functionality.** All features (cart, checkout, orders, i18n, dark mode toggle, email sending) must keep working.
2. **Keep RTL working.** Arabic and Hebrew are both RTL. No layout should break.
3. **Keep dark mode working.** The `.dark` class toggle system must remain. Both light and dark must look good.
4. **Preserve the CSS variable architecture.** All colors must flow through the `:root` / `.dark` / `@theme inline` token system — no hardcoded hex values in Tailwind classes.
5. **Update ALL hardcoded colors.** Check `globals.css` animations, `Book3D.tsx`, `book-modal-*` classes, `text-gradient-gold`, spine gradients, page-edge colors, skeleton shimmer, etc.
6. **Keep accessibility.** WCAG contrast ratios, `:focus-visible`, `prefers-reduced-motion`.
7. **Keep the 3D book effect** but adapt its colors to the new palette.
8. **Run `npm run lint` and `npm run build` after changes** to verify nothing is broken.
9. **Update `CLAUDE.md`** (currently just `@AGENTS.md`) if you need to add design notes.

---

## Quick Start for Claude

```
# Read these first:
src/app/globals.css              — the entire design system
src/app/[lang]/layout.tsx       — fonts + theme init
src/components/layout/Navbar.tsx — navigation styling
src/components/ui/Book3D.tsx    — 3D book effect
src/components/email/orderEmail.ts — email template

# Then change:
1. Pick/confirm the new color palette and font choices
2. Update globals.css (:root, .dark, @theme inline, hardcoded values in animations)
3. Update layout.tsx fonts if changing them
4. Update all components that use hardcoded colors
5. Update email template inline styles
6. Update page files if needed
7. Run: npm run lint && npm run build
```
