# Heavy-duty content and fleet imagery

The site now leads with heavy-duty towing for buses, coaches, semi trucks, and commercial fleets. Heavy-duty services appear first in the service navigation, homepage showcase, services index, contact selector, and about gallery. Existing service URLs, Prince George branding, dispatch number, analytics, and verification are retained.

Content reference: [Payless Auto Towing](https://paylesstowing.ca/), reviewed October 14, 2026. The user-provided single-s URL did not resolve; the established reference in this repository uses the double-s address above. The reference informed the service mix and emphasis. Prince George's copy is original; Payless's history, locations, reviews, certifications, and fleet photographs are not reused.

## Supplied fleet photographs

The three originals added to `public_html/` have been copied to:

- `design/source-images/fleet/heavy-wrecker.jpeg` → `public/images/fleet-heavy-wrecker.webp`
- `design/source-images/fleet/recovery-profile.jpeg` → `public/images/fleet-recovery-profile.webp`
- `design/source-images/fleet/heavy-equipment.jpeg` → `public/images/fleet-heavy-equipment.webp`

Each has 960px, 1280px, and 1600px WebP versions and a 1200×630 JPEG share image in `public/images/og/`. The uploaded photographs are unretouched apart from resizing, compression, and social-share crops. The homepage presents the complete truck photograph without color blending.

## Bus scene

Generated with the built-in `image_gen` tool, saved as `design/source-images/bus-coach-recovery.png`, and optimized as `public/images/bus-coach-recovery.webp`. It is a supplementary illustration, not a photograph of Prince George performing a particular recovery. Featured presentations carry an illustrative-image caption or description; alternative text also identifies it as illustrative.

Final prompt:

> Use case: photorealistic-natural. Asset type: supplementary bus and coach towing website photograph, landscape 1536x1024 composition. Primary request: illustrate professional heavy-duty bus towing in northern British Columbia. Scene: a white full-size passenger coach with dark windows being recovered by a white and burgundy heavy-duty Kenworth-style recovery wrecker on a wide paved highway turnout beside conifer forest, soft overcast daylight. The wrecker is in front of the coach with a believable underlift connection to the coach's front axle, front wheels raised slightly, rear wheels on the road, both vehicles facing right. Wide three-quarter side view, entire wrecker and coach in frame, balanced realistic proportions and natural texture. No people, passengers, emergency incident, logos, brand names, text, signage, or watermarks. This is an illustrative marketing image, not a documentary image of a specific business. Emphasize the scale of the coach and heavy recovery equipment. Avoid flatbeds carrying buses, impossible mechanics, distorted wheels, saturated blue trucks, synthetic CGI appearance.

## Validation and delivery

The existing Playwright checks cover navigation, service selectors and modals, direct service pages, image loading, mobile and desktop layouts, animation, tap-to-call links, and accessibility. Content assertions now expect heavy-duty services first. The cPanel export is built from `dist/`; no live-domain upload is performed by the local build.
