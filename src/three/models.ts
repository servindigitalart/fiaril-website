// Conceptual orthopaedic visualisations, built procedurally (no external models, no licences).
// They are illustrations, NOT FIARIL products, certified devices or real specifications:
// shapes and proportions are generic and every surface that shows them says "Visualización conceptual".
import {
  BufferGeometry, Curve, CylinderGeometry, ConeGeometry, ExtrudeGeometry, Group, LatheGeometry, Mesh,
  MeshPhysicalMaterial, MeshStandardMaterial, Path, Quaternion, Shape, SphereGeometry, TubeGeometry, Vector2, Vector3,
  type Material,
} from 'three';

export const materials = () => ({
  titanium: new MeshPhysicalMaterial({ color: 0xb4bac3, metalness: 1, roughness: 0.3 }),
  porous: new MeshPhysicalMaterial({ color: 0x9aa0a8, metalness: 1, roughness: 0.72 }),
  steel: new MeshPhysicalMaterial({ color: 0xd9dce1, metalness: 1, roughness: 0.14 }),
  ceramic: new MeshPhysicalMaterial({ color: 0xf2f0ea, metalness: 0, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.08 }),
  polymer: new MeshPhysicalMaterial({ color: 0xf3f3f1, metalness: 0, roughness: 0.48, sheen: 0.4 }),
  navy: new MeshStandardMaterial({ color: 0x07253f, metalness: 0.05, roughness: 0.55 }), // FIARIL navy handle
});
export type Materials = ReturnType<typeof materials>;

const Y = new Vector3(0, 1, 0);
/** A mesh whose local +Y axis runs from a to b. */
function between(geo: BufferGeometry, mat: Material, a: Vector3, b: Vector3) {
  const m = new Mesh(geo, mat), d = b.clone().sub(a);
  m.position.copy(a).addScaledVector(d, 0.5);
  m.quaternion.copy(new Quaternion().setFromUnitVectors(Y, d.normalize()));
  return m;
}

class Helix extends Curve<Vector3> {
  constructor(private r: number, private len: number, private turns: number, private phase = 0) { super(); }
  getPoint(t: number, target = new Vector3()) {
    const a = this.phase + t * this.turns * Math.PI * 2;
    return target.set(Math.cos(a) * this.r, t * this.len - this.len / 2, Math.sin(a) * this.r);
  }
}

/** Bone screw along local -Y from its head at the origin. */
export function screw(m: Materials, length = 0.9, r = 0.034) {
  const g = new Group();
  const head = new LatheGeometry([
    new Vector2(0, 0.05), new Vector2(r * 1.9, 0.045), new Vector2(r * 2.15, 0.02), new Vector2(r * 2.1, -0.02), new Vector2(r * 1.2, -0.05), new Vector2(r, -0.06),
  ], 40);
  g.add(new Mesh(head, m.titanium));
  const shaft = new Mesh(new CylinderGeometry(r * 0.78, r * 0.6, length, 24), m.titanium);
  shaft.position.y = -0.06 - length / 2;
  g.add(shaft);
  const thread = new Mesh(new TubeGeometry(new Helix(r * 0.86, length * 0.86, length * 22), 520, r * 0.2, 6), m.titanium);
  thread.position.y = -0.06 - length * 0.53;
  g.add(thread);
  const tip = new Mesh(new ConeGeometry(r * 0.6, 0.08, 20), m.titanium);
  tip.rotation.z = Math.PI; tip.position.y = -0.1 - length;
  g.add(tip);
  return g;
}

/** Hip arthroplasty concept: stem, neck, ceramic head, porous cup and liner. */
export function hip(m: Materials) {
  const g = new Group();
  const s = new Shape();
  s.moveTo(0.02, -1.32);
  s.bezierCurveTo(0.09, -1.0, 0.15, -0.2, 0.17, 0.36); // lateral edge
  s.lineTo(0.13, 0.5);
  s.lineTo(-0.02, 0.52); // shoulder
  s.lineTo(-0.2, 0.46);
  s.bezierCurveTo(-0.24, 0.3, -0.1, 0.05, -0.07, -0.4); // calcar curve
  s.bezierCurveTo(-0.05, -0.9, -0.03, -1.2, 0.02, -1.32);
  const stemGeo = new ExtrudeGeometry(s, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.045, bevelSize: 0.04, bevelSegments: 6, curveSegments: 48 });
  stemGeo.translate(0, 0, -0.05);
  g.add(new Mesh(stemGeo, m.titanium));
  const neckA = new Vector3(-0.1, 0.44, 0), neckB = new Vector3(-0.36, 0.72, 0);
  g.add(between(new CylinderGeometry(0.045, 0.06, neckA.distanceTo(neckB), 32), m.titanium, neckA, neckB));
  const head = new Mesh(new SphereGeometry(0.2, 64, 48), m.ceramic);
  head.position.set(-0.42, 0.78, 0);
  g.add(head);
  // cup + liner, opening towards the head's neck axis
  const cup = new Group();
  cup.add(new Mesh(new SphereGeometry(0.3, 64, 32, 0, Math.PI * 2, 0, Math.PI * 0.42), m.porous));
  const liner = new Mesh(new SphereGeometry(0.25, 64, 32, 0, Math.PI * 2, 0, Math.PI * 0.46), m.polymer);
  cup.add(liner);
  // exploded view: the cup sits off the head along the neck axis, as in a product shot
  const axis = new Vector3(-0.5, 0.52, 0.7).normalize();
  cup.position.copy(head.position).addScaledVector(axis, 0.42);
  cup.quaternion.setFromUnitVectors(Y, axis);
  g.add(cup);
  g.rotation.set(0.12, -0.62, 0.08);
  return g;
}

