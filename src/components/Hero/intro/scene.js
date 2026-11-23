// The homepage hero, drawn on a 2D canvas, playing by itself as the page
// opens: a house rendered the way a visual-effects shot is, pass by pass
// (Andranik's first trade), to the tagline, Dream. Design. Build.
//
//   DREAM   the house as a vision in gold glass, in pieces, as in an
//           architect's exploded view: each piece hangs over its place, and
//           from the first scroll they all close in and land, one by one.
//   DESIGN  the light turns white, and the glass house with it, while a
//           wireframe draws itself over it, edge by edge; then the light
//           turns blueprint blue, the glass fades, and the drawing is noted:
//           the main house, the ADU, the pool, the pergola.
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
// than with the scroll, the user asked for no light or flare and no dust): the backlight
// with its shafts, bloom and streak, and the dust, are gone from this scene.
// Its math, colors and those lighting pieces are still exported for the
// service pages' turntable (Hero/studio/studio.js), which uses them.

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
// Boxes, [x0, y0, z0] to [x1, y1, z1] in feet, none overlapping (so they can
// be put in drawing order, see drawOrder). `thin` parts (the pergola's posts,
// beams and slats) are only edges in DREAM.
const box = (id, min, max, mat, more = {}) => ({ id, min, max, mat, ...more });

function pergola() {
  const out = [];
  const [X0, X1, Z0, Z1, Y, P] = [-36, -23, -14, 2, 9, 0.6];
  [[X0, Z0], [X1 - P, Z0], [X0, Z1 - P], [X1 - P, Z1 - P]].forEach(([x, z], i) =>
    out.push(box(`post${i}`, [x, 0.4, z], [x + P, Y, z + P], "wood", { thin: true })),
  );
  [Z0, Z1 - P].forEach((z, i) => out.push(box(`beam${i}`, [X0 - 0.6, Y, z], [X1 + 0.6, Y + 0.8, z + P], "wood", { thin: true })));
  for (let x = X0 + 0.4, i = 0; x < X1 - 0.3; x += 1.25, i++)
    out.push(box(`slat${i}`, [x, Y + 0.8, Z0 - 0.4], [x + 0.35, Y + 1.5, Z1 + 0.4], "wood", { thin: true }));
  return out;
}

const BOXES = [
  box("patio", [-37, 0, -15], [-22, 0.4, 3], "deck"),
  ...pergola(),
  box("fin", [-21, 0, -11], [-18, 16, 12], "concrete"), // a concrete fin wall
  box("ground", [-18, 0, -8], [14, 10.5, 7], "glass"), // the ground floor, glass all round
  box("upper", [-12, 10.5, -11], [24, 20, 7], "clad"), // the upper floor, out over the terrace
  box("tower", [8, 0, 7], [13, 23, 12], "concrete"), // the stair tower
  box("deck", [-9, 0, -27], [25, 0.35, -12], "deck"), // the pool deck
  box("adu", [27, 0, 10], [39, 11, 24], "stucco"), // the ADU, at the back
];
const BOX = Object.fromEntries(BOXES.map((b) => [b.id, b]));
const POOL = { x: [-6, 22], z: [-24, -15], y: 0.36 };
const LOT = { x: [-40, 42], z: [-30, 27] };

// How each finish takes the light: `albedo`, how much it reflects; `slats`,
// lines across it every so many feet; `glass`, a glass wall (dark, its
// mullions every 4 ft, lit from inside once the lights are on).
const MATS = {
  glass: { albedo: 0.05, glass: true },
  clad: { albedo: 0.17, slats: 1.1 },
  concrete: { albedo: 0.46 },
  stucco: { albedo: 0.62 },
  deck: { albedo: 0.3 },
  wood: { albedo: 0.24 },
};

// Windows on a box's face: `u` across it (left to right as you face it), `v`
// up it, as fractions; each comes on at `on`, through T.lights. The glass
// floor comes on first.
const WINDOWS = [
  { box: "upper", face: "z-", u: [0.05, 0.6], v: [0.28, 0.8], on: 0.2 },
  { box: "upper", face: "z-", u: [0.68, 0.95], v: [0.28, 0.8], on: 0.38 },
  { box: "upper", face: "x+", u: [0.12, 0.88], v: [0.28, 0.8], on: 0.46 },
  { box: "upper", face: "x-", u: [0.3, 0.72], v: [0.3, 0.78], on: 0.3 },
  { box: "tower", face: "x+", u: [0.32, 0.68], v: [0.06, 0.93], on: 0.56 },
  { box: "adu", face: "z-", u: [0.1, 0.54], v: [0.26, 0.8], on: 0.66 },
  { box: "adu", face: "z-", u: [0.66, 0.86], v: [0, 0.8], on: 0.72 },
  { box: "adu", face: "x-", u: [0.22, 0.78], v: [0.3, 0.78], on: 0.78 },
];
const GLASS_ON = 0.05;
const POOL_ON = 0.86;

