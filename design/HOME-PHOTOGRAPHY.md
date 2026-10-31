# Homepage photography — October 20, 2026

The homepage uses six new illustrative photographs created with the built-in `image_gen` tool, presented as seven assets: five service scenes, a truck portrait, and a wide hero crop of that portrait. All use the three supplied photos of the actual truck and the supplied logo as references. The white Kenworth cab, burgundy paint, three axles, recovery equipment, original side graphics, unit 568, and truck dispatch number guide the vehicle identity. The logo informs the navy/orange accents; its printed phone number is not used in these images.

The visual direction is northern spruce forest, natural late-afternoon light, neutral white paint, burgundy equipment, navy shadows, and restrained amber highlights. These are generated marketing scenes, rather than documentary photographs of completed jobs. The on-page illustration labels were removed at the user's request; provenance remains recorded here.

| Source in `design/source-images/home/` | Responsive assets in `public/images/home/` | Placement |
| --- | --- | --- |
| `hero.png` (copy of the truck portrait) | `hero*.webp` | Wide hero still, video poster, highway reference |
| `car-towing.png` | `car-towing*.webp` | Car towing, statement, menu, preview reviews |
| `heavy-towing.png` | `heavy-towing*.webp` | Heavy-duty towing, statement, menu, preview reviews |
| `equipment.png` | `equipment*.webp` | Equipment transport, statement, menu |
| `offloading.png` | `offloading*.webp` | Offloading, menu |
| `roadside.png` | `roadside*.webp` | Roadside assistance, menu, preview reviews |
| `wrecker.png` | `wrecker*.webp` | Heavy-duty feature portrait |

The full prompt set and the reference paths are in [home-image-prompts.json](home-image-prompts.json). Each prompt combines the shared vehicle/style specification with its individual scene specification. Source generations remain unmodified in this repository. Two separate hero generation attempts returned output rejection errors; the finished hero uses the successful new portrait and no failed output. No API/CLI fallback was used.

Run `node design/prepare-home-images.mjs` to rebuild the WebP variants and `public/images/og/home-hero.jpg`. The smallest variants are 480px; full sizes are 1600×900 for the hero, 1440×960 for service images, and 1200×1600 for the portrait. Descriptors and intrinsic dimensions live in `src/home/photography.js`. Cards use the full 3:2 scene to keep the vehicles visible.

Homepage photo URLs include an explicit version to retry requests cached while the new files were being prepared. Photos inside the scroll animations load eagerly so native lazy loading cannot leave them blank while their frames move.

The existing road video, supplied logo artwork, original fleet photos, and inner-page photo assets remain available. Homepage changes are local until the updated build is published.

Validation: all 28 homepage Playwright checks passed across desktop Chromium and mobile WebKit, including photo loading and accessibility. After refining the hero photo's animated framing, all four motion/footage checks passed again. The production build passed. All 27 responsive WebP widths, seven source paths, intrinsic image dimensions, and the 1200×630 social crop were checked. Desktop and mobile screenshots are in `artifacts/home-photography/`.
