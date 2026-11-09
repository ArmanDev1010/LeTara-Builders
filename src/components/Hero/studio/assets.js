// The objects the service pages' turntable draws (studio.js), one per
// service, in feet: y up, the front facing -z. Boxes, none overlapping (so
// they sort far to near), each with its finish (`mat`) and the `layer` of the
// build it belongs to, which the page's "Layer by layer" list names.
//
//   word      the service's name, in outline behind it
//   target, dist, yaw, pitch   the camera: what it looks at, from how far,
//             the turn it makes as the page scrolls (degrees), how high
//   light     where the gold light shows, behind and above it
//   stage     the turntable's radius
//   order     the layers in the order they come down into place as the
//             hero opens; layers not in it are there from the start
//   layers    per layer, `build`: where it starts as the hero opens, and
//             `explode`: where the diagram pulls it to (a box can have its own)
//   windows   on a box's face, `u` across and `v` up (0-1); lit warm once
//             it's built. Each is also a pane of glass in the diagram's
//             `paneLayer`, pushed out from its wall (unless `pane: false`)
//   lamps     glows (pendants, the fire, string lights), with their layer
//   ghost     layers that were already there (the house under an addition),
//             faint in the diagram
//   diagram   the diagram's angle
//   diagramOnly  boxes only the diagram shows (the inside, hidden in the
//             hero by the walls; the utility trench)

const adu = {
  word: "ADU",
  target: [10, 5, 6],
  dist: 72,
  yaw: [-38, -14],
  pitch: 21,
  light: [7, 12.5, 19],
  stage: 19,
  order: ["site", "foundation", "walls", "roof"],
  paneLayer: "windows",
  layers: {
    site: {},
    foundation: { explode: [0, 3, 0], build: [0, 6, 0] },
    walls: { explode: [0, 10, 0], build: [0, 11, 0] },
    roof: { explode: [0, 17, 0], build: [0, 15, 0] },
    interior: { explode: [0, 3, 0] },
  },
  boxes: [
    { id: "patio", min: [-2, 0, -7], max: [22, 0.35, 0], mat: "deck", layer: "site" },
    { id: "utility", min: [-16, 0, 7], max: [0, 0.3, 7.8], mat: "metal", layer: "site", diagramOnly: true },
    { id: "slab", min: [0, 0, 0], max: [20, 0.8, 16], mat: "concrete", layer: "foundation" },
    { id: "body", min: [0, 0.8, 0], max: [20, 10.8, 16], mat: "stucco", layer: "walls" },
    { id: "roof", min: [-1.5, 10.8, -1.5], max: [21.5, 11.6, 17.5], mat: "roof", layer: "roof" },
    { id: "counter", min: [2, 0.8, 13], max: [11, 3.8, 15.5], mat: "cabinet", layer: "interior", diagramOnly: true },
    { id: "bed", min: [12.5, 0.8, 9], max: [18.5, 2.6, 15], mat: "fabric", layer: "interior", diagramOnly: true },
  ],
  windows: [
    { box: "body", face: "z-", u: [0.08, 0.46], v: [0, 0.84] },
    { box: "body", face: "z-", u: [0.58, 0.92], v: [0.32, 0.8] },
    { box: "body", face: "x-", u: [0.22, 0.78], v: [0.36, 0.76] },
    { box: "body", face: "x+", u: [0.3, 0.7], v: [0.36, 0.76] },
  ],
  diagram: { yaw: -34, pitch: 24 },
};

