// The service pages' "turntable": one object (an asset, see assets.js), the
// ADU, the addition, the remodeled kitchen or the outdoor room, drawn the
// way a visual-effects asset is shown for review: alone in the dark on a
// turntable, under a studio key light with the homepage's gold behind it,
// the service's name in huge outline at its back. It assembles when the page
// opens (`build` 0-1: its layers come down into place, then its lights come
// on) and turns a little as the visitor scrolls (`spin` 0-1).
//
//   drawStudio(context, { width, height, dpr, asset, layout, portrait, build, spin, calm, lite, fonts })
//
// The same object also draws as an architect's exploded diagram, in line on
// white, for the "Layer by layer" section (drawDiagram): its layers pulled
// apart (`spread` 0-1), numbered, the one being read in gold (`active`).
//
// Everything is drawn from numbers, nothing downloaded; world units are feet,
// y up, the front facing -z. The math, colors and the light's glow, bloom
// and dust are the homepage scene's (intro/scene.js).

import {
  GOLD,
  RAD,
  TAU,
  clamp,
  cross,
  dot,
  drawBloom,
  drawDust,
  drawLight,
  drawOrder,
  edges,
  faces,
  grainTile,
  lerp,
  mix,
  norm,
  onFace,
  path,
  rgba,
  rng,
  smooth,
  sprite,
  sub,
  visible,
} from "@/components/Hero/intro/scene";

const easeInOut = (k) => (k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2);

// ---- materials and light ----------------------------------------------------
// How much light each finish gives back, and `slats`: lines across it every
// so many feet (cladding).
const MATS = {
  stucco: { albedo: 0.62 },
  existing: { albedo: 0.4 },
  clad: { albedo: 0.2, slats: 1.1 },
  concrete: { albedo: 0.46 },
  deck: { albedo: 0.3 },
  wood: { albedo: 0.36 },
  roof: { albedo: 0.16 },
  stone: { albedo: 0.36 },
  cabinet: { albedo: 0.46 },
  counter: { albedo: 0.85 },
  drywall: { albedo: 0.64 },
  floor: { albedo: 0.34 },
  metal: { albedo: 0.14 },
  fabric: { albedo: 0.3 },
  lamp: { albedo: 0.95 },
  glass: { albedo: 0.08 },
};
// A studio's light: a key from the front left, above, so the object reads;
// the homepage's gold from behind, catching its tops and edges.
const KEY = norm([-0.55, 0.75, -0.5]);
const RIM = norm([0.3, 0.45, 1]);
const KEY_COLOR = [235, 222, 204];
function shade(albedo, n) {
  const k = Math.max(0, dot(n, KEY)), r = Math.max(0, dot(n, RIM));
  return [0, 1, 2].map((i) => Math.min(255, Math.round(albedo * (20 + KEY_COLOR[i] * 0.62 * k + GOLD.mid[i] * 0.85 * r) + 3)));
}

// ---- geometry ---------------------------------------------------------------
const moved = (b, [dx, dy, dz]) => ({ ...b, min: [b.min[0] + dx, b.min[1] + dy, b.min[2] + dz], max: [b.max[0] + dx, b.max[1] + dy, b.max[2] + dz] });
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const scale = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const ZERO = [0, 0, 0];

function view(target, dist, yawDeg, pitchDeg) {
  const yaw = yawDeg * RAD, pitch = pitchDeg * RAD;
  const eye = [
    target[0] + dist * Math.sin(yaw) * Math.cos(pitch),
    target[1] + dist * Math.sin(pitch),
    target[2] - dist * Math.cos(yaw) * Math.cos(pitch),
  ];
  const f = norm(sub(target, eye)), r = norm(cross([0, 1, 0], f)), u = cross(f, r);
  return {
    eye,
    project: (p) => {
      const d = sub(p, eye);
      const z = dot(d, f);
      return [dot(d, r) / z, -dot(d, u) / z, z];
    },
  };
}
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
const corners = (b) => edges(b).flat();

// A window's pane as a thin box on its wall, for the diagram, where the
// windows come away from the walls as a layer of their own (pushed out
// along the wall's face).
function paneBox(asset, w, i) {
  const b = asset.boxes.find((x) => x.id === w.box);
  const f = faces(b)[w.face];
  const A = onFace(f, w.u[0], w.v[0]), B = onFace(f, w.u[1], w.v[1]);
  const n = f.n, t = 0.3;
  const min = [0, 1, 2].map((k) => Math.min(A[k], B[k]) + (n[k] < 0 ? -t : 0));
  const max = [0, 1, 2].map((k) => Math.max(A[k], B[k]) + (n[k] > 0 ? t : 0));
  const base = asset.layers[b.layer]?.explode ?? ZERO;
  return { id: `pane${i}`, min, max, mat: "glass", layer: asset.paneLayer, explode: add(base, scale(n, 4)) };
}

