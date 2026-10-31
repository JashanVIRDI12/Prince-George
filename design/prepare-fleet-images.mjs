import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

// Optimize the reference-based scenes without altering the supplied originals.
// Run from any directory: node design/prepare-fleet-images.mjs
const root = new URL("../", import.meta.url);
const assets = ["fleet-highway", "fleet-roadside", "fleet-coach", "fleet-recovery-detail", "fleet-equipment-transport", "fleet-offloading"];
await mkdir(new URL("public/images/og/", root), { recursive: true });

for (const name of assets) {
  const source = fileURLToPath(new URL(`design/source-images/fleet/${name}.png`, root));
  const metadata = await sharp(source).metadata();
  if (metadata.width !== 1536 || metadata.height !== 1024)
    throw new Error(`${name}: update responsive descriptors for ${metadata.width}×${metadata.height}`);
  for (const width of [960, 1280, 1536]) {
    const suffix = width === 1536 ? "" : `-${width}`;
    await sharp(source)
      .resize({ width })
      .webp({ quality: 84, effort: 6 })
      .toFile(fileURLToPath(new URL(`public/images/${name}${suffix}.webp`, root)));
  }
  await sharp(source)
    .resize(1200, 630, { fit: "cover", position: "centre" })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(fileURLToPath(new URL(`public/images/og/${name}.jpg`, root)));
  console.log(`${name}: responsive WebP and social JPEG ready`);
}