// a second story on an existing one-story house
const addition = {
  word: "ADDITION",
  target: [18, 9, 11],
  dist: 100,
  yaw: [-36, -12],
  pitch: 20,
  light: [16, 22.5, 28],
  stage: 24,
  order: ["floor", "walls", "roof"],
  paneLayer: "windows",
  ghost: ["house"],
  layers: {
    house: {},
    floor: { explode: [0, 4, 0], build: [0, 10, 0] },
    walls: { explode: [0, 11, 0], build: [0, 12, 0] },
    roof: { explode: [0, 18, 0], build: [0, 15, 0] },
    inside: { explode: [0, 4, 0] },
  },
  boxes: [
    { id: "house", min: [0, 0, 0], max: [36, 10, 22], mat: "existing", layer: "house" },
    { id: "floor", min: [6, 10, 0], max: [30, 10.8, 22], mat: "wood", layer: "floor" },
    { id: "walls", min: [6, 10.8, 0], max: [30, 19.8, 22], mat: "clad", layer: "walls" },
    { id: "roof", min: [5, 19.8, -1], max: [31, 20.6, 23], mat: "roof", layer: "roof" },
    { id: "bed", min: [8, 10.8, 13], max: [14, 12.6, 20], mat: "fabric", layer: "inside", diagramOnly: true },
    { id: "closet", min: [22, 10.8, 18.5], max: [28.5, 17, 21], mat: "cabinet", layer: "inside", diagramOnly: true },
  ],
  windows: [
    { box: "house", face: "z-", u: [0.06, 0.28], v: [0.3, 0.75], pane: false },
    { box: "house", face: "z-", u: [0.42, 0.58], v: [0, 0.8], pane: false },
    { box: "house", face: "z-", u: [0.72, 0.94], v: [0.3, 0.75], pane: false },
    { box: "house", face: "x-", u: [0.3, 0.7], v: [0.3, 0.75], pane: false },
    { box: "walls", face: "z-", u: [0.08, 0.46], v: [0.2, 0.85] },
    { box: "walls", face: "z-", u: [0.56, 0.92], v: [0.2, 0.85] },
    { box: "walls", face: "x-", u: [0.25, 0.75], v: [0.3, 0.8] },
  ],
  diagram: { yaw: -32, pitch: 22 },
};

// a kitchen in a room cut away at the front and the right, so it's seen inside
const remodel = {
  word: "REMODEL",
  target: [13, 4, 10],
  dist: 64,
  yaw: [26, 46],
  pitch: 30,
  light: [5, 13, 22],
  stage: 18,
  order: ["cabinets", "counters", "lighting"],
  layers: {
    floors: {},
    walls: {},
    cabinets: { explode: [0, 4, 0], build: [0, 12, 0] },
    counters: { explode: [0, 8, 0], build: [0, 16, 0] },
    lighting: { explode: [0, 12, 0], build: [0, 14, 0] },
  },
  boxes: [
    { id: "floor", min: [0, 0, 0], max: [26, 0.6, 20], mat: "floor", layer: "floors" },
    { id: "back", min: [0, 0.6, 18.6], max: [26, 10.6, 20], mat: "drywall", layer: "walls", explode: [0, 0, 7] },
    { id: "side", min: [0, 0.6, 0], max: [1.4, 10.6, 18.6], mat: "drywall", layer: "walls", explode: [-7, 0, 0] },
    { id: "base", min: [1.4, 0.6, 15.8], max: [20, 3.4, 18.6], mat: "cabinet", layer: "cabinets" },
    { id: "pantry", min: [20.4, 0.6, 15.8], max: [25, 9, 18.6], mat: "cabinet", layer: "cabinets" },
    { id: "uppers", min: [1.4, 6.2, 17.2], max: [12, 8.6, 18.6], mat: "cabinet", layer: "cabinets" },
    { id: "island", min: [8, 0.6, 6], max: [19, 3.4, 9.6], mat: "cabinet", layer: "cabinets" },
    { id: "top", min: [1.4, 3.4, 15.6], max: [20, 3.7, 18.6], mat: "counter", layer: "counters" },
    { id: "islandTop", min: [7.6, 3.4, 5.6], max: [19.4, 3.7, 10], mat: "counter", layer: "counters" },
    { id: "pend1", min: [10.2, 7.2, 7.4], max: [11, 7.9, 8.2], mat: "lamp", layer: "lighting" },
    { id: "pend2", min: [13.1, 7.2, 7.4], max: [13.9, 7.9, 8.2], mat: "lamp", layer: "lighting" },
    { id: "pend3", min: [16, 7.2, 7.4], max: [16.8, 7.9, 8.2], mat: "lamp", layer: "lighting" },
  ],
  windows: [{ box: "back", face: "z-", u: [0.52, 0.76], v: [0.38, 0.78], pane: false }],
  lamps: [
    { at: [10.6, 7, 7.8], r: 2.2, layer: "lighting" },
    { at: [13.5, 7, 7.8], r: 2.2, layer: "lighting" },
    { at: [16.4, 7, 7.8], r: 2.2, layer: "lighting" },
  ],
  diagram: { yaw: 34, pitch: 30 },
};

