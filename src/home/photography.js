// Homepage-only photography, generated from the three original fleet photos
// and the supplied logo. Inner pages retain their existing image sets.
// New URLs also make open tabs retry requests made before the files existed.
const PHOTO_VERSION = "20261020b";
export const homePhotoUrl = (name) => `/images/home/${name}.webp?v=${PHOTO_VERSION}`;

const photo = (name, width, height) => ({
  src: homePhotoUrl(name),
  srcSet: [...new Set([480, 960, Math.min(1280, width), width])]
    .map((size) => `${homePhotoUrl(`${name}${size === width ? "" : `-${size}`}`)} ${size}w`)
    .join(", "),
  width,
  height,
});

export const homePhotography = {
  hero: photo("hero", 1600, 900),
  towing: photo("car-towing", 1440, 960),
  heavy: photo("heavy-towing", 1440, 960),
  equipment: photo("equipment", 1440, 960),
  offloading: photo("offloading", 1440, 960),
  roadside: photo("roadside", 1440, 960),
  wrecker: photo("wrecker", 1200, 1600),
};
