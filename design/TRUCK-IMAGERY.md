# Truck imagery — October 15, 2026

All active photographic sections use the original Prince George recovery truck or a generated scene based on its three supplied photographs. The reference files remain unchanged:

- `design/source-images/fleet/heavy-wrecker.jpeg`
- `design/source-images/fleet/recovery-profile.jpeg`
- `design/source-images/fleet/heavy-equipment.jpeg`

## New assets

Generated with the built-in `image_gen` tool using all three originals as identity references. These are illustrative marketing scenes, not documentary photographs of completed jobs.

| Source in `design/source-images/fleet/` | Website image | Used for |
| --- | --- | --- |
| `fleet-highway.png` | `/images/fleet-highway.webp` | Homepage company introduction |
| `fleet-roadside.png` | `/images/fleet-roadside.webp` | Roadside hero, service cards, selectors, navigation and gallery |
| `fleet-coach.png` | `/images/fleet-coach.webp` | Heavy-duty cards, service detail, selectors, navigation and gallery |
| `fleet-recovery-detail.png` | `/images/fleet-recovery-detail.webp` | Contact closing section |
| `fleet-equipment-transport.png` | `/images/fleet-equipment-transport.webp` | Heavy equipment selector, service page, contact and gallery |
| `fleet-offloading.png` | `/images/fleet-offloading.webp` | Offloading selector, service page, contact and gallery |

Run `node design/prepare-fleet-images.mjs` to regenerate the full-size, 1280px and 960px WebP assets and 1200×630 JPEG share images. Generated originals are 1536×1024. The supplied photographs continue to appear in company, fleet, towing and contact sections.

The supplied homepage footage already uses the correct reference truck design, so its scroll interaction, headline and dispatch closing card are retained. Reduced motion and data saver continue to show the first still. Previous supplementary images are preserved, with no active application references.

## Final prompts

The original four prompts are preserved in [fleet-image-prompts.json](fleet-image-prompts.json). The heavy equipment and offloading prompts are in [additional-service-image-prompts.json](additional-service-image-prompts.json). Both new scenes were generated with the built-in image tool using the three actual truck photos as references. Each includes the truck's exact white/burgundy paint, three-axle proportions, original equipment, navy/orange side lettering and dispatch number, with natural daylight and realistic material texture.

## Delivery

The Vite build and cPanel export are local artifacts. The live domain is updated separately by uploading the export.

Validation: 97 Playwright checks passed across desktop Chromium and mobile WebKit; one desktop-only hover check was skipped on mobile. Both new service pages also passed accessibility checks in desktop and mobile review. The expanded gallery exposed a mobile anchor-scroll interruption; the alignment fix passed five repeated WebKit runs and the complete suite. The production build contains nine pages, both new routes are in the sitemap, and all responsive hero assets exist. New desktop and mobile screenshots are in `artifacts/additional-services/`. The cPanel archive was rebuilt and checked for integrity.