const explodeOf = (asset, b) => b.explode ?? asset.layers[b.layer]?.explode ?? ZERO;
const buildOf = (asset, b) => b.build ?? asset.layers[b.layer]?.build ?? ZERO;

// Worked out once per asset: what the turntable draws, what the diagram
// draws, and how much of the screen each takes from every angle it's seen.
const prepared = new Map();
function prepare(asset) {
  if (prepared.has(asset)) return prepared.get(asset);
  const render = asset.boxes.filter((b) => !b.diagramOnly);
  const panes = asset.paneLayer ? asset.windows.filter((w) => w.pane !== false).map((w, i) => paneBox(asset, w, i)) : [];
  const diagram = [...asset.boxes, ...panes];
  const extent = [Infinity, Infinity, -Infinity, -Infinity];
  const pts = render.flatMap(corners);
  for (let i = 0; i <= 8; i++) {
    const yaw = lerp(asset.yaw[0] - 18, asset.yaw[1], i / 8);
    extentOf(view(asset.target, asset.dist, yaw, asset.pitch).project, pts, extent);
  }
  const d = asset.diagram;
  const dv = view(d.target ?? asset.target, d.dist ?? asset.dist, d.yaw, d.pitch);
  const diagramExtent = extentOf(dv.project, diagram.flatMap((b) => corners(moved(b, explodeOf(asset, b)))));
  const p = { render, diagram, extent, diagramExtent };
  prepared.set(asset, p);
  return p;
}

// ---- where it goes ------------------------------------------------------------
// The room the object has: beside the copy on a wide screen (or above it,
// when the copy is too wide), above it on a phone, from under the navbar
// down to the breadcrumb (`lead`), so nothing runs into it.
function room(width, height, portrait, layout) {
  const nav = layout.navBottom ?? (portrait ? 72 : 88);
  const above = () => {
    const bottom = (layout.lead ?? layout.copyTop * height) - (portrait ? 18 : 24);
    return { x0: 0.05 * width, x1: 0.95 * width, y0: nav + 18, y1: Math.max(nav + 140, bottom) };
  };
  if (portrait) return above();
  const left = Math.max(layout.copyRight ?? 0, layout.titleRight ?? 0) + 0.04;
  if (left > 0.62) return above();
  return { x0: left * width, x1: 0.975 * width, y0: nav + 24, y1: 0.94 * height };
}

// The service's name in outline at the object's back, as wide as its room.
function drawWord(ctx, word, box, portrait, fonts) {
  ctx.save();
  ctx.font = `100px ${fonts.display}`;
  const m = ctx.measureText(word);
  const capH = (m.actualBoundingBoxAscent + m.actualBoundingBoxDescent) / 100;
  const size = Math.min(((box.x1 - box.x0) * 0.98 * 100) / m.width, ((box.y1 - box.y0) * 0.62) / capH);
  ctx.font = `${size}px ${fonts.display}`;
  const w = ctx.measureText(word).width;
  const baseline = box.y0 + (box.y1 - box.y0) * 0.36 + (capH * size) / 2;
  ctx.textBaseline = "alphabetic";
  ctx.lineJoin = "round";
  ctx.fillStyle = rgba(GOLD.mid, portrait ? 0.06 : 0.05);
  ctx.fillText(word, (box.x0 + box.x1) / 2 - w / 2, baseline);
  ctx.strokeStyle = rgba(GOLD.mid, portrait ? 0.3 : 0.24);
  ctx.lineWidth = Math.max(1, size / 140);
  ctx.strokeText(word, (box.x0 + box.x1) / 2 - w / 2, baseline);
  ctx.restore();
}

