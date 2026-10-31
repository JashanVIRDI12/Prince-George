// Everything the build adds to the pages for search engines and tracking.
//
// `pages` is the single list of pages on the site. The build entries, the
// canonical URLs, the breadcrumbs and sitemap.xml are all generated from it, so
// adding a page here keeps them in step. All of it is added at build time only:
// local development and the test suite never load the tracking tags.

import { heroImages } from "./src/heroImages.js";

export const SITE_URL = "https://towingprincegeorge.com";

// Google Tag Manager is the only tag on the pages. Analytics, Google Ads and
// call tracking are all configured inside this container.
const GTM_ID = "GTM-TQ9G82SV";

// Business details as they appear on the Google Business Profile. The phone
// number must match the one in src/data.js.
const BUSINESS = {
  name: "Prince George Towing & Recovery Inc.",
  alternateName: "Prince George Towing",
  telephone: "+1-778-281-0200",
  description:
    "Car towing, heavy-duty recovery, heavy equipment transport, offloading services, and roadside assistance in Prince George, BC and surrounding areas.",
  mapsUrl:
    "https://www.google.com/maps/place/PRINCE+GEORGE+TOWING+%26+RECOVERY+INC./@54.1386854,-126.5578556,5z/data=!4m6!3m5!1s0x6d071a1b8a2ce27f:0xfc20f614a90feafe!8m2!3d54.1386854!4d-126.5578556!16s%2Fg%2F11zz8603cm",
};

// `key` also selects the page's hero image in src/heroImages.js, which is
// preloaded so it can download while the script loads. `trail` lists the
// parent pages, in order. `share` replaces the hero image on social platforms;
// the homepage shares a crop of its new reference-based hero photograph.
export const pages = [
  { key: "home", entry: "index.html", path: "/", name: "Home", business: true, share: "/images/og/home-hero.jpg" },
  { key: "services", entry: "services/index.html", path: "/services/", name: "Services", trail: ["/"], share: "/images/og/services.jpg" },
  { key: "towing", entry: "services/towing/index.html", path: "/services/towing/", name: "Car Towing", trail: ["/", "/services/"], share: "/images/og/services-towing.jpg" },
  { key: "roadside", entry: "services/roadside/index.html", path: "/services/roadside/", name: "Roadside Assistance", trail: ["/", "/services/"], share: "/images/og/services-roadside.jpg" },
  { key: "heavy", entry: "services/heavy/index.html", path: "/services/heavy/", name: "Heavy-Duty & Bus Towing", trail: ["/", "/services/"], share: "/images/og/services-heavy.jpg" },
  { key: "equipment", entry: "services/equipment/index.html", path: "/services/equipment/", name: "Heavy Equipment Transport", trail: ["/", "/services/"], share: "/images/og/services-equipment.jpg" },
  { key: "offloading", entry: "services/offloading/index.html", path: "/services/offloading/", name: "Offloading Services", trail: ["/", "/services/"], share: "/images/og/services-offloading.jpg" },
  { key: "about", entry: "about/index.html", path: "/about/", name: "About Us", trail: ["/"], share: "/images/og/about.jpg" },
  { key: "contact", entry: "contact/index.html", path: "/contact/", name: "Contact", trail: ["/"], business: true, share: "/images/og/contact.jpg" },
];

const url = (path) => `${SITE_URL}${path}`;
const jsonLd = (data) =>
  `<script type="application/ld+json">${JSON.stringify(data)}</script>`;

// Google Tag Manager, as high in <head> as possible. Only the character
// encoding goes above it, because browsers must find that within the first
// 1024 bytes of the page.
const HEAD_TOP = `<meta charset="UTF-8" />
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${GTM_ID}');</script>
    <!-- End Google Tag Manager -->`;

// Immediately after the opening <body> tag.
const BODY_TOP = `<!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->`;

const businessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "AutomotiveBusiness",
  "@id": `${SITE_URL}/#business`,
  name: BUSINESS.name,
  alternateName: BUSINESS.alternateName,
  description: BUSINESS.description,
  url: url("/"),
  telephone: BUSINESS.telephone,
  image: url("/images/og/fleet-heavy-wrecker.jpg"),
  logo: url("/images/brand-header.png"),
  // A service-area business: the listing shows no street address.
  address: {
    "@type": "PostalAddress",
    addressLocality: "Prince George",
    addressRegion: "BC",
    addressCountry: "CA",
  },
  areaServed: [
    { "@type": "City", name: "Prince George, BC" },
    { "@type": "Place", name: "Highway 16 West toward Vanderhoof" },
    { "@type": "Place", name: "Highway 97 North" },
    { "@type": "Place", name: "Highway 97 South toward Quesnel" },
  ],
  hasMap: BUSINESS.mapsUrl,
  sameAs: [BUSINESS.mapsUrl],
});

const breadcrumbSchema = (page) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [...page.trail, page.path].map((path, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: pages.find((item) => item.path === path).name,
    item: url(path),
  })),
});

// Social platforms do not all accept WebP, so each page shares a 1200x630 JPG
// of its hero image from public/images/og/, or the page's own `share` image.
const shareImage = (page) =>
  url(
    page.share ??
      heroImages[page.key].src
        .replace("/images/", "/images/og/")
        .replace(".webp", ".jpg"),
  );

const heroPreload = ({ src, srcSet, sizes }) =>
  `<link rel="preload" as="image" href="${src}" imagesrcset="${srcSet}" imagesizes="${sizes}" fetchpriority="high" />`;

const headEnd = (page) =>
  [
    `<link rel="canonical" href="${url(page.path)}" />`,
    `<meta property="og:url" content="${url(page.path)}" />`,
    `<meta property="og:site_name" content="${BUSINESS.alternateName}" />`,
    `<meta property="og:locale" content="en_CA" />`,
    `<meta property="og:image" content="${shareImage(page)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:image" content="${shareImage(page)}" />`,
    heroPreload(heroImages[page.key]),
    page.business && jsonLd(businessSchema()),
    page.trail && jsonLd(breadcrumbSchema(page)),
  ]
    .filter(Boolean)
    .join("\n    ");

const sitemap = () => {
  const today = new Date().toISOString().slice(0, 10);
  const entries = pages
    .map(
      (page) =>
        `  <url>\n    <loc>${url(page.path)}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
};

export function seo() {
  return {
    name: "seo",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        const page = pages.find((item) => `/${item.entry}` === ctx.path);
        if (!page) throw new Error(`seo.config.js has no page for ${ctx.path}`);
        const result = html
          .replace(/\s*<meta charset="UTF-8" \/>/, "")
          .replace(/\s*<meta\s+property="og:image"\s+content="[^"]*"\s*\/>/, "")
          .replace("<head>", `<head>\n    ${HEAD_TOP}`)
          .replace(/<body([^>]*)>/, `<body$1>\n    ${BODY_TOP}`)
          .replace("</head>", `  ${headEnd(page)}\n  </head>`);
        // A page whose markup no longer matches would lose its tags silently.
        const expected = {
          "the Google Tag Manager script": `'${GTM_ID}');</script>`,
          "the Google Tag Manager noscript": `ns.html?id=${GTM_ID}`,
          "the canonical link": `<link rel="canonical" href="${url(page.path)}" />`,
        };
        for (const [label, text] of Object.entries(expected)) {
          if (result.split(text).length !== 2)
            throw new Error(`${page.entry} should contain ${label} exactly once`);
        }
        return result;
      },
    },
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "sitemap.xml", source: sitemap() });
    },
  };
}
