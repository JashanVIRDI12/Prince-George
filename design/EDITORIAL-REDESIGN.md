# Prince George Towing — editorial redesign

## Direction

An independent, northern roadside company presented as a field guide: human details, documentary-style art direction, practical wayfinding, and a deliberate rhythm of paper, ink blue, cobalt, and orange. The approved hero retains its original markup, imagery, typography, layout, and animation. Everything following it uses a new component system.

## Chapters

1. **The people behind the wheel.** An asymmetric manifesto, an original detail photograph presented as a printed field image, and quieter sentence-case typography. Scroll reveals and a rotating wayfinding mark provide movement.
2. **The right kind of help.** A photographic service selector. Keyboard-accessible tabs switch the image, description, included services, and detail dialog. Each dialog opens a request with the appropriate service selected.
3. **The anatomy of a comeback.** A sticky progress dial follows three vertically arranged recovery scenes. A voice waveform, drawn route, and perforated destination ticket make each step distinct. Links allow direct navigation to any step. On phones the guide becomes a compact introduction above the sequence.
4. **Our kind of country.** A full-width aerial forest photograph carries a schematic route overlay. Map points and keyboard-accessible route controls share selection state. Coverage must still be confirmed for the customer's exact location.
5. **Roadside field notes.** Searchable questions with a dedicated answer panel. Filtering updates the answer and includes a useful empty state. On narrow screens, choosing a question scrolls its answer into view.
6. **Your next move.** A cobalt contact chapter with an inline service chooser. The selected service carries into the request form.
7. **A local constant.** A new directory footer and oversized typographic wordmark.

## Typography and motion

The hero's existing Barlow Condensed treatment is retained. New chapters pair local DM Sans with locally hosted Instrument Serif and small monospaced navigation labels. Motion uses GSAP and ScrollTrigger, with responsive cleanup and reduced-motion support. All primary actions remain available with reduced motion enabled.

## Assets

Four new images were created with the built-in image generation tool and optimized as WebP. Full prompts, provenance, original PNG locations, and final asset paths are recorded in [redesign-image-prompts.md](redesign-image-prompts.md). These are creative brand illustrations in a photographic style, not verified photographs of the company's fleet or employees.

## Functionality

The site has no submission server. The request flow validates details, optionally obtains coordinates with permission, and prepares an editable, downloadable or copyable summary. The UI explicitly distinguishes this preview from a submitted request. Set `VITE_DISPATCH_PHONE` to the confirmed business number to enable telephone links.

## Validation

Playwright tests cover Chromium desktop and WebKit mobile, widths from 320 to 1920 pixels, both motion preferences, service selection, request validation and download, geolocation, searchable notes, route selection, keyboard behavior, dialog focus restoration, images, and automated axe accessibility checks. Screenshots of the redesign are in `artifacts/redesign/`.
