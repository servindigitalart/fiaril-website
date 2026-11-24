// F02 — Chromatic Offset. Three ink layers (navy / signal red / energy yellow) printed with
// multiply and mis-registered along rotating vectors. The cursor widens the separation locally.
import { stage, dots } from './stage';

const INKS = ['#f3b234', '#b1282f', '#07253f'];

export default function (canvas: HTMLCanvasElement) {
  let n = 0, gap = 18;
  let hx: Float32Array, hy: Float32Array, base: Float32Array, near: Float32Array, X: Float32Array, Y: Float32Array, R: Float32Array;

  stage(canvas, {
    setup(w, h) {
      gap = w < 640 ? 14 : 20;
      const cols = Math.ceil(w / gap) + 1, rows = Math.ceil(h / gap) + 1;
      n = cols * rows;
      [hx, hy, base, near, X, Y, R] = Array.from({ length: 7 }, () => new Float32Array(n));
      for (let i = 0; i < n; i++) { hx[i] = (i % cols) * gap; hy[i] = Math.floor(i / cols) * gap; }
    },
    draw({ ctx, w, h, t, pointer }) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#f7f7f7';
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'multiply';

      const diag = w + h, rad = Math.max(120, w * 0.12);
      for (let i = 0; i < n; i++) {
        // diagonal gradient modulated by a travelling interference band
        const g = (hx[i] + hy[i]) / diag;
        base[i] = 0.25 + 0.6 * g + 0.15 * Math.sin((hx[i] - hy[i]) * 0.012 - t * 0.9);
        const dx = hx[i] - pointer.x, dy = hy[i] - pointer.y;
        near[i] = pointer.strength * Math.exp(-(dx * dx + dy * dy) / (rad * rad));
      }
      INKS.forEach((ink, k) => {
        const a = t * 0.35 + (k * Math.PI * 2) / 3;
        const ca = Math.cos(a), sa = Math.sin(a);
        for (let i = 0; i < n; i++) {
          const m = k === 2 ? 0 : 1.2 + base[i] * 2.5 + near[i] * 9; // navy is the key plate: stays registered
          X[i] = hx[i] + ca * m; Y[i] = hy[i] + sa * m;
          R[i] = gap * 0.46 * Math.min(1, base[i] * (1 - k * 0.12) + near[i] * 0.25);
        }
        dots(ctx, X, Y, R, n, ink);
      });
      ctx.globalCompositeOperation = 'source-over';
    },
  });
}
