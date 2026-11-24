// F05 — Precision Field. The hybrid of F03 and F04 as ONE medium: the anatomy assembles from the
// isotype's orbits (F03) and F04's damped wave equation travels THROUGH it. Particles sample the
// field: they refract along its slope, swell on crests and turn signal-red while a wave passes.
// A faint lattice (technical-drawing vocabulary) makes the field itself visible.
// Wave sources: cursor wake, taps, and drops emitted by the orbit nodes (keeps touch screens alive).
import { stage, dots, rng, type StageControl } from './stage';
import { PARTS, ORBITS, orbit, easeOutCubic as ease } from './anatomy';

export interface Focus { cx: number; cy: number; size: number; }
export type Rect = [left: number, top: number, right: number, bottom: number];
export interface F05Options {
  /** Where the anatomy sits, in canvas px. The hero derives it from a CSS-positioned element. */
  focus?: (w: number, h: number) => Focus;
  /** Text boxes (canvas px) the lattice must clear, so copy never sits on the moving field. */
  holes?: () => Rect[];
}

const STEP = 1 / 60; // fixed solver step: propagation speed no longer depends on refresh rate
const FEATHER = 56;
const INK = '#07253f', SIGNAL = '#b1282f', LATTICE = '#b9bfc7', NODE = '#72767f';

export interface F05Control extends StageControl { /** Re-read the text boxes (fonts loaded, header changed, entrance ended). */ refresh(): void; }

