// The homepage hero, drawn on a 2D canvas as the visitor scrolls: a house
// rendered the way a visual-effects shot is, pass by pass (Andranik's first
// trade), to the tagline, Dream. Design. Build.
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
// The camera turns slowly around it all the while. Behind it, in outline
// across the screen, "DREAM. DESIGN. BUILD.", each word lighting up with its
// pass; a viewfinder's corners frame it.
//
//   drawScene(context, { width, height, dpr, t, portrait, layout, calm, idle, fonts })
//
// paints the scene at progress `t` (0-1) on a canvas of `width` x `height`
// CSS px at `dpr` device px each. `layout` places it around the hero's copy,
// as fractions of the screen: `copyTop` (where the copy starts), `copyRight`
// and `titleRight` (how far right its text and its headline reach), and
// `navZoom` (how much the navbar has grown on a big screen). `calm` is the
// Reduce Motion version: the camera holds still, the pieces start a little
// closer together, nothing flashes. `idle` (seconds)
// keeps the dust drifting and the pool shimmering once the scene has
// finished. `lite` (phones and tablets) draws the light shafts smaller and in
// fewer passes and leaves out the film grain. `fonts` are the CSS families
// for the lettering.
//
// Everything is drawn from numbers here, nothing is downloaded. World units
// are feet: y points up, the front of the house faces -z, the ADU is at +x.
// Black, white and greys, plus two colors: the gold light and blueprint blue.

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, k) => a + (b - a) * k;
const smooth = (a, b, v) => {
  const k = clamp((v - a) / (b - a));
  return k * k * (3 - 2 * k);
};
const mix = (c1, c2, k) => c1.map((v, i) => Math.round(lerp(v, c2[i], k)));
const rgba = ([r, g, b], a = 1) => `rgba(${r},${g},${b},${a})`;
const RAD = Math.PI / 180;
const TAU = Math.PI * 2;
// the same "random" numbers every frame, so the scene is a function of t
function rng(seed) {
  let s = seed >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}
const makeCanvas = (w, h) =>
  typeof OffscreenCanvas !== "undefined"
    ? new OffscreenCanvas(w, h)
    : Object.assign(document.createElement("canvas"), { width: w, height: h });

// 3D vectors
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};
const lerp3 = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];

// ---- palette ---------------------------------------------------------------
const GOLD = { core: [255, 244, 214], mid: [255, 170, 58], deep: [196, 92, 16] };
const BLUE = { core: [232, 244, 255], mid: [74, 150, 255], deep: [20, 64, 190] };
// the light's colors, from gold (0) to blue (1); halfway (0.5) it's white
const lightColors = (s) => ({
  core: mix(GOLD.core, BLUE.core, s),
  mid: mix(GOLD.mid, BLUE.mid, s),
  deep: mix(GOLD.deep, BLUE.deep, s),
});

