// The small drawings in the service pages' type switcher
// (components/Service/Types), on a 240 x 160 sheet: what each type adds, in
// gold, on a lot seen from above or a floor plan. Not to scale (the 4 ft setbacks are marked, not measured); they show
// where things go, not how big they are.

const STREET = { t: "text", x: 120, y: 155, label: "STREET" };
const LOT = { t: "lot", x: 16, y: 10, w: 208, h: 132 };

// new construction: what the lot starts as (an `old` house is dashed), and
// the new home in gold
export const NEW_PLANS = {
  custom: [LOT, { t: "new", x: 52, y: 40, w: 136, h: 74, label: "NEW HOME" }, { t: "text", x: 120, y: 28, label: "EMPTY LOT, BUILT ON" }, STREET],
  rebuild: [
    LOT,
    { t: "old", x: 70, y: 74, w: 100, h: 46, label: "OLD HOUSE" },
    { t: "new", x: 46, y: 30, w: 148, h: 70, label: "NEW HOME" },
    STREET,
  ],
  loss: [
    LOT,
    { t: "old", x: 56, y: 40, w: 128, h: 74 },
    { t: "new", x: 62, y: 46, w: 116, h: 62, label: "REBUILT" },
    { t: "text", x: 120, y: 28, label: "THE SAME FOOTPRINT, OR NEW" },
    STREET,
  ],
};

export const ADU_PLANS = {
  detached: [
    LOT,
    { t: "house", x: 46, y: 90, w: 110, h: 44, label: "HOUSE" },
    { t: "new", x: 150, y: 24, w: 58, h: 42, label: "ADU" },
    { t: "dim", x1: 208, y1: 45, x2: 224, y2: 45, label: "4 FT" },
    { t: "dim", x1: 179, y1: 10, x2: 179, y2: 24, label: "4 FT" },
    { t: "text", x: 92, y: 52, label: "YARD" },
    STREET,
  ],
  attached: [
    LOT,
    { t: "house", x: 46, y: 90, w: 110, h: 44, label: "HOUSE" },
    { t: "new", x: 156, y: 90, w: 44, h: 44, label: "ADU" },
    { t: "text", x: 120, y: 52, label: "YARD" },
    STREET,
  ],
  garage: [
    LOT,
    { t: "house", x: 36, y: 90, w: 104, h: 44, label: "HOUSE" },
    { t: "new", x: 152, y: 92, w: 46, h: 42, label: "GARAGE", label2: "TO ADU" },
    { t: "area", x: 160, y: 134, w: 30, h: 8 },
    { t: "text", x: 110, y: 52, label: "YARD" },
    STREET,
  ],
  junior: [
    LOT,
    { t: "house", x: 46, y: 78, w: 136, h: 56, label: "HOUSE" },
    { t: "new", x: 138, y: 78, w: 44, h: 30, label: "JADU" },
    { t: "text", x: 110, y: 46, label: "YARD" },
    STREET,
  ],
};

// home additions, on the ground floor (Andranik, 11-16): the lot from
// above, the house by the street and the addition in gold
export const ADDITION_PLANS = {
  rear: [
    LOT,
    { t: "house", x: 50, y: 88, w: 128, h: 44, label: "HOUSE" },
    { t: "new", x: 86, y: 50, w: 68, h: 38, label: "ADDITION" },
    { t: "text", x: 120, y: 32, label: "YARD" },
    STREET,
  ],
  side: [
    LOT,
    { t: "house", x: 38, y: 88, w: 112, h: 44, label: "HOUSE" },
    { t: "new", x: 150, y: 96, w: 50, h: 36, label: "ADDITION" },
    { t: "dim", x1: 200, y1: 114, x2: 224, y2: 114, label: "SETBACK" },
    { t: "text", x: 110, y: 50, label: "YARD" },
    STREET,
  ],
  bumpout: [
    LOT,
    { t: "house", x: 46, y: 80, w: 148, h: 52, label: "HOUSE" },
    { t: "new", x: 98, y: 62, w: 44, h: 18, label: "BUMP-OUT" },
    { t: "text", x: 120, y: 38, label: "YARD" },
    STREET,
  ],
};

