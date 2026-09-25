# Prince George Towing

A custom React/Vite towing-company website with an orange-and-cobalt hero, a clear company introduction, an interactive service showcase, a three-step service guide, a regional coverage selector, searchable roadside questions, and a local request flow. It has three further pages: Services, About Us, and Contact.

## Run

```sh
npm install
npm run dev
```

Preview: `http://localhost:5173`. Services page: `http://localhost:5173/services/`. About Us: `http://localhost:5173/about/`. Contact: `http://localhost:5173/contact/`. `npm run build` creates `dist/`; `npm run preview` serves the production build locally.

## Contact setup

Copy `.env.example` to `.env.local` and set `VITE_DISPATCH_PHONE` to the business's confirmed dispatch number. Restart Vite, or rebuild for production, after changing it.

The request flow validates vehicle, location, and contact details, optionally captures device coordinates with permission, and creates an editable summary that the visitor can copy or download. It does not send a request or dispatch a truck. No submission backend is connected. When no number is configured, the summary explicitly identifies the preview state.

Confirm the actual business hours, services, and coverage before publishing. No reviews, service history, certifications, or response-time guarantees have been fabricated. The regional map uses real OpenStreetMap tiles. Its pins identify communities, not business premises or confirmed coverage boundaries.

## Project guide

- Current design direction: [design/COMPANY-REFINEMENT.md](design/COMPANY-REFINEMENT.md)
- New image prompts and paths: [design/redesign-image-prompts.md](design/redesign-image-prompts.md)
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

Generated imagery is art-directed brand material, not documentary photography of the business. Images were created with the built-in image generation tool and optimized with Sharp. All fonts are served locally.

The original content reference was [Payless Auto Towing](https://paylesstowing.ca/). Its broad service categories informed the structure; this site's copy and visual identity are original. Motion uses official GSAP [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) and [matchMedia](<https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/>) APIs.

## Validate

```sh
npm test
npm run build
```

The suite covers desktop Chromium and mobile WebKit. It checks the About page, the Contact page's live local clock, service chooser, request handoff, checklist, and question accordion, plus the service process, interactive services, request validation and downloads, location permission, focus restoration, coverage controls, map loading and retry, navigation, responsive layouts, motion, and axe accessibility.

The Vite multi-page build produces `dist/index.html`, `dist/services/index.html`, `dist/about/index.html`, and `dist/contact/index.html`. A static host can serve all four pages directly, including a browser refresh, without a client-side routing rewrite. Service-category links use `/services/#towing`, `/services/#roadside`, and `/services/#heavy`.
