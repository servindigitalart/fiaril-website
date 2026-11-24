// Live conceptual 3D viewer (docs/14 §7). Lazy-loaded by the home page when its section approaches.
// One rAF loop, only while visible and not paused; a single frame under reduced motion.
import { Group } from 'three';
import { createStudio, frame, wireframe } from './studio';
import { materials, MODELS, type ModelName } from './models';

export interface Viewer { animated: boolean; show(name: ModelName): void; setWire(on: boolean): void; setPaused(p: boolean): void }

export function mountViewer(canvas: HTMLCanvasElement, initial: ModelName): Viewer | null {
  let studio;
  try { studio = createStudio(canvas, { dpr: Math.min(devicePixelRatio || 1, innerWidth < 640 ? 1.5 : 2) }); }
  catch { return null; } // no WebGL: the static render underneath stays
  const { renderer, scene, camera } = studio;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mats = materials();
  const cache = new Map<ModelName, Group>();
  const pivot = new Group(); scene.add(pivot);
  let current: Group | null = null, wire = false, paused = false, visible = false, raf = 0, last = 0;
  let yaw = 0, tiltX = 0, tiltY = 0, targetX = 0, targetY = 0, drag = 0, dragFrom = 0;

  const render = () => renderer.render(scene, camera);
  const fit = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h || !current) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const r = pivot.rotation.clone(); pivot.rotation.set(0, 0, 0); // frame the model at rest
    frame(camera, current, w < 520 ? 1 : 1.12); // bounding sphere overestimates thin parts: fill a little past 1
    pivot.rotation.copy(r);
    render();
  };

  const loop = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.05); last = now;
    yaw += dt * 0.16; // very slow turntable
    tiltX += (targetX - tiltX) * Math.min(1, dt * 4); // damped cursor tilt
    tiltY += (targetY - tiltY) * Math.min(1, dt * 4);
    pivot.rotation.set(tiltY, yaw + tiltX + drag, 0);
    render();
    raf = requestAnimationFrame(loop);
  };
  const start = () => { if (!raf && visible && !paused && !still && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(loop); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };

  // fine pointer: tilt toward the cursor; touch: horizontal drag rotates, vertical scroll stays native
  canvas.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'mouse') {
      targetX = ((e.offsetX / canvas.clientWidth) - 0.5) * 0.7;
      targetY = ((e.offsetY / canvas.clientHeight) - 0.5) * 0.3;
    } else if (e.buttons) {
      drag += (e.clientX - dragFrom) * 0.01; dragFrom = e.clientX;
      if (still || paused) { pivot.rotation.y = yaw + drag; render(); }
    }
  });
  canvas.addEventListener('pointerdown', (e) => { dragFrom = e.clientX; });
  canvas.addEventListener('pointerleave', () => { targetX = 0; targetY = 0; });
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); stop(); canvas.closest('.viewer')?.classList.remove('is-live'); });

  new ResizeObserver(fit).observe(canvas);
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); }).observe(canvas);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  const viewer: Viewer = {
    animated: !still,
    show(name) {
      if (current) pivot.remove(current);
      let g = cache.get(name);
      if (!g) { g = MODELS[name](mats); cache.set(name, g); }
      current = g;
      wireframe(g, wire);
      pivot.add(g);
      fit();
    },
    setWire(on) { wire = on; if (current) wireframe(current, on); render(); },
    setPaused(p) { paused = p; p ? stop() : start(); },
  };
  viewer.show(initial);
  canvas.closest('.viewer')?.classList.add('is-live');
  return viewer;
}