// a patio under a louvered pergola, an outdoor kitchen and a fire pit
const POSTS = [[3, 3], [3, 15], [17, 3], [17, 15]];
const LOUVERS = Array.from({ length: 13 }, (_, i) => 3.2 + i * 1.1);
const BULBS = [4.6, 7.2, 9.8, 12.4, 15].flatMap((x) => [[x, 3.25], [x, 15.25]]);
const outdoor = {
  word: "OUTDOORS",
  target: [15, 4, 11],
  dist: 80,
  yaw: [-34, -10],
  pitch: 24,
  light: [12, 14, 28],
  stage: 21,
  order: ["hardscape", "frame", "roof", "kitchen", "fire", "decor"],
  layers: {
    hardscape: {},
    frame: { explode: [0, 3, 0], build: [0, 12, 0] },
    roof: { explode: [0, 9, 0], build: [0, 16, 0] },
    kitchen: { explode: [0, 3, 0], build: [0, 10, 0] },
    fire: { explode: [0, 3, 0], build: [0, 8, 0] },
    decor: { explode: [0, 3, 0], build: [0, 6, 0] },
    lighting: { explode: [0, 6, 0] },
  },
  boxes: [
    { id: "patio", min: [0, 0, 0], max: [30, 0.5, 22], mat: "stone", layer: "hardscape" },
    ...POSTS.map(([x, z], i) => ({ id: `post${i}`, min: [x, 0.5, z], max: [x + 0.8, 9.5, z + 0.8], mat: "wood", layer: "frame" })),
    { id: "beam0", min: [2.4, 9.5, 3], max: [18.4, 10.3, 3.8], mat: "wood", layer: "frame" },
    { id: "beam1", min: [2.4, 9.5, 15], max: [18.4, 10.3, 15.8], mat: "wood", layer: "frame" },
    ...LOUVERS.map((x, i) => ({ id: `louver${i}`, min: [x, 10.3, 2.2], max: [x + 0.4, 10.9, 16.6], mat: "wood", layer: "roof" })),
    { id: "counter", min: [21, 0.5, 17], max: [29, 3.3, 20], mat: "concrete", layer: "kitchen" },
    { id: "counter2", min: [26.5, 0.5, 9], max: [29, 3.3, 17], mat: "concrete", layer: "kitchen" },
    { id: "grill", min: [22.5, 3.3, 17.6], max: [25.5, 4.1, 19.6], mat: "metal", layer: "kitchen" },
    { id: "firepit", min: [7, 0.5, 5.5], max: [11, 1.7, 9.5], mat: "concrete", layer: "fire" },
    { id: "sofa", min: [4.5, 0.5, 11], max: [13, 2.1, 13.4], mat: "fabric", layer: "decor" },
    ...BULBS.map(([x, z], i) => ({ id: `bulb${i}`, min: [x, 9, z], max: [x + 0.3, 9.3, z + 0.3], mat: "lamp", layer: "lighting", diagramOnly: true })),
  ],
  windows: [],
  lamps: [
    { at: [9, 2.4, 7.5], r: 3, a: 1, layer: "fire" },
    ...BULBS.map(([x, z]) => ({ at: [x + 0.15, 9.15, z + 0.15], r: 0.9, a: 0.6, layer: "frame" })),
  ],
  diagram: { yaw: -30, pitch: 26 },
};

export const ASSETS = { adu, addition, remodel, outdoor };
