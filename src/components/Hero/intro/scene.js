// The homepage hero, drawn on a 2D canvas, playing by itself as the page
// opens: a house rendered the way a visual-effects shot is, pass by pass
// (Andranik's first trade), to the tagline, Dream. Design. Build.
//
// The home is the Craftsman of the area pages and the Services section (the
// `property` asset, Hero/studio/assets.js), since 11-23: before, a modern
// house with a pool.
//
//   DREAM   the house as a vision in gold glass, in pieces, as in an
//           architect's exploded view: each piece hangs over its place, and
//           from the first scroll they all close in and land, one by one.
//   DESIGN  the light turns white, and the glass house with it, while a
//           wireframe draws itself over it, edge by edge; then the light
//           turns blueprint blue, the glass fades, and the drawing is noted:
//           the main house, the addition, the ADU, the pergola.
//   BUILD   a scan rises through it, leaving it solid behind it; the light
//           turns gold again and the windows come on, one by one, until it's
//           the finished render.
//
// The camera turns slowly around it all the while, and once it's built, a
// little further as the hero scrolls away (`spin`). It stands on a faint
// drafting grid, in perspective, on black. Behind it, in outline across the
// screen, "DREAM. DESIGN. BUILD.", each word lighting up with its pass; a
// viewfinder's corners frame it.
//
//   drawScene(context, { width, height, dpr, t, spin, portrait, layout, calm, lite, fonts })
//
// paints the scene at progress `t` (0-1) on a canvas of `width` x `height`
// CSS px at `dpr` device px each. `layout` places it around the hero's copy,
// as fractions of the screen: `copyTop` (where the copy starts), `copyRight`
// and `titleRight` (how far right its text and its headline reach), and
// `navZoom` (how much the navbar has grown on a big screen). `calm` is the
// Reduce Motion version: the camera circles without pushing in, the pieces
// start a little closer together, nothing flashes. `lite` (phones and
// tablets) leaves out the film grain. `fonts` are the CSS families for the
// lettering.
//
// Everything is drawn from numbers here, nothing is downloaded. World units
// are feet: y points up, the front of the house faces -z, the ADU is at +x.
// Black, white and greys, plus two colors: gold and blueprint blue, the
// passes' colors.
//
// No light of its own since 11-23 (when it began playing by itself rather
// than with the scroll, the user asked for no light or flare and no dust):
// the backlight with its shafts, bloom and streak, and the dust, are gone.
// Its math, colors, sky, grid, light on faces, lamplit rooms and glare are
// exported for the service and area pages' turntable (Hero/studio/studio.js),
// which has had the same look since 11-24 (Andranik asked).

import { ASSETS } from "@/components/Hero/studio/assets";

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, k) => a + (b - a) * k;
export const smooth = (a, b, v) => {
  const k = clamp((v - a) / (b - a));
  return k * k * (3 - 2 * k);
};
export const mix = (c1, c2, k) => c1.map((v, i) => Math.round(lerp(v, c2[i], k)));
export const rgba = ([r, g, b], a = 1) => `rgba(${r},${g},${b},${a})`;
export const RAD = Math.PI / 180;
export const TAU = Math.PI * 2;
// the same "random" numbers every frame, so the scene is a function of t
export function rng(seed) {
  let s = seed >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}
export const makeCanvas = (w, h) =>
  typeof OffscreenCanvas !== "undefined"
    ? new OffscreenCanvas(w, h)
    : Object.assign(document.createElement("canvas"), { width: w, height: h });

// 3D vectors
export const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const norm = (a) => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};
export const lerp3 = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];

// ---- palette ---------------------------------------------------------------
export const GOLD = { core: [255, 244, 214], mid: [255, 170, 58], deep: [196, 92, 16] };
export const BLUE = { core: [232, 244, 255], mid: [74, 150, 255], deep: [20, 64, 190] };
// the drafting grid's lines (see drawGrid)
const GRID = [140, 176, 230];
// The sky (drawSky): blue hour, the twilight homes are photographed in, from
// its top down to the horizon, then the ground darkening to the foot of the
// screen; bluer, a blueprint's, while the house is drawn in blue.
const SKY = {
  dusk: { top: [5, 11, 27], horizon: [24, 42, 82], ground: [8, 13, 26], foot: [2, 4, 10] },
  blueprint: { top: [4, 15, 40], horizon: [18, 54, 112], ground: [6, 16, 36], foot: [2, 6, 15] },
};
// the passes' colors, from gold (0) to blue (1); halfway (0.5) it's white
const lightColors = (s) => ({
  core: mix(GOLD.core, BLUE.core, s),
  mid: mix(GOLD.mid, BLUE.mid, s),
  deep: mix(GOLD.deep, BLUE.deep, s),
});

// ---- timeline (fractions of the play, see PLAY in HeroIntro) ----------------
// Retimed 11-23 for playing by itself in a few seconds: the notes are held
// long enough to read (about 0.7s of 5) before the scan starts.
const T = {
  dream: [0.0, 0.28], // DREAM: the pieces come together
  white: [0.23, 0.29], // the glass goes white, and holds (the user liked it)…
  lines: [0.27, 0.48], // DESIGN: the wireframe draws itself
  glass: [0.35, 0.45], // the glass house fades under it
  blue: [0.4, 0.46], // …then it all goes blueprint blue
  notes: [0.42, 0.47], // the notes come up… (and go at the start of BUILD)
  rise: [0.61, 0.8], // BUILD: the scan rises through it
  gold: [0.63, 0.76], // …and it turns gold again
  lights: [0.78, 0.91], // the windows come on
  settle: 0.94, // the camera arrives
};
// the three passes, each lighting its word in the title from `from`
const PASSES = [
  { word: "DREAM.", from: 0 },
  { word: "DESIGN.", from: 0.27 },
  { word: "BUILD.", from: 0.6 },
];

// ---- the property ----------------------------------------------------------
// The Craftsman home on its lot, as the turntable shows it (not the drawing's
// cutaway and rooms): the house with its porch on stone piers and its upper
// floor, the addition on its right, the ADU in the back corner, the
// patio under the pergola with the outdoor kitchen and the fire pit. Boxes in
// feet, none overlapping (so they can be put in drawing order, see
// drawOrder); a `gable` one is a roof inside its box (gableFaces). `thin`
// parts (posts, beams, slats) are only edges in DREAM.
const ASSET = ASSETS.property;
const BOXES = ASSET.boxes
  .filter((b) => !b.diagramOnly)
  .map((b) => ({ ...b, thin: Math.min(b.max[0] - b.min[0], b.max[2] - b.min[2]) < 1.2 }));
const BOX = Object.fromEntries(BOXES.map((b) => [b.id, b]));
const LOT = ASSET.lot;

// How each finish takes the light: `albedo`, how much it reflects; `slats`,
// lines across it every so many feet (the siding's boards, the shingles'
// courses); `tint`, its own color, as a multiple of the light's.
const MATS = {
  siding: { albedo: 0.5, slats: 0.75 },
  shingle: { albedo: 0.2, slats: 0.9 },
  concrete: { albedo: 0.46 },
  stone: { albedo: 0.38 },
  stucco: { albedo: 0.62, tint: [1.14, 1.04, 0.86] }, // the ADU: warm white, apart from the grey house
  roof: { albedo: 0.18 },
  deck: { albedo: 0.3 },
  wood: { albedo: 0.36 },
};
const matOf = (b) => MATS[b.mat] ?? MATS.concrete;

// What the drawing is noted with in DESIGN: a point on the property, which
// way the label leans off it, and the label (its services: the house, the
// addition, the ADU, outdoor living).
const NOTES = [
  { at: [25.5, 25.6, 8], dir: [-1, -1], text: "Main house" },
  { at: [39.25, 14.6, 10], dir: [1, -1], text: "Addition" },
  { at: [-19, 10.4, 36], dir: [-1, -1], text: "ADU" },
  { at: [55, 10.1, 13], dir: [1, 1], text: "Pergola" },
];

// The light on the built house: blue hour's, cool from the sky in front and
// above (KEY, SKY_LIGHT), and a little of the pass's color from behind (RIM),
// so its roofs and far edges catch it. The windows are what's warm.
const KEY = norm([-0.45, 0.6, -0.65]);
const RIM = norm([0.3, 0.45, 1]);
const SKY_LIGHT = [190, 205, 235];