/** Fixation plate concept with screws. */
export function plate(m: Materials) {
  const g = new Group();
  const L = 2.3, W = 0.26, holes = 7;
  const s = new Shape();
  s.moveTo(-L / 2, -W / 2); s.lineTo(L / 2, -W / 2); s.absarc(L / 2, 0, W / 2, -Math.PI / 2, Math.PI / 2, false);
  s.lineTo(-L / 2, W / 2); s.absarc(-L / 2, 0, W / 2, Math.PI / 2, Math.PI * 1.5, false);
  const xs: number[] = [];
  for (let i = 0; i < holes; i++) {
    const x = -L / 2 + 0.12 + (i * (L - 0.24)) / (holes - 1);
    xs.push(x);
    const h = new Path(); h.absarc(x, 0, i === 3 ? 0.075 : 0.058, 0, Math.PI * 2, true); s.holes.push(h);
  }
  const geo = new ExtrudeGeometry(s, { depth: 0.045, bevelEnabled: true, bevelThickness: 0.018, bevelSize: 0.018, bevelSegments: 4, curveSegments: 40 });
  // gentle anatomical bend along the length
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) p.setZ(i, p.getZ(i) - 0.07 * p.getX(i) * p.getX(i));
  geo.computeVertexNormals();
  g.add(new Mesh(geo, m.titanium));
  [0, 2, 4, 6].forEach((i, k) => {
    const sc = screw(m, 0.72 - (k % 2) * 0.1, 0.03);
    sc.rotation.x = Math.PI / 2; // shaft through the plate (-z)
    sc.position.set(xs[i], 0, 0.08 - 0.07 * xs[i] * xs[i]);
    g.add(sc);
  });
  g.rotation.set(-0.95, 0.18, 0.42);
  return g;
}

/** Instrument concept: hex driver with a FIARIL-navy polymer handle. */
export function instrument(m: Materials) {
  const g = new Group();
  const pts: Vector2[] = [];
  for (let i = 0; i <= 40; i++) {
    const y = i / 40;
    const r = 0.13 + 0.03 * Math.sin(y * Math.PI) + (i % 8 < 2 && i > 4 && i < 36 ? -0.012 : 0); // grip grooves
    pts.push(new Vector2(i === 0 || i === 40 ? 0.06 : r, y * 0.95));
  }
  pts.unshift(new Vector2(0, 0)); pts.push(new Vector2(0, 0.95));
  const handle = new Mesh(new LatheGeometry(pts, 48), m.navy);
  handle.position.y = 0.45;
  g.add(handle);
  const collar = new Mesh(new CylinderGeometry(0.06, 0.08, 0.08, 32), m.steel);
  collar.position.y = 0.42;
  g.add(collar);
  const shaft = new Mesh(new CylinderGeometry(0.03, 0.03, 1.45, 32), m.steel);
  shaft.position.y = -0.33;
  g.add(shaft);
  const tip = new Mesh(new CylinderGeometry(0.026, 0.03, 0.12, 6), m.steel); // hex tip
  tip.position.y = -1.11;
  g.add(tip);
  g.rotation.set(0.35, 0.4, -0.85);
  return g;
}

/** Consumables concept: K-wires, a fluted drill bit and screws. */
export function consumables(m: Materials) {
  const g = new Group();
  const wire = (x: number, len: number) => {
    const w = new Group();
    const body = new Mesh(new CylinderGeometry(0.016, 0.016, len, 16), m.steel); w.add(body);
    const tip = new Mesh(new ConeGeometry(0.016, 0.07, 3), m.steel); // trocar point
    tip.rotation.z = Math.PI; tip.position.y = -len / 2 - 0.035; w.add(tip);
    w.position.x = x; return w;
  };
  g.add(wire(-0.42, 2.2), wire(-0.3, 2.0), wire(-0.18, 2.2));
  const drill = new Group();
  const core = new Mesh(new CylinderGeometry(0.04, 0.04, 1.9, 24), m.steel); drill.add(core);
  for (const ph of [0, Math.PI]) drill.add(new Mesh(new TubeGeometry(new Helix(0.035, 1.1, 5, ph), 360, 0.022, 8), m.steel));
  drill.children.slice(1).forEach((c) => (c.position.y = -0.38));
  const dtip = new Mesh(new ConeGeometry(0.058, 0.1, 24), m.steel); dtip.rotation.z = Math.PI; dtip.position.y = -0.99; drill.add(dtip);
  drill.position.x = 0.02; g.add(drill);
  const s1 = screw(m, 0.8, 0.04); s1.position.set(0.3, 0.5, 0); g.add(s1);
  const s2 = screw(m, 0.6, 0.034); s2.position.set(0.48, 0.38, 0); g.add(s2);
  g.rotation.set(0.25, 0.3, -0.6);
  return g;
}

export const MODELS = { hip, plate, instrument, consumables } as const;
export type ModelName = keyof typeof MODELS;
