import { homePhotography } from "./home/photography.js";

// The large image at the top of each page, offered in several widths so phones
// do not download the full-size file. `sizes` describes how wide the image is
// drawn at each screen width and must follow the page's CSS.
//
// The pages spread these onto their <img>, and the build (seo.config.js) uses
// the same values for the preload hint. Both must match or the browser fetches
// two different files.

// The homepage uses the new reference-based forest portrait as its still and
// video poster. The supplied road footage remains the motion version.
export const heroImages = {
  home: {
    ...homePhotography.hero,
    sizes: "100vw",
  },
  // The services page opens on a strip of five photos; the first is preloaded.
  services: { ...homePhotography.towing, sizes: "(max-width: 760px) 70vw, 18vw" },
  // Each service page opens on its own full-width photograph.
  towing: { ...homePhotography.towing, sizes: "100vw" },
  roadside: { ...homePhotography.roadside, sizes: "100vw" },
  heavy: { ...homePhotography.heavy, sizes: "100vw" },
  equipment: { ...homePhotography.equipment, sizes: "100vw" },
  offloading: { ...homePhotography.offloading, sizes: "100vw" },
  about: { ...homePhotography.wrecker, sizes: "(max-width: 900px) 100vw, 40vw" },
  contact: { ...homePhotography.hero, sizes: "(max-width: 900px) 100vw, 45vw" },
};

