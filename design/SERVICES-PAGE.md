# Services page

The `/services/` page presents Prince George Towing as a practical roadside and recovery business. Its image-led service index, three full photographic chapters, and direct help actions make the equipment and type of call clear before the visitor reaches detailed information.

## Design reference and original direction

- [LODISNA Transport & Logistics](https://lodisna.com/) uses large fleet photography and strong type, then names its transport services plainly.
- [Logika / Beyond Logistics](https://www.awwwards.com/sites/logika-beyond-logistics) uses a modular service index and bold typography.
- [Stark Shipping case study](https://solar-digital.com/portfolio/stark-shipping) describes a restrained visual system and responsive service presentation.

This page applies those broad presentation ideas to towing: a real-looking roadside loading image, a three-service index, and one dedicated equipment photo per chapter. The layout, copy, color, and interactions are original to this site.

## Content and interaction

- A full-width roadside scene introduces the service and provides immediate help and service-finder actions.
- A three-card photo index links directly to dedicated towing and recovery, roadside assistance, and heavy-duty hauling pages. The cards use existing detailed job photography.
- Each service chapter shows the relevant photo next to the description, expandable capabilities, preparation information, and a request button that preselects the service.
- A sticky category bar tracks the chapter in view and supports direct chapter links. Each chapter also links to its dedicated page.
- A three-step recovery walkthrough moves a small illustrated truck as visitors choose a step or use its keyboard-accessible slider. The illustration explains the process; it is not live vehicle tracking.
- A keyboard-accessible situation selector changes the recommendation and its photo together.
- FAQ controls and an image-led final contact section complete the page.

The hero asset was generated for this page, kept in `design/source-images/services-roadside-hero.png`, and optimized to `public/images/services-roadside-hero.webp`. Its brief called for an unbranded cobalt flatbed tow truck loading a passenger vehicle at a safe roadside turnout in northern British Columbia, with realistic equipment and restrained color. The other photos were already in the site asset library.

The built-in image generation prompt was:

> Use case: photorealistic-natural  
> Asset type: wide photographic hero image for the Services page of a Prince George, British Columbia towing company website.  
> Primary request: a believable unbranded cobalt blue flatbed tow truck parked on a broad safe gravel turnout beside a northern British Columbia highway, with an orange high-visibility recovery operator preparing to load a dark grey passenger vehicle. Show the equipment and the practical work clearly.  
> Scene/backdrop: spruce forest and low forested hills near Prince George, overcast late afternoon, damp pavement and gravel, no dramatic alpine mountains.  
> Style/medium: natural editorial commercial photography, grounded and realistic, premium but not cinematic fantasy.  
> Composition/framing: landscape 16:9; truck and operator occupy the center and right two-thirds, room for a text crop on the left; human eye-level, three-quarter side view, enough surrounding road context to crop on mobile.  
> Lighting/mood: soft cool daylight with a restrained warm orange safety accent.  
> Color palette: rich cobalt blue truck, orange jacket, dark forest, muted asphalt.  
> Materials/textures: realistic metal deck, tires, straps, wet road, gravel.  
> Constraints: one truck, one passenger vehicle, one worker seen from behind or side, realistic flatbed mechanics, no unsafe traffic position, no brand text, no logo, no watermark, no license plate text, no signage, no collage.

No response-time guarantees, reviews, pricing, or credentials were added. The request dialog is a local preparation flow and has no backend dispatch connection.

## Implementation and verification

`src/ServicesPage.jsx` contains the overview and finder. `src/serviceContent.js` shares service names and capabilities between the overview, navigation, and the three detail pages. `src/ServiceDetailPage.jsx` renders `/services/towing/`, `/services/roadside/`, and `/services/heavy/` with service-specific photography, preparation steps, and questions. The header has a photo-led Services dropdown; the mobile menu offers the same destinations. `src/ServiceMotion.jsx` contains the recovery walkthrough. `src/services-redesign.css` sets the overview direction, and `src/service-detail.css` styles the detail pages. GSAP provides short entrance reveals, hero photo motion, accordion transitions, and finder photo changes on the overview. Reduced-motion users receive immediate state changes and native details behavior.

The Playwright suite covers direct links and reload, service-specific request selections, focus restoration, keyboard controls, image loading, responsive widths, accessibility, and the service photography/navigation relationship. Desktop and mobile review screenshots are in `artifacts/services-redesign/`.
