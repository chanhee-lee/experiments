"""
Aetherbeasts TCG — card frame asset.
Generates a low-poly 3D card with a beveled frame, gem slot, and element color.
Usable as a game prop or UI element in the Aetherbeasts web game.
"""
import bpy
import os

bpy.ops.wm.read_factory_settings(use_empty=True)

def add_material(name: str, color: tuple[float, float, float], metallic: float = 0.0, roughness: float = 0.5) -> bpy.types.Material:
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    return mat

# Card body — thin rectangular slab
bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 0))
card = bpy.context.active_object
card.name = "CardBody"
card.scale = (2.5, 3.5, 0.08)
bpy.ops.object.transform_apply(scale=True)
card.data.materials.append(add_material("CardBodyMat", (0.08, 0.08, 0.12), metallic=0.1, roughness=0.8))

# Bevel the card edges
bpy.ops.object.modifier_add(type="BEVEL")
card.modifiers["Bevel"].width = 0.08
card.modifiers["Bevel"].segments = 3
bpy.ops.object.modifier_apply(modifier="Bevel")

# Card frame border — slightly larger, very thin
bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 0.05))
frame = bpy.context.active_object
frame.name = "CardFrame"
frame.scale = (2.7, 3.7, 0.02)
bpy.ops.object.transform_apply(scale=True)
# Fire element — orange/gold frame
frame.data.materials.append(add_material("FrameMat", (0.9, 0.55, 0.1), metallic=0.8, roughness=0.2))

# Gem / element orb at top center
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.22, location=(0, 1.4, 0.15), segments=16, ring_count=8)
gem = bpy.context.active_object
gem.name = "ElementGem"
gem.data.materials.append(add_material("GemMat", (1.0, 0.35, 0.05), metallic=0.0, roughness=0.0))

# Power value plinth — small cube bottom right
bpy.ops.mesh.primitive_cube_add(size=0.5, location=(0.9, -1.5, 0.1))
plinth = bpy.context.active_object
plinth.name = "PowerPlinth"
plinth.scale = (1.0, 1.0, 0.3)
bpy.ops.object.transform_apply(scale=True)
plinth.data.materials.append(add_material("PlinthMat", (0.9, 0.55, 0.1), metallic=0.6, roughness=0.3))

output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "output", "aetherbeasts_card.glb")
bpy.ops.export_scene.gltf(filepath=output_path, export_format="GLB", use_selection=False)
print(f"[OK] Exported: {output_path}")