export default function (canvas: HTMLCanvasElement, opts: F05Options = {}): F05Control {
  const rand = rng(29);
  const N = innerWidth < 640 ? 1900 : 3600;
  const P = new Float32Array(N * 3), Nn = new Float32Array(N * 3), orb = new Float32Array(N * 2);
  const delay = new Float32Array(N), fade = new Float32Array(N);
  const total = PARTS.reduce((s, p) => s + p[0], 0);
  let n = 0;
  for (const [weight, sample] of PARTS) {
    const count = Math.round((weight / total) * N);
    for (let k = 0; k < count && n < N; k++, n++) {
      const [p, nr] = sample(k, count);
      const l = Math.hypot(...nr) || 1;
      P.set(p, n * 3); Nn.set([nr[0] / l, nr[1] / l, nr[2] / l], n * 3);
      orb[n * 2] = n % 3; orb[n * 2 + 1] = rand() * Math.PI * 2;
      delay[n] = 0.4 + rand() * 1.2 + (1.5 - p[1]) * 0.22;
      fade[n] = Math.min(1, (1.5 - Math.abs(p[1])) / 0.35);
    }
  }
  const X = new Float32Array(N), Y = new Float32Array(N), Rn = new Float32Array(N), Rr = new Float32Array(N);
  const L = [-0.45, 0.55, 0.7], ll = Math.hypot(...L); L.forEach((v, i) => (L[i] = v / ll));

  // wave field (F04 solver) on a screen-space grid
  let cell = 12, cols = 0, rows = 0, h0 = new Float32Array(0), h1 = new Float32Array(0);
  let LX = new Float32Array(0), LY = new Float32Array(0), LR = new Float32Array(0), LC = new Float32Array(0), LM = new Float32Array(0), ln = 0;
  let focus: Focus = { cx: 0, cy: 0, size: 1 }, holes: Rect[] = [];
  // orbit constants, so the per-particle loop allocates nothing
  const OA = ORBITS.map((o) => o.a), OB = ORBITS.map((o) => o.b), OZ = ORBITS.map((o) => o.tz);
  const OC = ORBITS.map((o) => Math.cos(o.tilt)), OS = ORBITS.map((o) => Math.sin(o.tilt));
  let settled = 0; // time after which every particle has finished assembling
  for (let i = 0; i < N; i++) settled = Math.max(settled, delay[i] + 2.2);
  let acc = 0, nextDrop = 1.6, drops = 0, lastX = -1e4, lastY = -1e4, taps = 0;

  const inject = (x: number, y: number, amount: number) => {
    const c = Math.round(x / cell), r = Math.round(y / cell);
    for (let j = -2; j <= 2; j++) for (let i = -2; i <= 2; i++) {
      const cc = c + i, rr = r + j;
      if (cc < 1 || rr < 1 || cc >= cols - 1 || rr >= rows - 1) continue;
      h1[rr * cols + cc] += amount * Math.exp(-(i * i + j * j) / 2);
    }
  };
  const solve = () => {
    for (let r = 1; r < rows - 1; r++) for (let c = 1; c < cols - 1; c++) {
      const i = r * cols + c;
      const lap = h1[i - 1] + h1[i + 1] + h1[i - cols] + h1[i + cols] - 4 * h1[i];
      h0[i] = (2 * h1[i] - h0[i] + 0.25 * lap) * 0.986;
    }
    [h0, h1] = [h1, h0];
  };
  const at = (x: number, y: number) => {
    const c = Math.min(cols - 2, Math.max(1, Math.round(x / cell))), r = Math.min(rows - 2, Math.max(1, Math.round(y / cell)));
    return r * cols + c;
  };
  const clearance = (x: number, y: number) => {
    let m = 1;
    for (const [l, t, r, b] of holes) {
      const d = Math.hypot(Math.max(l - x, 0, x - r), Math.max(t - y, 0, y - b));
      if (d < FEATHER) m = Math.min(m, d / FEATHER);
    }
    return m;
  };

  // lattice clearance is static per layout: computed when the boxes change, not every frame
  const buildMask = () => {
    let li = 0;
    for (let r = 0; r < rows; r += 2) for (let c = 0; c < cols; c += 2, li++) LM[li] = clearance(c * cell, r * cell);
  };

  const control = stage(canvas, {
    setup(w, h) {
      cell = w < 640 ? 11 : 12;
      cols = Math.ceil(w / cell) + 1; rows = Math.ceil(h / cell) + 1;
      h0 = new Float32Array(cols * rows); h1 = new Float32Array(cols * rows);
      ln = Math.ceil(cols / 2) * Math.ceil(rows / 2);
      [LX, LY, LR, LC, LM] = Array.from({ length: 5 }, () => new Float32Array(ln));
      focus = opts.focus?.(w, h) ?? { cx: w * (w > 900 ? 0.62 : 0.5), cy: h * 0.5, size: Math.min(w / 3.4, h / 3.3) };
      holes = opts.holes?.() ?? [];
      buildMask();
    },
    draw({ ctx, w, h, t, dt, pointer }) {
      const yaw = -0.6 + Math.sin(t * 0.16) * 0.6, cy = Math.cos(yaw), sy = Math.sin(yaw);
      const scale = focus.size, cam = 4.5;
      const proj = (x: number, y: number, z: number) => {
        const rx = x * cy - z * sy, rz = x * sy + z * cy, f = cam / (cam - rz);
        return [focus.cx + rx * scale * f, focus.cy - y * scale * f, f] as const;
      };

      if (dt > 0) {
        const speed = Math.min(Math.hypot(pointer.x - lastX, pointer.y - lastY), 60);
        if (pointer.strength > 0.05 && pointer.taps === taps) inject(pointer.x, pointer.y, speed * 0.028 * pointer.strength);
        if (pointer.taps !== taps) { taps = pointer.taps; inject(pointer.x, pointer.y, 6); }
        if (t > nextDrop) { // the orbit nodes emit: waves are born where the isotype's nodes travel
          nextDrop = t + 1.3 + rand() * 1.4;
          const k = drops++ % 3, [x, y] = proj(...orbit(k, t * (0.35 + k * 0.12) + k * 2));
          inject(x, y, 3.6);
        }
        acc = Math.min(acc + dt, STEP * 4);
        while (acc >= STEP) { solve(); acc -= STEP; }
      }
      lastX = pointer.x; lastY = pointer.y;

      ctx.fillStyle = '#f7f7f7';
      ctx.fillRect(0, 0, w, h);

      // lattice: the field made visible, thinning out around text
      let li = 0;
      for (let r = 0; r < rows; r += 2) for (let c = 0; c < cols; c += 2, li++) {
        const i = r * cols + c, v = h1[i];
        const gx = c > 0 && c < cols - 1 ? h1[i + 1] - h1[i - 1] : 0;
        const gy = r > 0 && r < rows - 1 ? h1[i + cols] - h1[i - cols] : 0;
        const x = c * cell + gx * 3, y = r * cell + gy * 3, m = LM[li];
        LX[li] = x; LY[li] = y;
        const rad = (0.7 + Math.max(0, v) * 0.9) * m;
        LR[li] = v > 0.75 ? 0 : rad;
        LC[li] = v > 0.75 ? Math.min(2.6, rad) : 0;
      }
      dots(ctx, LX, LY, LR, li, LATTICE);
      dots(ctx, LX, LY, LC, li, SIGNAL);

      // orbit trajectories and their nodes
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(7,37,63,0.2)';
      ORBITS.forEach((_, k) => {
        ctx.beginPath();
        for (let s = 0; s <= 96; s++) {
          const [x, y] = proj(...orbit(k, (s / 96) * Math.PI * 2));
          s ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke();
      });
      ctx.fillStyle = NODE;
      ORBITS.forEach((_, k) => {
        const [x, y] = proj(...orbit(k, t * (0.35 + k * 0.12) + k * 2));
        ctx.beginPath(); ctx.arc(x, y, 4.5, 0, 6.2832); ctx.fill();
      });

      // anatomy: assembles from the orbits, then the field passes through it.
      // Hot loop: no allocations; the orbit path is only evaluated while a particle is in transit.
      const k3 = scale, all = t >= settled;
      for (let i = 0; i < n; i++) {
        const i3 = i * 3;
        const p = all ? 1 : ease((t - delay[i]) / 2.2);
        const breathe = 0.01 * Math.sin(t * 1.3 + P[i3 + 1] * 5) * p;
        let x = P[i3] + Nn[i3] * breathe, y = P[i3 + 1] + Nn[i3 + 1] * breathe, z = P[i3 + 2] + Nn[i3 + 2] * breathe;
        if (p < 1) {
          const k = orb[i * 2], th = orb[i * 2 + 1] + t * (0.3 + k * 0.08);
          const ct = Math.cos(th), st = Math.sin(th), ex = ct * OA[k], ey = st * OB[k];
          const ax = ex * OC[k] - ey * OS[k], ay = ex * OS[k] + ey * OC[k], az = st * OZ[k];
          x = ax + (x - ax) * p + (1 - p) * 0.12 * Math.sin(i * 12.9898 + t);
          y = ay + (y - ay) * p;
          z = az + (z - az) * p;
        }
        const rx = x * cy - z * sy, rz = x * sy + z * cy, f = cam / (cam - rz);
        const sx = focus.cx + rx * k3 * f, sy2 = focus.cy - y * k3 * f;

        const g = at(sx, sy2), v = h1[g];
        const gx = h1[g + 1] - h1[g - 1], gy = h1[g + cols] - h1[g - cols];

        const nx = Nn[i3] * cy - Nn[i3 + 2] * sy, nz = Nn[i3] * sy + Nn[i3 + 2] * cy;
        const lambert = Math.max(0, nx * L[0] + Nn[i3 + 1] * L[1] + nz * L[2]);
        const shade = (1 - lambert * 0.8) * (0.35 + 0.65 * Math.max(0, nz));
        const r = (0.35 + 2.6 * (shade * p + 0.4 * (1 - p))) * f * (k3 / 240) * (1 + Math.max(0, v) * 0.35) * (p < 1 ? 1 : fade[i]);
        X[i] = sx + gx * 5; Y[i] = sy2 + gy * 5; // refraction along the slope
        const signal = p < 1 || v > 0.9; // in transit, or a crest is passing through
        Rn[i] = signal ? 0 : r;
        Rr[i] = signal ? r : 0;
      }
      dots(ctx, X, Y, Rn, n, INK);
      dots(ctx, X, Y, Rr, n, SIGNAL);
    },
  });

  return { ...control, refresh() { if (opts.holes && rows) { holes = opts.holes(); buildMask(); } } };
}
