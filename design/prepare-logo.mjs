import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(
  projectRoot,
  "public/images/Prince-George-Towing_Logo_12092026.png",
);
const output = resolve(projectRoot, "public/images");
const navy = [4, 35, 86];
const orange = [254, 82, 1];

// The supplied art has two solid ink colors on white. Recover its transparent
// edges from the white matte so it works on the site's cream and gray surfaces.
const { data, info } = await sharp(source)
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const pixels = Buffer.alloc(info.width * info.height * 4);
for (let index = 0; index < info.width * info.height; index += 1) {
  const sourceAt = index * 3;
  const targetAt = index * 4;
  const sample = [data[sourceAt], data[sourceAt + 1], data[sourceAt + 2]];
  let best = { error: Infinity, alpha: 0, color: navy };
  for (const color of [navy, orange]) {
    const delta = color.map((channel) => channel - 255);
    const amount = Math.max(
      0,
      Math.min(
        1,
        delta.reduce(
          (sum, channel, channelIndex) =>
            sum + (sample[channelIndex] - 255) * channel,
          0,
        ) / delta.reduce((sum, channel) => sum + channel * channel, 0),
      ),
    );
    const error = delta.reduce(
      (sum, channel, channelIndex) =>
        sum + (sample[channelIndex] - (255 + amount * channel)) ** 2,
      0,
    );
    if (error < best.error) best = { error, alpha: amount, color };
  }
  pixels[targetAt] = best.color[0];
  pixels[targetAt + 1] = best.color[1];
  pixels[targetAt + 2] = best.color[2];
  pixels[targetAt + 3] = Math.round(best.alpha * 255);
}

const artwork = sharp(pixels, {
  raw: { width: info.width, height: info.height, channels: 4 },
});
const header = { left: 110, top: 115, width: 1890, height: 615 };
const mark = { left: 105, top: 115, width: 505, height: 615 };

await artwork.clone().extract(header).png().toFile(resolve(output, "brand-header.png"));
await artwork.clone().extract(mark).png().toFile(resolve(output, "brand-mark.png"));
await artwork
  .clone()
  .extract(mark)
  .resize(128, 128, { fit: "contain", background: "#00000000" })
  .png()
  .toFile(resolve(projectRoot, "public/favicon.png"));
await artwork
  .clone()
  .extract(mark)
  .resize(180, 180, { fit: "contain", background: "#ffffff" })
  .png()
  .toFile(resolve(projectRoot, "public/apple-touch-icon.png"));