// A box's faces: the four corners (bottom left, bottom right, top right, top
// left, as you face it from outside) and its outward normal. The underside
// is left out: the camera is always above the ground.
export function faces({ min: [x0, y0, z0], max: [x1, y1, z1] }) {
  return {
    "z-": { n: [0, 0, -1], p: [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]] },
    "z+": { n: [0, 0, 1], p: [[x1, y0, z1], [x0, y0, z1], [x0, y1, z1], [x1, y1, z1]] },
    "x-": { n: [-1, 0, 0], p: [[x0, y0, z1], [x0, y0, z0], [x0, y1, z0], [x0, y1, z1]] },
    "x+": { n: [1, 0, 0], p: [[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]] },
    "y+": { n: [0, 1, 0], p: [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]] },
  };
}
// the point `u` across and `v` up a face
export const onFace = ({ p: [a, b, , d] }, u, v) => [
  a[0] + (b[0] - a[0]) * u + (d[0] - a[0]) * v,
  a[1] + (b[1] - a[1]) * u + (d[1] - a[1]) * v,
  a[2] + (b[2] - a[2]) * u + (d[2] - a[2]) * v,
];
export function edges({ min, max }) {
  const c = (i) => [i & 1 ? max[0] : min[0], i & 2 ? max[1] : min[1], i & 4 ? max[2] : min[2]];
  const out = [];
  for (let i = 0; i < 8; i++) for (const bit of [1, 2, 4]) if (!(i & bit)) out.push([c(i), c(i | bit)]);
  return out;
}

// A gable roof inside a box's bounds (`gable: "x"`: its ridge runs along x;
// `"z"`: along z), the eaves at the bottom and the ridge at the top: two
// slopes (`ridge`: their top edge catches the light) and two triangular ends
// (`tri`, the apex written twice). It sits inside its box, so the boxes'
// drawing order (drawOrder) still holds; keep its box clear of every other.
// (Shared with the service pages' turntable, Hero/studio/studio.js.)
export function gableFaces({ min: [x0, y0, z0], max: [x1, y1, z1], gable }) {
  const h = y1 - y0;
  if (gable === "x") {
    const zm = (z0 + z1) / 2, d = (z1 - z0) / 2;
    return {
      "z-": { n: norm([0, d, -h]), p: [[x0, y0, z0], [x1, y0, z0], [x1, y1, zm], [x0, y1, zm]], ridge: true },
      "z+": { n: norm([0, d, h]), p: [[x1, y0, z1], [x0, y0, z1], [x0, y1, zm], [x1, y1, zm]], ridge: true },
      "x-": { n: [-1, 0, 0], p: [[x0, y0, z1], [x0, y0, z0], [x0, y1, zm], [x0, y1, zm]], tri: true },
      "x+": { n: [1, 0, 0], p: [[x1, y0, z0], [x1, y0, z1], [x1, y1, zm], [x1, y1, zm]], tri: true },
    };
  }
  const xm = (x0 + x1) / 2, d = (x1 - x0) / 2;
  return {
    "x-": { n: norm([-h, d, 0]), p: [[x0, y0, z1], [x0, y0, z0], [xm, y1, z0], [xm, y1, z1]], ridge: true },
    "x+": { n: norm([h, d, 0]), p: [[x1, y0, z0], [x1, y0, z1], [xm, y1, z1], [xm, y1, z0]], ridge: true },
    "z-": { n: [0, 0, -1], p: [[x0, y0, z0], [x1, y0, z0], [xm, y1, z0], [xm, y1, z0]], tri: true },
    "z+": { n: [0, 0, 1], p: [[x1, y0, z1], [x0, y0, z1], [xm, y1, z1], [xm, y1, z1]], tri: true },
  };
}
export const shapeFaces = (b) => (b.gable ? gableFaces(b) : faces(b));
// a shape's edges: a box's twelve, or a gable's eaves, ridge and rafters
export function shapeEdges(b) {
  if (!b.gable) return edges(b);
  const { min: [x0, y0, z0], max: [x1, y1, z1] } = b;
  const eaves = [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]];
  const out = eaves.map((p, i) => [p, eaves[(i + 1) % 4]]);
  if (b.gable === "x") {
    const zm = (z0 + z1) / 2, r0 = [x0, y1, zm], r1 = [x1, y1, zm];
    out.push([r0, r1], [eaves[0], r0], [eaves[3], r0], [eaves[1], r1], [eaves[2], r1]);
  } else {
    const xm = (x0 + x1) / 2, r0 = [xm, y1, z0], r1 = [xm, y1, z1];
    out.push([r0, r1], [eaves[0], r0], [eaves[1], r0], [eaves[3], r1], [eaves[2], r1]);
  }
  return out;
}
// its corners (a gable's eaves and ridge ends)
export const shapeVertices = (b) => {
  const seen = new Map();
  for (const p of shapeEdges(b).flat()) seen.set(p.join(","), p);
  return [...seen.values()];
};
// A shape's planes, each facing out: its faces' and its floor's.
export function planesOf(b) {
  const out = Object.values(shapeFaces(b)).map((f) => ({ n: f.n, q: f.p[0] }));
  out.push({ n: [0, -1, 0], q: b.min });
  return out;
}
// Whether a shape (its planes) stands between the eye and point p: the line
// from one to the other clipped against each plane, stopping just short of p.
export function hides(planes, eye, p) {
  const d = sub(p, eye);
  let t0 = 0, t1 = 0.995;
  for (const { n, q } of planes) {
    const den = dot(n, d), num = dot(n, sub(q, eye));
    if (Math.abs(den) < 1e-9) {
      if (num < 0) return false;
      continue;
    }
    if (den > 0) t1 = Math.min(t1, num / den);
    else t0 = Math.max(t0, num / den);
    if (t0 >= t1) return false;
  }
  return true;
}

// For the rising scan: the part of a face's outline at or below height h
// (null if none of it is), the part of an edge at or above it, and a shape's
// cut at h (its cross-section: a gable's narrows toward the ridge).
function clipBelow(pts, h) {
  const out = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length];
    if (a[1] <= h) out.push(a);
    if (a[1] <= h !== b[1] <= h) out.push(lerp3(a, b, (h - a[1]) / (b[1] - a[1])));
  }
  return out.length >= 3 ? out : null;
}
function clipAbove([a, c], h) {
  const [lo, hi] = a[1] <= c[1] ? [a, c] : [c, a];
  if (hi[1] <= h) return null;
  if (lo[1] >= h) return [lo, hi];
  return [lerp3(lo, hi, (h - lo[1]) / (hi[1] - lo[1])), hi];
}
function sectionAt(b, h) {
  const { min: [x0, y0, z0], max: [x1, y1, z1] } = b;
  if (h <= y0 || h >= y1) return null;
  let [a0, a1, c0, c1] = [x0, x1, z0, z1];
  const k = 1 - (h - y0) / (y1 - y0);
  if (b.gable === "x") [c0, c1] = [(z0 + z1) / 2 - ((z1 - z0) / 2) * k, (z0 + z1) / 2 + ((z1 - z0) / 2) * k];
  if (b.gable === "z") [a0, a1] = [(x0 + x1) / 2 - ((x1 - x0) / 2) * k, (x0 + x1) / 2 + ((x1 - x0) / 2) * k];
  return [[a0, h, c0], [a1, h, c0], [a1, h, c1], [a0, h, c1]];
}
const HEIGHT = Math.max(...BOXES.map((b) => b.max[1]));

// Its windows (`u` across a face, `v` up it), each coming on in turn
// through T.lights (`on`), left to right; then the lamps (the fire pit, the
// pergola's lights), lit at LAMPS_ON. The lamplight falls on the ground round
// the house from SPILL_ON.
const WINDOWS = (() => {
  const shown = ASSET.windows.filter((w) => BOX[w.box]);
  const x = (w) => onFace(faces(BOX[w.box])[w.face], (w.u[0] + w.u[1]) / 2, 0)[0];
  const order = [...shown].sort((a, b) => x(a) - x(b));
  return shown.map((w) => ({ ...w, on: 0.08 + (0.6 * order.indexOf(w)) / Math.max(1, order.length - 1) }));
})();
const LAMPS = ASSET.lamps;
const LAMPS_ON = 0.8;
const SPILL_ON = 0.1;

// The wireframe's edges, each with when it starts drawing (0-1 through
// T.lines): from the ground up, left to right. Vertical edges draw upward.
const EDGES = BOXES.flatMap((b) =>
  shapeEdges(b).map(([a, c]) => {
    const order = 0.72 * (Math.min(a[1], c[1]) / HEIGHT) + 0.28 * ((a[0] + c[0]) / 2 - LOT.x[0]) / (LOT.x[1] - LOT.x[0]);
    return { a, c, order, box: b };
  }),
);

