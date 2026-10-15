# Embrace Luxury — fine jewellery showcase

A multi-page, mobile-first jewellery storefront (frontend only) built with React, Vite, React Router, Framer Motion, GSAP + ScrollTrigger, Lenis and Lottie.

Pages: Home, Shop (search, category tabs, filters, sorting), Product detail, Collections, Maison (brand story), Contact, Wishlist, Checkout (demo — no payment is taken).

## Run locally

```bash
npm install
npm run dev
```

Production build: `npm run build` (output in `dist/`).

## Structure

- `src/pages` — route pages
- `src/components` — shared UI (header, footer, product card, drawers, hero sections)
- `src/data/products.js` — catalogue data
- `src/styles` — design tokens (`base.css`), layout chrome, components, pages
- `public/img` — optimised WebP product cutouts and photos

## Image licensing

The product cutouts in `public/img/p` come from pngimg.com (CC BY-NC 4.0, non-commercial use only). The photos in `public/img/photo` are cropped from a design reference. Replace both with the brand's own photography before any commercial launch.
