// Cuts a build video, or a folder of stills, into the frames a hero scrubs
// through as you scroll (components/Hero/HeroBuildSequence.jsx).
//
//   npm run hero-frames -- <video file | folder of stills> --name <sequence> [options]
//
//   --name <sequence>    the sequence's name — "home" for the homepage, a
//                        service page's slug (e.g. adu) for that
//                        page, which then plays it automatically
//   --frames <n>         how many frames to cut from the video (default 120).
//                        A folder with more stills than this is thinned to
//                        it; a folder with fewer is used as-is, and the hero
//                        crossfades between them.
//   --mobile-frames <n>  fewer frames for phones, to keep their download
//                        down (default: the same as --frames)
//   --width <px>         desktop frame width (default 1600)
//   --focus <0-1>        where across the video the square slice phones get
//                        is cut: 0 its left edge, 0.5 the middle, 1 the
//                        right edge (default 0.5). A phone held upright
//                        fills its screen with the middle of that slice.
//   --format <webp|avif> the frames' file type (default webp). AVIF is
//                        around a third smaller for the same look; the hero
//                        decodes frames off the main thread, so its slower
//                        decode doesn't cost smoothness. AVIF frames always
//                        get a WebP copy beside them: Safari (and so every
//                        iPhone browser) can show AVIF in an <img> but can't
//                        decode it into the hero's canvas, and plays the WebP.
//   --quality <n>        1-100 (default 72 for WebP, 55 for AVIF — AVIF's
//                        scale runs lower for the same look)
//
// Writes public/hero/<sequence>/desktop/* (the video's own aspect ratio),
// public/hero/<sequence>/mobile/* (a square slice, up to 768x768) and the
// sequence's entry in src/data/heroSequences.json — its frame counts, sizes
// and file type, which the hero reads.
//
// A video needs ffmpeg on the PATH, or its path in FFMPEG_PATH (Windows:
// `winget install Gyan.FFmpeg`, macOS: `brew install ffmpeg`). A folder of
// stills doesn't. sharp comes with Next.js — it's what next/image uses.

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import sharp from "sharp";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const MANIFEST = path.join(ROOT, "src", "data", "heroSequences.json");
const STILLS = /\.(png|jpe?g|webp|avif|tiff?)$/i;

const MOBILE = { width: 768, height: 768 };

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    name: { type: "string" },
    frames: { type: "string", default: "120" },
    "mobile-frames": { type: "string" },
    width: { type: "string", default: "1600" },
    focus: { type: "string", default: "0.5" },
    format: { type: "string", default: "webp" },
    quality: { type: "string" },
  },
});

const input = positionals[0];
const name = values.name;
if (!name || !/^[a-z0-9-]+$/.test(name)) fail("--name is the sequence's name: lowercase letters, numbers and dashes (e.g. adu).");
const OUT_DIR = path.join(ROOT, "public", "hero", name);
const frameCount = Number(values.frames);
const mobileCount = Number(values["mobile-frames"] ?? values.frames);
const desktopWidth = Number(values.width);
const focus = Number(values.focus);
const format = values.format;
const quality = Number(values.quality ?? (format === "avif" ? 55 : 72));

if (!input) fail("Usage: npm run hero-frames -- <video file | folder of stills>");
if (!(frameCount >= 2 && mobileCount >= 2)) fail("--frames and --mobile-frames need to be 2 or more.");
if (!(desktopWidth >= 320)) fail("--width is in pixels, 320 or more.");
if (!(focus >= 0 && focus <= 1)) fail("--focus is a fraction, 0 to 1.");
if (!["webp", "avif"].includes(format)) fail("--format is webp or avif.");
if (!(quality >= 1 && quality <= 100)) fail("--quality is 1 to 100.");

const source = path.resolve(input);
const sourceStat = await stat(source).catch(() => fail(`Can't find ${source}`));

