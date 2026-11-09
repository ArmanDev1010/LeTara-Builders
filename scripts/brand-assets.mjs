// Draws LeTara's logo files from the logo's paths in src/data/logo.json (the
// same paths components/UI/Logo.jsx draws on the page):
//
//   npm run brand-assets
//
//   src/app/icon.svg                     the favicon: the mark, black, and
//                                        white when the browser is in dark mode
//   src/app/apple-icon.png               180x180, the home-screen icon: the
//                                        mark on white (iOS fills a
//                                        transparent icon with black)
//   public/images/brand/letara-logo.png  600x600, the logo on white: the
//                                        structured data's `logo` (lib/seo.js)
//   public/images/brand/og.png           1200x630, the link-preview image
//                                        (DEFAULT_OG_IMAGE in lib/seo.js)
//
// Rerun it whenever logo.json changes. sharp comes with Next.js.
//
// logo.json is a vector rebuild of LeTara's logo from a 1023px JPEG: the mark
// redrawn from its geometry (a regular hexagon, bands 26 units wide, seams
// about 2), the lettering set in Bebas Neue, and both checked against the
// JPEG pixel by pixel. If Andranik has the original vector file, it replaces
// these paths.

import { mkdir, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const LOGO = JSON.parse(readFileSync(path.join(ROOT, "src", "data", "logo.json"), "utf8"));
const LOCKUP = { box: [0, 0, LOGO.width, LOGO.height], paths: [LOGO.mark.d, LOGO.wordmark.d] };
const MARK = { box: LOGO.mark.box, paths: [LOGO.mark.d] };

const round = (n, places = 2) => +n.toFixed(places);

// `art` (a box of logo units and its paths) centred on a width x height
// canvas, as large as fits in `fill` of it.
function place({ box: [x, y, w, h], paths }, { width, height, fill, background = "#fff" }) {
  const scale = Math.min((width * fill) / w, (height * fill) / h);
  const left = (width - w * scale) / 2 - x * scale;
  const top = (height - h * scale) / 2 - y * scale;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<rect width="${width}" height="${height}" fill="${background}"/>` +
    `<g transform="translate(${round(left)} ${round(top)}) scale(${round(scale, 5)})">` +
    paths.map((d) => `<path d="${d}"/>`).join("") +
    `</g></svg>`
  );
}

async function png(svg, file) {
  const out = path.join(ROOT, file);
  await mkdir(path.dirname(out), { recursive: true });
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true }).toFile(out);
  console.log(`wrote ${file}`);
}

// The favicon stays vector: a square around the mark, a little margin.
{
  const [x, y, w, h] = MARK.box;
  const margin = 8;
  const side = h + margin * 2;
  const viewBox = [x - (side - w) / 2, y - margin, side, side].map((n) => round(n)).join(" ");
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">` +
    `<style>path{fill:#000}@media (prefers-color-scheme:dark){path{fill:#fff}}</style>` +
    `<path d="${MARK.paths[0]}"/></svg>\n`;
  await writeFile(path.join(ROOT, "src", "app", "icon.svg"), svg);
  console.log("wrote src/app/icon.svg");
}
await png(place(MARK, { width: 180, height: 180, fill: 0.72 }), "src/app/apple-icon.png");
await png(place(LOCKUP, { width: 600, height: 600, fill: 0.8 }), "public/images/brand/letara-logo.png");
await png(place(LOCKUP, { width: 1200, height: 630, fill: 0.74 }), "public/images/brand/og.png");
