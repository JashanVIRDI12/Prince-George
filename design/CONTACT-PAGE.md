# Contact page

The page lives at `/contact/` with its own static HTML entry. A loaded flatbed and roadside worker establish the business immediately. The hero pairs that image with a direct towing headline and a clear call or request action. A compact dispatch strip holds the configured number and Prince George local time.

## Research direction

- [NN/g on photos as content](https://www.nngroup.com/articles/photos-as-web-content/) finds that relevant images receive attention while decorative imagery is often ignored. The hero shows a vehicle on a flatbed; the service chooser shows work associated with the selected service.
- [NN/g on image-focused design](https://www.nngroup.com/articles/image-focused-design/) recommends balancing a large image with the actions people came to take. The hero keeps the towing action alongside the photo, and the phone link becomes primary when configured.
- [NN/g on visual hierarchy](https://www.nngroup.com/articles/principles-visual-design/) supports one prominent headline and a clear visual order. The orange action has the strongest control treatment; service choices and supporting detail follow below.
- [web.dev on responsive images](https://web.dev/learn/design/responsive-images) recommends prioritizing the important hero image. It loads eagerly with high fetch priority and fixed dimensions. Service and closing images load when needed.

The existing images are generated brand artwork. They illustrate towing situations; they are not presented as documentary photos of the business.

## Flow

1. **Contact.** The hero shows a flatbed recovery scene, names towing directly, and offers a call when `VITE_DISPATCH_PHONE` is configured. The dispatch strip shows the number and real local time. Without a number, it states that this is a preview and offers the existing request builder instead.
2. **Choose help.** Three accessible tabs change both the useful service explanation and a matching work image: battery boost, flatbed securing, or heavy recovery. Arrow keys, Home, and End move between tabs. Each panel opens the site's request builder with the matching service selected.
3. **Prepare.** Four short, numbered prompts cover location, vehicle, situation, and destination. They remain a normal reading sequence at every screen size and motion preference.
4. **Coverage.** A compact area list reuses `areas` from `src/data.js` and links to the interactive map on the home page. Exact coverage is confirmed by the business.
5. **Questions and close.** The FAQ uses one-open-at-a-time buttons with `aria-expanded` and labelled answer regions. The final panel repeats the primary action beside a flatbed loading scene.

The clock uses `Intl.DateTimeFormat` with `America/Vancouver`. Its digits and progress arc reflect the same local time. No location, phone number, availability detail, or response time is invented.

## Validation

`tests/contact.spec.js` covers entry and reload, navigation, the clock, service tabs and request preselection, checklist, FAQ, coverage link, layout from 320 to 1920 pixels, motion, and axe accessibility in desktop Chromium and mobile WebKit. Screenshots are in `artifacts/contact-page/`.