// DREAM: at first the house is apart, as in an architect's exploded view:
// each piece hangs over its place (`lift`, feet), the higher it sits the
// higher it hangs, the roofs highest. From the very start they all close in
// together, easing into place, and land in turn (`land`, as a share of
// T.dream): from the ground up, left to right, the upper floor's roof last.
// With `calm` they start a little closer (CALM_APART).
const CALM_APART = 0.75;
const PIECES = (() => {
  const key = (b) => b.min[1] + (0.012 * ((b.min[0] + b.max[0]) / 2 - LOT.x[0]));
  const ranked = [...BOXES].sort((a, b) => key(a) - key(b));
  return BOXES.map((b) => ({
    box: b,
    lift: [0, 2 + 0.5 * b.min[1] + (b.gable ? 4 : 0), 0],
    land: 0.35 + (0.65 * ranked.indexOf(b)) / (BOXES.length - 1),
  }));
})();
// The share of the way a piece has come, k through its time: already moving
// as it starts, slowing as it lands, but still moving to the end (an
// ease-out left the second half of DREAM nearly still).
const closing = (k) => k + k * k - k * k * k;
// how far piece `q` still has to go, 0-1, and the last piece
const apartOf = (q, t) => 1 - closing(clamp((t - T.dream[0]) / ((T.dream[1] - T.dream[0]) * q.land)));
const apart = (t) => apartOf({ land: 1 }, t);
// where it is: its lift, by how far it still has to go
const offsetOf = (q, t, calm) => q.lift.map((v) => v * apartOf(q, t) * (calm ? CALM_APART : 1));
const moved = (b, [dx, dy, dz]) => ({ ...b, min: [b.min[0] + dx, b.min[1] + dy, b.min[2] + dz], max: [b.max[0] + dx, b.max[1] + dy, b.max[2] + dz] });
// every corner of the pieces where they are at `t`
const dreamCorners = (t, calm) => PIECES.flatMap((q) => shapeVertices(moved(q.box, offsetOf(q, t, calm))));

// ---- drawing order -----------------------------------------------------------
// Far to near, for boxes that don't overlap: wherever two are apart along an
// axis and the camera is past one of them on it, that one is the nearer.
// When two axes disagree (apart along x and along z, say, with the camera
// on the near side of each on one of them), neither can hide the other, so
// the pair sets no order: forcing one made loops on the area pages' home
// (11-12), and the loop's fallback drew a roof over the wing in front of it.
// Pairs that can't be told apart this way keep their distance order.
export function drawOrder(list, eye) {
  const n = list.length;
  const after = Array.from({ length: n }, () => []);
  const indegree = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const A = list[i], B = list[j];
      let near = -1, clash = false;
      for (let k = 0; k < 3; k++) {
        let v = -1;
        if (A.max[k] <= B.min[k] + 1e-6) v = eye[k] > B.min[k] ? j : eye[k] < A.max[k] ? i : -1;
        else if (B.max[k] <= A.min[k] + 1e-6) v = eye[k] > A.min[k] ? i : eye[k] < B.max[k] ? j : -1;
        if (v < 0) continue;
        if (near >= 0 && v !== near) clash = true;
        near = v;
      }
      if (near < 0 || clash) continue;
      const far = near === i ? j : i;
      after[far].push(near);
      indegree[near]++;
    }
  }
  const dist = list.map((b) => {
    const c = [(b.min[0] + b.max[0]) / 2, (b.min[1] + b.max[1]) / 2, (b.min[2] + b.max[2]) / 2];
    return -Math.hypot(...sub(c, eye));
  });
  const ready = [];
  for (let i = 0; i < n; i++) if (!indegree[i]) ready.push(i);
  const out = [];
  while (out.length < n) {
    if (!ready.length) {
      // a cycle (it doesn't happen with this house): fall back to distance
      const rest = list.map((_, i) => i).filter((i) => !out.includes(list[i]));
      rest.sort((a, b) => dist[a] - dist[b]).forEach((i) => out.push(list[i]));
      break;
    }
    ready.sort((a, b) => dist[a] - dist[b]);
    const i = ready.shift();
    out.push(list[i]);
    for (const k of after[i]) if (!--indegree[k]) ready.push(k);
  }
  return out;
}

// ---- camera ----------------------------------------------------------------
// It circles the home, looking at the middle of the lot from DIST feet:
// from its left (the ADU's side) round toward its front, a little lower as
// it goes, already moving as the play starts (`orbitEase`), with Reduce Motion
// on too (`calm`). Then, as the hero scrolls away, it turns SPIN degrees
// further (`spin`, as the service pages' turntable does): a touch, nothing
// to scroll through. The view is fitted into the room the copy leaves (see
// room), the same size all the way round, and centred in it as it looks
// from where the camera is at that moment (11-23: centred on every angle it
// takes at once, it sat off centre at most of them; the user asked), and
// pushes in a little as the scene plays (not with `calm`). In DREAM it also takes in the pieces where
// they hang, closing in as they land (not with `calm`: no zoom).
const TARGET = ASSET.target;
const DIST = 150;
const ORBIT = {
  desktop: { yaw: [-52, -18], pitch: [24, 18] },
  portrait: { yaw: [-46, -20], pitch: [30, 24] },
};
const SPIN = 14;
const PUSH_IN = 0.06;

function view(yawDeg, pitchDeg) {
  const yaw = yawDeg * RAD, pitch = pitchDeg * RAD;
  const eye = [
    TARGET[0] + DIST * Math.sin(yaw) * Math.cos(pitch),
    TARGET[1] + DIST * Math.sin(pitch),
    TARGET[2] - DIST * Math.cos(yaw) * Math.cos(pitch),
  ];
  const f = norm(sub(TARGET, eye));
  const r = norm(cross([0, 1, 0], f));
  const u = cross(f, r);
  // [x, y] on a screen 1 unit from the eye (the target at 0, 0), and depth
  const project = (p) => {
    const d = sub(p, eye);
    const z = dot(d, f);
    return [dot(d, r) / z, -dot(d, u) / z, z];
  };
  return { eye, project };
}
const angles = (orbit, k) => [lerp(orbit.yaw[0], orbit.yaw[1], k), lerp(orbit.pitch[0], orbit.pitch[1], k)];
// every angle it's seen from: round the orbit, then the scroll's turn
const allAngles = (orbit) => [
  ...Array.from({ length: 25 }, (_, i) => angles(orbit, i / 24)),
  ...Array.from({ length: 6 }, (_, i) => [orbit.yaw[1] + (SPIN * (i + 1)) / 6, orbit.pitch[1]]),
];
// part ease-out, part ease-in-out: moving from the start (with an
// ease-in-out alone it hardly moved at first), arriving gently
const orbitEase = (x) => 0.35 * (1 - (1 - x) ** 2) + 0.65 * x * x * (3 - 2 * x);
// [x0, y0, x1, y1] of points on a screen 1 unit away, grown from `e`
function extentOf(project, pts, e = [Infinity, Infinity, -Infinity, -Infinity]) {
  for (const p of pts) {
    const [x, y] = project(p);
    e[0] = Math.min(e[0], x);
    e[1] = Math.min(e[1], y);
    e[2] = Math.max(e[2], x);
    e[3] = Math.max(e[3], y);
  }
  return e;
}

// The navbar's bottom edge, CSS px, if HeroIntro couldn't measure it
// (components/Navigation/Navbar.jsx: 12px + a 60px bar on a phone, 20px + a
// 68px bar wide, growing with --wide-zoom on a big screen).
const NAV_BOTTOM = { portrait: 72, desktop: 88 };
const navBottom = (portrait, layout) =>
  layout.navBottom ?? (portrait ? NAV_BOTTOM.portrait : NAV_BOTTOM.desktop) * (layout.navZoom ?? 1);

// "DREAM. DESIGN. BUILD." (drawTitle): one line across the screen in the
// background, spaced evenly in the room it has (the user asked): on a wide
// screen beside the copy, halfway between the navbar and the headline's
// letters, the house below it; on a phone (and wherever the house is above
// the copy), with as much air above it as below it, down to the house. No
// word is ever behind the house: the user missed "DESIGN." when they were
// stacked behind it on a phone, and the light sat on "BUILD." on desktop.
// `span`: its width at most, as a share of the screen's; `maxH`: its size at
// most, as a share of the height; `faint` / `bright`: its outline's opacity,
// unlit and lit; `fill`: a lit word's fill; `stretch`: how much taller than
// the face its letters are drawn (on a phone, like a lock screen's stretched
// clock: the user asked, 11-23, with it fainter everywhere).
const TITLE = {
  text: "DREAM. DESIGN. BUILD.",
  portrait: { span: 0.86, maxH: 0.05, faint: 0.15, bright: 0.45, fill: 0.08, stretch: 1.55 },
  desktop: { span: 0.84, maxH: 0.17, faint: 0.05, bright: 0.2, fill: 0.035, stretch: 1 },
};
// px from the title down to the house's room, beside the copy
const UNDER_TITLE = 20;