// What the drawing is noted with in DESIGN: a point on the property, which
// way the label leans off it, and the label.
const NOTES = [
  { at: [-6, 20, -11], dir: [-1, -1], text: "Main house" },
  { at: [33, 11, 17], dir: [1, -1], text: "ADU" },
  { at: [8, POOL.y, -19.5], dir: [1, 1], text: "Pool" },
  { at: [-29.5, 10.5, -6], dir: [-1, -1], text: "Pergola" },
];

// The key light: behind the house, a little above its roof, so the roofs and
// edges catch it (in the pass's color); it isn't drawn.
const KEY = norm([-6, 18, 95]);
const FILL = norm([0.25, 0.55, -0.8]); // a little from the camera's side

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
// a box cut off below or above height y (for the rising scan)
const below = (b, y) => (y <= b.min[1] ? null : { ...b, max: [b.max[0], Math.min(b.max[1], y), b.max[2]] });
const above = (b, y) => (y >= b.max[1] ? null : { ...b, min: [b.min[0], Math.max(b.min[1], y), b.min[2]] });
const HEIGHT = Math.max(...BOXES.map((b) => b.max[1]));

// The wireframe's edges, each with when it starts drawing (0-1 through
// T.lines): from the ground up, left to right. Vertical edges draw upward.
const EDGES = BOXES.flatMap((b) =>
  edges(b).map(([a, c]) => {
    const order = 0.72 * (Math.min(a[1], c[1]) / HEIGHT) + 0.28 * ((a[0] + c[0]) / 2 - LOT.x[0]) / (LOT.x[1] - LOT.x[0]);
    return { a, c, order, box: b };
  }),
);

