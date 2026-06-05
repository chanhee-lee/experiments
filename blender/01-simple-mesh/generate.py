import bpy
import os

bpy.ops.wm.read_factory_settings(use_empty=True)

def add_material(name: str, color: tuple[float, float, float]) -> bpy.types.Material:
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    return mat

bpy.ops.mesh.primitive_uv_sphere_add(radius=1.0, location=(-3.5, 0, 0), segments=32, ring_count=16)
sphere = bpy.context.active_object
sphere.name = "Sphere"
sphere.data.materials.append(add_material("SphereMat", (0.8, 0.2, 0.2)))

bpy.ops.mesh.primitive_cube_add(size=1.8, location=(0, 0, 0))
cube = bpy.context.active_object
cube.name = "Cube"
cube.data.materials.append(add_material("CubeMat", (0.2, 0.6, 0.9)))

bpy.ops.mesh.primitive_torus_add(
    major_radius=1.0, minor_radius=0.3,
    major_segments=48, minor_segments=16,
    location=(3.5, 0, 0)
)
torus = bpy.context.active_object
torus.name = "Torus"
torus.data.materials.append(add_material("TorusMat", (0.2, 0.85, 0.4)))

output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "output", "simple_meshes.glb")
bpy.ops.export_scene.gltf(filepath=output_path, export_format="GLB", use_selection=False)
print(f"[OK] Exported: {output_path}")
