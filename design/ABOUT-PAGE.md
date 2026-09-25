# About Us page

The dedicated `/about/` entry has its own title, description, social image, and direct reload support. The page introduces the company through the work it actually does: a roadside flatbed scene leads, followed by a selectable field gallery, the call process, a real map of the highways out of Prince George, and a clear request action.

## Design decision

The old text-only opening made a towing company feel abstract. The replacement gives the truck and operator half the first screen on desktop and the first panel on mobile. Type remains editorial, but cobalt, safety orange, and actual roadside equipment carry the identity. The three gallery scenes are roadside assistance, towing and recovery, and heavy hauling. Their detail text and links come from the same service data used elsewhere on the site, so descriptions stay consistent.

No founding date, staff identity, response time, fleet size, or coverage guarantee was invented. The images are generated brand illustrations, not documentary photographs of the company; image notes are in `ABOUT-IMAGE.md` and `CONTACT-PAGE.md`.

## Interaction and research

- [GSAP SplitText documentation](https://gsap.com/docs/v3/Plugins/SplitText/) describes the v3.13 rewrite, including masked lines, `autoSplit`, `onSplit`, and automatic accessibility labels. The page splits only headline lines and returns the reveal animation from `onSplit`, so line breaks can rebuild when the layout changes.
- [GSAP Flip documentation](https://gsap.com/docs/v3/Plugins/Flip/) describes animating a before/after layout change. The gallery uses it only when a visitor selects a scene; the selected image expands while service details update. All three images and labels remain visible.
- [GSAP matchMedia documentation](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/) guided motion preference handling and cleanup. Reduced-motion users see the same content and can use all controls without animation.
- [Nielsen Norman Group's animation guidance](https://www.nngroup.com/articles/animation-purpose-ux/) emphasizes that motion should explain feedback and state. The page uses a single arrival, one layout response to selection, and a strap that follows the call process.

The gallery uses real buttons with visible labels and `aria-pressed`; selection updates an announced detail area. The road choices are keyboard-operable tabs with arrow, Home, and End navigation. They synchronize with the site's existing Leaflet/OpenStreetMap map, which starts in a regional view, then focuses the selected community. Pins represent communities, not a guaranteed service boundary. The map loads when scrolled into view, retains visible attribution, and has the same tile-error fallback as the homepage. The [OSM tile policy](https://operations.osmfoundation.org/policies/tiles/) governs its public tile use; provider settings and coordinate sources are in `REAL-MAP.md`. The request action opens the existing dialog and restores focus on close.

## Implementation and checks

`src/AboutPage.jsx` and `src/about-page.css` contain the live page. Previous physics and weighted-scroll modules are preserved in `artifacts/about-page/retired-source/` and are no longer imported. The earlier About design is in `artifacts/about-page/before-source/`.

The 16 About-page tests cover desktop Chromium and mobile WebKit: direct entry and navigation, gallery buttons by pointer and keyboard, service detail, four call steps, road tabs synchronized with map pins, request dialog and focus, responsive widths from 320 to 1920 pixels, image loading, axe checks, the SplitText reveal, Flip layout change, and a road deep link. Current gallery and real-tile map screenshots are in `artifacts/about-page/refined/`.