// How big the house looks, on a screen 1 unit away: the widest and the
// tallest it gets from any one angle it's seen from ({ w, h }). It's centred
// as it looks at each moment (see camera), so a room it fits at this size
// fits it from every angle. (Until 11-23, centred on all the angles at once,
// it was fitted to their extent together, a tenth wider than it ever looks.)
// The lot's line, only a faint dashed one, may run past it.
const sizeOf = (e) => ({ w: e[2] - e[0], h: e[3] - e[1] });
const biggest = (a, b) => ({ w: Math.max(a.w, b.w), h: Math.max(a.h, b.h) });
function sizeFrom(pts) {
  const out = {};
  for (const [key, orbit] of Object.entries(ORBIT))
    out[key] = allAngles(orbit).reduce((size, [yaw, pitch]) => biggest(size, sizeOf(extentOf(view(yaw, pitch).project, pts))), { w: 0, h: 0 });
  return out;
}
const SIZE = sizeFrom(BOXES.flatMap(shapeVertices));
// With `calm`, the pieces where they start too, so the camera can circle
// without the view zooming as they land.
const CALM_SIZE = (() => {
  const apartSize = sizeFrom(dreamCorners(0, true));
  return Object.fromEntries(Object.keys(SIZE).map((key) => [key, biggest(SIZE[key], apartSize[key])]));
})();
// On a wide screen the house takes this much of its room, the room ending
// ROOM_FOOT of the way down (11-23: the user found it a little big and too
// close to the foot of the screen).
const DESKTOP_FILL = 0.88;
const ROOM_FOOT = 0.88;

// Where the title and the house go: the title's size and baseline, and the
// house's room, a box in CSS px (`top`: the house sits at its top, so the air
// over it is what it looks like; otherwise in its middle). On a phone, the
// navbar, the title and the house evenly spaced, above the copy. On a wide
// screen, the house beside the copy (the title halfway between the navbar
// and the headline, the house under it) or above it (spaced as on a phone),
// whichever lets the house be bigger. The still (a phone held sideways, the
// copy below it) has the screen to itself.
function placeScene(ctx, width, height, portrait, layout, fonts) {
  const nav = navBottom(portrait, layout);
  const size = SIZE[portrait ? "portrait" : "desktop"];
  const cfg = TITLE[portrait ? "portrait" : "desktop"];
  ctx.font = `100px ${fonts.display}`;
  const m = ctx.measureText(TITLE.text);
  // (at 1px, as drawn: stretched on a phone)
  const ascent = (m.actualBoundingBoxAscent / 100) * cfg.stretch;
  const capH = ((m.actualBoundingBoxAscent + m.actualBoundingBoxDescent) / 100) * cfg.stretch;
  const maxSize = Math.min((width * cfg.span * 100) / m.width, height * cfg.maxH);
  const titleAt = (px, capsTop) => ({ size: px, stretch: cfg.stretch, baseline: capsTop + ascent * px, bottom: capsTop + capH * px });
  const fit = ({ room: b }) => Math.min((b.x1 - b.x0) / size.w, (b.y1 - b.y0) / size.h);
  // the least air between them (more on a phone: 11-17, the user found the
  // house too close to the headline with the browser's bars showing)
  const air = portrait ? clamp(0.035 * height, 22, 34) : clamp(0.028 * height, 14, 30);
  const head = layout.head ? headlineTop(ctx, layout.head, fonts) : null;

  // the house above the copy: the navbar, the title, the house and the
  // headline, the same air between each (the house as wide as the room
  // lets it be); where there isn't room for that, `air` between each, under
  // the house too, and the house as big as what's left lets it be; on a
  // screen so short that leaves it under 60% of that, the air gives way
  // (down to 12px) rather than the house. (Until 11-17 the house's room ran
  // down to the headline when it was short of room.)
  const stacked = (x0, x1, bottom) => {
    const houseH = ((x1 - x0) * size.h) / size.w;
    const free = bottom - nav - capH * maxSize; // for the house and the air
    let gap = Math.max((free - houseH) / 3, air);
    if (free - 3 * gap < 0.6 * houseH) gap = Math.max(12, (free - 0.6 * houseH) / 3);
    const title = titleAt(maxSize, nav + gap);
    const y0 = title.bottom + gap;
    const y1 = y0 + Math.max(Math.min(houseH, free - 3 * gap), 0.1 * height);
    return { title, room: { x0, x1, y0, y1, top: true } };
  };
  if (portrait) return stacked(0.04 * width, 0.96 * width, head ?? (layout.copyTop - 0.015) * height);
  const overhead = stacked(0.035 * width, 0.965 * width, head ?? (layout.copyTop - 0.02) * height);
  if (head == null) return overhead;

  // beside the copy: the title halfway between the navbar and the
  // headline's letters, the house below it
  const space = head - nav;
  const px = Math.min(maxSize, (space * 0.55) / capH);
  const title = titleAt(px, nav + (space - capH * px) / 2);
  const y0 = title.bottom + UNDER_TITLE;
  const beside = {
    title,
    room: {
      x0: Math.min(0.6, Math.max(layout.copyRight ?? 0, layout.titleRight ?? 0) + 0.03) * width,
      x1: 0.975 * width,
      y0,
      y1: Math.max(y0 + 0.18 * height, ROOM_FOOT * height),
    },
  };
  return fit(beside) >= fit(overhead) ? beside : overhead;
}

// The top of the headline's letters, px: from its box, through the font's
// metrics (its line box centres the font's ascent and descent).
function headlineTop(ctx, { top, size, line }, fonts) {
  ctx.font = `${size}px ${fonts.display}`;
  const m = ctx.measureText("D");
  const ascent = m.fontBoundingBoxAscent ?? size * 0.9, descent = m.fontBoundingBoxDescent ?? size * 0.3;
  return top + (line - ascent - descent) / 2 + ascent - m.actualBoundingBoxAscent;
}

function camera(width, height, portrait, t, spin, calm, box) {
  const orbit = ORBIT[portrait ? "portrait" : "desktop"];
  const k = orbitEase(clamp(t / T.settle));
  // it circles with Reduce Motion on too (the user's iPhone has it on, and a
  // still camera read as nothing happening), with no push-in or zoom; the
  // scroll's turn too (the visitor's own scroll moves it)
  const [yaw, pitch] = angles(orbit, k);
  const { eye, project } = view(yaw + SPIN * spin, pitch);
  // as it is now (the pieces where they are)
  const now = extentOf(project, dreamCorners(t, calm));
  // sized for the house at its biggest, and in DREAM for the pieces where
  // they hang (with `calm`, where they start, so it doesn't zoom); on a wide
  // screen a little smaller than its room
  const key = portrait ? "portrait" : "desktop";
  const e = calm ? CALM_SIZE[key] : apart(t) > 0 ? biggest(SIZE[key], sizeOf(now)) : SIZE[key];
  // pushed in all the way, it still fits
  const fill = portrait ? 1 : DESKTOP_FILL;
  const s0 = (fill * Math.min((box.x1 - box.x0) / e.w, (box.y1 - box.y0) / e.h)) / (1 + PUSH_IN);
  const s = s0 * (1 + (calm ? 0 : PUSH_IN * smooth(0, 1, t)));
  // centred in the room as it looks from here, so it's centred at every
  // angle (it fits, being no bigger than the size above)
  const ox = (box.x0 + box.x1) / 2 - s * ((now[0] + now[2]) / 2);
  const oy = (box.y0 + box.y1) / 2 - s * ((now[1] + now[3]) / 2);
  return {
    eye,
    box,
    s,
    // CSS px on the canvas, and depth (feet)
    toScreen: (p) => {
      const [x, y, z] = project(p);
      return [ox + x * s, oy + y * s, z];
    },
  };
}

// ---- shapes on screen --------------------------------------------------------
export function path(ctx, pts) {
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
}
export const visible = (face, eye) => dot(face.n, sub(eye, face.p[0])) > 0;

// A face's color in blue hour's light (shared with the turntable): a little
// ambient, the sky's cool light where it faces it (KEY), and `rim` (a color:
// here the pass's) from behind (RIM); `albedo`, how much the finish gives
// back, `tint`, its own color.
export function duskShade(albedo, n, rim, tint = [1, 1, 1]) {
  const k = Math.max(0, dot(n, KEY)), r = Math.max(0, dot(n, RIM));
  return [0, 1, 2].map((i) => Math.min(255, Math.round(albedo * tint[i] * (34 + SKY_LIGHT[i] * 1.1 * k + rim[i] * 0.6 * r) + 3)));
}
const shade = (b, n, colors) => duskShade(matOf(b).albedo, n, colors.mid, matOf(b).tint);