// DREAM: at first the house is apart, as in an architect's exploded view:
// each piece hangs over its place (`lift`, feet), the upper floor highest,
// the pergola's posts, beams and slats in layers. From the very first scroll
// they all close in together, easing into place, and land in turn: the
// lowest first (`land`, as a share of T.dream), the slats last, left to
// right. With `calm` they start a little closer (CALM_APART).
const DREAM = {
  patio: { lift: [0, 2, 0], land: 0.35 },
  deck: { lift: [0, 2, 0], land: 0.35 },
  ground: { lift: [0, 6, 0], land: 0.5 },
  fin: { lift: [-3, 5, 0], land: 0.55 },
  adu: { lift: [4, 5, 0], land: 0.6 },
  post: { lift: [0, 4, 0], land: 0.65 },
  tower: { lift: [0, 9, 4], land: 0.72 },
  upper: { lift: [0, 12, 0], land: 0.8 },
  beam: { lift: [0, 8, 0], land: 0.86 },
  slat: { lift: [0, 11, 0], land: [0.88, 1] },
};
const CALM_APART = 0.75;
const PIECES = (() => {
  const slats = BOXES.filter((b) => b.id.startsWith("slat")).length;
  return BOXES.map((b) => {
    const [, kind, n] = b.id.match(/^([a-z]+)(\d*)$/);
    const { lift, land } = DREAM[kind];
    return { box: b, lift, land: Array.isArray(land) ? lerp(land[0], land[1], Number(n) / (slats - 1)) : land };
  });
})();
const PIECE = Object.fromEntries(PIECES.map((q) => [q.box.id, q]));
// The share of the way a piece has come, k through its time: already moving
// at the first scroll, slowing as it lands, but still moving to the end (an
// ease-out left the second half of DREAM nearly still).
const closing = (k) => k + k * k - k * k * k;
// how far piece `q` still has to go, 0-1, and the last piece
const apartOf = (q, t) => 1 - closing(clamp((t - T.dream[0]) / ((T.dream[1] - T.dream[0]) * q.land)));
const apart = (t) => apartOf({ land: 1 }, t);
// where it is: its lift, by how far it still has to go
const offsetOf = (q, t, calm) => q.lift.map((v) => v * apartOf(q, t) * (calm ? CALM_APART : 1));
const moved = (b, [dx, dy, dz]) => ({ ...b, min: [b.min[0] + dx, b.min[1] + dy, b.min[2] + dz], max: [b.max[0] + dx, b.max[1] + dy, b.max[2] + dz] });
// every corner of the pieces where they are at `t`
const dreamCorners = (t, calm) => PIECES.flatMap((q) => edges(moved(q.box, offsetOf(q, t, calm))).flat());

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
// It circles the house, looking at the middle of it from DIST feet: from its
// left (the pergola) round to its right (the ADU), a little lower as it
// goes, already moving as the play starts (`orbitEase`), with Reduce Motion
// on too (`calm`). Then, as the hero scrolls away, it turns SPIN degrees
// further (`spin`, as the service pages' turntable does): a touch, nothing
// to scroll through. The view is fitted into the room the copy leaves (see
// room), the same size all the way round, and pushes in a little as the
// scene plays (not with `calm`). In DREAM it also takes in the pieces where
// they hang, closing in as they land (not with `calm`: no zoom).
const TARGET = [2, 7, -2];
const DIST = 135;
const ORBIT = {
  desktop: { yaw: [-38, 20], pitch: [17, 11] },
  portrait: { yaw: [-30, 14], pitch: [24, 18] },
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
// unlit and lit; `fill`: a lit word's fill.
const TITLE = {
  text: "DREAM. DESIGN. BUILD.",
  portrait: { span: 0.86, maxH: 0.05, faint: 0.22, bright: 0.65, fill: 0.13 },
  desktop: { span: 0.84, maxH: 0.17, faint: 0.07, bright: 0.28, fill: 0.05 },
};
// px from the title down to the house's room, beside the copy
const UNDER_TITLE = 20;

// How much of the screen the house takes from every angle it's seen from,
// on a screen 1 unit away: [x0, y0, x1, y1] around the target. The lot's
// line, only a faint dashed one, may run past it.
const EXTENT = (() => {
  const pts = BOXES.flatMap((b) => edges(b).flat());
  const out = {};
  for (const [key, orbit] of Object.entries(ORBIT)) {
    const e = [Infinity, Infinity, -Infinity, -Infinity];
    for (const [yaw, pitch] of allAngles(orbit)) extentOf(view(yaw, pitch).project, pts, e);
    out[key] = e;
  }
  return out;
})();
// With `calm`, the house and the pieces where they start, from every angle,
// so the camera can circle without the view zooming as they land.
const CALM_EXTENT = (() => {
  const pts = dreamCorners(0, true);
  const out = {};
  for (const [key, orbit] of Object.entries(ORBIT)) {
    const e = [...EXTENT[key]];
    for (const [yaw, pitch] of allAngles(orbit)) extentOf(view(yaw, pitch).project, pts, e);
    out[key] = e;
  }
  return out;
})();

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
  const e = EXTENT[portrait ? "portrait" : "desktop"];
  const cfg = TITLE[portrait ? "portrait" : "desktop"];
  ctx.font = `100px ${fonts.display}`;
  const m = ctx.measureText(TITLE.text);
  const ascent = m.actualBoundingBoxAscent / 100;
  const capH = (m.actualBoundingBoxAscent + m.actualBoundingBoxDescent) / 100; // at 1px
  const maxSize = Math.min((width * cfg.span * 100) / m.width, height * cfg.maxH);
  const titleAt = (size, capsTop) => ({ size, baseline: capsTop + ascent * size, bottom: capsTop + capH * size });
  const fit = ({ room: b }) => Math.min((b.x1 - b.x0) / (e[2] - e[0]), (b.y1 - b.y0) / (e[3] - e[1]));
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
    const houseH = ((x1 - x0) * (e[3] - e[1])) / (e[2] - e[0]);
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
  const size = Math.min(maxSize, (space * 0.55) / capH);
  const title = titleAt(size, nav + (space - capH * size) / 2);
  const y0 = title.bottom + UNDER_TITLE;
  const beside = {
    title,
    room: {
      x0: Math.min(0.6, Math.max(layout.copyRight ?? 0, layout.titleRight ?? 0) + 0.03) * width,
      x1: 0.975 * width,
      y0,
      y1: Math.max(y0 + 0.18 * height, 0.93 * height),
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
  // the house, and in DREAM the pieces where they hang (with `calm`, where
  // they start, from every angle, so it doesn't zoom)
  const whole = EXTENT[portrait ? "portrait" : "desktop"];
  const e = calm
    ? CALM_EXTENT[portrait ? "portrait" : "desktop"]
    : apart(t) > 0
      ? extentOf(project, dreamCorners(t, false), [...whole])
      : whole;
  // pushed in all the way, it still fits
  const s0 = Math.min((box.x1 - box.x0) / (e[2] - e[0]), (box.y1 - box.y0) / (e[3] - e[1])) / (1 + PUSH_IN);
  const s = s0 * (1 + (calm ? 0 : PUSH_IN * smooth(0, 1, t)));
  // the target's place on screen: the extent centred across the room, and
  // at its top (as far in as it pushes) or in its middle
  const ox = (box.x0 + box.x1) / 2 - s0 * ((e[0] + e[2]) / 2);
  const oy = box.top ? box.y0 - s0 * (calm ? 1 : 1 + PUSH_IN) * e[1] : (box.y0 + box.y1) / 2 - s0 * ((e[1] + e[3]) / 2);
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

// A face's color in the light: a little ambient, the fill from the camera's
// side, and the key light (gold, or blue while it's blue) where it faces it.
function shade(mat, n, colors) {
  const a = MATS[mat].albedo;
  const k = Math.max(0, dot(n, KEY)), f = Math.max(0, dot(n, FILL));
  return [0, 1, 2].map((i) =>
    Math.min(255, Math.round(a * (26 + [118, 124, 136][i] * f) + a * colors.mid[i] * 1.25 * k + 4)),
  );
}

// a light sprite for a lamp's or a window's glow, a hot core in a glow (the
// service pages' turntable; this scene's windows have a softer one, GLARE)
const sprites = {};
export function sprite(color) {
  const key = color.join(",");
  if (sprites[key]) return sprites[key];
  const c = makeCanvas(64, 64), g = c.getContext("2d");
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, rgba([255, 255, 255], 1));
  grad.addColorStop(0.12, rgba(color, 0.95));
  grad.addColorStop(0.35, rgba(color, 0.28));
  grad.addColorStop(1, rgba(color, 0));
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return (sprites[key] = c);
}

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
    const fs = faces(b);
    for (const key of ["z-", "z+", "x-", "x+", "y+"]) {
      const f = fs[key];
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
  // the edges (and the pool, cut into the deck)
  const pool = [[POOL.x[0], POOL.z[0]], [POOL.x[1], POOL.z[0]], [POOL.x[1], POOL.z[1]], [POOL.x[0], POOL.z[1]]].map(([x, z]) =>
    [x, POOL.y, z].map((v, i) => v + parts.find((p) => p.q === PIECE.deck).o[i]),
  );
  const lines = [...parts.flatMap(({ b }) => edges(b)), ...pool.map((p, i) => [p, pool[(i + 1) % 4]])].map(([a, c]) => ({ a, c }));
  strokeEdges(ctx, cam, lines, colors, 0.7 * holo);
  if (calm) return;
  for (const { q, b } of parts) {
    const land = T.dream[0] + (T.dream[1] - T.dream[0]) * q.land;
    const glow = smooth(land - 0.012, land, t) * (1 - smooth(land, land + 0.035, t));
    if (glow > 0.01) strokeEdges(ctx, cam, edges(b).map(([a, c]) => ({ a, c })), colors, glow * holo);
  }
}

// DESIGN: the wireframe, edge by edge, glowing; farther edges dimmer. In
// BUILD, what the scan hasn't reached yet (see drawBox).
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
    for (const [p] of edges(b)) {
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
    const [hx, hy] = cam.toScreen([1, 0, -1]);
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
  // the lamplight falling out through the glass floor onto the ground round
  // it (the house drawn over it), once it's lit
  const spill = litAt(t, GLASS_ON);
  if (spill > 0) {
    const { min, max } = BOX.ground;
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
// cut into short pieces instead, it cost a phone several ms a frame.
const GRID_R = 78;
const GRID_STEP = 4;
const GRID_STOPS = [0, 0.12, 0.25, 0.38, 0.5, 0.62, 0.75, 0.88, 1];
function drawGrid(ctx, cam, strength) {
  const [cx, , cz] = TARGET;
  ctx.save();
  ctx.lineWidth = 1;
  // lines along z (at x = c), then along x (at z = c)
  for (const [mid, along, point] of [[cx, cz, (c, v) => [c, 0, v]], [cz, cx, (c, v) => [v, 0, c]]]) {
    for (let c = Math.ceil((mid - GRID_R) / GRID_STEP) * GRID_STEP; c < mid + GRID_R; c += GRID_STEP) {
      const off = c - mid;
      const half = Math.sqrt(GRID_R * GRID_R - off * off);
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
        const fade = Math.max(0, 1 - (off * off + v * v) / (GRID_R * GRID_R)) ** 2;
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
function drawSheet(ctx, width, height, dpr, room, strength) {
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

// furniture along the floor behind a glass wall: [u0, u1, height] in feet
const FURNITURE = [[0.08, 0.27, 2.6], [0.33, 0.35, 5.5], [0.47, 0.64, 3.4], [0.74, 0.79, 4.2], [0.86, 0.95, 2.2]];

// A lit room seen through glass, in a face's rectangle `u` across and `v`
// up: warm lamplight (ROOM), a little brighter toward the ceiling and
// falling off toward the floor, the furniture dark against it where the
// glass comes down to the floor, and a little glare round it (`glows`, see
// drawGlows). `vHead` is where the window's top is when the scan has only
// built part of it.
const ROOM = { floor: [150, 76, 22], mid: [242, 164, 74], ceiling: [252, 206, 138] };
function drawRoom(ctx, cam, face, [u0, u1], [v0, v1], lit, glows, vHead = v1) {
  const quad = [[u0, v0], [u1, v0], [u1, v1], [u0, v1]].map(([u, v]) => cam.toScreen(onFace(face, u, v)));
  const [fx, fy] = cam.toScreen(onFace(face, (u0 + u1) / 2, v0));
  const [hx, hy] = cam.toScreen(onFace(face, (u0 + u1) / 2, vHead));
  const g = ctx.createLinearGradient(fx, fy, hx, hy + 0.01);
  g.addColorStop(0, rgba(ROOM.floor, 0.9 * lit));
  g.addColorStop(0.55, rgba(ROOM.mid, 0.92 * lit));
  g.addColorStop(0.92, rgba(ROOM.ceiling, 0.94 * lit));
  g.addColorStop(1, rgba(ROOM.mid, 0.92 * lit));
  ctx.save();
  path(ctx, quad);
  ctx.fillStyle = g;
  ctx.fill();
  const height = face.p[3][1] - face.p[0][1];
  if (v0 < 0.05) {
    ctx.clip();
    ctx.fillStyle = `rgba(22,12,4,${0.8 * lit})`;
    for (const [a, b, h] of FURNITURE) {
      if (a < u0 || b > u1) continue;
      const top = Math.min(h / height, v1);
      path(ctx, [[a, 0], [b, 0], [b, top], [a, top]].map(([u, v]) => cam.toScreen(onFace(face, u, v))));
      ctx.fill();
    }
  }
  ctx.restore();
  const span = Math.hypot(...sub(onFace(face, u0, v0), onFace(face, u1, v1)));
  glows.push({ at: onFace(face, (u0 + u1) / 2, (v0 + v1) / 2), r: span * 0.4, a: lit });
}

// One face of a built box: its shade (darker at the foot), and its finish:
// glass with its mullions (lit from inside once the lights come on), or
// slats; windows; a fine edge.
function drawFace(ctx, cam, b, part, key, face, colors, t, glows) {
  const mat = MATS[b.mat];
  const pts = face.p.map((p) => cam.toScreen(p));
  const base = shade(b.mat, face.n, colors);
  path(ctx, pts);
  if (key === "y+") ctx.fillStyle = rgba(base);
  else {
    const foot = [(pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2];
    const head = [(pts[2][0] + pts[3][0]) / 2, (pts[2][1] + pts[3][1]) / 2];
    const g = ctx.createLinearGradient(foot[0], foot[1], head[0], head[1] + 0.01);
    g.addColorStop(0, rgba(base.map((v) => v * 0.55)));
    g.addColorStop(1, rgba(base.map((v) => Math.min(255, v * 1.12))));
    ctx.fillStyle = g;
  }
  ctx.fill();

  const sideFace = key !== "y+";
  if (mat.glass && sideFace) {
    // dark glass catching a little of the fog at its top; then the room
    // behind it, lit (see drawRoom), and the frame: mullions every 6 ft, a
    // sill and a head
    const full = faces(b)[key];
    const vTop = (part.max[1] - b.min[1]) / (b.max[1] - b.min[1]);
    const lit = litAt(t, GLASS_ON);
    const [fx, fy] = cam.toScreen(onFace(full, 0.5, 0)), [hx, hy] = cam.toScreen(onFace(full, 0.5, 1));
    let g = ctx.createLinearGradient(fx, fy, hx, hy + 0.01);
    g.addColorStop(0, "rgba(40,44,52,0)");
    g.addColorStop(1, `rgba(90,96,110,${0.22 * (1 - lit)})`);
    path(ctx, pts);
    ctx.fillStyle = g;
    ctx.fill();
    if (lit > 0) drawRoom(ctx, cam, full, [0, 1], [0, vTop], lit, glows, vTop);
    const w = Math.hypot(full.p[1][0] - full.p[0][0], full.p[1][2] - full.p[0][2]);
    ctx.beginPath();
    for (let u = 6 / w; u < 1 - 1 / w; u += 6 / w) {
      const [x0, y0] = cam.toScreen(onFace(full, u, 0)), [x1, y1] = cam.toScreen(onFace(full, u, vTop));
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
    }
    for (const v of [0.03, 0.94]) {
      if (v > vTop) continue;
      const [x0, y0] = cam.toScreen(onFace(full, 0, v)), [x1, y1] = cam.toScreen(onFace(full, 1, v));
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
    }
    ctx.strokeStyle = "rgba(6,6,6,0.85)";
    ctx.lineWidth = 1.4;
    ctx.stroke();
  }
  if (mat.slats && sideFace) {
    const h = part.max[1] - part.min[1];
    ctx.beginPath();
    for (let v = mat.slats / h; v < 1; v += mat.slats / h) {
      const [x0, y0] = cam.toScreen(onFace(face, 0, v)), [x1, y1] = cam.toScreen(onFace(face, 1, v));
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
    }
    ctx.strokeStyle = "rgba(255,255,255,0.045)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // windows: dark glass until they come on, warm after; only what the scan
  // has built so far
  const full = faces(b)[key];
  for (const w of WINDOWS) {
    if (w.box !== b.id || w.face !== key) continue;
    const yAt = (v) => lerp(full.p[0][1], full.p[3][1], v);
    const top = Math.min(yAt(w.v[1]), part.max[1]);
    if (top <= yAt(w.v[0])) continue;
    const vTop = (top - full.p[0][1]) / (full.p[3][1] - full.p[0][1]);
    const quad = [[w.u[0], w.v[0]], [w.u[1], w.v[0]], [w.u[1], vTop], [w.u[0], vTop]].map(([u, v]) => cam.toScreen(onFace(full, u, v)));
    const lit = litAt(t, w.on);
    path(ctx, quad);
    ctx.fillStyle = "rgb(12,13,16)";
    ctx.fill();
    if (lit > 0) drawRoom(ctx, cam, full, w.u, [w.v[0], vTop], lit, glows, w.v[1]);
    path(ctx, quad);
    ctx.strokeStyle = "rgba(4,4,4,0.9)";
    ctx.lineWidth = 1.4;
    ctx.stroke();
  }

  // a fine edge, and the light catching the top edges that face it
  path(ctx, pts);
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  ctx.stroke();
  if (key === "y+" && part.max[1] === b.max[1]) {
    const catchK = Math.max(0, dot([0, 1, 0], KEY));
    ctx.strokeStyle = rgba(colors.mid, 0.45 * catchK);
    ctx.stroke();
  }
}

// One box in BUILD: the part below the scan solid (its cut glowing where the
// scan is passing through it), the part above still wireframe.
function drawBox(ctx, cam, b, t, colors, glows) {
  const k = clamp((t - T.rise[0]) / (T.rise[1] - T.rise[0]));
  const h = k * (HEIGHT + 0.5);
  const solid = below(b, h);
  if (solid) {
    const fs = faces(solid);
    for (const key of ["z-", "z+", "x-", "x+", "y+"]) {
      if (!visible(fs[key], cam.eye)) continue;
      drawFace(ctx, cam, b, solid, key, fs[key], colors, t, glows);
      if (b.id === "deck" && key === "y+") drawPool(ctx, cam, t);
    }
    // the cut, where the scan is passing through
    if (solid.max[1] < b.max[1]) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      path(ctx, fs["y+"].p.map((p) => cam.toScreen(p)));
      ctx.fillStyle = rgba(colors.mid, 0.22);
      ctx.fill();
      ctx.strokeStyle = rgba(colors.core, 0.9);
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();
    }
  }
  const rest = above(b, h);
  if (rest) strokeEdges(ctx, cam, edges(rest).map(([a, c]) => ({ a, c })), colors, 1 - smooth(T.rise[1] - 0.04, T.rise[1], t));
}

// The pool in the deck: dark water, then lit from below, ripples of light
// across it.
function drawPool(ctx, cam, t) {
  const pts = [[POOL.x[0], POOL.z[0]], [POOL.x[1], POOL.z[0]], [POOL.x[1], POOL.z[1]], [POOL.x[0], POOL.z[1]]].map(([x, z]) =>
    cam.toScreen([x, POOL.y, z]),
  );
  const lit = litAt(t, POOL_ON);
  ctx.save();
  path(ctx, pts);
  ctx.fillStyle = rgba(mix([8, 14, 26], [40, 120, 230], lit));
  ctx.fill();
  ctx.clip();
  if (lit > 0) {
    ctx.globalCompositeOperation = "lighter";
    const [cx, cy] = cam.toScreen([(POOL.x[0] + POOL.x[1]) / 2, POOL.y, (POOL.z[0] + POOL.z[1]) / 2]);
    const r = Math.abs(pts[1][0] - pts[0][0]) * 0.7;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, rgba(BLUE.core, 0.5 * lit));
    g.addColorStop(1, rgba(BLUE.mid, 0));
    ctx.fillStyle = g;
    ctx.fillRect(cx - r, cy - r, 2 * r, 2 * r);
    // ripples of light across it
    ctx.strokeStyle = rgba(BLUE.core, 0.22 * lit);
    ctx.lineWidth = 1;
    const r2 = rng(9);
    for (let i = 0; i < 9; i++) {
      const z = lerp(POOL.z[0] + 1, POOL.z[1] - 1, r2());
      const x0 = lerp(POOL.x[0], POOL.x[1] - 6, r2());
      const a = cam.toScreen([x0, POOL.y, z]), b = cam.toScreen([x0 + 4 + r2() * 4, POOL.y, z + (r2() - 0.5)]);
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]);
      ctx.quadraticCurveTo((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 1.5, b[0], b[1]);
      ctx.stroke();
    }
  }
  ctx.restore();
}

// The windows' glare, a little (11-23): a soft warm haze round each lit
// window, with no hot middle. Until then each had a white-hot core at nearly
// half strength, spilling over the roof and past the walls, and the user
// found the light too much; with none at all, the house looked bland.
// GLARE: how strong (`a`) and how far it reaches (`size`, times the
// window's size).
const GLARE = { a: 0.45, size: 3 };
let glare = null;
function drawGlows(ctx, cam, glows) {
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

// ---- the light and the air (the service pages' turntable) -----------------------
// The source, the haze around it, and a bank of fog behind the object that
// it reads against.
export function drawLight(ctx, colors, flare, [lx, ly], scale) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.save();
  ctx.translate(lx, ly + scale * 0.35);
  ctx.scale(1.6, 0.36);
  const R = scale * 2.6;
  const fog = ctx.createRadialGradient(0, 0, 0, 0, 0, R);
  fog.addColorStop(0, rgba(colors.mid, 0.3));
  fog.addColorStop(0.5, rgba(colors.deep, 0.15));
  fog.addColorStop(1, rgba(colors.deep, 0));
  ctx.fillStyle = fog;
  ctx.fillRect(-R, -R, 2 * R, 2 * R);
  ctx.restore();
  let g = ctx.createRadialGradient(lx, ly, 0, lx, ly, scale * 1.9);
  g.addColorStop(0, rgba(colors.mid, 0.28));
  g.addColorStop(0.3, rgba(colors.deep, 0.09));
  g.addColorStop(1, rgba(colors.deep, 0));
  ctx.fillStyle = g;
  ctx.fillRect(lx - scale * 2, ly - scale * 2, scale * 4, scale * 4);
  const r = scale * 0.15 * flare;
  g = ctx.createRadialGradient(lx, ly, 0, lx, ly, r);
  g.addColorStop(0, rgba(colors.core, 1));
  g.addColorStop(0.08, rgba(colors.core, 0.85));
  g.addColorStop(0.3, rgba(colors.mid, 0.32));
  g.addColorStop(1, rgba(colors.deep, 0));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(lx, ly, r, 0, TAU);
  ctx.fill();
  ctx.restore();
}

// over everything: a bloom round the light, and an anamorphic streak through it
export function drawBloom(ctx, colors, flare, [lx, ly], scale) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const R = scale * 0.15 * flare;
  let g = ctx.createRadialGradient(lx, ly, 0, lx, ly, R);
  g.addColorStop(0, rgba(colors.core, 0.75));
  g.addColorStop(0.35, rgba(colors.mid, 0.2));
  g.addColorStop(1, rgba(colors.mid, 0));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(lx, ly, R, 0, TAU);
  ctx.fill();
  ctx.translate(lx, ly);
  ctx.scale(1, 0.016);
  const S = scale * 2.8;
  g = ctx.createRadialGradient(0, 0, 0, 0, 0, S);
  g.addColorStop(0, rgba(colors.core, 0.36 * flare));
  g.addColorStop(0.25, rgba(colors.mid, 0.11 * flare));
  g.addColorStop(1, rgba(colors.mid, 0));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, S, 0, TAU);
  ctx.fill();
  ctx.restore();
}

// Dust drifting through the light (screen space): specks behind the object,
// a few big out-of-focus ones in front. `t` and `idle` (seconds) move it.
const DUST = (() => {
  const r = rng(42), out = [];
  for (let i = 0; i < 140; i++) out.push({ x: r(), y: r(), d: 0.35 + r() * 1.35, p: r() * TAU, s: 0.6 + r() });
  return out;
})();
export function drawDust(ctx, t, idle, colors, width, height, [lx, ly], front) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const q of DUST) {
    if (front !== q.d > 1.3 || (front && q.d < 1.5)) continue;
    const drift = t + idle * 0.02;
    const x = ((((q.x * 1.3 - drift * 0.25 * q.d + Math.sin(q.p + t * 3 + idle * 0.6) * 0.02) % 1.3) + 1.3) % 1.3) * width - 0.15 * width;
    const y = ((((q.y - drift * 0.12 * q.d) % 1) + 1) % 1) * height;
    const near = Math.exp(-((x - lx) ** 2 + (y - ly) ** 2) / (2 * (0.42 * Math.max(width, height)) ** 2));
    const a = (0.08 + 0.92 * near) * (front ? 0.16 : 0.7);
    const size = q.s * q.d * (front ? 12 : 1.5) * (width / 1440);
    if (front) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, size);
      g.addColorStop(0, rgba(colors.core, a * 0.45));
      g.addColorStop(0.75, rgba(colors.mid, a * 0.22));
      g.addColorStop(1, rgba(colors.mid, 0));
      ctx.fillStyle = g;
    } else ctx.fillStyle = rgba(mix([190, 190, 190], colors.core, near), a);
    ctx.beginPath();
    ctx.arc(x, y, Math.max(0.6, size), 0, TAU);
    ctx.fill();
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
  const space = ctx.measureText(" ").width;
  const widths = words.map((w) => ctx.measureText(w).width);
  let x = width / 2 - (widths.reduce((sum, w) => sum + w, 0) + space * 2) / 2;
  ctx.lineWidth = Math.max(1, title.size / (portrait ? 45 : 110));
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
      ctx.fillText(word, x, title.baseline);
    }
    ctx.strokeStyle = rgba(mix([255, 255, 255], c.mid, k), lerp(faint, bright, k));
    ctx.strokeText(word, x, title.baseline);
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
// light taken out). Kept below the title (`title`), so it never washes the
// words out (looking down at the start, the camera sees the horizon at the
// title's height). `hue` 0-1 is the passes' color, gold to blue.
function drawSky(ctx, width, height, cam, colors, hue, title) {
  const { box } = cam;
  const rx = Math.max(box.x1 - box.x0, width * 0.5) * 0.85;
  const ry = Math.max(40, (box.y1 - box.y0) * 0.3);
  const d = sub(TARGET, cam.eye);
  const ahead = norm([d[0], 0, d[2]]);
  const [, horizon] = cam.toScreen([cam.eye[0] + ahead[0] * 1e5, cam.eye[1], cam.eye[2] + ahead[2] * 1e5]);
  const line = Math.max(horizon, title.bottom + 0.55 * ry);
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
  drawSky(ctx, width, height, cam, colors, hue, title);
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
    for (const b of drawOrder(BOXES, cam.eye)) drawBox(ctx, cam, b, t, colors, glows);
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
