// F03 — Living Anatomy. A procedurally sampled knee-joint ABSTRACTION (not a clinical model)
// rendered as a halftone point cloud. Narrative: dispersion on the isotype's orbits ->
// convergence -> precision (breathing). Shading follows halftone logic: darker = larger dot.
import { stage, dots, rng } from './stage';
import { PARTS, ORBITS, orbit, easeOutCubic as ease } from './anatomy';

const rand = rng(23);

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