// ---- the passes --------------------------------------------------------------
// DREAM: the house as a vision in gold glass, in pieces (see DREAM): each
// piece's faces faintly lit, brightest at the top, its edges glowing, and a
// dashed line from each corner down to where it goes, as in an exploded
// view. A piece glows as it lands (not with `calm`). It turns white with the
// light as DESIGN draws over it, then fades.
function drawDream(ctx, cam, t, calm, colors) {
  const holo = 1 - smooth(T.glass[0], T.glass[1], t);
  if (holo <= 0) return;
  const parts = PIECES.map((q) => {
    const o = offsetOf(q, t, calm);
    return { q, o, b: moved(q.box, o), left: apartOf(q, t) };
  });
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const { q, b } of parts) {
    if (q.box.thin) continue;
    for (const [key, f] of Object.entries(shapeFaces(b))) {
      if (!visible(f, cam.eye)) continue;
      const pts = f.p.map((p) => cam.toScreen(p));
      path(ctx, pts);
      if (key === "y+") ctx.fillStyle = rgba(colors.mid, 0.13 * holo);
      else {
        const foot = [(pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2];
        const head = [(pts[2][0] + pts[3][0]) / 2, (pts[2][1] + pts[3][1]) / 2];
        const g = ctx.createLinearGradient(foot[0], foot[1], head[0], head[1] + 0.01);
        g.addColorStop(0, rgba(colors.deep, 0.03 * holo));
        g.addColorStop(1, rgba(colors.mid, 0.1 * holo));
        ctx.fillStyle = g;
      }
      ctx.fill();
    }
  }
  // the guides, from where each piece hangs down to its place
  ctx.setLineDash([3, 4]);
  ctx.lineWidth = 1;
  for (const { q, o, left } of parts) {
    if (q.box.thin || left < 0.002) continue;
    const { min, max } = q.box;
    ctx.beginPath();
    for (const [x, z] of [[min[0], min[2]], [max[0], min[2]], [max[0], max[2]], [min[0], max[2]]]) {
      const [x0, y0] = cam.toScreen([x + o[0], min[1] + o[1], z + o[2]]), [x1, y1] = cam.toScreen([x, min[1], z]);
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
    }
    ctx.strokeStyle = rgba(colors.core, 0.4 * holo * Math.min(1, left * 8));
    ctx.stroke();
  }
  ctx.restore();
  // the edges
  const lines = parts.flatMap(({ b }) => shapeEdges(b)).map(([a, c]) => ({ a, c }));
  strokeEdges(ctx, cam, lines, colors, 0.7 * holo);
  if (calm) return;
  for (const { q, b } of parts) {
    const land = T.dream[0] + (T.dream[1] - T.dream[0]) * q.land;
    const glow = smooth(land - 0.012, land, t) * (1 - smooth(land, land + 0.035, t));
    if (glow > 0.01) strokeEdges(ctx, cam, shapeEdges(b).map(([a, c]) => ({ a, c })), colors, glow * holo);
  }
}

// DESIGN: the wireframe, edge by edge, glowing; farther edges dimmer. In
// BUILD, what the scan hasn't reached yet (see drawShape).
function strokeEdges(ctx, cam, list, colors, alpha, progress = () => 1) {
  if (alpha <= 0) return;
  const segs = [];
  let zMin = Infinity, zMax = -Infinity;
  for (const e of list) {
    const k = progress(e);
    if (k <= 0) continue;
    const [lo, hi] = e.a[1] <= e.c[1] ? [e.a, e.c] : [e.c, e.a];
    const a = cam.toScreen(lo), b = cam.toScreen(lerp3(lo, hi, k));
    segs.push([a, b]);
    zMin = Math.min(zMin, a[2]);
    zMax = Math.max(zMax, a[2]);
  }
  if (!segs.length) return;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.lineCap = "round";
  // three depths, near brightest
  for (let band = 0; band < 3; band++) {
    const lo = lerp(zMin, zMax, band / 3) - 0.01, hi = lerp(zMin, zMax, (band + 1) / 3) + 0.01;
    const these = segs.filter(([a]) => a[2] >= lo && a[2] <= hi);
    if (!these.length) continue;
    const depth = 1 - band * 0.28;
    ctx.beginPath();
    for (const [a, b] of these) {
      ctx.moveTo(a[0], a[1]);
      ctx.lineTo(b[0], b[1]);
    }
    ctx.strokeStyle = rgba(colors.mid, 0.16 * alpha * depth);
    ctx.lineWidth = 3.2;
    ctx.stroke();
    ctx.strokeStyle = rgba(colors.core, 0.85 * alpha * depth);
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.restore();
}

// the box corners, marked like a CG viewport's vertices while it's a drawing
function drawVertices(ctx, cam, t, colors) {
  const a = smooth(T.lines[0] + 0.06, T.lines[1], t) * (1 - smooth(T.rise[0], T.rise[0] + 0.06, t));
  if (a <= 0) return;
  ctx.save();
  ctx.fillStyle = rgba(colors.core, 0.75 * a);
  for (const b of BOXES) {
    if (b.thin) continue;
    for (const p of shapeVertices(b)) {
      const [x, y] = cam.toScreen(p);
      ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
    }
  }
  ctx.restore();
}

// The ground: the lot, dashed in DESIGN; in BUILD a dark ground that fades
// into the dark at its edges (no hard edge: the house stands in a void), a
// little of the pass's color round the house, and the scan's plane rising
// through it. The drafting grid lies over it (drawGrid).
function drawGround(ctx, cam, t, colors, fonts, grid) {
  const corners = [[LOT.x[0], 0, LOT.z[0]], [LOT.x[1], 0, LOT.z[0]], [LOT.x[1], 0, LOT.z[1]], [LOT.x[0], 0, LOT.z[1]]];
  const pts = corners.map((p) => cam.toScreen(p));
  const built = smooth(T.rise[0] - 0.02, T.rise[0] + 0.06, t);
  if (built > 0) {
    // an ellipse on screen as wide as the lot and as deep as it looks
    const [hx, hy] = cam.toScreen([TARGET[0], 0, TARGET[2]]);
    const rx = (Math.max(...pts.map(([x]) => x)) - Math.min(...pts.map(([x]) => x))) * 0.62;
    const ry = (Math.max(...pts.map(([, y]) => y)) - Math.min(...pts.map(([, y]) => y))) * 0.62;
    ctx.save();
    ctx.translate(hx, hy);
    ctx.scale(1, ry / rx);
    let g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    g.addColorStop(0, `rgba(7,11,22,${0.95 * built})`);
    g.addColorStop(0.6, `rgba(6,9,19,${0.8 * built})`);
    g.addColorStop(1, "rgba(6,9,19,0)");
    ctx.fillStyle = g;
    ctx.fillRect(-rx, -rx, 2 * rx, 2 * rx);
    ctx.globalCompositeOperation = "lighter";
    g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx * 0.9);
    g.addColorStop(0, rgba(colors.mid, 0.07 * built));
    g.addColorStop(0.5, rgba(colors.deep, 0.025 * built));
    g.addColorStop(1, rgba(colors.deep, 0));
    ctx.fillStyle = g;
    ctx.fillRect(-rx, -rx, 2 * rx, 2 * rx);
    ctx.restore();
  }
  // the lamplight falling out of the windows onto the ground round the
  // house (the house drawn over it), once it's lit
  const spill = litAt(t, SPILL_ON);
  if (spill > 0) {
    const { min, max } = BOX.hGround;
    const foot = [[min[0], 0, min[2]], [max[0], 0, min[2]], [max[0], 0, max[2]], [min[0], 0, max[2]]].map((p) => cam.toScreen(p));
    const [sx, sy] = cam.toScreen([(min[0] + max[0]) / 2, 0, (min[2] + max[2]) / 2]);
    const rx = (Math.max(...foot.map(([x]) => x)) - Math.min(...foot.map(([x]) => x))) * 0.95;
    const ry = Math.max(8, (Math.max(...foot.map(([, y]) => y)) - Math.min(...foot.map(([, y]) => y))) * 1.4);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.translate(sx, sy);
    ctx.scale(1, ry / rx);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    g.addColorStop(0, rgba(ROOM.mid, 0.2 * spill));
    g.addColorStop(0.5, rgba(ROOM.floor, 0.08 * spill));
    g.addColorStop(1, rgba(ROOM.floor, 0));
    ctx.fillStyle = g;
    ctx.fillRect(-rx, -rx, 2 * rx, 2 * rx);
    ctx.restore();
  }
  drawGrid(ctx, cam, grid);
  // the property line, dashed, while it's a drawing
  const line = smooth(T.lines[0], T.lines[0] + 0.08, t) * (1 - smooth(T.rise[0], T.rise[0] + 0.08, t));
  if (line > 0) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.setLineDash([7, 6]);
    ctx.strokeStyle = rgba(BLUE.mid, 0.55 * line);
    ctx.lineWidth = 1;
    path(ctx, pts);
    ctx.stroke();
    ctx.setLineDash([]);
    // its name, along the front
    const [a, b] = [pts[0], pts[1]];
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    ctx.translate(lerp(a[0], b[0], 0.14), lerp(a[1], b[1], 0.14));
    ctx.rotate(ang);
    ctx.font = `700 ${Math.round(clamp(cam.s / 70, 11, 14))}px ${fonts.mono}`;
    ctx.fillStyle = rgba(BLUE.core, 0.9 * line);
    ctx.fillText("PROPERTY LINE", 0, -7);
    ctx.restore();
  }
  // the scan's plane, rising through the property
  const k = clamp((t - T.rise[0]) / (T.rise[1] - T.rise[0]));
  const glow = Math.sin(Math.PI * k);
  if (glow > 0.01) {
    const h = k * (HEIGHT + 0.5);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    path(ctx, corners.map(([x, , z]) => cam.toScreen([x, h, z])));
    ctx.strokeStyle = rgba(colors.core, 0.35 * glow);
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = rgba(colors.mid, 0.035 * glow);
    ctx.fill();
    ctx.restore();
  }
}

