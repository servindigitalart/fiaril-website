// Shared runtime for every Kinetic Raster canvas: DPR sizing, visibility-gated loop,
// reduced-motion, and a unified pointer (mouse hover = continuous field, touch tap = decaying pulse).

export interface Pointer { x: number; y: number; strength: number; taps: number; }
export interface Frame { ctx: CanvasRenderingContext2D; w: number; h: number; t: number; dt: number; pointer: Pointer; }
export interface StageOptions { setup?: (w: number, h: number) => void; draw: (f: Frame) => void; }

export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function stage(canvas: HTMLCanvasElement, { setup, draw }: StageOptions) {
  const ctx = canvas.getContext('2d', { alpha: false })!;
  const pointer: Pointer = { x: -1e4, y: -1e4, strength: 0, taps: 0 };
  let hover = false, pulse = 0, w = 0, h = 0, raf = 0, last = 0, t = 0, visible = false;
  const still = reducedMotion();

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2); // ponytail: DPR capped at 2, fill-rate bound beyond that
    w = r.width; h = r.height;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    setup?.(w, h);
    if (still || !raf) frame(last); // static/offscreen canvases still get a correct picture
  };

  const frame = (now: number) => {
    const dt = Math.min((now - last) / 1000 || 0, 1 / 20); // clamp: tab switches must not explode physics
    last = now;
    if (!still) t += dt;
    const target = hover ? 1 : 0;
    pointer.strength += (target - pointer.strength) * Math.min(dt * 6, 1);
    if (pulse > 0) { pulse = Math.max(0, pulse - dt * 0.9); pointer.strength = Math.max(pointer.strength, pulse); }
    draw({ ctx, w, h, t: still ? 6 : t, dt: still ? 0 : dt, pointer });
    raf = visible && !still ? requestAnimationFrame(frame) : 0;
  };

  const start = () => { if (!raf && visible && !still && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };

  const local = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top; };
  canvas.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') { hover = true; local(e); } });
  canvas.addEventListener('pointerleave', () => { hover = false; });
  canvas.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') { local(e); pulse = 1; pointer.taps++; start(); } });

  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); }).observe(canvas);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
}

/** Seeded PRNG so every visitor sees the same composition. */
export function rng(seed = 7) {
  return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
}

// ponytail: Canvas 2D arcs are GPU-raster bound: F01/F02/F04 run 11-21 fps on a 2015 Retina Mac (docs/07).
// Swap for a WebGL2 point renderer with this signature, keeping this as fallback (DECISIONS D-012).
/** Batched dot fill: one path, one fill call per colour. */
export function dots(ctx: CanvasRenderingContext2D, xs: Float32Array, ys: Float32Array, rs: Float32Array, n: number, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const r = rs[i];
    if (r < 0.15) continue;
    ctx.moveTo(xs[i] + r, ys[i]);
    ctx.arc(xs[i], ys[i], r, 0, 6.2832);
  }
  ctx.fill();
}
