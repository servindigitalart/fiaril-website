// Live conceptual 3D viewer (docs/14 §7, V2.1 D-049). Lazy-loaded when its section approaches.
// Choreography: the camera stays still; the object travels a slow lemniscate (Gerono figure-eight)
// with a little depth, and its orientation follows the path tangent — a product being presented,
// not a spinning toy. Cursor tilt and touch drag are added on top with damping.
// D-049 (resolved, D-055): a discreet pause control drives setPaused(). Internally: one rAF loop only while
// visible, shown and not paused; reduced motion = a static pose. Paused or still, manual drag still renders.
import { Box3, Group, Vector3 } from 'three';
import { createStudio, frame, wireframe } from './studio';
import { materials, MODELS, type ModelName } from './models';

export interface Viewer { animated: boolean; show(name: ModelName): void; setWire(on: boolean): void; setPaused(p: boolean): void }

const PERIOD = 20; // seconds per figure-eight

export function mountViewer(canvas: HTMLCanvasElement, initial: ModelName): Viewer | null {
  let studio;
  try { studio = createStudio(canvas, { dpr: Math.min(devicePixelRatio || 1, innerWidth < 640 ? 1.5 : 2) }); }
  catch { return null; } // no WebGL: the static render underneath stays
  const { renderer, scene, camera } = studio;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mats = materials();
  const cache = new Map<ModelName, Group>();
  const orbit = new Group(); // travels the lemniscate
  const pivot = new Group(); // orientation (path tangent + cursor + drag)
  orbit.add(pivot); scene.add(orbit);
  const size = new Vector3();
  let current: Group | null = null, wire = false, paused = false, visible = false, raf = 0, last = 0, t = 0, amp = 0.1;
  let tiltX = 0, tiltY = 0, targetX = 0, targetY = 0, drag = 0, dragV = 0, dragFrom = 0, dragging = false;

  const pose = () => {
    const s = (t / PERIOD) * Math.PI * 2, sin = Math.sin(s), cos = Math.cos(s);
    orbit.position.set(amp * sin, amp * 0.5 * Math.sin(2 * s), amp * 0.35 * cos); // Gerono lemniscate + depth
    // orientation follows the tangent (dx = cos, dy = cos 2s), kept small and smooth
    pivot.rotation.set(0.1 * Math.cos(2 * s) + tiltY, -0.35 + 0.32 * cos + tiltX + drag, -0.06 * Math.cos(2 * s));
  };
  const render = () => renderer.render(scene, camera);
  const fit = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h || !current) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    orbit.position.set(0, 0, 0); pivot.rotation.set(0, 0, 0);
    frame(camera, current, w < 520 ? 0.8 : 0.84); // room for the orbit's travel: the piece never leaves the frame
    amp = current.userData.amp as number;
    pose(); render();
  };

  const loop = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.05); last = now;
    t += dt;
    const k = Math.min(1, dt * 3.5); // damped cursor response
    tiltX += (targetX - tiltX) * k; tiltY += (targetY - tiltY) * k;
    if (!dragging) { drag += dragV * dt; dragV *= Math.exp(-dt * 3); } // drag inertia settles
    pose(); render();
    raf = requestAnimationFrame(loop);
  };
  const start = () => { if (!raf && visible && !still && !paused && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(loop); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };

  canvas.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'mouse') {
      targetX = (e.offsetX / canvas.clientWidth - 0.5) * 0.6;
      targetY = (e.offsetY / canvas.clientHeight - 0.5) * 0.26;
    } else if (dragging) {
      const dx = (e.clientX - dragFrom) * 0.012; dragFrom = e.clientX;
      drag += dx; dragV = dx * 30;
      if (still || paused) { pose(); render(); }
    }
  });
  // touch-action: pan-y keeps vertical scrolling native; only horizontal drags reach us
  canvas.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') { dragging = true; dragFrom = e.clientX; } });
  const end = () => { dragging = false; };
  canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', end);
  canvas.addEventListener('pointerleave', () => { targetX = 0; targetY = 0; end(); });
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); stop(); canvas.closest('.viewer')?.classList.remove('is-live'); });

  new ResizeObserver(fit).observe(canvas);
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); }).observe(canvas);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  const viewer: Viewer = {
    animated: !still,
    show(name) {
      if (current) pivot.remove(current);
      let g = cache.get(name);
      if (!g) {
        g = MODELS[name](mats); cache.set(name, g);
        // orbit amplitude scales with the model: 8 % of its size, so every piece travels the same way
        g.userData.amp = 0.08 * new Box3().setFromObject(g).getSize(size).length();
      }
      wireframe(g, wire);
      current = g;
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
