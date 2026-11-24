// Shared geometry for the Raster Anatomy family (F03, F05): a procedurally sampled knee-joint
// ABSTRACTION (not a clinical model) and the three tilted orbits of the FIARIL isotype.

export type V3 = [number, number, number];
export type Sampler = (k: number, count: number) => [V3, V3];

// --- lattice surface samplers: sample k of `count` -> [position, normal].
// Structured (not random) so dots line up in rows like a printed halftone screen.
const GOLDEN = Math.PI * (3 - Math.sqrt(5));
function ellipsoid(c: V3, r: V3): Sampler {
  return (k, count) => {
    const u = 1 - (2 * (k + 0.5)) / count, s = Math.sqrt(1 - u * u), a = k * GOLDEN;
    const d: V3 = [s * Math.cos(a), u, s * Math.sin(a)];
    return [[c[0] + d[0] * r[0], c[1] + d[1] * r[1], c[2] + d[2] * r[2]], [d[0] / r[0], d[1] / r[1], d[2] / r[2]]];
  };
}
function tube(x: number, z: number, y0: number, y1: number, r0: number, r1: number, sx = 1): Sampler {
  return (k, count) => {
    const per = Math.max(12, Math.round(Math.sqrt(count * 2.2 * Math.PI * ((r0 + r1) / 2) / Math.abs(y1 - y0))));
    const rings = Math.ceil(count / per), ring = Math.floor(k / per), q = ring / Math.max(1, rings - 1);
    const a = ((k % per) + (ring % 2) * 0.5) / per * Math.PI * 2, r = r0 + (r1 - r0) * q;
    return [[x + Math.cos(a) * r * sx, y0 + (y1 - y0) * q, z + Math.sin(a) * r], [Math.cos(a) / sx, 0, Math.sin(a)]];
  };
}

// relative sample weights ≈ surface area
export const PARTS: [number, Sampler][] = [
  [0.2, tube(0, 0, 0.45, 1.5, 0.16, 0.15)], // femoral shaft
  [0.12, tube(0, 0, 0.18, 0.45, 0.33, 0.16, 1.15)], // distal femur flare
  [0.13, ellipsoid([-0.17, 0.14, 0.02], [0.17, 0.15, 0.24])], // medial condyle
  [0.13, ellipsoid([0.17, 0.14, 0.02], [0.16, 0.14, 0.22])], // lateral condyle
  [0.05, ellipsoid([0, 0.26, 0.27], [0.11, 0.13, 0.05])], // patella
  [0.1, tube(0, 0, -0.05, -0.38, 0.34, 0.16, 1.2)], // tibial plateau + flare
  [0.19, tube(0, 0, -0.38, -1.5, 0.15, 0.13)], // tibial shaft
  [0.08, tube(0.27, -0.1, -0.15, -1.5, 0.05, 0.04)], // fibula
];

// the three tilted orbits of the FIARIL isotype, as 3D ellipses
export const ORBITS = [0.9, 0.6, 1.15].map((tilt, k) => ({ tilt, a: 1.75 - k * 0.15, b: 0.62 + k * 0.08, tz: 0.4 - k * 0.35 }));
export function orbit(k: number, th: number): V3 {
  const o = ORBITS[k], x = Math.cos(th) * o.a, y = Math.sin(th) * o.b;
  const c = Math.cos(o.tilt), s = Math.sin(o.tilt);
  return [x * c - y * s, x * s + y * c, Math.sin(th) * o.tz];
}

export const easeOutCubic = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.pow(1 - x, 3));