// one floor plan, the rooms a remodel takes on in gold
const ROOMS = [
  { id: "kitchen", x: 30, y: 18, w: 78, h: 60, label: "KITCHEN" },
  { id: "living", x: 108, y: 18, w: 102, h: 60, label: "LIVING" },
  { id: "bed1", x: 30, y: 78, w: 64, h: 62, label: "BEDROOM" },
  { id: "bath", x: 94, y: 78, w: 40, h: 62, label: "BATH" },
  { id: "bed2", x: 134, y: 78, w: 76, h: 62, label: "BEDROOM" },
];
const rooms = (on) => [
  { t: "text", x: 40, y: 12, label: "FLOOR PLAN" },
  ...ROOMS.map(({ id, ...room }) => ({ t: "room", ...room, on: on.includes(id) })),
];
export const REMODEL_PLANS = {
  kitchen: rooms(["kitchen"]),
  bathroom: rooms(["bath"]),
  whole: rooms(ROOMS.map(({ id }) => id)),
};

// a commercial space's floor plan, the storefront along the bottom, the
// part each kind of build-out is about in gold
const FRONT = { t: "text", x: 120, y: 155, label: "STOREFRONT" };
const PLAN = { t: "text", x: 40, y: 12, label: "FLOOR PLAN" };
const space = (rooms) => [PLAN, ...rooms.map((room) => ({ t: "room", ...room })), FRONT];
export const COMMERCIAL_PLANS = {
  tenant: space([
    { x: 30, y: 18, w: 120, h: 122, label: "YOUR SPACE", on: true },
    { x: 150, y: 18, w: 60, h: 62, label: "OFFICE", on: true },
    { x: 150, y: 80, w: 60, h: 60, label: "RESTROOM", on: true },
  ]),
  restaurant: space([
    { x: 30, y: 18, w: 108, h: 54, label: "KITCHEN", on: true },
    { x: 138, y: 18, w: 40, h: 54, label: "STORAGE" },
    { x: 178, y: 18, w: 32, h: 54, label: "WC" },
    { x: 30, y: 72, w: 180, h: 68, label: "DINING", on: true },
  ]),
  office: space([
    { x: 30, y: 18, w: 60, h: 56, label: "OFFICE", on: true },
    { x: 90, y: 18, w: 60, h: 56, label: "OFFICE", on: true },
    { x: 150, y: 18, w: 60, h: 56, label: "MEETING", on: true },
    { x: 30, y: 74, w: 120, h: 66, label: "OPEN WORK", on: true },
    { x: 150, y: 74, w: 60, h: 66, label: "RECEPTION" },
  ]),
  retail: space([
    { x: 30, y: 18, w: 120, h: 40, label: "STOCKROOM" },
    { x: 150, y: 18, w: 60, h: 40, label: "RESTROOM" },
    { x: 30, y: 58, w: 180, h: 82, label: "SALES FLOOR", on: true },
  ]),
};

// one backyard from above, the part each project builds in gold
const yard = (on) => [
  { t: "house", x: 16, y: 8, w: 208, h: 32, label: "HOUSE" },
  { t: "area", x: 28, y: 48, w: 184, h: 66, on: on === "patio" },
  { t: "pergola", x: 36, y: 54, w: 78, h: 50, label: "PERGOLA", on: on === "pergola" },
  { t: "area", x: 150, y: 54, w: 54, h: 12, on: on === "kitchen" },
  { t: "area", x: 192, y: 66, w: 12, h: 38, on: on === "kitchen" },
  { t: "text", x: 168, y: 82, label: on === "kitchen" ? "KITCHEN" : "" },
  { t: "text", x: 70, y: 112, label: on === "patio" ? "PATIO" : "" },
  { t: "circle", cx: 176, cy: 134, r: 9, label: "", on: on === "fire" },
  { t: "text", x: 150, y: 137, label: on === "fire" ? "FIRE PIT" : "" },
  { t: "text", x: 70, y: 138, label: "YARD" },
];
export const OUTDOOR_PLANS = {
  pergola: yard("pergola"),
  kitchen: yard("kitchen"),
  patio: yard("patio"),
  fire: yard("fire"),
};
