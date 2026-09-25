# Prince George Towing — company refinement

This is the current design direction, following the editorial redesign. The user requested a simpler, more recognisable towing-company website, specifically rebuilding numbered sections 01, 03, and 04 and removing the curvy type and star ornament.

## What changed

- **01 / Company introduction:** a straight photographic layout, a clear service description, three practical benefits, and direct actions. The service strip opens the relevant service dialog.
- **03 / How it works:** three selectable steps with short explanations and useful checklists. Pointer and keyboard navigation update one compact panel; no sticky dial or long animated scenes.
- **04 / Service areas:** a real OpenStreetMap street map paired with a service-area panel. Pins and tabs share selection state. Selecting an area recentres the map on the relevant community; zoom, drag, reset, and a larger-map link are available. See [REAL-MAP.md](REAL-MAP.md).
- **Shared theme:** bold DM Sans replaces decorative serif accents. The star, rotating image treatment, and contact rings are removed. White, light grey, navy, cobalt, and orange form a restrained business palette. Navigation uses familiar labels.

The original hero imagery, layout, copy, and animations remain. Service, question, contact, and footer layouts are retained with simpler typography. Existing generated images are reused; no additional images were generated for this refinement.

## Interaction and access

GSAP provides short entrance and tab-panel transitions. Reduced-motion users receive the same functionality without motion. Controls have keyboard focus states, arrow-key navigation, and accessible selected states. Service details feed the existing request flow.

## Verification

The browser suite has 28 checks across desktop Chromium and mobile WebKit, including responsive widths from 320 to 1920 pixels, map-pin and tab synchronisation, zoom/reset, tile-failure recovery, step navigation, dialog focus, geolocation, request validation and download, image loading, reduced motion, and automated accessibility. Production output is built with Vite.

Current screenshots are in `artifacts/company-update/`. The request form remains a local preparation flow, not a live dispatch submission; the confirmed dispatch number is configured with `VITE_DISPATCH_PHONE`.
