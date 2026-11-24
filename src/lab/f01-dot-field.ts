// F01 — Dot Field. Halftone grid whose dot size follows an orbiting radial well
// (Bauhaus-poster principle) and a cursor force field with spring recovery.
import { stage, dots } from './stage';

export default function (canvas: HTMLCanvasElement) {
  let n = 0, gap = 14;
  let hx: Float32Array, hy: Float32Array, ox: Float32Array, oy: Float32Array, vx: Float32Array, vy: Float32Array;
  let X: Float32Array, Y: Float32Array, R: Float32Array;

  stage(canvas, {
    setup(w, h) {
      gap = w < 640 ? 11 : 14;
      const cols = Math.ceil(w / gap) + 1, rows = Math.ceil(h / gap) + 1;
      n = cols * rows;
      [hx, hy, ox, oy, vx, vy, X, Y, R] = Array.from({ length: 9 }, () => new Float32Array(n));
      for (let i = 0; i < n; i++) { hx[i] = (i % cols) * gap; hy[i] = Math.floor(i / cols) * gap; }
    },
    draw({ ctx, w, h, t, dt, pointer }) {
      ctx.fillStyle = '#f7f7f7';
      ctx.fillRect(0, 0, w, h);
      // the well travels an ellipse, like a node on the isotype's orbits
      const cx = w * (0.5 + 0.3 * Math.cos(t * 0.13)), cy = h * (0.5 + 0.34 * Math.sin(t * 0.19));
      const reach = Math.hypot(w, h) * 0.6, rad = Math.max(90, w * 0.09), damp = Math.exp(-dt * 6);

      for (let i = 0; i < n; i++) {
        const px = hx[i] + ox[i], py = hy[i] + oy[i];
        const dx = px - pointer.x, dy = py - pointer.y, d = Math.hypot(dx, dy) + 1e-3;
        const f = pointer.strength * Math.exp(-(d * d) / (rad * rad));
        vx[i] = (vx[i] + ((dx / d) * f * 2400 - ox[i] * 70) * dt) * damp;
        vy[i] = (vy[i] + ((dy / d) * f * 2400 - oy[i] * 70) * dt) * damp;
        ox[i] += vx[i] * dt; oy[i] += vy[i] * dt;

        const r = Math.min(1, Math.hypot(hx[i] - cx, hy[i] - cy) / reach);
        const flow = 0.5 + 0.5 * Math.sin(hx[i] * 0.011 + hy[i] * 0.007 + t * 0.5);
        const s = Math.pow(r, 1.3) * 0.85 + flow * 0.15;
        X[i] = px; Y[i] = py;
        R[i] = gap * 0.5 * s * (1 + f * 0.5);
      }
      dots(ctx, X, Y, R, n, '#07253f');
    },
  });
}
