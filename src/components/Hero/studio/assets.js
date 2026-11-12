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
//   renderOnly   boxes only the hero shows (a wall the diagram has in pieces)
//   phantom   in the diagram, cut away and drawn as a dashed outline (a
//             cutaway: the roof and walls over the rooms inside)
//   section   a cut wall: its top filled dark in the diagram, as an
//             architect fills a section
//   diagramWindows  the diagram draws the windows on its walls
//   marks     where the diagram puts each layer's number, on the part itself
//             (otherwise the numbers stand in a column on its left)
//   covers    the layers a layer lights in the diagram, when more than its
//             own (on the area pages, new construction: all but the ADU)

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

// a new two-story home, from the ground up (both floors are one "walls"
// layer in the list, each with its own lift)
const house = {
  word: "NEW BUILD",
  target: [13, 9, 8],
  dist: 92,
  yaw: [-36, -12],
  pitch: 20,
  light: [10, 22, 24],
  stage: 23,
  order: ["site", "foundation", "walls", "roof"],
  paneLayer: "windows",
  layers: {
    site: {},
    foundation: { explode: [0, 3, 0], build: [0, 6, 0] },
    walls: { explode: [0, 10, 0], build: [0, 10, 0] },
    roof: { explode: [0, 25, 0], build: [0, 16, 0] },
    interior: { explode: [0, 3, 0] },
  },
  boxes: [
    { id: "drive", min: [-4, 0, -9], max: [30, 0.3, -2], mat: "deck", layer: "site" },
    { id: "utility", min: [-16, 0, 9], max: [0, 0.3, 9.8], mat: "metal", layer: "site", diagramOnly: true },
    { id: "slab", min: [0, 0, 0], max: [26, 0.8, 18], mat: "concrete", layer: "foundation" },
    { id: "ground", min: [0, 0.8, 0], max: [26, 10.8, 18], mat: "stucco", layer: "walls" },
    { id: "upper", min: [4, 10.8, -2], max: [26, 20, 18], mat: "clad", layer: "walls", explode: [0, 18, 0], build: [0, 13, 0] },
    { id: "roof", min: [3, 20, -3], max: [27, 20.8, 19], mat: "roof", layer: "roof" },
    { id: "kitchen", min: [2, 0.8, 14], max: [12, 3.8, 16.5], mat: "cabinet", layer: "interior", diagramOnly: true },
    { id: "sofa", min: [14, 0.8, 4], max: [22, 2.4, 7], mat: "fabric", layer: "interior", diagramOnly: true },
  ],
  windows: [
    { box: "ground", face: "z-", u: [0.05, 0.55], v: [0, 0.86] },
    { box: "ground", face: "z-", u: [0.68, 0.8], v: [0, 0.8] },
    { box: "ground", face: "x-", u: [0.3, 0.7], v: [0.35, 0.78] },
    { box: "upper", face: "z-", u: [0.08, 0.46], v: [0.25, 0.85] },
    { box: "upper", face: "z-", u: [0.56, 0.92], v: [0.25, 0.85] },
    { box: "upper", face: "x-", u: [0.25, 0.75], v: [0.3, 0.8] },
  ],
  diagram: { yaw: -32, pitch: 22 },
};

// An area page's property (Area pages): one Craftsman home on its lot, with
// every service on it, the way the homepage's scene shows one property:
//   new construction: the house, in lap siding, a low gable roof with wide
//     eaves over its single-story wing, and a front porch on stone piers
//     under a gable of its own;
//   a home addition: a second story on the house, its gable to the street;
//   a remodel: the living room, kitchen and bath inside, seen in the
//     drawing, where the single-story wing is cut away (its roof and the
//     top of its walls dashed, the cut walls filled dark);
//   an ADU: a small matching cottage in the back corner of the yard;
//   outdoor living: a patio beside the house under a pergola, with an
//     outdoor kitchen and a fire pit.
// The property line (`lot`) ties them into one lot. Each service is a layer
// named by its slug, so the area page's list lights it in the drawing; the
// turntable puts them in place in turn. `word` is the area's name, set by
// the page. Roofs are gables (`gable`, studio.js). (11-11: two houses on a
// street, then a modern house with an ADU set apart, both read as a
// neighborhood; the user asked for one normal home with a roof, like a
// Craftsman, showing the services the way the homepage does. 11-12: the
// drawing whole, not pulled apart, with the cutaway for the remodel.)
const pergolaSlats = Array.from({ length: 7 }, (_, i) => {
  const x = 39 + 2.2 * i;
  return { id: `slat${i}`, min: [x, 9.7, 4], max: [x + 0.5, 10.1, 22], mat: "wood", layer: "outdoor-living" };
});

