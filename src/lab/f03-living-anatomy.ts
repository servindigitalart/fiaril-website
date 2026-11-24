// F03 — Living Anatomy. A procedurally sampled knee-joint ABSTRACTION (not a clinical model)
// rendered as a halftone point cloud. Narrative: dispersion on the isotype's orbits ->
// convergence -> precision (breathing). Shading follows halftone logic: darker = larger dot.
import { stage, dots, rng } from './stage';

type V3 = [number, number, number];
const rand = rng(23);

// --- lattice surface samplers: sample k of `count` -> [position, normal].
// Structured (not random) so dots line up in rows like a printed halftone screen.
const GOLDEN = Math.PI * (3 - Math.sqrt(5));
function ellipsoid(c: V3, r: V3) {
  return (k: number, count: number): [V3, V3] => {
    const u = 1 - (2 * (k + 0.5)) / count, s = Math.sqrt(1 - u * u), a = k * GOLDEN;
    const d: V3 = [s * Math.cos(a), u, s * Math.sin(a)];
    return [[c[0] + d[0] * r[0], c[1] + d[1] * r[1], c[2] + d[2] * r[2]], [d[0] / r[0], d[1] / r[1], d[2] / r[2]]];
  };
}
function tube(x: number, z: number, y0: number, y1: number, r0: number, r1: number, sx = 1) {
  return (k: number, count: number): [V3, V3] => {
    const per = Math.max(12, Math.round(Math.sqrt(count * 2.2 * Math.PI * ((r0 + r1) / 2) / Math.abs(y1 - y0))));
    const rings = Math.ceil(count / per), ring = Math.floor(k / per), q = ring / Math.max(1, rings - 1);
    const a = ((k % per) + (ring % 2) * 0.5) / per * Math.PI * 2, r = r0 + (r1 - r0) * q;
    return [[x + Math.cos(a) * r * sx, y0 + (y1 - y0) * q, z + Math.sin(a) * r], [Math.cos(a) / sx, 0, Math.sin(a)]];
  };
}

