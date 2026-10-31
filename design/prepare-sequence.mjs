import sharp from "sharp";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

// Turns the supplied road footage into the scroll-driven image sequence on the
// homepage. Needs ffmpeg: on PATH, or named by the FFMPEG environment variable.
//
//   FFMPEG=/path/to/ffmpeg node design/prepare-sequence.mjs
//
// The frame count, second-shot frame and widths must match src/RoadSequence.jsx.
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(
  projectRoot,
  "design/source-images/hf_20261014_160203_b7dfa9e2-4df5-45ea-a98d-45522d007b86.mp4",
);
const output = resolve(projectRoot, "public/images/road-sequence");

// The first five seconds are dropped. The footage ends at 16.5s, where the
// closing logo card fades in: that card shows a phone number that is not the
// dispatch number in src/data.js.
const start = 5;
const end = 16.5;
const fps = 12;
const widths = [960, 1280];

const frames = mkdtempSync(join(tmpdir(), "road-sequence-"));
try {
  execFileSync(process.env.FFMPEG || "ffmpeg", [
    "-hide_banner",
    "-loglevel", "error",
    "-ss", String(start),
    "-t", String(end - start),
    "-i", source,
    "-vf", `fps=${fps}`,
    "-pix_fmt", "rgb24",
    join(frames, "%03d.png"),
  ]);
  const names = readdirSync(frames).filter((name) => name.endsWith(".png")).sort();
  for (const width of widths) {
    const folder = resolve(output, String(width));
    rmSync(folder, { recursive: true, force: true });
    mkdirSync(folder, { recursive: true });
    for (const name of names) {
      await sharp(join(frames, name))
        .resize(width)
        .webp({ quality: 64, effort: 5 })
        .toFile(resolve(folder, name.replace(".png", ".webp")));
    }
  }
  console.log(`${names.length} frames at ${widths.join(" and ")}px`);
} finally {
  rmSync(frames, { recursive: true, force: true });
}