let workDir = null;
let stills;
if (sourceStat.isDirectory()) {
  const names = (await readdir(source))
    .filter((name) => STILLS.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  if (names.length < 2) fail(`${source} needs at least two images.`);
  stills = names.map((name) => path.join(source, name));
} else {
  workDir = await mkdtemp(path.join(tmpdir(), "hero-frames-"));
  stills = extractFrames(source, Math.max(frameCount, mobileCount), workDir);
}
const desktopStills = thin(stills, frameCount);
const mobileStills = thin(stills, mobileCount);

try {
  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(path.join(OUT_DIR, "desktop"), { recursive: true });
  await mkdir(path.join(OUT_DIR, "mobile"), { recursive: true });

  let desktopSize = null;
  let mobileSize = null;
  const bytes = { desktop: 0, mobile: 0 };

  const frameName = (index, ext = format) => `${String(index + 1).padStart(4, "0")}.${ext}`;
  const encode = (image) =>
    format === "avif"
      ? image.avif({ quality, effort: 4 })
      : image.webp({ quality, effort: 5 });
  // the WebP copy of an AVIF frame (see --format)
  const fallback = format === "avif" ? "webp" : null;
  const writeFallback = (image, dir, index) =>
    fallback &&
    image
      .clone()
      .webp({ quality: Number(values.quality ? values.quality * 1.3 : 72), effort: 5 })
      .toFile(path.join(OUT_DIR, dir, frameName(index, fallback)));

  await eachLimit(desktopStills, 4, async (file, index) => {
    const resized = sharp(file).resize({ width: desktopWidth, withoutEnlargement: true });
    await writeFallback(resized, "desktop", index);
    const desktop = await encode(resized.clone()).toFile(path.join(OUT_DIR, "desktop", frameName(index)));
    desktopSize ??= { width: desktop.width, height: desktop.height };
    bytes.desktop += desktop.size;
  });

  await eachLimit(mobileStills, 4, async (file, index) => {
    const image = sharp(file);
    const { width, height } = await image.metadata();
    // The widest square slice of the frame, `focus` of the way across.
    const cropWidth = Math.min(width, height);
    const cropHeight = cropWidth;
    const cropped = image
      .clone()
      .extract({
        left: Math.round((width - cropWidth) * focus),
        top: Math.round((height - cropHeight) / 2),
        width: cropWidth,
        height: cropHeight,
      })
      // never scaled up — a phone upscales it anyway, once is enough
      .resize(MOBILE.width, MOBILE.height, { withoutEnlargement: true });
    await writeFallback(cropped, "mobile", index);
    const mobile = await encode(cropped.clone()).toFile(path.join(OUT_DIR, "mobile", frameName(index)));
    mobileSize ??= { width: mobile.width, height: mobile.height };
    bytes.mobile += mobile.size;
  });

  const manifest = existsSync(MANIFEST) ? JSON.parse(await readFile(MANIFEST, "utf8")) : {};
  manifest[name] = {
    ext: format,
    ...(fallback && { fallback }),
    desktop: { count: desktopStills.length, ...desktopSize },
    mobile: { count: mobileStills.length, ...mobileSize, focus },
  };
  await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);

  const mb = (n) => `${(n / 1024 / 1024).toFixed(1)} MB`;
  console.log(
    `public/hero/${name}\n` +
      `  desktop ${desktopStills.length} frames  ${desktopSize.width}x${desktopSize.height}  ${mb(bytes.desktop)}\n` +
      `  mobile  ${mobileStills.length} frames  ${mobileSize.width}x${mobileSize.height}  ${mb(bytes.mobile)}\n` +
      `Updated "${name}" in src/data/heroSequences.json`,
  );
} finally {
  if (workDir) await rm(workDir, { recursive: true, force: true });
}

// `count` evenly spaced frames across the whole video, first to last, as
// JPEGs in `dir`.
function extractFrames(video, count, dir) {
  const ffmpeg = process.env.FFMPEG_PATH || "ffmpeg";
  const probe = spawnSync(ffmpeg, ["-hide_banner", "-i", video], {
    encoding: "utf8",
  });
  if (probe.error) {
    fail(
      "ffmpeg isn't installed (or isn't on the PATH). Install it — Windows: " +
        "`winget install Gyan.FFmpeg`, macOS: `brew install ffmpeg` — or " +
        "set FFMPEG_PATH, or pass a folder of stills instead of a video.",
    );
  }
  const match = probe.stderr.match(/Duration: (\d+):(\d+):(\d+(?:\.\d+)?)/);
  if (!match) fail(`ffmpeg couldn't read ${video}:\n${probe.stderr}`);
  const duration = +match[1] * 3600 + +match[2] * 60 + +match[3];

  const run = spawnSync(
    ffmpeg,
    [
      "-v", "error",
      "-i", video,
      "-vf", `fps=${count / duration}`,
      "-frames:v", String(count),
      "-q:v", "2",
      path.join(dir, "%04d.jpg"),
    ],
    { stdio: "inherit" },
  );
  if (run.status !== 0) fail("ffmpeg couldn't cut the frames.");

  // The fps filter can land a frame short of `count`.
  return Array.from({ length: count }, (_, i) =>
    path.join(dir, `${String(i + 1).padStart(4, "0")}.jpg`),
  ).filter((file) => existsSync(file));
}

// Keeps `max` evenly spaced items (always the first and last).
function thin(items, max) {
  if (items.length <= max) return items;
  return Array.from(
    { length: max },
    (_, i) => items[Math.round((i * (items.length - 1)) / (max - 1))],
  );
}

async function eachLimit(items, limit, fn) {
  let next = 0;
  await Promise.all(
    Array.from({ length: limit }, async () => {
      while (next < items.length) {
        const index = next++;
        await fn(items[index], index);
      }
    }),
  );
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
