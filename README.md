# Prince George Towing

A custom React/Vite website for Prince George Towing, covering car towing, heavy-duty recovery for buses and commercial trucks, heavy equipment transport, offloading services, and roadside assistance. It uses the supplied fleet photographs, an interactive service showcase, a three-step service guide, regional coverage, searchable questions, and tap-to-call contact. Dedicated pages cover Services, Heavy-Duty Towing, Car Towing, Roadside Assistance, Heavy Equipment Transport, Offloading Services, About Us, and Contact.

## Run

```sh
npm install
npm run dev
```

Preview: `http://localhost:5173`. Services page: `http://localhost:5173/services/`. About Us: `http://localhost:5173/about/`. Contact: `http://localhost:5173/contact/`. `npm run build` creates `dist/`; `npm run preview` serves the production build locally.

## Contact setup

Every help action on the site is a tap-to-call link to the dispatch number, 778-281-0200. The number is set in `src/data.js`. To use a different number for a deployment, copy `.env.example` to `.env.local` and set `VITE_DISPATCH_PHONE`, then restart Vite or rebuild. There is no web form and no submission backend.

## Search engines and tracking

The site is published at `https://towingprincegeorge.com`. Everything tied to that address is added when the site is built, from one file, [seo.config.js](seo.config.js):

- Google Tag Manager (`GTM-TQ9G82SV`) at the top of `<head>` and its `noscript` frame at the top of `<body>`. It is the only tag on the pages: Analytics, Google Ads and call tracking are configured inside the container.
- A canonical link, Open Graph and Twitter tags, and a 1200x630 JPG share image for every page.
- Business details (JSON-LD) on the home and contact pages, and breadcrumbs on every inner page.
- `sitemap.xml`, generated from the same page list.

Tag Manager is not loaded by `npm run dev` or the tests, so local work never reports visits. The build fails if it cannot be inserted. Do not paste it into the HTML files as well, or pages will carry two copies.

To add a page, add it to `pages` in `seo.config.js` and give it a hero image in [src/heroImages.js](src/heroImages.js). The build entry, canonical URL, breadcrumb and sitemap entry follow from that.

Files in `public/` are published as they are: `robots.txt`, `404.html`, and `.htaccess`. The `.htaccess` redirects `http` and `www` to `https://towingprincegeorge.com`, turns on compression and caching, and serves `404.html` for missing pages. The Search Console verification tag is in `index.html` and must stay there.

Hero images come in three widths (`-960`, `-1280`, and full size) so phones download a smaller file. When replacing one, regenerate all three from the original in `design/source-images/`.

Confirm the actual business hours, services, and coverage before publishing. No reviews, service history, certifications, or response-time guarantees have been fabricated. The regional map uses real OpenStreetMap tiles. Its pins identify communities, not business premises or confirmed coverage boundaries.

## Project guide

- Current design direction: [design/COMPANY-REFINEMENT.md](design/COMPANY-REFINEMENT.md)
- Current truck imagery and prompts: [design/TRUCK-IMAGERY.md](design/TRUCK-IMAGERY.md)
- Homepage photo redesign and prompts: [design/HOME-PHOTOGRAPHY.md](design/HOME-PHOTOGRAPHY.md)
- Original hero image prompts: [design/image-prompts.md](design/image-prompts.md)
- Original PNG assets: `design/source-images/`
- Optimized WebP assets and local fonts: `public/images/` and `public/fonts/`
- Business and content settings: `src/data.js`
- Preserved hero, navigation, dialogs, and request flow: `src/App.jsx`
- Dedicated services page: `src/ServicesPage.jsx` and `src/services-page.css`
- Services photo story, animated recovery walkthrough, and visual finder: `src/ServiceMotion.jsx` and `src/services-motion.css`
- Services entry and metadata: `services/index.html`
- Services page notes: [design/SERVICES-PAGE.md](design/SERVICES-PAGE.md)
- Dedicated About page: `src/AboutPage.jsx`, `src/about-page.css`, and `about/index.html`
- About page GSAP SplitText reveal, Flip gallery, and real road map: `src/AboutPage.jsx`
- Previous About sources: `artifacts/about-page/before-source/` and `artifacts/about-page/retired-source/`
- Dedicated Contact page: `src/ContactPage.jsx`, `src/contact-page.css`, and `contact/index.html`
- Contact page design and validation: [design/CONTACT-PAGE.md](design/CONTACT-PAGE.md)
- About page design and validation: [design/ABOUT-PAGE.md](design/ABOUT-PAGE.md)
- About photograph and generation prompt: [design/ABOUT-IMAGE.md](design/ABOUT-IMAGE.md)
- New page chapters and footer: `src/Experience.jsx`
- Base and hero styles: `src/styles.css`
- Service, question, contact, and footer layouts: `src/experience.css`
- Company introduction, process, coverage, and shared typography: `src/company.css`
- Real interactive map: `src/CoverageMap.jsx` and `src/coverage-map.css`
- Map setup and coordinate sources: [design/REAL-MAP.md](design/REAL-MAP.md)
- Current desktop and mobile screenshots: `artifacts/company-update/`, `artifacts/about-page/`, and `artifacts/contact-page/`

Photographic sections use the supplied photos of Prince George’s actual white and burgundy recovery truck or illustrative scenes generated from those references. The homepage has a new coordinated photo set inspired by the real vehicle and supplied logo: five service scenes, a heavy-duty portrait, and a wide hero crop. These replace every service card, inline photo, menu thumbnail, preview review photo and hero still. Homepage originals are in `design/source-images/home/`; run `node design/prepare-home-images.mjs` to rebuild its responsive WebP assets and social JPEG. See [the homepage photography notes](design/HOME-PHOTOGRAPHY.md) for paths and the built-in image generation prompts. Inner-page assets and the supplied road footage are retained; their originals and generated PNGs are in `design/source-images/fleet/`, with responsive assets rebuilt by `node design/prepare-fleet-images.mjs`. See [the truck imagery notes](design/TRUCK-IMAGERY.md).

The original content reference was [Payless Auto Towing](https://paylesstowing.ca/). Its heavy-duty towing, bus and semi recovery, long-haul transport, and roadside service categories informed the content; this site's copy and visual identity are original. Motion uses official GSAP [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) and [matchMedia](<https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/>) APIs.

## Validate

```sh
npm test
npm run build
```

The suite covers desktop Chromium and mobile WebKit. It checks the About page, the Contact page's live local clock, service chooser, request handoff, checklist, and question accordion, plus the service process, interactive services, request validation and downloads, location permission, focus restoration, coverage controls, map loading and retry, navigation, responsive layouts, motion, and axe accessibility.

The Vite multi-page build produces nine pages in `dist/`, including `/services/heavy/`, `/services/towing/`, `/services/roadside/`, `/services/equipment/`, and `/services/offloading/`. A static host can serve each page directly, including a browser refresh, without a client-side routing rewrite. Service-category links use `/services/#towing`, `/services/#roadside`, and `/services/#heavy`.

## cPanel upload

`public_html/` contains the current production build. `public_html.zip` packages those files under the `public_html/` directory, ready to extract into the hosting account. The original uploaded JPEGs are preserved locally and in `design/source-images/fleet/`. Uploading this package is separate from building it; local changes do not update the live domain.
