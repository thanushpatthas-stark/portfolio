# Thanush Puvanesvaran — Industrial & Product Design Portfolio

![Portfolio Preview Banner](Img/portrait-studio.webp)

> Official Industrial & Product Design Portfolio of Thanush Puvanesvaran, undergraduate designer at the Faculty of Innovative Design & Technology (FRIT), Universiti Sultan Zainal Abidin (UniSZA).

## Portfolio

This portfolio showcases physical objects, parametric 3D CAD assemblies, workshop prototypes, and ergonomic systems. Featured projects include:

- **Boat Redang** — maritime craft and material CMF
- **Agomoto Acoustic** — Fusion 360 CAD and acoustic hardware
- **Smart Bento** — modular systems and prototyping
- **Flute Mist** — personal appliance concept and CMF

The website includes an interactive Three.js CAD viewport that loads the real Agomoto B-rep model (`models/agomoto.glb`, tessellated from the original Rhino `.3dm` file) with shaded CMF, B-rep wireframe, clay and exploded-view modes, project case-study drawer, lightbox gallery, responsive navigation, and white/dark theme modes. Images are optimised WebP, motion respects `prefers-reduced-motion`, and the case-study dialogs are keyboard accessible.

## Technology

- HTML5, CSS3, and vanilla JavaScript
- Three.js r128 (CDN) plus a vendored `js/vendor/GLTFLoader.js` for the interactive CAD viewport
- Google Fonts: Space Grotesk, Plus Jakarta Sans, and JetBrains Mono
- HTML5 Canvas and CSS ambient studio effects

## Run locally

Requires [Node.js](https://nodejs.org) 16 or newer. There is nothing to install:

```bash
npm start
```

Then open `http://localhost:3000`. To use another port: `PORT=8080 npm start` (PowerShell: `$env:PORT=8080; npm start`).

The 3D model is loaded with `fetch`, so use the server above rather than double-clicking `index.html` (opened straight from disk, the page shows a static render instead of the live model). On GitHub Pages everything works as-is; all asset paths are relative and lower-case.

## Contact & Industry Inquiries

- **Designer**: Thanush Puvanesvaran
- **Degree**: Bachelor of Industrial Design (Hons), Universiti Sultan Zainal Abidin (UniSZA)
- **Email**: [thanushpatthas@gmail.com](mailto:thanushpatthas@gmail.com)
- **Phone**: [+60 11-3671 2501](tel:+601136712501)
- **LinkedIn**: [Connect on LinkedIn](https://www.linkedin.com/in/thanush-undefined-395b3a311/)
- **Availability**: Open for Industrial Design Internships & Junior Roles

---

*© 2025–2026 Thanush Puvanesvaran. All rights reserved.*
