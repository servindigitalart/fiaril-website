// Shared studio for every 3D visual (offline renders and the live viewer), so both read the same:
// physically based materials lit by a neutral room environment, a key light and a cool rim.
import {
  ACESFilmicToneMapping, Box3, DirectionalLight, Mesh, MeshBasicMaterial, PerspectiveCamera, PMREMGenerator,
  Scene, SRGBColorSpace, Vector3, WebGLRenderer, type Material, type Object3D,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export interface Studio { renderer: WebGLRenderer; scene: Scene; camera: PerspectiveCamera; dispose(): void }

export function createStudio(canvas: HTMLCanvasElement, opts: { dpr: number; preserve?: boolean }): Studio {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: !!opts.preserve, powerPreference: 'high-performance' });
  renderer.setPixelRatio(opts.dpr);
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = SRGBColorSpace;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;
  pmrem.dispose();

  const key = new DirectionalLight(0xffffff, 2.4); key.position.set(2.5, 3.2, 3); scene.add(key);
  const rim = new DirectionalLight(0xcfe0f0, 1.6); rim.position.set(-3, 1.5, -2.5); scene.add(rim);

  const camera = new PerspectiveCamera(28, 1, 0.1, 60);
  camera.position.set(0, 0, 8);

  return {
    renderer, scene, camera,
    dispose() {
      env.dispose();
      scene.traverse((o) => { const m = o as Mesh; if (m.isMesh) { m.geometry.dispose(); [m.material].flat().forEach((x) => x.dispose()); } });
      renderer.dispose();
    },
  };
}

/** Frame an object: centre it and place the camera so its bounding sphere fills `fill` of the view. */
export function frame(camera: PerspectiveCamera, obj: Object3D, fill = 0.82) {
  const box = new Box3().setFromObject(obj), c = box.getCenter(new Vector3()), r = box.getSize(new Vector3()).length() / 2;
  obj.position.sub(c);
  const fov = (camera.fov * Math.PI) / 180, fovH = 2 * Math.atan(Math.tan(fov / 2) * camera.aspect);
  camera.position.set(0, 0, r / Math.sin(Math.min(fov, fovH) / 2) / fill);
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();
}

/** "Geometría" view: swap every material for a technical wireframe, and back. */
export function wireframe(obj: Object3D, on: boolean, color = 0xf7f7f7) {
  const wire = new MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.38, depthWrite: false });
  obj.traverse((o) => {
    const m = o as Mesh;
    if (!m.isMesh) return;
    if (on) { m.userData.solid ??= m.material; m.material = wire; }
    else if (m.userData.solid) m.material = m.userData.solid as Material;
  });
}
