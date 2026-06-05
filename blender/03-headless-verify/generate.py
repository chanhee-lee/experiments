"""
E2E pipeline verification.
Generates a scene, exports GLB, then validates the file is non-empty and readable.
Produces an HTML viewer (Three.js CDN) you can open in a browser to confirm web-readiness.
"""
import bpy
import os
import struct

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "output")
GLB_PATH = os.path.join(OUTPUT_DIR, "verify_scene.glb")
HTML_PATH = os.path.join(OUTPUT_DIR, "viewer.html")

# --- Generate scene ---
bpy.ops.wm.read_factory_settings(use_empty=True)

def mat(name: str, color: tuple[float, float, float], metallic: float = 0.0) -> bpy.types.Material:
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = 0.4
    return m

# Ground plane
bpy.ops.mesh.primitive_plane_add(size=6, location=(0, 0, 0))
bpy.context.active_object.name = "Ground"
bpy.context.active_object.data.materials.append(mat("GroundMat", (0.15, 0.15, 0.2)))

# Three pillars
for i, (x, color) in enumerate([(-2, (0.8, 0.2, 0.2)), (0, (0.2, 0.7, 0.9)), (2, (0.3, 0.85, 0.3))]):
    bpy.ops.mesh.primitive_cylinder_add(radius=0.3, depth=2.0, location=(x, 0, 1.0))
    obj = bpy.context.active_object
    obj.name = f"Pillar_{i}"
    obj.data.materials.append(mat(f"PillarMat_{i}", color, metallic=0.3))

# Sphere on center pillar
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.45, location=(0, 0, 2.5), segments=24, ring_count=16)
bpy.context.active_object.name = "TopSphere"
bpy.context.active_object.data.materials.append(mat("SphereMat", (0.9, 0.7, 0.1), metallic=0.8))

# Export
bpy.ops.export_scene.gltf(filepath=GLB_PATH, export_format="GLB", use_selection=False)

# --- Validate GLB ---
with open(GLB_PATH, "rb") as f:
    magic = struct.unpack("<I", f.read(4))[0]
    assert magic == 0x46546C67, f"Invalid GLB magic: {hex(magic)}"
    version = struct.unpack("<I", f.read(4))[0]
    size = struct.unpack("<I", f.read(4))[0]

file_kb = os.path.getsize(GLB_PATH) / 1024
print(f"[OK] GLB valid — glTF v{version}, {file_kb:.1f} KB, reported size {size} bytes")

# --- Write HTML viewer ---
viewer_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Blender bpy — E2E Verify</title>
  <style>body {{ margin: 0; background: #0a0a0f; }} canvas {{ display: block; }}</style>
</head>
<body>
<script type="importmap">
  {{"imports": {{"three": "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js",
               "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/"}}}}
</script>
<script type="module">
  import * as THREE from 'three';
  import {{ GLTFLoader }} from 'three/addons/loaders/GLTFLoader.js';
  import {{ OrbitControls }} from 'three/addons/controls/OrbitControls.js';

  const renderer = new THREE.WebGLRenderer({{ antialias: true }});
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(devicePixelRatio);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a0f);
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const dir = new THREE.DirectionalLight(0xffffff, 1.2);
  dir.position.set(5, 8, 5);
  scene.add(dir);

  const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 100);
  camera.position.set(0, 4, 7);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  new GLTFLoader().load('verify_scene.glb', gltf => scene.add(gltf.scene));

  window.addEventListener('resize', () => {{
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  }});

  (function animate() {{
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }})();
</script>
</body>
</html>"""

with open(HTML_PATH, "w") as f:
    f.write(viewer_html)

print(f"[OK] Viewer written: {HTML_PATH}")
print("[DONE] Open output/viewer.html in a browser to confirm web-readiness.")
print("       Note: serve from a local server (e.g. python3 -m http.server 8080) — GLB fetch requires HTTP.")
