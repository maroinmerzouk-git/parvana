# Parvana

Editorial website for **Parvana** — Afghan & Central Asian cuisine in Nantes, France.

> *Tradition · Création · Saveur*

## About

Static marketing site built with vanilla HTML/CSS and React (UMD + Babel standalone). No build step — open `index.html` and it runs.

Aesthetic: editorial / Persian-poetry feel. Lapis-lazuli indigo, warm cream, saffron gold, pomegranate red — drawn from Afghan textiles. Type pairing: Cormorant Garamond italic + Manrope + Vazirmatn (Persian).

## Sections

- **Hero** — full-bleed lapis with the *Parvana* wordmark, butterfly silhouette, address & hours
- **Histoire** — origin of the name (papillon / literary heroine)
- **Carte** — interactive dish list with filters and live detail panel
- **Le lieu** — quote and gallery
- **Brunch** + **Traiteur**
- **Visiter** — map, hours, sticky reservation form

## Run locally

```bash
python3 -m http.server 8000
# or
npx serve .
```

Then open http://localhost:8000.

## Deploy

Deployed on Vercel as a static site (no build configuration needed).