// The drafting grid (11-23: the user asked for a subtle blueprint grid
// behind the build, in place of the light): on the ground, in perspective,
// a line every 4 ft and a heavier one every 20, turning with the camera like
// a CAD viewport's and fading out round the house (GRID_R feet), so it has
// no edge; and on the sheet behind it all, flat (drawSheet). Both a little
// stronger while the house is a drawing (`grid`, 1 to 1.6). Each line is one
// stroke, its fade a gradient along it with a stop at each of GRID_STOPS
// (placed where those points fall on screen, so the perspective is right):
// cut into short pieces instead, it cost a phone several ms a frame. Round
// `center` within `radius` feet (the turntable passes its own).
const GRID_R = 78;
const GRID_STEP = 4;
const GRID_STOPS = [0, 0.12, 0.25, 0.38, 0.5, 0.62, 0.75, 0.88, 1];
export function drawGrid(ctx, cam, strength, [cx, , cz] = TARGET, radius = GRID_R) {
  ctx.save();
  ctx.lineWidth = 1;
  // lines along z (at x = c), then along x (at z = c)
  for (const [mid, along, point] of [[cx, cz, (c, v) => [c, 0, v]], [cz, cx, (c, v) => [v, 0, c]]]) {
    for (let c = Math.ceil((mid - radius) / GRID_STEP) * GRID_STEP; c < mid + radius; c += GRID_STEP) {
      const off = c - mid;
      const half = Math.sqrt(radius * radius - off * off);
      if (!(half > 1)) continue;
      const at = (k) => cam.toScreen(point(c, along - half + 2 * half * k));
      const [ax, ay] = at(0), [bx, by] = at(1);
      const len2 = (bx - ax) ** 2 + (by - ay) ** 2;
      if (len2 < 1) continue;
      const peak = (Math.abs(c % 20) < 1e-6 ? 0.18 : 0.09) * strength;
      const g = ctx.createLinearGradient(ax, ay, bx, by);
      for (const k of GRID_STOPS) {
        const [px, py] = at(k);
        const v = (2 * k - 1) * half;
        const fade = Math.max(0, 1 - (off * off + v * v) / (radius * radius)) ** 2;
        g.addColorStop(clamp(((px - ax) * (bx - ax) + (py - ay) * (by - ay)) / len2), rgba(GRID, peak * fade));
      }
      ctx.strokeStyle = g;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.stroke();
    }
  }
  ctx.restore();
}

// The sheet behind it all: a fine line every 24 px and a heavier one every
// 120, centred on the house's room and fading out from it, fainter than the
// ground's. It doesn't move, so it's drawn once per size and kept.
let sheet = null;
export function drawSheet(ctx, width, height, dpr, room, strength) {
  const cx = Math.round((room.x0 + room.x1) / 2), cy = Math.round((room.y0 + room.y1) / 2);
  const key = [width, height, dpr, cx, cy].join(":");
  if (sheet?.key !== key) {
    const c = makeCanvas(Math.round(width * dpr), Math.round(height * dpr));
    const g = c.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.lineWidth = 1;
    for (const [step, a] of [[24, 0.04], [120, 0.07]]) {
      g.strokeStyle = rgba(GRID, a);
      g.beginPath();
      for (let x = cx % step; x < width; x += step) {
        g.moveTo(Math.round(x) + 0.5, 0);
        g.lineTo(Math.round(x) + 0.5, height);
      }
      for (let y = cy % step; y < height; y += step) {
        g.moveTo(0, Math.round(y) + 0.5);
        g.lineTo(width, Math.round(y) + 0.5);
      }
      g.stroke();
    }
    g.globalCompositeOperation = "destination-in";
    const r = Math.max(width, height) * 0.62;
    const m = g.createRadialGradient(cx, cy, 0, cx, cy, r);
    m.addColorStop(0, "rgba(0,0,0,1)");
    m.addColorStop(0.45, "rgba(0,0,0,0.6)");
    m.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = m;
    g.fillRect(0, 0, width, height);
    sheet = { key, canvas: c };
  }
  ctx.save();
  ctx.globalAlpha = Math.min(1, strength);
  ctx.drawImage(sheet.canvas, 0, 0, width, height);
  ctx.restore();
}

// How far each window is lit, 0-1.
const litAt = (t, on) => smooth(on, on + 0.08, clamp((t - T.lights[0]) / (T.lights[1] - T.lights[0])));

// A lit room seen through a window, in a face's rectangle `u` across and
// `v` up: warm lamplight (ROOM), a little brighter toward the ceiling and
// falling off toward the floor, and a little glare round it (`glows`, see
// drawGlows; `box`, its wall, which doesn't hide it).
const ROOM = { floor: [150, 76, 22], mid: [242, 164, 74], ceiling: [252, 206, 138] };
// the lamplight's gradient, from a window's foot to its head (screen px),
// `lit` 0-1 (shared with the turntable)
export function roomLight(ctx, [fx, fy], [hx, hy], lit) {
  const g = ctx.createLinearGradient(fx, fy, hx, hy + 0.01);
  g.addColorStop(0, rgba(ROOM.floor, 0.9 * lit));
  g.addColorStop(0.55, rgba(ROOM.mid, 0.92 * lit));
  g.addColorStop(0.92, rgba(ROOM.ceiling, 0.94 * lit));
  g.addColorStop(1, rgba(ROOM.mid, 0.92 * lit));
  return g;
}
function drawRoom(ctx, cam, face, [u0, u1], [v0, v1], lit, glows, box) {
  const quad = [[u0, v0], [u1, v0], [u1, v1], [u0, v1]].map(([u, v]) => cam.toScreen(onFace(face, u, v)));
  const foot = cam.toScreen(onFace(face, (u0 + u1) / 2, v0));
  const head = cam.toScreen(onFace(face, (u0 + u1) / 2, v1));
  path(ctx, quad);
  ctx.fillStyle = roomLight(ctx, foot, head, lit);
  ctx.fill();
  const span = Math.hypot(...sub(onFace(face, u0, v0), onFace(face, u1, v1)));
  glows.push({ at: onFace(face, (u0 + u1) / 2, (v0 + v1) / 2), r: span * 0.4, a: lit, box });
}

