import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

// Rebuild only homepage assets; never alter the supplied fleet originals.
// Dimensions and responsive descriptors match src/home/photography.js.
const root = new URL("../", import.meta.url);
const output = new URL("public/images/home/", root);
const shots = [
  { name: "hero", width: 1600, height: 900 },
  ...["car-towing", "heavy-towing", "equipment", "offloading", "roadside"].map(
    (name) => ({ name, width: 1440, height: 960 }),
  ),
  { name: "wrecker", width: 1200, height: 1600 },
];

await mkdir(output, { recursive: true });
await mkdir(new URL("public/images/og/", root), { recursive: true });

for (const { name, width, height } of shots) {
  const source = fileURLToPath(new URL(`design/source-images/home/${name}.png`, root));
  const widths = [...new Set([480, 960, Math.min(1280, width), width])];
  // Establish the crop once, then resize it consistently at every breakpoint.
  const master = await sharp(source)
    .rotate()
    .resize(width, height, { fit: "cover", position: "centre" })
    .toBuffer();
  for (const size of widths) {
    const suffix = size === width ? "" : `-${size}`;
    await sharp(master)
      .resize({ width: size })
      .webp({ quality: 84, effort: 6 })
      .toFile(fileURLToPath(new URL(`${name}${suffix}.webp`, output)));
  }
  console.log(`${name}: ${widths.join(", ")}px WebP ready`);
}

await sharp(fileURLToPath(new URL("design/source-images/home/hero.png", root)))
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(fileURLToPath(new URL("public/images/og/home-hero.jpg", root)));