// relative sample weights ≈ surface area
const PARTS: [number, (k: number, count: number) => [V3, V3]][] = [
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
const ORBITS = [0.9, 0.6, 1.15].map((tilt, k) => ({ tilt, a: 1.75 - k * 0.15, b: 0.62 + k * 0.08, tz: 0.4 - k * 0.35 }));
function orbit(k: number, th: number): V3 {
  const o = ORBITS[k], x = Math.cos(th) * o.a, y = Math.sin(th) * o.b;
  const c = Math.cos(o.tilt), s = Math.sin(o.tilt);
  return [x * c - y * s, x * s + y * c, Math.sin(th) * o.tz];
}

export default function (canvas: HTMLCanvasElement) {
  const N = innerWidth < 640 ? 2600 : 5200;
  const P = new Float32Array(N * 3), Nn = new Float32Array(N * 3), orb = new Float32Array(N * 2), delay = new Float32Array(N), fade = new Float32Array(N);
  const total = PARTS.reduce((s, p) => s + p[0], 0);
  let i = 0;
  for (const [weight, sample] of PARTS) {
    const count = Math.round((weight / total) * N);
    for (let k = 0; k < count && i < N; k++, i++) {
      const [p, nr] = sample(k, count);
      const l = Math.hypot(...nr) || 1;
      P.set(p, i * 3); Nn.set([nr[0] / l, nr[1] / l, nr[2] / l], i * 3);
      orb[i * 2] = i % 3; orb[i * 2 + 1] = rand() * Math.PI * 2;
      delay[i] = 0.6 + rand() * 1.4 + (1.5 - p[1]) * 0.25; // assembles roughly top-down
      fade[i] = Math.min(1, (1.5 - Math.abs(p[1])) / 0.35); // shafts dissolve instead of ending in a hard cut
    }
  }
  const n = i;
  const X = new Float32Array(N), Y = new Float32Array(N), Rn = new Float32Array(N), Rr = new Float32Array(N);
  const ox = new Float32Array(N), oy = new Float32Array(N), vx = new Float32Array(N), vy = new Float32Array(N);
  const L = [-0.45, 0.55, 0.7], ll = Math.hypot(...L); L.forEach((v, i) => (L[i] = v / ll));
  const ease = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.pow(1 - x, 3));

  stage(canvas, {
    draw({ ctx, w, h, t, dt, pointer }) {
      ctx.fillStyle = '#f7f7f7';
      ctx.fillRect(0, 0, w, h);
      const yaw = -0.6 + Math.sin(t * 0.18) * 0.7, cy = Math.cos(yaw), sy = Math.sin(yaw);
      const scale = Math.min(w, h) * 0.3, cx0 = w * (w > 900 ? 0.62 : 0.5), cy0 = h * 0.5, cam = 4.5;
      const proj = (x: number, y: number, z: number) => {
        const rx = x * cy - z * sy, rz = x * sy + z * cy, f = cam / (cam - rz);
        return [cx0 + rx * scale * f, cy0 - y * scale * f, f, rz] as const;
      };

      // orbit lines + travelling nodes (layer: trajectories)
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(7,37,63,0.28)';
      ORBITS.forEach((_, k) => {
        ctx.beginPath();
        for (let s = 0; s <= 96; s++) {
          const [x, y] = proj(...orbit(k, (s / 96) * Math.PI * 2));
          s ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke();
      });
      ctx.fillStyle = '#72767f';
      ORBITS.forEach((_, k) => {
        const [x, y] = proj(...orbit(k, t * (0.35 + k * 0.12) + k * 2));
        ctx.beginPath(); ctx.arc(x, y, 5, 0, 6.2832); ctx.fill();
      });

      const rad = Math.max(80, scale * 0.45), damp = Math.exp(-dt * 6);
      for (let i = 0; i < n; i++) {
        const i3 = i * 3, k = orb[i * 2], th = orb[i * 2 + 1] + t * (0.3 + k * 0.08);
        const p = ease((t - delay[i]) / 2.2);
        const breathe = 0.012 * Math.sin(t * 1.4 + P[i3 + 1] * 5) * p;
        const [ax, ay, az] = orbit(k, th);
        const jitter = (1 - p) * 0.12 * Math.sin(i * 12.9898 + t);
        const x = ax + (P[i3] + Nn[i3] * breathe - ax) * p + jitter;
        const y = ay + (P[i3 + 1] + Nn[i3 + 1] * breathe - ay) * p;
        const z = az + (P[i3 + 2] + Nn[i3 + 2] * breathe - az) * p;
        const [sx, sy2, f] = proj(x, y, z);

        // cursor force field in screen space with spring recovery
        const dx = sx + ox[i] - pointer.x, dy = sy2 + oy[i] - pointer.y, d = Math.hypot(dx, dy) + 1e-3;
        const push = pointer.strength * Math.exp(-(d * d) / (rad * rad));
        vx[i] = (vx[i] + ((dx / d) * push * 1600 - ox[i] * 60) * dt) * damp;
        vy[i] = (vy[i] + ((dy / d) * push * 1600 - oy[i] * 60) * dt) * damp;
        ox[i] += vx[i] * dt; oy[i] += vy[i] * dt;

        // halftone shading from the rotated normal; settled = navy, in transit = red
        const nx = Nn[i3] * cy - Nn[i3 + 2] * sy, nz = Nn[i3] * sy + Nn[i3 + 2] * cy;
        const lambert = Math.max(0, nx * L[0] + Nn[i3 + 1] * L[1] + nz * L[2]);
        const facing = Math.max(0, nz); // fade back-facing samples so the silhouette reads
        const shade = (1 - lambert * 0.8) * (0.35 + 0.65 * facing);
        const r = (0.35 + 2.6 * (shade * p + 0.4 * (1 - p))) * f * (1 + push * 0.6) * (scale / 240) * (p < 1 ? 1 : fade[i]);
        X[i] = sx + ox[i]; Y[i] = sy2 + oy[i];
        Rn[i] = p >= 1 ? r : 0;
        Rr[i] = p < 1 ? r : 0;
      }
      dots(ctx, X, Y, Rn, n, '#07253f');
      dots(ctx, X, Y, Rr, n, '#b1282f');
    },
  });
}