// The turntable under it: a dark disc lit warm toward the middle, a gold
// ring at its edge.
function drawStage(ctx, cam, asset) {
  const [cx, , cz] = asset.target, R = asset.stage;
  const ring = (r) => Array.from({ length: 72 }, (_, i) => cam.toScreen([cx + r * Math.cos((i / 72) * TAU), 0, cz + r * Math.sin((i / 72) * TAU)]));
  const pts = ring(R);
  const [hx, hy] = cam.toScreen([cx, 0, cz]);
  const rx = Math.max(...pts.map(([x]) => Math.abs(x - hx)));
  ctx.save();
  path(ctx, pts);
  const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, rx);
  g.addColorStop(0, "rgba(28,20,12,0.9)");
  g.addColorStop(0.7, "rgba(14,12,10,0.85)");
  g.addColorStop(1, "rgba(8,8,8,0.6)");
  ctx.fillStyle = g;
  ctx.fill();
  ctx.globalCompositeOperation = "lighter";
  ctx.strokeStyle = rgba(GOLD.mid, 0.32);
  ctx.lineWidth = 1.2;
  ctx.stroke();
  path(ctx, ring(R * 1.06));
  ctx.strokeStyle = rgba(GOLD.mid, 0.1);
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}

// One face of a box: its shade (darker at the foot), its cladding lines,
// its windows (dark glass, warm once lit), a fine edge, and the gold light
// catching its top edge.
function drawFace(ctx, cam, asset, b, key, face, lit, glows) {
  const mat = MATS[b.mat] ?? MATS.stucco;
  const pts = face.p.map((p) => cam.toScreen(p));
  const base = shade(mat.albedo, face.n);
  path(ctx, pts);
  if (key === "y+") ctx.fillStyle = rgba(base);
  else {
    const foot = [(pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2];
    const head = [(pts[2][0] + pts[3][0]) / 2, (pts[2][1] + pts[3][1]) / 2];
    const g = ctx.createLinearGradient(foot[0], foot[1], head[0], head[1] + 0.01);
    g.addColorStop(0, rgba(base.map((v) => v * 0.55)));
    g.addColorStop(1, rgba(base.map((v) => Math.min(255, v * 1.1))));
    ctx.fillStyle = g;
  }
  ctx.fill();
  if (mat.slats && key !== "y+") {
    const h = b.max[1] - b.min[1];
    ctx.beginPath();
    for (let v = mat.slats / h; v < 1; v += mat.slats / h) {
      const [x0, y0] = cam.toScreen(onFace(face, 0, v)), [x1, y1] = cam.toScreen(onFace(face, 1, v));
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
    }
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  for (const w of asset.windows) {
    if (w.box !== b.id || w.face !== key) continue;
    const quad = [[w.u[0], w.v[0]], [w.u[1], w.v[0]], [w.u[1], w.v[1]], [w.u[0], w.v[1]]].map(([u, v]) => cam.toScreen(onFace(face, u, v)));
    path(ctx, quad);
    ctx.fillStyle = "rgb(12,13,16)";
    ctx.fill();
    if (lit > 0) {
      const [fx, fy] = cam.toScreen(onFace(face, (w.u[0] + w.u[1]) / 2, w.v[0]));
      const [hx, hy] = cam.toScreen(onFace(face, (w.u[0] + w.u[1]) / 2, w.v[1]));
      const g = ctx.createLinearGradient(fx, fy, hx, hy + 0.01);
      g.addColorStop(0, rgba(GOLD.deep, 0.6 * lit));
      g.addColorStop(0.55, rgba(GOLD.mid, 0.8 * lit));
      g.addColorStop(0.92, rgba(GOLD.core, 0.92 * lit));
      g.addColorStop(1, rgba(GOLD.mid, 0.7 * lit));
      path(ctx, quad);
      ctx.fillStyle = g;
      ctx.fill();
      const span = Math.hypot(...sub(onFace(face, w.u[0], w.v[0]), onFace(face, w.u[1], w.v[1])));
      glows.push({ at: onFace(face, (w.u[0] + w.u[1]) / 2, (w.v[0] + w.v[1]) / 2), r: span * 0.55, a: 0.45 * lit });
    }
    path(ctx, quad);
    ctx.strokeStyle = "rgba(4,4,4,0.9)";
    ctx.lineWidth = 1.4;
    ctx.stroke();
  }
  path(ctx, pts);
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 1;
  ctx.stroke();
  if (key === "y+") {
    ctx.strokeStyle = rgba(GOLD.mid, 0.38);
    ctx.stroke();
  }
}

// light spilling from the windows and the lamps
function drawGlows(ctx, cam, glows) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const img = sprite(GOLD.mid);
  for (const { at, r, a } of glows) {
    if (a <= 0) continue;
    const [x, y, z] = cam.toScreen(at);
    const size = r * (cam.s / z) * 3;
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(img, x - size / 2, y - size / 2, size, size * 0.85);
  }
  ctx.restore();
}

// ---- the turntable --------------------------------------------------------------
export function drawStudio(ctx, { width, height, dpr = 1, asset, layout, portrait = false, build = 1, spin = 0, calm = false, lite = false, fonts }) {
  const P = prepare(asset);
  const box = room(width, height, portrait, layout);
  // it comes round a little as it assembles, then turns with the scroll
  // (neither with Reduce Motion: the camera holds still)
  const yaw = calm ? asset.yaw[0] : lerp(asset.yaw[0], asset.yaw[1], spin) - 18 * (1 - easeInOut(build));
  const { eye, project } = view(asset.target, asset.dist, yaw, asset.pitch);
  const e = P.extent;
  // a little short of its room, so the name behind it shows round it
  const s = 0.84 * Math.min((box.x1 - box.x0) / (e[2] - e[0]), (box.y1 - box.y0) / (e[3] - e[1]));
  const ox = (box.x0 + box.x1) / 2 - (s * (e[0] + e[2])) / 2;
  const oy = (box.y0 + box.y1) / 2 - (s * (e[1] + e[3])) / 2 + 0.06 * (box.y1 - box.y0);
  const cam = {
    eye,
    s,
    toScreen: (p) => {
      const [x, y, z] = project(p);
      return [ox + x * s, oy + y * s, z];
    },
  };

  // each layer comes down into place in its turn (`order`), fading in as it
  // starts; with Reduce Motion from half as far
  const order = asset.order;
  const far = calm ? 0.5 : 1;
  const placed = (layer) => {
    const i = order.indexOf(layer);
    if (i < 0) return 1;
    const start = (i / order.length) * 0.6;
    return clamp((build - start) / 0.4);
  };
  const offsetOf = (b) => scale(buildOf(asset, b), far * (1 - easeInOut(placed(b.layer))));
  const lit = smooth(0.72, 0.98, build);

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#030303";
  ctx.fillRect(0, 0, width, height);

  const light = cam.toScreen(asset.light);
  const lightScale = Math.max(box.x1 - box.x0, box.y1 - box.y0) * 0.6;
  drawLight(ctx, GOLD, 1, light, lightScale);
  drawWord(ctx, asset.word, box, portrait, fonts);
  drawDust(ctx, calm ? 0 : spin * 0.6, 0, GOLD, width, height, light, false);
  drawStage(ctx, cam, asset);

  const glows = [];
  const parts = P.render.map((b) => ({ b: moved(b, offsetOf(b)), a: smooth(0, 0.3, placed(b.layer)) }));
  const alphaOf = new Map(parts.map(({ b, a }) => [b, a]));
  for (const b of drawOrder(parts.map(({ b }) => b), eye)) {
    const a = alphaOf.get(b);
    if (a <= 0) continue;
    ctx.save();
    ctx.globalAlpha = a;
    const fs = faces(b);
    for (const key of ["z-", "z+", "x-", "x+", "y+"]) if (visible(fs[key], eye)) drawFace(ctx, cam, asset, b, key, fs[key], lit, glows);
    ctx.restore();
  }
  for (const lamp of asset.lamps ?? []) {
    const at = add(lamp.at, scale(asset.layers[lamp.layer]?.build ?? ZERO, far * (1 - easeInOut(placed(lamp.layer)))));
    glows.push({ at, r: lamp.r, a: (lamp.a ?? 0.8) * lit });
  }
  drawGlows(ctx, cam, glows);
  drawBloom(ctx, GOLD, 1, light, lightScale);

  drawDust(ctx, calm ? 0 : spin * 0.6, 0, GOLD, width, height, light, true);
  const vx = (box.x0 + box.x1) / 2, vy = height * 0.45;
  const v = ctx.createRadialGradient(vx, vy, Math.min(width, height) * 0.3, vx, vy, Math.max(width, height) * 0.85);
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(1, "rgba(0,0,0,0.7)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, width, height);
  if (!lite) {
    ctx.save();
    ctx.globalCompositeOperation = "overlay";
    ctx.globalAlpha = 0.08;
    const r = rng(Math.round(spin * 400 + build * 100) + 1);
    ctx.translate(-r() * 256, -r() * 256);
    ctx.fillStyle = ctx.createPattern(grainTile(), "repeat");
    ctx.fillRect(0, 0, width + 256, height + 256);
    ctx.restore();
  }
}

// ---- the exploded diagram ---------------------------------------------------------
// Line on white, as an architect draws an exploded view: each layer pulled
// away from the next (`spread` 0-1), its faces white to light grey by which
// way they face, a fine black edge; the layer being read (`active`) in gold.
// Each numbered layer (`labels`, { layer: number }) gets a hexagon with its
// number, on a leader from its left edge. `ghost` layers (what's already
// there, like the house under an addition) are drawn faint.
const FACE_FILL = { "y+": [255, 255, 255], "z-": [242, 241, 238], "z+": [242, 241, 238], "x-": [232, 230, 226], "x+": [232, 230, 226] };
const HEX = (cx, cy, r) => Array.from({ length: 6 }, (_, i) => [cx + r * Math.cos(((60 * i - 90) * Math.PI) / 180), cy + r * Math.sin(((60 * i - 90) * Math.PI) / 180)]);

export function drawDiagram(ctx, { width, height, dpr = 1, asset, spread = 1, active = null, labels = {}, fonts }) {
  const P = prepare(asset);
  const d = asset.diagram;
  const { eye, project } = view(d.target ?? asset.target, d.dist ?? asset.dist, d.yaw, d.pitch);
  const e = P.diagramExtent;
  const pad = { l: 58, r: 12, t: 16, b: 16 };
  const s = Math.min((width - pad.l - pad.r) / (e[2] - e[0]), (height - pad.t - pad.b) / (e[3] - e[1]));
  const ox = pad.l + (width - pad.l - pad.r) / 2 - (s * (e[0] + e[2])) / 2;
  const oy = pad.t + (height - pad.t - pad.b) / 2 - (s * (e[1] + e[3])) / 2;
  const toScreen = (p) => {
    const [x, y, z] = project(p);
    return [ox + x * s, oy + y * s, z];
  };
  const ghosts = asset.ghost ?? [];
  const gold = [233, 166, 72];

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.lineJoin = "round";
  const boxes = P.diagram.map((b) => moved(b, scale(explodeOf(asset, b), spread)));
  for (const b of drawOrder(boxes, eye)) {
    const ghost = ghosts.includes(b.layer);
    const on = active && b.layer === active;
    const fs = faces(b);
    for (const key of ["z-", "z+", "x-", "x+", "y+"]) {
      if (!visible(fs[key], eye)) continue;
      const pts = fs[key].p.map(toScreen);
      path(ctx, pts);
      const base = b.mat === "glass" ? [214, 224, 230] : FACE_FILL[key];
      ctx.fillStyle = rgba(on ? mix(base, gold, key === "y+" ? 0.3 : 0.42) : ghost ? mix(base, [255, 255, 255], 0.6) : base);
      ctx.fill();
      ctx.strokeStyle = on ? "rgba(176,112,28,0.95)" : ghost ? "rgba(17,17,17,0.22)" : "rgba(17,17,17,0.72)";
      ctx.lineWidth = on ? 1.4 : 1;
      ctx.stroke();
    }
  }

  // the numbers: a hexagon left of each layer, kept apart, on a leader
  const marks = Object.entries(labels)
    .map(([layer, number]) => {
      const pts = boxes.filter((b) => b.layer === layer).flatMap((b) => corners(b).map(toScreen));
      if (!pts.length) return null;
      const left = pts.reduce((a, p) => (p[0] < a[0] ? p : a));
      const midY = pts.reduce((sum, p) => sum + p[1], 0) / pts.length;
      return { layer, number, anchor: [left[0], (left[1] + midY) / 2], y: (left[1] + midY) / 2 };
    })
    .filter(Boolean)
    .sort((a, b) => a.y - b.y);
  for (let i = 1; i < marks.length; i++) marks[i].y = Math.max(marks[i].y, marks[i - 1].y + 32);
  const overflow = marks.length ? marks[marks.length - 1].y - (height - 18) : 0;
  if (overflow > 0) for (const m of marks) m.y -= overflow;
  ctx.font = `700 11px ${fonts.mono}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const m of marks) {
    const on = m.layer === active;
    const cx = 22, r = 13;
    ctx.beginPath();
    ctx.moveTo(cx + r, m.y);
    ctx.lineTo(Math.max(cx + r + 6, m.anchor[0] - 6), m.y);
    ctx.lineTo(m.anchor[0], m.anchor[1]);
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = on ? "rgba(176,112,28,0.9)" : "rgba(17,17,17,0.35)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);
    path(ctx, HEX(cx, m.y, r));
    ctx.fillStyle = on ? rgba(gold) : "#ffffff";
    ctx.fill();
    ctx.strokeStyle = on ? rgba(gold) : "rgba(17,17,17,0.5)";
    ctx.lineWidth = 1.3;
    ctx.stroke();
    ctx.fillStyle = on ? "#111" : "rgba(17,17,17,0.75)";
    ctx.fillText(String(m.number).padStart(2, "0"), cx, m.y + 0.5);
  }
}