const property = {
  word: "LOS ANGELES",
  target: [24, 7, 17],
  dist: 160,
  yaw: [-34, -14],
  pitch: 26,
  light: [24, 30, 52],
  stage: 50,
  lot: { x: [-10, 58], z: [-15, 49] },
  order: ["site", "new-construction", "home-additions", "adu-contractor", "outdoor-living"],
  layers: {
    site: {},
    "new-construction": { build: [0, 11, 0] },
    "home-additions": { build: [0, 12, 0] },
    "home-remodeling": {},
    "adu-contractor": { build: [0, 9, 0] },
    "outdoor-living": { build: [0, 9, 0] },
  },
  boxes: [
    // the drive and the front walk
    { id: "drive", min: [21, 0, -15], max: [30, 0.25, 0], mat: "deck", layer: "site" },
    { id: "walk", min: [8, 0, -15], max: [10, 0.2, -10.5], mat: "concrete", layer: "site" },
    // the house: its slab and walls, the side-gabled roof over the
    // single-story wing, the porch on its piers and its own gable. In the
    // drawing the wing is cut away: its walls stop at 5.6 ft (`section`,
    // their tops filled dark), the rest of them, its roof and the porch's
    // dashed (`phantom`), and the wing beside it has walls of its own.
    { id: "hSlab", min: [0, 0, 0], max: [34, 0.8, 26], mat: "concrete", layer: "new-construction" },
    { id: "hGround", min: [0, 0.8, 0], max: [34, 10.8, 26], mat: "siding", layer: "new-construction", renderOnly: true },
    { id: "hGroundR", min: [17, 0.8, 0], max: [34, 10.8, 26], mat: "siding", layer: "new-construction", diagramOnly: true },
    { id: "stubF", min: [0, 0.8, 0], max: [17, 5.6, 0.5], mat: "siding", layer: "new-construction", diagramOnly: true, section: true },
    { id: "stubL", min: [0, 0.8, 0.5], max: [0.5, 5.6, 25.5], mat: "siding", layer: "new-construction", diagramOnly: true, section: true },
    { id: "stubB", min: [0, 0.8, 25.5], max: [17, 5.6, 26], mat: "siding", layer: "new-construction", diagramOnly: true, section: true },
    { id: "wallsCut", min: [0, 5.6, 0], max: [17, 10.8, 26], mat: "siding", layer: "new-construction", diagramOnly: true, phantom: true },
    { id: "hRoof", min: [-1.5, 10.8, -2], max: [17, 17.6, 28], mat: "shingle", gable: "x", layer: "new-construction", phantom: true },
    { id: "porch", min: [2, 0, -8.5], max: [16, 1.4, 0], mat: "concrete", layer: "new-construction" },
    { id: "steps", min: [7.5, 0, -10.5], max: [10.5, 0.7, -8.5], mat: "concrete", layer: "new-construction" },
    { id: "pierL", min: [2.4, 1.4, -8.2], max: [4.2, 4.4, -6.4], mat: "stone", layer: "new-construction" },
    { id: "pierR", min: [13.8, 1.4, -8.2], max: [15.6, 4.4, -6.4], mat: "stone", layer: "new-construction" },
    { id: "postL", min: [2.8, 4.4, -7.8], max: [3.8, 9.4, -6.8], mat: "wood", layer: "new-construction" },
    { id: "postR", min: [14.2, 4.4, -7.8], max: [15.2, 9.4, -6.8], mat: "wood", layer: "new-construction" },
    { id: "porchRoof", min: [1, 9.4, -9.2], max: [17, 13.8, -2], mat: "shingle", gable: "z", layer: "new-construction", phantom: true },
    // the addition: a second story on the house, its gable to the street
    { id: "hUpper", min: [17, 10.8, 0], max: [34, 19.8, 26], mat: "siding", layer: "home-additions" },
    { id: "hUpperRoof", min: [16, 19.8, -1], max: [35, 25.6, 27], mat: "shingle", gable: "z", layer: "home-additions" },
    // the remodel, inside the cut-away wing (drawing only): a living room at
    // the front (a rug, the sofa, a table, a chair, the fireplace), the
    // kitchen behind it (counters along two walls, an island) and a bath in
    // the back corner (its walls, a tub, a vanity)
    { id: "floor", min: [0.5, 0.8, 0.5], max: [17, 0.85, 25.5], mat: "floor", layer: "home-remodeling", diagramOnly: true },
    { id: "rug", min: [2.5, 0.85, 3], max: [12.5, 0.9, 12.5], mat: "fabric", layer: "home-remodeling", diagramOnly: true },
    { id: "sofa", min: [3, 0.9, 9.5], max: [11, 2.3, 12.3], mat: "fabric", layer: "home-remodeling", diagramOnly: true },
    { id: "sofaBack", min: [3, 0.9, 12.3], max: [11, 3.4, 13.2], mat: "fabric", layer: "home-remodeling", diagramOnly: true },
    { id: "table", min: [5, 0.9, 5], max: [9, 2, 7.2], mat: "wood", layer: "home-remodeling", diagramOnly: true },
    { id: "chair", min: [12.8, 0.9, 4], max: [15.6, 2.8, 7], mat: "fabric", layer: "home-remodeling", diagramOnly: true },
    { id: "hearth", min: [0.5, 0.85, 2], max: [2, 5.6, 6.5], mat: "stone", layer: "home-remodeling", diagramOnly: true },
    { id: "counterB", min: [7.5, 0.85, 23.4], max: [17, 3.8, 25.5], mat: "cabinet", layer: "home-remodeling", diagramOnly: true },
    { id: "counterR", min: [14.9, 0.85, 16.5], max: [17, 3.8, 23.4], mat: "cabinet", layer: "home-remodeling", diagramOnly: true },
    { id: "island", min: [9.5, 0.85, 17.8], max: [13, 3.6, 20.6], mat: "counter", layer: "home-remodeling", diagramOnly: true },
    { id: "bathWallF", min: [0.5, 0.85, 17], max: [6.9, 5.6, 17.4], mat: "drywall", layer: "home-remodeling", diagramOnly: true, section: true },
    { id: "bathWallR", min: [6.5, 0.85, 20], max: [6.9, 5.6, 25.5], mat: "drywall", layer: "home-remodeling", diagramOnly: true, section: true },
    { id: "tub", min: [0.5, 0.85, 20.5], max: [3.1, 2.6, 25.5], mat: "counter", layer: "home-remodeling", diagramOnly: true },
    { id: "vanity", min: [3.8, 0.85, 23.8], max: [6.5, 3.3, 25.5], mat: "cabinet", layer: "home-remodeling", diagramOnly: true },
    // the ADU, a matching cottage in the back corner of the yard
    { id: "aduSlab", min: [-6, 0, 32], max: [8, 0.6, 44], mat: "concrete", layer: "adu-contractor" },
    { id: "aduBody", min: [-6, 0.6, 32], max: [8, 9.6, 44], mat: "siding", layer: "adu-contractor" },
    { id: "aduRoof", min: [-7, 9.6, 31], max: [9, 14.4, 45], mat: "shingle", gable: "x", layer: "adu-contractor" },
    // beside the house: the patio under the pergola, the outdoor kitchen,
    // the fire pit
    { id: "patio", min: [37, 0, 3], max: [55, 0.35, 23], mat: "deck", layer: "outdoor-living" },
    { id: "postA", min: [38, 0.35, 4], max: [38.8, 9, 4.8], mat: "wood", layer: "outdoor-living" },
    { id: "postB", min: [53.2, 0.35, 4], max: [54, 9, 4.8], mat: "wood", layer: "outdoor-living" },
    { id: "postC", min: [38, 0.35, 21.2], max: [38.8, 9, 22], mat: "wood", layer: "outdoor-living" },
    { id: "postD", min: [53.2, 0.35, 21.2], max: [54, 9, 22], mat: "wood", layer: "outdoor-living" },
    { id: "beamF", min: [37.5, 9, 4], max: [54.5, 9.7, 4.8], mat: "wood", layer: "outdoor-living" },
    { id: "beamB", min: [37.5, 9, 21.2], max: [54.5, 9.7, 22], mat: "wood", layer: "outdoor-living" },
    ...pergolaSlats,
    { id: "grill", min: [47, 0.35, 18], max: [53, 3.4, 20.5], mat: "stone", layer: "outdoor-living" },
    { id: "fire", min: [41, 0.35, 9], max: [45, 1.6, 13], mat: "stone", layer: "outdoor-living" },
  ],
  windows: [
    // the wing, under the porch: windows either side of the front door
    { box: "hGround", face: "z-", u: [0.1, 0.21], v: [0.28, 0.76] },
    { box: "hGround", face: "z-", u: [0.244, 0.285], v: [0, 0.74] },
    { box: "hGround", face: "z-", u: [0.32, 0.43], v: [0.28, 0.76] },
    // the two-story wing: a row of three below, two above
    { box: "hGround", face: "z-", u: [0.59, 0.91], v: [0.3, 0.78] },
    { box: "hUpper", face: "z-", u: [0.14, 0.44], v: [0.3, 0.8] },
    { box: "hUpper", face: "z-", u: [0.56, 0.86], v: [0.3, 0.8] },
    { box: "hGround", face: "x-", u: [0.5, 0.69], v: [0.3, 0.75] },
    { box: "hGround", face: "x-", u: [0.23, 0.38], v: [0.3, 0.75] },
    // the ADU: its door and a window
    { box: "aduBody", face: "z-", u: [0.12, 0.3], v: [0, 0.78] },
    { box: "aduBody", face: "z-", u: [0.45, 0.85], v: [0.3, 0.78] },
    { box: "aduBody", face: "x-", u: [0.3, 0.7], v: [0.35, 0.75] },
    // in the drawing: the same windows on the walls it has in pieces, cut
    // through on the cut-away wing (the front door too)
    { box: "hGroundR", face: "z-", u: [0.18, 0.82], v: [0.3, 0.78] },
    { box: "stubF", face: "z-", u: [0.2, 0.42], v: [0.58, 1] },
    { box: "stubF", face: "z-", u: [0.49, 0.57], v: [0, 1] },
    { box: "stubF", face: "z-", u: [0.64, 0.86], v: [0.58, 1] },
    { box: "stubL", face: "x-", u: [0.5, 0.7], v: [0.58, 1] },
    { box: "stubL", face: "x-", u: [0.22, 0.38], v: [0.58, 1] },
  ],
  lamps: [
    { at: [43, 2.4, 11], r: 2.6, layer: "outdoor-living" },
    { at: [42, 8.6, 13], r: 1.4, a: 0.6, layer: "outdoor-living" },
    { at: [49, 8.6, 13], r: 1.4, a: 0.6, layer: "outdoor-living" },
  ],
  diagram: { yaw: -24, pitch: 34 },
  diagramWindows: true,
  // the numbers in the drawing: on the porch, the upper wing's gable, over
  // the ADU, in the cut-away rooms, over the pergola
  // new construction is the whole home: pointing at it lights everything on
  // the lot but the ADU (the user asked, 11-12)
  covers: { "new-construction": ["site", "new-construction", "home-additions", "home-remodeling", "outdoor-living"] },
  marks: {
    "new-construction": [9, 2.6, -4.6],
    "home-additions": [25.5, 22, -1],
    "adu-contractor": [1, 16.5, 38],
    "home-remodeling": [8.5, 6.5, 15],
    "outdoor-living": [46, 12.5, 13],
  },
};

export const ASSETS = { adu, addition, remodel, outdoor, house, property };
