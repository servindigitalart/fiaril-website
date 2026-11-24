// Surgical lamp field (Acompañamiento técnico, D-048). A halftone screen covering the WHOLE section:
// no masks, no holes. Light comes from an ambient lamp drifting on a slow Lissajous path plus the
// cursor (or a tap). Dots also yield to the cursor and spring back. Legibility comes from lower dot
// opacity near the copy (never zero) and a soft gradient behind it, not from removing particles.
// Runs on the shared stage(): DPR cap, paused off-screen / hidden tab, static frame under reduced motion.
import { stage, type StageControl } from '../lab/stage';

export type Box = [left: number, top: number, right: number, bottom: number];
const LEVELS = 6; // alpha buckets: one path + one fill per bucket
const ALPHA = [0.1, 0.2, 0.34, 0.5, 0.7, 0.92];

export default function surgicalField(canvas: HTMLCanvasElement, copy: () => Box[]): StageControl & { refresh(): void } {
  let cols = 0, rows = 0, n = 0, gap = 15;
  let hx = new Float32Array(0), hy = new Float32Array(0), ox = new Float32Array(0), oy = new Float32Array(0);
  let vx = new Float32Array(0), vy = new Float32Array(0), shade = new Float32Array(0);
  let lx = 0, ly = 0; // cursor light, eased
  const paths: Path2D[] = [];

  // near the copy, dots dim (to 55 %) with a long soft falloff: present everywhere, quieter where text is
  const buildShade = () => {
    const boxes = copy();
    for (let i = 0; i < n; i++) {
      let m = 1;
      for (const [l, t, r, b] of boxes) {
        const d = Math.hypot(Math.max(l - hx[i], 0, hx[i] - r), Math.max(t - hy[i], 0, hy[i] - b));
        m = Math.min(m, 0.55 + 0.45 * Math.min(1, d / 160));
      }
      shade[i] = m;
    }
  };

  const control = stage(canvas, {
    setup(w, h) {
      gap = w < 640 ? 13 : 15;
      cols = Math.ceil(w / gap) + 1; rows = Math.ceil(h / gap) + 1; n = cols * rows;
      [hx, hy, ox, oy, vx, vy, shade] = Array.from({ length: 7 }, () => new Float32Array(n));
      for (let i = 0; i < n; i++) { hx[i] = (i % cols) * gap + ((Math.floor(i / cols) % 2) * gap) / 2; hy[i] = Math.floor(i / cols) * gap; }
      buildShade();
      lx = w * 0.65; ly = h * 0.4;
    },
    draw({ ctx, w, h, t, dt, pointer }) {
      ctx.fillStyle = '#07253f';
      ctx.fillRect(0, 0, w, h);
      // ambient lamp: slow Lissajous drift across the field
      const ax = w * (0.6 + 0.26 * Math.sin(t * 0.09)), ay = h * (0.45 + 0.28 * Math.sin(t * 0.13 + 1));
      const R1 = Math.max(w, h) * 0.32, R2 = Math.max(160, Math.min(w, h) * 0.3);
      if (pointer.strength > 0.01) { lx += (pointer.x - lx) * Math.min(1, dt * 5); ly += (pointer.y - ly) * Math.min(1, dt * 5); }
      const damp = Math.exp(-dt * 5), push = pointer.strength;
      for (let k = 0; k < LEVELS; k++) paths[k] = new Path2D();
      for (let i = 0; i < n; i++) {
        // cursor: gentle repulsion with spring recovery (dots move near the text too)
        const px = hx[i] + ox[i], py = hy[i] + oy[i];
        const dx = px - pointer.x, dy = py - pointer.y, d2 = dx * dx + dy * dy, dd = Math.sqrt(d2) + 1e-3;
        // a swell, not a hole: weak force and displacement clamped below the dot pitch
        const f = push * Math.exp(-d2 / (R2 * R2 * 0.35));
        vx[i] = (vx[i] + ((dx / dd) * f * 320 - ox[i] * 46) * dt) * damp;
        vy[i] = (vy[i] + ((dy / dd) * f * 320 - oy[i] * 46) * dt) * damp;
        const lim = gap * 0.6;
        ox[i] = Math.max(-lim, Math.min(lim, ox[i] + vx[i] * dt)); oy[i] = Math.max(-lim, Math.min(lim, oy[i] + vy[i] * dt));
        // light: ambient lamp + cursor light
        const a1 = (px - ax) ** 2 + (py - ay) ** 2, a2 = (px - lx) ** 2 + (py - ly) ** 2;
        // copy dims the ambient light fully but the cursor light only partly: the field answers near the text too
        const amb = 0.24 + 0.76 * Math.exp(-a1 / (R1 * R1)), cur = push * 0.8 * Math.exp(-a2 / (R2 * R2));
        const I = Math.min(1, amb + cur);
        const v = Math.min(1, amb * shade[i] + cur * (0.6 + 0.4 * shade[i]));
        const r = 0.55 + 1.55 * I;
        const k = Math.min(LEVELS - 1, Math.floor(v * LEVELS));
        paths[k].moveTo(px + r, py);
        paths[k].arc(px, py, r, 0, 6.2832);
      }
      for (let k = 0; k < LEVELS; k++) { ctx.fillStyle = `rgba(247,247,247,${ALPHA[k]})`; ctx.fill(paths[k]); }
    },
  });

  return { ...control, refresh() { if (n) buildShade(); } };
}