// One face of a built shape, as far as the scan has built it (`h`, feet):
// its shade (darker at the foot), its boards or shingle courses, its windows
// (dark glass, lamplight once lit), a fine edge, and the pass's color
// catching its ridge or its top. Cut by the scan, everything is drawn whole
// and clipped to the built part.
function drawFace(ctx, cam, b, key, face, colors, t, glows, h) {
  const whole = h >= b.max[1];
  const cut = whole ? face.p : clipBelow(face.p, h);
  if (!cut) return;
  const full = face.p.map((p) => cam.toScreen(p));
  const pts = whole ? full : cut.map((p) => cam.toScreen(p));
  const mat = matOf(b);
  ctx.save();
  if (!whole) {
    path(ctx, pts);
    ctx.clip();
  }
  const base = shade(b, face.n, colors);
  path(ctx, full);
  if (key === "y+") ctx.fillStyle = rgba(base);
  else {
    const foot = [(full[0][0] + full[1][0]) / 2, (full[0][1] + full[1][1]) / 2];
    const head = [(full[2][0] + full[3][0]) / 2, (full[2][1] + full[3][1]) / 2];
    const g = ctx.createLinearGradient(foot[0], foot[1], head[0], head[1] + 0.01);
    g.addColorStop(0, rgba(base.map((v) => v * 0.6)));
    g.addColorStop(1, rgba(base.map((v) => Math.min(255, v * 1.1))));
    ctx.fillStyle = g;
  }
  ctx.fill();
  if (mat.slats && key !== "y+" && !face.tri) {
    const rise = b.max[1] - b.min[1];
    ctx.beginPath();
    for (let v = mat.slats / rise; v < 1; v += mat.slats / rise) {
      const [x0, y0] = cam.toScreen(onFace(face, 0, v)), [x1, y1] = cam.toScreen(onFace(face, 1, v));
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
    }
    ctx.strokeStyle = b.mat === "shingle" ? "rgba(0,0,0,0.22)" : "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  for (const w of WINDOWS) {
    if (w.box !== b.id || w.face !== key) continue;
    const quad = [[w.u[0], w.v[0]], [w.u[1], w.v[0]], [w.u[1], w.v[1]], [w.u[0], w.v[1]]].map(([u, v]) => cam.toScreen(onFace(face, u, v)));
    path(ctx, quad);
    ctx.fillStyle = "rgb(12,14,20)";
    ctx.fill();
    const lit = litAt(t, w.on);
    if (lit > 0) drawRoom(ctx, cam, face, w.u, w.v, lit, glows, b.id);
    path(ctx, quad);
    ctx.strokeStyle = "rgba(230,228,220,0.55)"; // a painted frame
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }
  ctx.restore();
  path(ctx, pts);
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 1;
  ctx.stroke();
  if (!whole) return;
  if (key === "y+") {
    ctx.strokeStyle = rgba(colors.mid, 0.3);
    ctx.stroke();
  }
  if (face.ridge) {
    ctx.beginPath();
    ctx.moveTo(full[3][0], full[3][1]);
    ctx.lineTo(full[2][0], full[2][1]);
    ctx.strokeStyle = rgba(colors.mid, 0.45);
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }
}

// One shape in BUILD: the part below the scan solid (its cut glowing where
// the scan is passing through it), the part above still wireframe.
function drawShape(ctx, cam, b, t, colors, glows) {
  const h = clamp((t - T.rise[0]) / (T.rise[1] - T.rise[0])) * (HEIGHT + 0.5);
  if (h > b.min[1]) {
    for (const [key, f] of Object.entries(shapeFaces(b))) if (visible(f, cam.eye)) drawFace(ctx, cam, b, key, f, colors, t, glows, h);
    const cap = sectionAt(b, h);
    if (cap) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      path(ctx, cap.map((p) => cam.toScreen(p)));
      ctx.fillStyle = rgba(colors.mid, 0.22);
      ctx.fill();
      ctx.strokeStyle = rgba(colors.core, 0.9);
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();
    }
  }
  if (h < b.max[1]) {
    const rest = shapeEdges(b).map((e) => clipAbove(e, h)).filter(Boolean).map(([a, c]) => ({ a, c }));
    strokeEdges(ctx, cam, rest, colors, 1 - smooth(T.rise[1] - 0.04, T.rise[1], t));
  }
}

// The windows' glare, a little (11-23): a soft warm haze round each lit
// window, with no hot middle. Until then each had a white-hot core at nearly
// half strength, spilling over the roof and past the walls, and the user
// found the light too much; with none at all, the house looked bland.
// GLARE: how strong (`a`) and how far it reaches (`size`, times the
// window's size).
const GLARE = { a: 0.45, size: 3 };
let glare = null;
// Each is dimmed by how much of it the solid shapes in front of it hide (its
// middle and four points round it; not posts, beams or slats, which would
// make it flicker as the camera turns, and not its own wall), as on the
// turntable: the porch's roof covers the windows under it.
const OCCLUDERS = BOXES.filter((b) => Math.min(b.max[0] - b.min[0], b.max[2] - b.min[2]) >= 1.5).map((b) => ({ id: b.id, planes: planesOf(b) }));
function drawGlows(ctx, cam, glows) {
  if (!glows.length) return;
  for (const g of glows) {
    const k = g.r * 0.45;
    const pts = [g.at, [g.at[0] + k, g.at[1], g.at[2]], [g.at[0] - k, g.at[1], g.at[2]], [g.at[0], g.at[1] + k, g.at[2]], [g.at[0], g.at[1] - k, g.at[2]]];
    g.a *= pts.filter((p) => !OCCLUDERS.some((o) => o.id !== g.box && hides(o.planes, cam.eye, p))).length / pts.length;
  }
  drawGlare(ctx, cam, glows);
}
// The glows themselves (shared with the turntable, which dims its own
// first): { at (feet), r (feet), a (0-1) } each.
export function drawGlare(ctx, cam, glows) {
  if (!glows.length) return;
  if (!glare) {
    glare = makeCanvas(64, 64);
    const g = glare.getContext("2d");
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, rgba(ROOM.ceiling, 0.7));
    grad.addColorStop(0.3, rgba(ROOM.mid, 0.3));
    grad.addColorStop(1, rgba(ROOM.mid, 0));
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
  }
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const { at, r, a } of glows) {
    if (a <= 0.01) continue;
    const [x, y, z] = cam.toScreen(at);
    const size = r * (cam.s / z) * GLARE.size;
    ctx.globalAlpha = a * GLARE.a;
    ctx.drawImage(glare, x - size / 2, y - size * 0.4, size, size * 0.8);
  }
  ctx.restore();
}

// DESIGN's notes: a dot on the drawing, a leader out from it, and the label
// on a dark plate with a blue edge, big enough to read (the user asked),
// kept on screen. `a` is how far they've come up, 0-1.
const NOTE_TONES = {
  blue: { ink: BLUE.core, edge: BLUE.mid, plate: "rgba(3,8,22,0.82)" },
};
function drawNotes(ctx, cam, a, notes, fonts, width, tone = NOTE_TONES.blue) {
  if (a <= 0) return;
  const fs = Math.round(clamp(cam.s / 64, 11, 15));
  const padX = Math.round(fs * 0.55), plateH = Math.round(fs * 1.7);
  ctx.save();
  ctx.globalAlpha = a;
  ctx.font = `700 ${fs}px ${fonts.mono}`;
  ctx.textBaseline = "middle";
  const reach = clamp(cam.s / 26, 18, 40);
  for (const { at, dir, text } of notes) {
    const [x, y] = cam.toScreen(at);
    const label = text.toUpperCase();
    const plateW = ctx.measureText(label).width + padX * 2;
    // the elbow, then the plate beyond it on the side the note leans to
    const ex = x + dir[0] * reach * 0.8, ey = y + dir[1] * reach;
    let px = dir[0] > 0 ? ex + 10 : ex - 10 - plateW;
    px = clamp(px, 8, width - 8 - plateW);
    const py = ey - plateH / 2;
    ctx.strokeStyle = rgba(tone.ink, 0.85);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(ex, ey);
    ctx.lineTo(dir[0] > 0 ? px : px + plateW, ey);
    ctx.stroke();
    ctx.fillStyle = rgba(tone.ink, 1);
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, TAU);
    ctx.fill();
    ctx.fillStyle = tone.plate;
    ctx.fillRect(px, py, plateW, plateH);
    ctx.strokeStyle = rgba(tone.edge, 0.9);
    ctx.lineWidth = 1;
    ctx.strokeRect(px + 0.5, py + 0.5, plateW - 1, plateH - 1);
    ctx.fillStyle = rgba(tone.ink, 1);
    ctx.fillText(label, px + padX, ey + 1);
  }
  ctx.restore();
}

