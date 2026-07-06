---
name: testing-3d-gallery
description: Test the Sketchtravel 3D product gallery (Vite + Three.js) end-to-end. Use when verifying the 3D viewer, product navigation, or gallery UI in sketchtravel-3d-gallery.
---

# Testing the Sketchtravel 3D Gallery

A Vite + Three.js app in `sketchtravel-3d-gallery/` that shows 5 line-art products; each opens a 3D card you drag to rotate 360° and scroll to zoom.

## Run locally
```bash
cd sketchtravel-3d-gallery && npm install && npm run dev   # http://localhost:5173
npm run build   # production build sanity check
```
No backend, no secrets, no auth required — purely static frontend.

## Devin Secrets Needed
None.

## Primary end-to-end flow (browser)
1. Load `http://localhost:5173` → gallery grid shows all 5 cards (Nón Lá, Cổng Trời, Cầu Vàng, Tượng Bác Hồ, Vịnh Ninh Vân). The 5th is below the fold — scroll down.
2. Click a card → full-screen `#viewer` overlay with a Three.js canvas.
3. **Drag horizontally across the canvas** to rotate. Key assertion: dragging ~180° reveals a **distinct back face** (navy panel: "ARTISTIC VISION / Sketchtravel / <title>"). This is the strongest proof it's a real 3D object, not a CSS tilt — a static 2D image cannot show a back face or the gold side edge.
4. Scroll wheel over canvas → card grows/shrinks (camera dolly, clamped by min/maxDistance).
5. `›`/`‹` buttons switch product; title, description AND 3D artwork must update **together**.
6. `Bộ sưu tập` back button → returns to grid.

## Tips / gotchas
- Auto-rotate is ON by default and stops the moment you start dragging (`controls.addEventListener("start", ...)`). To get a controlled pose, drag once then screenshot.
- The card can stop **edge-on** after a drag, which makes zoom hard to judge visually. Drag slightly to face the front before demonstrating zoom.
- Front image uses `MeshStandardMaterial` under bright lighting, so images with large light areas (e.g. Cầu Vàng's topo pattern) look washed-out; line-art on dark backgrounds renders crisply. This is aesthetic, not a functional bug — might be tunable via lighting/material if richer navy is wanted.
- Rapid next/prev is guarded by a `loadGeneration` counter in `loadProduct` (src/main.js) so a slow earlier texture load can't overwrite a newer product. When testing navigation, this consistency (artwork matches title) is the thing to confirm.
- Products/data live in `src/products.js`; images in `public/products/`.
