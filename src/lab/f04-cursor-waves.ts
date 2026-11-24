// F04 — Cursor Waves. A damped 2D wave equation on the dot grid: the cursor's wake (or a tap)
// injects energy, the disturbance propagates outward and the field settles back to rest.
// Crests above a threshold are re-inked in signal red (red = activity).
import { stage, dots, rng } from './stage';

export default function (canvas: HTMLCanvasElement) {
  let cols = 0, rows = 0, n = 0, gap = 12;
  let h0: Float32Array, h1: Float32Array, X: Float32Array, Y: Float32Array, R: Float32Array, RC: Float32Array;
  let lastX = 0, lastY = 0, taps = 0, nextDrop = 1.5;
  const rand = rng(11);

  const inject = (x: number, y: number, amount: number) => {
    const c = Math.round(x / gap), r = Math.round(y / gap);
    for (let j = -2; j <= 2; j++) for (let i = -2; i <= 2; i++) {
      const cc = c + i, rr = r + j;
      if (cc < 1 || rr < 1 || cc >= cols - 1 || rr >= rows - 1) continue;
      h1[rr * cols + cc] += amount * Math.exp(-(i * i + j * j) / 2);
    }
  };

  stage(canvas, {
    setup(w, h) {
      gap = w < 640 ? 10 : 12;
      cols = Math.ceil(w / gap) + 1; rows = Math.ceil(h / gap) + 1; n = cols * rows;
      [h0, h1, X, Y, R, RC] = Array.from({ length: 6 }, () => new Float32Array(n));
    },
    draw({ ctx, w, h, t, dt, pointer }) {
      // sources: mouse wake ∝ speed, tap = strong drop, ambient drops along an orbit keep touch screens alive
      if (dt > 0) {
        const speed = Math.min(Math.hypot(pointer.x - lastX, pointer.y - lastY), 60);
        if (pointer.strength > 0.05 && pointer.taps === taps) inject(pointer.x, pointer.y, speed * 0.03 * pointer.strength);
        if (pointer.taps !== taps) { taps = pointer.taps; inject(pointer.x, pointer.y, 6); }
        if (t > nextDrop) {
          nextDrop = t + 1.2 + rand() * 1.6;
          const a = t * 0.4;
          inject(w * (0.5 + 0.35 * Math.cos(a)), h * (0.5 + 0.3 * Math.sin(a * 1.3)), 4);
        }
        // ponytail: one solver step per frame, so propagation speed scales with refresh rate; fixed-step accumulator if 120Hz screens look off
        for (let r = 1; r < rows - 1; r++) for (let c = 1; c < cols - 1; c++) {
          const i = r * cols + c;
          const lap = h1[i - 1] + h1[i + 1] + h1[i - cols] + h1[i + cols] - 4 * h1[i];
          h0[i] = (2 * h1[i] - h0[i] + 0.25 * lap) * 0.985;
        }
        [h0, h1] = [h1, h0];
      }
      lastX = pointer.x; lastY = pointer.y;

      ctx.fillStyle = '#f7f7f7';
      ctx.fillRect(0, 0, w, h);
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const i = r * cols + c, v = h1[i];
        const gx = c > 0 && c < cols - 1 ? h1[i + 1] - h1[i - 1] : 0;
        const gy = r > 0 && r < rows - 1 ? h1[i + cols] - h1[i - cols] : 0;
        X[i] = c * gap + gx * 3; Y[i] = r * gap + gy * 3; // refraction-like shift along the slope
        const s = Math.max(0.12, Math.min(1, 0.32 + v * 0.45));
        R[i] = gap * 0.45 * s;
        RC[i] = v > 0.7 ? gap * 0.45 * Math.min(1, v * 0.5) : 0;
      }
      dots(ctx, X, Y, R, n, '#07253f');
      dots(ctx, X, Y, RC, n, '#b1282f');
    },
  });
}