// film grain: one tile of noise, laid over the frame at a new offset each time
let grain = null;
export function grainTile() {
  if (grain) return grain;
  const c = makeCanvas(256, 256);
  const g = c.getContext("2d"), img = g.createImageData(256, 256), r = rng(5);
  for (let i = 0; i < img.data.length; i += 4) {
    img.data[i] = img.data[i + 1] = img.data[i + 2] = r() * 255;
    img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  return (grain = c);
}

// ---- lettering ---------------------------------------------------------------
// "DREAM. DESIGN. BUILD." in outline behind the scene, one line across the
// screen, spaced evenly between the navbar and what is under it (see
// placeScene), visible but in the background: each word outlined, the
// pass's word brighter in its light's color and faintly filled, the first lit
// from the first frame; once the render is complete, all three.
function drawTitle(ctx, width, portrait, title, t, fonts) {
  const words = PASSES.map((p) => p.word);
  ctx.save();
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.lineJoin = "round";
  ctx.font = `${title.size}px ${fonts.display}`;
  // stretched tall from its baseline (on a phone)
  ctx.translate(0, title.baseline);
  ctx.scale(1, title.stretch);
  const space = ctx.measureText(" ").width;
  const widths = words.map((w) => ctx.measureText(w).width);
  let x = width / 2 - (widths.reduce((sum, w) => sum + w, 0) + space * 2) / 2;
  // (thinner as it's stretched, so its outline stays even)
  ctx.lineWidth = Math.max(0.8, title.size / (portrait ? 45 : 110) / ((1 + title.stretch) / 2));
  const done = smooth(T.settle - 0.05, T.settle, t);
  const lit = (i) => {
    const from = PASSES[i].from, to = PASSES[i + 1]?.from ?? 2;
    const on = from <= 0 ? 1 : smooth(from - 0.03, from + 0.03, t);
    return Math.max(on * (1 - smooth(to - 0.03, to + 0.03, t)), done);
  };
  const { faint, bright, fill } = TITLE[portrait ? "portrait" : "desktop"];
  words.forEach((word, i) => {
    const k = lit(i);
    const c = i === 1 ? BLUE : GOLD;
    if (k > 0) {
      ctx.fillStyle = rgba(c.mid, fill * k);
      ctx.fillText(word, x, 0);
    }
    ctx.strokeStyle = rgba(mix([255, 255, 255], c.mid, k), lerp(faint, bright, k));
    ctx.strokeText(word, x, 0);
    x += widths[i] + space;
  });
  ctx.restore();
}

// the viewfinder's corners round the room the house is in
function drawFrame(ctx, cam, portrait, width) {
  const { box } = cam;
  const x0 = box.x0, x1 = Math.min(box.x1, width - (portrait ? 16 : 24)), y0 = box.y0, y1 = box.y1;
  const arm = portrait ? 12 : 16;
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (const [px, py, dx, dy] of [[x0, y0, 1, 1], [x1, y0, -1, 1], [x0, y1, 1, -1], [x1, y1, -1, -1]]) {
    ctx.moveTo(px + dx * arm, py);
    ctx.lineTo(px, py);
    ctx.lineTo(px, py + dy * arm);
  }
  ctx.stroke();
  ctx.restore();
}

// The sky (11-23: the user asked for some color in the background): SKY,
// from its top to the horizon (where the ground meets it, behind the house,
// wherever the camera is), then the ground darkening toward the foot of the
// screen, where the copy is; and along the horizon a wide, soft glow in the
// pass's color (gold, white, blue, gold), the last of the day behind the
// house: warm in the gold passes, like a dusk sky's last light, blue in
// DESIGN's. A band, never a light: no source, no rays (the user had the
// light taken out). Kept below `floor` (px: the title's foot), so it never
// washes the words out (looking down at the start, the camera sees the
// horizon at the title's height). `hue` 0-1 is the passes' color, gold to
// blue. `cam` has the room it frames (`box`); `target`, what it looks at.
// (Shared with the turntable.)
export function drawSky(ctx, width, height, cam, colors, hue, floor, target = TARGET) {
  const { box } = cam;
  const rx = Math.max(box.x1 - box.x0, width * 0.5) * 0.85;
  const ry = Math.max(40, (box.y1 - box.y0) * 0.3);
  const d = sub(target, cam.eye);
  const ahead = norm([d[0], 0, d[2]]);
  const [, horizon] = cam.toScreen([cam.eye[0] + ahead[0] * 1e5, cam.eye[1], cam.eye[2] + ahead[2] * 1e5]);
  const line = Math.max(horizon, floor + 0.55 * ry);
  const at = clamp(line / height, 0.05, 0.9);
  const blue = clamp(hue * 2 - 1); // 0, until the house is drawn in blue
  const c = (k) => mix(SKY.dusk[k], SKY.blueprint[k], blue);
  let g = ctx.createLinearGradient(0, 0, 0, height);
  g.addColorStop(0, rgba(c("top")));
  g.addColorStop(at, rgba(c("horizon")));
  g.addColorStop(Math.min(1, at + 0.12), rgba(c("ground")));
  g.addColorStop(1, rgba(c("foot")));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, width, height);
  // the glow along the horizon, centred behind the house: the pass's deep
  // color laid over the sky, and a little of its bright one added at its
  // heart
  ctx.save();
  ctx.translate((box.x0 + box.x1) / 2, line);
  ctx.scale(1, ry / rx);
  g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
  g.addColorStop(0, rgba(colors.deep, 0.34));
  g.addColorStop(0.5, rgba(colors.deep, 0.12));
  g.addColorStop(1, rgba(colors.deep, 0));
  ctx.fillStyle = g;
  ctx.fillRect(-rx, -rx, 2 * rx, 2 * rx);
  ctx.globalCompositeOperation = "lighter";
  g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx * 0.6);
  g.addColorStop(0, rgba(colors.mid, 0.1));
  g.addColorStop(1, rgba(colors.mid, 0));
  ctx.fillStyle = g;
  ctx.fillRect(-rx, -rx, 2 * rx, 2 * rx);
  ctx.restore();
}

// ---- the frame -------------------------------------------------------------
const DEFAULT_FONTS = { display: "'Bebas Neue', 'Arial Narrow', sans-serif", mono: "'Courier New', monospace" };

export function drawScene(ctx, { width, height, dpr = 1, t, spin = 0, portrait = false, layout, calm = false, lite = false, fonts = DEFAULT_FONTS }) {
  layout ??= portrait ? { copyTop: 0.56 } : { copyTop: 0.58, copyRight: 0.45, titleRight: 0.42 };
  const { title, room } = placeScene(ctx, width, height, portrait, layout, fonts);
  const cam = camera(width, height, portrait, t, spin, calm, room);
  // the passes' color: gold, then white (held), then blue, then gold again
  const hue = (0.5 * smooth(T.white[0], T.white[1], t) + 0.5 * smooth(T.blue[0], T.blue[1], t)) * (1 - smooth(T.gold[0], T.gold[1], t));
  const colors = lightColors(hue);
  const built = smooth(T.rise[0], T.rise[0] + 0.04, t);
  // the grid a little stronger while the house is a drawing
  const grid = 1 + 0.6 * smooth(T.lines[0], T.lines[0] + 0.08, t) * (1 - smooth(T.rise[0], T.rise[0] + 0.1, t));

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  drawSky(ctx, width, height, cam, colors, hue, title.bottom);
  drawSheet(ctx, width, height, dpr, room, grid);
  drawTitle(ctx, width, portrait, title, t, fonts);
  drawGround(ctx, cam, t, colors, fonts, grid);

  // DREAM: the pieces coming together, until DESIGN draws over them
  drawDream(ctx, cam, t, calm, colors);

  // DESIGN's wireframe, until the scan takes over in BUILD
  const span = T.lines[1] - T.lines[0], dur = 0.22;
  if (built < 1) {
    strokeEdges(ctx, cam, EDGES, colors, 1 - built, (e) => clamp((t - T.lines[0] - span * (1 - dur) * e.order) / (span * dur)));
  }
  drawVertices(ctx, cam, t, colors);

  // BUILD, far to near
  const glows = [];
  if (t >= T.rise[0]) {
    for (const b of drawOrder(BOXES, cam.eye)) drawShape(ctx, cam, b, t, colors, glows);
    // the fire pit and the pergola's lights
    const lamps = litAt(t, LAMPS_ON);
    if (lamps > 0) for (const l of LAMPS) glows.push({ at: l.at, r: l.r, a: (l.a ?? 1) * lamps });
  }
  drawGlows(ctx, cam, glows);
  drawNotes(ctx, cam, smooth(T.notes[0], T.notes[1], t) * (1 - smooth(T.rise[0], T.rise[0] + 0.05, t)), NOTES, fonts, width);

  // in front of the lens: a vignette, grain
  const vx = (cam.box.x0 + cam.box.x1) / 2, vy = height * 0.45;
  const v = ctx.createRadialGradient(vx, vy, Math.min(width, height) * 0.3, vx, vy, Math.max(width, height) * 0.85);
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(1, "rgba(1,3,10,0.65)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, width, height);
  // (no grain on a phone, `lite`: unseen at that size, and costly there)
  if (!lite) {
    ctx.save();
    ctx.globalCompositeOperation = "overlay";
    ctx.globalAlpha = 0.08;
    const r = rng(Math.round(t * 1000 + spin * 400) + 1); // new grain each frame
    ctx.translate(-r() * 256, -r() * 256);
    ctx.fillStyle = ctx.createPattern(grainTile(), "repeat");
    ctx.fillRect(0, 0, width + 256, height + 256);
    ctx.restore();
  }

  // over the lens's darkening, so it stays crisp: the viewfinder
  drawFrame(ctx, cam, portrait, width);
}
