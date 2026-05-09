# Parvana

Editorial website for **Parvana** — Afghan & Central Asian cuisine in Nantes, France.

> *Tradition · Création · Saveur*

## Stack

- **Next.js** App Router (React 19, server-rendered)
- **next/font** for Cormorant Garamond, Manrope, Vazirmatn
- Plain CSS (no Tailwind) — global styles in `app/globals.css`
- Deployed on **Vercel**

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run build
npm start
```

## Structure

```
app/
  layout.jsx     # root layout, font wiring, <head>
  page.jsx       # composes the page sections
  globals.css    # design tokens + global styles
components/
  primitives.jsx # Reveal, Butterfly, DiamondDivider, Placeholder
  nav.jsx
  hero.jsx
  story.jsx
  menu.jsx
  space.jsx
  brunch.jsx     # Brunch + Traiteur
  visit.jsx      # Visit + Footer
```

## Design

Editorial / Persian-poetry feel. Palette: lapis-lazuli indigo, warm cream, saffron gold, pomegranate red — drawn from Afghan textiles. The placeholder boxes are intentional — drop in real photos as they become available.