// ---- timeline (fractions of the scroll) -------------------------------------
const T = {
  dream: [0.0, 0.3], // DREAM: the pieces come together
  white: [0.25, 0.31], // the light goes white, and holds (the user liked it)…
  lines: [0.29, 0.5], // DESIGN: the wireframe draws itself
  glass: [0.37, 0.47], // the glass house fades under it
  blue: [0.42, 0.48], // …then the light goes blueprint blue
  notes: [0.46, 0.53], // the notes come up… (and go at the start of BUILD)
  rise: [0.58, 0.79], // BUILD: the scan rises through it
  gold: [0.6, 0.74], // …and the light turns gold again
  lights: [0.77, 0.9], // the windows come on
  settle: 0.93, // the camera arrives
};
// the three passes, each lighting its word in the title from `from`
const PASSES = [
  { word: "DREAM.", from: 0 },
  { word: "DESIGN.", from: 0.29 },
  { word: "BUILD.", from: 0.57 },
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

// The key light: behind the house, a little above its roof, so the fronts
// are in shadow, the roofs and edges catch it, and once it's built the house
// stands against it, cutting into its shafts.
const LIGHT = [-4, 26, 95];
const KEY = norm(sub(LIGHT, [2, 8, 0]));
// where the light shows on screen: on the back edge of the upper floor's
// roof, as if setting behind it, and so below the title on a wide screen
// (higher up, it sat on "BUILD." and the user couldn't read it)
const LIGHT_AT = [0, 20.6, 7];
const FILL = norm([0.25, 0.55, -0.8]); // a little from the camera's side

// A box's faces: the four corners (bottom left, bottom right, top right, top
// left, as you face it from outside) and its outward normal. The underside
// is left out: the camera is always above the ground.
function faces({ min: [x0, y0, z0], max: [x1, y1, z1] }) {
  return {
    "z-": { n: [0, 0, -1], p: [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]] },
    "z+": { n: [0, 0, 1], p: [[x1, y0, z1], [x0, y0, z1], [x0, y1, z1], [x1, y1, z1]] },
    "x-": { n: [-1, 0, 0], p: [[x0, y0, z1], [x0, y0, z0], [x0, y1, z0], [x0, y1, z1]] },
    "x+": { n: [1, 0, 0], p: [[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]] },
    "y+": { n: [0, 1, 0], p: [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]] },
  };
}
// the point `u` across and `v` up a face
const onFace = ({ p: [a, b, , d] }, u, v) => [
  a[0] + (b[0] - a[0]) * u + (d[0] - a[0]) * v,
  a[1] + (b[1] - a[1]) * u + (d[1] - a[1]) * v,
  a[2] + (b[2] - a[2]) * u + (d[2] - a[2]) * v,
];
function edges({ min, max }) {
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
// Pairs that can't be told apart this way keep their distance order.
function drawOrder(list, eye) {
  const n = list.length;
  const after = Array.from({ length: n }, () => []);
  const indegree = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const A = list[i], B = list[j];
      for (let k = 0; k < 3; k++) {
        let near = -1;
        if (A.max[k] <= B.min[k] + 1e-6) near = eye[k] > B.min[k] ? j : eye[k] < A.max[k] ? i : -1;
        else if (B.max[k] <= A.min[k] + 1e-6) near = eye[k] > A.min[k] ? i : eye[k] < B.max[k] ? j : -1;
        if (near < 0) continue;
        const far = near === i ? j : i;
        after[far].push(near);
        indegree[near]++;
        break;
      }
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
// goes, already moving at the first scroll (`orbitEase`). With `calm` it
// holds one angle. The view is fitted into the room the copy leaves (see
// room), the same size all the way round, and pushes in a little as the
// scene plays (not with `calm`). In DREAM it also takes in the pieces where
// they hang, closing in as they land.
const TARGET = [2, 7, -2];
const DIST = 135;
const ORBIT = {
  desktop: { yaw: [-38, 20], pitch: [17, 11], calm: [-10, 14] },
  portrait: { yaw: [-30, 14], pitch: [24, 18], calm: [-8, 21] },
};
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
// part ease-out, part ease-in-out: moving from the first scroll (with an
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
    const views = [...Array.from({ length: 25 }, (_, i) => angles(orbit, i / 24)), orbit.calm];
    for (const [yaw, pitch] of views) extentOf(view(yaw, pitch).project, pts, e);
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
  const air = clamp(0.028 * height, 14, 30); // the least air between them
  const head = layout.head ? headlineTop(ctx, layout.head, fonts) : null;

  // the house above the copy: the navbar, the title, the house and the
  // headline, the same air between each (the house as wide as the room
  // lets it be); where there isn't room for that, the least air over and
  // under the title, and the house as big as what's left lets it be
  const stacked = (x0, x1, bottom) => {
    const houseH = ((x1 - x0) * (e[3] - e[1])) / (e[2] - e[0]);
    const even = (bottom - nav - capH * maxSize - houseH) / 3;
    const gap = even >= air ? even : air;
    const title = titleAt(maxSize, nav + gap);
    const y0 = title.bottom + gap;
    const y1 = even >= air ? y0 + houseH : Math.max(y0 + 0.18 * height, bottom);
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

function camera(width, height, portrait, t, calm, box) {
  const orbit = ORBIT[portrait ? "portrait" : "desktop"];
  const k = orbitEase(clamp(t / T.settle));
  const [yaw, pitch] = calm ? orbit.calm : angles(orbit, k);
  const { eye, project } = view(yaw, pitch);
  // the house, and in DREAM the pieces where they hang (with `calm`, where
  // they start, so it doesn't zoom)
  const whole = EXTENT[portrait ? "portrait" : "desktop"];
  const e = calm
    ? extentOf(project, dreamCorners(0, true), [...whole])
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
function path(ctx, pts) {
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
}
const visible = (face, eye) => dot(face.n, sub(eye, face.p[0])) > 0;

// A face's color in the light: a little ambient, the fill from the camera's
// side, and the key light (gold, or blue while it's blue) where it faces it.
function shade(mat, n, colors) {
  const a = MATS[mat].albedo;
  const k = Math.max(0, dot(n, KEY)), f = Math.max(0, dot(n, FILL));
  return [0, 1, 2].map((i) =>
    Math.min(255, Math.round(a * (26 + [118, 124, 136][i] * f) + a * colors.mid[i] * 1.25 * k + 4)),
  );
}

// a light sprite for the lit windows' glow: a hot core in a glow
const sprites = {};
function sprite(color) {
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
// into the dark at its edges (no hard edge: the house stands in a void),
// the light pooling round the house, and the scan's plane rising through it.
function drawGround(ctx, cam, t, colors, fonts) {
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
    g.addColorStop(0, `rgba(14,13,12,${0.95 * built})`);
    g.addColorStop(0.6, `rgba(9,9,8,${0.8 * built})`);
    g.addColorStop(1, "rgba(5,5,5,0)");
    ctx.fillStyle = g;
    ctx.fillRect(-rx, -rx, 2 * rx, 2 * rx);
    ctx.globalCompositeOperation = "lighter";
    g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx * 0.9);
    g.addColorStop(0, rgba(colors.mid, 0.13 * built));
    g.addColorStop(0.5, rgba(colors.deep, 0.05 * built));
    g.addColorStop(1, rgba(colors.deep, 0));
    ctx.fillStyle = g;
    ctx.fillRect(-rx, -rx, 2 * rx, 2 * rx);
    ctx.restore();
  }
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

// How far each window is lit, 0-1.
const litAt = (t, on) => smooth(on, on + 0.08, clamp((t - T.lights[0]) / (T.lights[1] - T.lights[0])));

// furniture along the floor behind a glass wall: [u0, u1, height] in feet
const FURNITURE = [[0.08, 0.27, 2.6], [0.33, 0.35, 5.5], [0.47, 0.64, 3.4], [0.74, 0.79, 4.2], [0.86, 0.95, 2.2]];

// A lit room seen through glass, in a face's rectangle `u` across and `v`
// up: warm light, brightest at the ceiling where the lamps are and falling
// off toward the floor, the furniture dark against it where the glass comes
// down to the floor. Its light spills out (glows). `vHead` is where the
// window's top is when the scan has only built part of it.
function drawRoom(ctx, cam, face, [u0, u1], [v0, v1], lit, glows, vHead = v1) {
  const quad = [[u0, v0], [u1, v0], [u1, v1], [u0, v1]].map(([u, v]) => cam.toScreen(onFace(face, u, v)));
  const [fx, fy] = cam.toScreen(onFace(face, (u0 + u1) / 2, v0));
  const [hx, hy] = cam.toScreen(onFace(face, (u0 + u1) / 2, vHead));
  const g = ctx.createLinearGradient(fx, fy, hx, hy + 0.01);
  g.addColorStop(0, rgba(GOLD.deep, 0.6 * lit));
  g.addColorStop(0.5, rgba(GOLD.mid, 0.78 * lit));
  g.addColorStop(0.88, rgba(GOLD.core, 0.92 * lit));
  g.addColorStop(1, rgba(GOLD.mid, 0.7 * lit));
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
  glows.push({ at: onFace(face, (u0 + u1) / 2, (v0 + v1) / 2), r: span * 0.5, a: lit * 0.45 });
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
    if (lit > 0) drawRoom(ctx, cam, full, [0, 1], [0, vTop], lit, glows);
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
function drawBox(ctx, cam, b, t, colors, glows, idle) {
  const k = clamp((t - T.rise[0]) / (T.rise[1] - T.rise[0]));
  const h = k * (HEIGHT + 0.5);
  const solid = below(b, h);
  if (solid) {
    const fs = faces(solid);
    for (const key of ["z-", "z+", "x-", "x+", "y+"]) {
      if (!visible(fs[key], cam.eye)) continue;
      drawFace(ctx, cam, b, solid, key, fs[key], colors, t, glows);
      if (b.id === "deck" && key === "y+") drawPool(ctx, cam, t, idle);
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

// The pool in the deck: dark water, then lit from below, its ripples
// shimmering once the scene has finished (`idle`).
function drawPool(ctx, cam, t, idle) {
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
      const wob = Math.sin(idle * 1.4 + i * 1.7) * 0.6;
      const a = cam.toScreen([x0 + wob, POOL.y, z]), b = cam.toScreen([x0 + 4 + r2() * 4 + wob, POOL.y, z + (r2() - 0.5)]);
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]);
      ctx.quadraticCurveTo((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 1.5, b[0], b[1]);
      ctx.stroke();
    }
  }
  ctx.restore();
}

// the windows' light spilling out into the night
function drawGlows(ctx, cam, glows, idle) {
  if (!glows.length) return;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const img = sprite(GOLD.mid);
  for (const { at, r, a } of glows) {
    const [x, y, z] = cam.toScreen(at);
    const size = r * (cam.s / z) * 3;
    ctx.globalAlpha = a * (0.95 + 0.05 * Math.sin(idle * 2));
    ctx.drawImage(img, x - size / 2, y - size / 2, size, size * 0.8);
  }
  ctx.restore();
}

// DESIGN's notes: a dot on the drawing, a leader out from it, and the label
// on a dark plate with a blue edge, big enough to read (the user asked),
// kept on screen.
function drawNotes(ctx, cam, t, fonts, width) {
  const a = smooth(T.notes[0], T.notes[1], t) * (1 - smooth(T.rise[0], T.rise[0] + 0.05, t));
  if (a <= 0) return;
  const fs = Math.round(clamp(cam.s / 64, 11, 15));
  const padX = Math.round(fs * 0.55), plateH = Math.round(fs * 1.7);
  ctx.save();
  ctx.globalAlpha = a;
  ctx.font = `700 ${fs}px ${fonts.mono}`;
  ctx.textBaseline = "middle";
  const reach = clamp(cam.s / 26, 18, 40);
  for (const { at, dir, text } of NOTES) {
    const [x, y] = cam.toScreen(at);
    const label = text.toUpperCase();
    const plateW = ctx.measureText(label).width + padX * 2;
    // the elbow, then the plate beyond it on the side the note leans to
    const ex = x + dir[0] * reach * 0.8, ey = y + dir[1] * reach;
    let px = dir[0] > 0 ? ex + 10 : ex - 10 - plateW;
    px = clamp(px, 8, width - 8 - plateW);
    const py = ey - plateH / 2;
    ctx.strokeStyle = rgba(BLUE.core, 0.85);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(ex, ey);
    ctx.lineTo(dir[0] > 0 ? px : px + plateW, ey);
    ctx.stroke();
    ctx.fillStyle = rgba(BLUE.core, 1);
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "rgba(3,8,22,0.82)";
    ctx.fillRect(px, py, plateW, plateH);
    ctx.strokeStyle = rgba(BLUE.mid, 0.9);
    ctx.lineWidth = 1;
    ctx.strokeRect(px + 0.5, py + 0.5, plateW - 1, plateH - 1);
    ctx.fillStyle = rgba(BLUE.core, 1);
    ctx.fillText(label, px + padX, ey + 1);
  }
  ctx.restore();
}

// ---- the light and the air ---------------------------------------------------
// The source, the haze around it, and a bank of fog behind the house that
// it reads against.
function drawLight(ctx, colors, flare, [lx, ly], scale) {
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

// Light shafts, the built house cutting through them: the light and the
// house drawn at quarter size, then smeared outward from the light.
let rayA = null, rayB = null;
function godRays(ctx, dpr, [sx, sy], colors, flare, strength, drawOccluders, lite) {
  if (strength <= 0) return;
  // (on a phone, `lite`: drawn smaller and smeared in fewer passes)
  const W = Math.max(2, Math.round(ctx.canvas.width / (lite ? 6 : 4)));
  const H = Math.max(2, Math.round(ctx.canvas.height / (lite ? 6 : 4)));
  rayA ??= makeCanvas(W, H);
  rayB ??= makeCanvas(W, H);
  for (const c of [rayA, rayB]) {
    if (c.width !== W || c.height !== H) {
      c.width = W;
      c.height = H;
    }
  }
  const A = rayA.getContext("2d"), B = rayB.getContext("2d");
  const s = W / ctx.canvas.width;
  const lx = sx * dpr * s, ly = sy * dpr * s;
  A.setTransform(1, 0, 0, 1, 0, 0);
  A.globalAlpha = 1;
  A.globalCompositeOperation = "source-over";
  A.fillStyle = "#000";
  A.fillRect(0, 0, W, H);
  A.globalCompositeOperation = "lighter";
  const r0 = Math.max(W, H) * 0.045 * flare;
  let g = A.createRadialGradient(lx, ly, 0, lx, ly, r0);
  g.addColorStop(0, rgba(colors.core, 1));
  g.addColorStop(0.4, rgba(colors.mid, 0.7));
  g.addColorStop(1, rgba(colors.mid, 0));
  A.fillStyle = g;
  A.beginPath();
  A.arc(lx, ly, r0, 0, TAU);
  A.fill();
  const r = rng(3);
  for (let i = 0; i < 10; i++) {
    const a = r() * TAU, d = r0 * (0.8 + r() * 1.6), rr = r0 * (0.06 + r() * 0.16);
    const x = lx + Math.cos(a) * d, y = ly + Math.sin(a) * d;
    g = A.createRadialGradient(x, y, 0, x, y, rr);
    g.addColorStop(0, rgba(colors.mid, 0.35));
    g.addColorStop(1, rgba(colors.mid, 0));
    A.fillStyle = g;
    A.beginPath();
    A.arc(x, y, rr, 0, TAU);
    A.fill();
  }
  A.globalCompositeOperation = "source-over";
  drawOccluders(A, dpr * s);
  const blur = (from, to, step, n) => {
    to.setTransform(1, 0, 0, 1, 0, 0);
    to.globalAlpha = 1;
    to.globalCompositeOperation = "source-over";
    to.fillStyle = "#000";
    to.fillRect(0, 0, W, H);
    to.globalCompositeOperation = "lighter";
    for (let i = 0; i < n; i++) {
      const k = 1 + step * i;
      to.globalAlpha = (1 - i / n) * (2.2 / n);
      to.setTransform(k, 0, 0, k, lx * (1 - k), ly * (1 - k));
      to.drawImage(from.canvas, 0, 0);
    }
    to.globalAlpha = 1;
  };
  blur(A, B, lite ? 0.1 : 0.06, lite ? 6 : 10);
  blur(B, A, lite ? 0.02 : 0.012, lite ? 6 : 10);
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = 0.7 * strength;
  ctx.drawImage(rayA, 0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.restore();
}

// over everything: a bloom round the light, and an anamorphic streak through it
function drawBloom(ctx, colors, flare, [lx, ly], scale) {
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

// Dust drifting through the light (screen space): specks behind the house, a
// few big out-of-focus ones in front. The scroll moves it; once the scene is
// finished, so does time (`idle`, seconds), so it keeps drifting while the
// last frame holds.
const DUST = (() => {
  const r = rng(42), out = [];
  for (let i = 0; i < 140; i++) out.push({ x: r(), y: r(), d: 0.35 + r() * 1.35, p: r() * TAU, s: 0.6 + r() });
  return out;
})();
function drawDust(ctx, t, idle, colors, width, height, [lx, ly], front) {
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
function grainTile() {
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

// ---- the frame -------------------------------------------------------------
const DEFAULT_FONTS = { display: "'Bebas Neue', 'Arial Narrow', sans-serif", mono: "'Courier New', monospace" };

export function drawScene(ctx, { width, height, dpr = 1, t, portrait = false, layout, calm = false, idle = 0, lite = false, fonts = DEFAULT_FONTS }) {
  layout ??= portrait ? { copyTop: 0.56 } : { copyTop: 0.58, copyRight: 0.45, titleRight: 0.42 };
  const { title, room } = placeScene(ctx, width, height, portrait, layout, fonts);
  const cam = camera(width, height, portrait, t, calm, room);
  // the light: gold, then white (held), then blue, then gold again
  const hue = (0.5 * smooth(T.white[0], T.white[1], t) + 0.5 * smooth(T.blue[0], T.blue[1], t)) * (1 - smooth(T.gold[0], T.gold[1], t));
  const colors = lightColors(hue);
  // the light flares as the render completes; on screen it's kept just over
  // the back of the roof (riding on it in DREAM), so it's behind the house
  // from every angle
  const flare = 1 + 0.35 * Math.exp(-(((t - T.rise[1]) / 0.04) ** 2));
  const light = cam.toScreen(LIGHT_AT.map((v, i) => v + offsetOf(PIECE.upper, t, calm)[i]));
  const lightScale = Math.max(cam.box.x1 - cam.box.x0, cam.box.y1 - cam.box.y0) * 0.75;
  const built = smooth(T.rise[0], T.rise[0] + 0.04, t);

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#030303";
  ctx.fillRect(0, 0, width, height);

  drawLight(ctx, colors, flare, light, lightScale);
  drawTitle(ctx, width, portrait, title, t, fonts);
  drawDust(ctx, calm ? 0 : t, calm ? 0 : idle, colors, width, height, light, false);
  drawGround(ctx, cam, t, colors, fonts);

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
    // the pool shimmers once it's finished (not with Reduce Motion)
    for (const b of drawOrder(BOXES, cam.eye)) drawBox(ctx, cam, b, t, colors, glows, calm ? 0 : idle);
  }
  drawGlows(ctx, cam, glows, calm ? 0 : idle);

  // shafts round the built house, then the bloom over everything
  godRays(ctx, dpr, light, colors, flare, lerp(0.45, 1, built), (c, scale) => {
    if (t < T.rise[0]) return;
    const h = clamp((t - T.rise[0]) / (T.rise[1] - T.rise[0])) * (HEIGHT + 0.5);
    c.setTransform(scale, 0, 0, scale, 0, 0);
    c.fillStyle = "#000";
    for (const b of BOXES) {
      const solid = below(b, h);
      if (!solid) continue;
      const fs = faces(solid);
      for (const key of ["z-", "z+", "x-", "x+", "y+"]) {
        if (!visible(fs[key], cam.eye)) continue;
        path(c, fs[key].p.map((p) => cam.toScreen(p)));
        c.fill();
      }
    }
  }, lite);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawBloom(ctx, colors, flare, light, lightScale);
  // the notes over the light and its bloom, so the glare never washes them out
  drawNotes(ctx, cam, t, fonts, width);

  // in front of the lens: out-of-focus dust, a vignette, grain
  drawDust(ctx, calm ? 0 : t, calm ? 0 : idle, colors, width, height, light, true);
  const vx = (cam.box.x0 + cam.box.x1) / 2, vy = height * 0.45;
  const v = ctx.createRadialGradient(vx, vy, Math.min(width, height) * 0.3, vx, vy, Math.max(width, height) * 0.85);
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(1, "rgba(0,0,0,0.7)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, width, height);
  // (no grain on a phone, `lite`: unseen at that size, and costly there)
  if (!lite) {
    ctx.save();
    ctx.globalCompositeOperation = "overlay";
    ctx.globalAlpha = 0.08;
    const r = rng(Math.round(t * 1000 + idle * 24) + 1); // new grain each frame
    ctx.translate(-r() * 256, -r() * 256);
    ctx.fillStyle = ctx.createPattern(grainTile(), "repeat");
    ctx.fillRect(0, 0, width + 256, height + 256);
    ctx.restore();
  }

  // over the lens's darkening, so it stays crisp: the viewfinder
  drawFrame(ctx, cam, portrait, width);
}
