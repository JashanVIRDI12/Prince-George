# Supplied company logo

The source artwork is `public/images/Prince-George-Towing_Logo_12092026.png`. It contains the Prince George Towing mark, service line, and a printed phone number on a white canvas.

Run `node design/prepare-logo.mjs` after replacing the source. The script removes the white canvas while preserving the navy and orange edges, then creates:

- `public/images/brand-header.png` — compact logo for the shared header.
- `public/images/brand-mark.png` — supplied hook mark for the footer directory.
- `public/favicon.png` and `public/apple-touch-icon.png` — browser and home-screen marks from the same source.

The header uses the compact logo; the footer keeps the small hook mark. The oversized footer logo was removed. Click-to-call controls continue to use the configured business phone setting until the printed number is confirmed for calls. The full source is retained without alteration.
