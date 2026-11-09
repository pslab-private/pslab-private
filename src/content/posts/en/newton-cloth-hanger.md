---
title: "Putting Clothes on a Hanger in Newton · VBD and Style3D"
description: "Comparing shirt folds on the same mesh in Newton VBD and Style3D, then validating hanger contact and grasp release with official women's T-shirt and sweatshirt assets."
pubDatetime: 2026-11-09T11:00:00+09:00
coverImage: "/media/newton-cloth-hanger/vbd-style3d-poster.png"
tags: ["물리 시뮬레이션", "Newton", "Style3D", "로보틱스"]
draft: false
---

Sleeves can move similarly when a hanger shakes, yet the hem may open differently after it stops. We measured this difference by hanging the same unisex shirt in Newton VBD and Style3D. Next, we inserted a hanger one shoulder at a time into a women's short-sleeved T-shirt with actual cutting-pattern data. Finally, we used the same hanger with a women's long-sleeved sweatshirt and observed its motion without holding the cloth.

## Hanging a T-shirt one shoulder at a time

<figure><video controls="" playsinline="" preload="metadata" width="1280" height="536" poster="/media/newton-cloth-hanger/female-tshirt-poster.png" src="/media/newton-cloth-hanger/female-tshirt-threading.mp4" aria-label="12.2-second video: holding the official women's T-shirt, inserting a hanger, and shaking it"></video><figcaption>The official <code>Female_T_Shirt.usd</code>. Left: exterior view; right: translucent view at the same instant. Orange and green dots mark the first and second grasps. The rounded hook outside the neckline and both tips rotating inside the shirt are visible together.</figcaption></figure>

Five position actuators in MuJoCo Warp drive the hanger's three translation and two rotation axes. Newton Style3D receives its actual joint positions to simulate the cloth. The first frame with both hands released is at 8.97 seconds. From there, shoulder contact alone supports the garment, and the sleeves and hem follow the hanger's side-to-side motion. In this configuration, cloth reaction forces on the hanger are not fed back to MuJoCo.

## How the hem and folds differ between VBD and Style3D

Both solvers received the same unisex shirt's initial 3,033 vertices and 5,938 triangles. We let the already-hung shirt settle for 3 seconds, shook the hanger laterally for 2 seconds, then stopped for 1 second. The drive was a 1 Hz sine wave with a maximum amplitude coefficient of 5 cm, multiplied by a smooth start-and-stop envelope. Neither simulation used grasp constraints during this 6-second experiment.

<figure><video controls="" playsinline="" preload="metadata" width="1280" height="524" poster="/media/newton-cloth-hanger/vbd-style3d-poster.png" src="/media/newton-cloth-hanger/vbd-style3d-comparison.mp4" aria-label="Synchronized VBD and Style3D comparison of the same unisex shirt"></video><figcaption>VBD on the left, Style3D on the right. Saved vertex trajectories were rendered with the same camera and matte material. Pause at 3 seconds to inspect the hem; after 5 seconds, compare cloth motion while the hanger is stationary.</figcaption></figure>

| Measurement on the same shirt                             | VBD              | Style3D          |
| --------------------------------------------------------- | ---------------- | ---------------- |
| Front-to-back gap at hem center, at 3 s                   | 5.76 cm          | 13.21 cm         |
| Vertical / horizontal fine-fold RMS on torso, at 3 s      | 0.093 / 0.560 mm | 0.116 / 0.553 mm |
| Peak broad horizontal-fold RMS on torso during shaking    | 13.20 mm         | 7.09 mm          |
| Maximum lateral cuff-center displacement during shaking   | 4.57 cm          | 4.45 cm          |
| Lateral range of hem center in final 0.5 s after stopping | 2.62 mm          | 1.03 mm          |

<figure><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 850 195" role="img" aria-label="Hem outlines at equal scale: VBD center depth 5.76 cm, Style3D 13.21 cm" width="850" height="195"><rect width="850" height="195" fill="#f0f6f6"></rect><path d="M210,40V166" fill="none" stroke="#81989d" stroke-dasharray="4 4"></path><polygon points="106.2,32.9 119.5,31.9 129.6,32.4 139.6,33.7 149.4,35.8 159.3,38.2 172.2,41.8 182.0,44.6 191.6,47.6 201.3,50.6 211.0,53.7 223.7,57.7 233.4,60.9 243.0,64.2 255.7,68.8 268.2,73.8 277.5,77.7 286.7,81.9 298.6,88.1 310.2,94.7 321.4,102.0 332.2,109.9 342.0,118.9 350.6,129.1 355.3,137.7 357.8,147.1 355.7,156.8 349.5,164.6 339.9,168.1 329.7,166.8 317.4,160.7 306.8,152.2 297.3,142.6 288.1,132.4 281.0,124.9 273.6,117.8 262.7,109.6 250.8,102.8 238.1,97.7 224.6,95.4 210.9,94.8 197.2,95.5 183.6,97.1 173.4,98.7 163.3,100.4 149.7,102.6 136.1,104.6 122.5,105.9 108.9,105.9 95.3,104.7 82.0,101.2 70.2,94.2 64.0,86.0 62.2,76.0 64.8,63.0 71.7,51.6 81.5,42.6 93.2,36.1" fill="none" stroke="#145f74" stroke-width="3"></polygon><text x="210" y="27" text-anchor="middle" font-size="17" fill="#145f74">VBD · 5.76 cm</text><path d="M635,40V166" fill="none" stroke="#81989d" stroke-dasharray="4 4"></path><polygon points="529.1,64.3 541.7,59.7 551.3,56.8 561.2,54.6 571.1,53.1 581.1,51.9 594.5,50.9 604.6,50.3 614.6,49.9 624.7,49.6 634.7,49.4 648.0,49.2 658.0,49.1 668.1,49.1 681.5,49.2 694.8,49.7 704.9,50.2 714.9,51.0 728.1,53.5 741.0,56.8 753.4,62.1 764.6,69.4 773.9,79.0 781.4,90.1 784.6,99.6 786.5,109.5 785.3,119.7 782.5,129.5 776.9,138.1 768.4,144.0 755.4,148.2 741.9,150.0 728.3,150.1 714.5,149.4 704.3,148.7 694.0,147.9 680.3,146.8 666.6,145.7 652.9,144.8 639.1,144.4 625.4,144.7 611.7,145.4 598.0,146.4 587.7,147.4 577.5,148.5 563.8,149.8 550.1,150.7 536.4,150.9 522.9,149.6 509.5,146.7 497.4,140.2 488.2,130.0 483.7,120.8 483.5,110.6 488.6,98.1 496.5,87.3 506.1,78.0 517.0,70.1" fill="none" stroke="#a14827" stroke-width="3"></polygon><text x="635" y="27" text-anchor="middle" font-size="17" fill="#a14827">Style3D · 13.21 cm</text><path d="M22,172h72" stroke="#37555c" stroke-width="3"></path><text x="26" y="190" font-size="14" fill="#37555c">10 cm</text></svg><figcaption>Top view of the open hem boundary. Only the centers are aligned; scale is identical. The front-to-back distance between the two boundary intersections with the central vertical line is the first table row.</figcaption></figure>

Sleeve displacement differed by 0.12 cm during shaking, but the stationary hem gap differed by 7.45 cm. With these VBD settings, the hem was flatter and broad torso folds were deeper during shaking. To measure fine folds, we tracked the same material points on the front and back panels, measured midpoint depth over a 4 cm span, and subtracted the gentle-curvature component over 12 cm. Broad folds were measured directly over 12 cm. These values were not fitted to footage of real garments, so this experiment alone cannot determine which is closer to reality.

### Shared conditions and solver-specific inputs

The comparison used Newton 1.7.0 and Warp 1.18.0. Both used Z-up coordinates, gravity 9.81 m/s², areal density 0.10 kg/m², particle radius 8 mm, and timestep 1/600 s. Hanger poses updated at 120 Hz, with rigid contact computed every substep. Rigid-shape friction input was 0.02; cloth–rigid contact inputs `(ke, kd, mu)` were `(10000, 0.01, 0.3)`, with an 8 mm search gap. Both used the same per-vertex quadratic velocity drag coefficient of 0.0005.

| Implementation          | Newton VBD                                                                                                                                                            | Newton Style3D                                                                                                                                                                                                                    |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Deformation solve       | Vertices within a color group update in parallel; groups update sequentially. 8 iterations per substep.                                                               | Projective Dynamics updates material-constraint targets and solves whole-cloth displacement using PCG. 4 outer iterations; inner linear iteration setting: 10.                                                                    |
| Membrane and bending    | Neo-Hookean membrane inputs `tri_ke=tri_ka=500`; adjacent-triangle bending `edge_ke=0.0625`. Rest dihedral angle: zero. Triangle and edge damping inputs: 0.001 each. | Weft, warp, and shear stiffness `(100,100,10)`; directional bending `(2e-5,1e-5,5e-6)`. With no real cutting coordinates for the unisex shirt, material axes came from projecting the vertical axis onto triangle tangent planes. |
| Contact and application | Self-contact enabled; search margin 6 mm, gap 3 mm. Can handle rigid and deformable bodies together; the hanger was externally driven in this comparison.             | Style3D internal cloth self-contact and Newton's rigid collision pipeline. Chosen for the official-garment insertion experiments because it preserves pattern-piece grain directions and areas.                                   |

The table compares the two configurations we ran. VBD's dihedral reference and Style3D's material coordinates differ, and their stiffness coefficients enter different energy expressions. The full hem-gap difference therefore cannot be attributed to the iteration algorithm alone. [Newton VBD documentation](https://newton-physics.github.io/newton/latest/solvers/vbd.html) · [Official Newton 1.7.0 Style3D example](https://github.com/newton-physics/newton/blob/v1.7.0/newton/examples/cloth/example_cloth_style3d.py)

The VBD comparison settings are listed above. See the [official Newton VBD documentation](https://newton-physics.github.io/newton/latest/solvers/vbd.html) for public API usage.

## Cutting patterns and fabric settings of the official garments

The official USD files contain both sewn 3D triangles and flat 2D cutting triangles. A single 3D vertex joined at a seam can correspond to separate corners on multiple pattern pieces. UV indices for all three corners of each triangle must therefore be read separately. In the official files, 3D lengths are in meters and `primvars:st` pattern coordinates are in millimeters. Multiply only pattern coordinates by 0.001. [Style3D USD format](https://github.com/newton-physics/newton-assets/tree/main/style3d)

The following is pseudocode illustrating how to read cutting coordinates through Newton's public API. `garment_prim` is the garment prim selected from an official garment USD opened with OpenUSD. Opening the file and selecting the prim are omitted input-preparation steps. The API and unit conversion follow the [official Newton 1.7.0 Style3D example](https://github.com/newton-physics/newton/blob/v1.7.0/newton/examples/cloth/example_cloth_style3d.py).

```python
import newton.usd

mesh, pattern_indices = newton.usd.get_mesh(
    garment_prim,
    load_uvs=True,
    preserve_facevarying_uvs=True,
    return_uv_indices=True,
)
pattern_vertices_m = mesh.uvs * 0.001
```

The short-sleeved shirt has 45,167 vertices and 89,912 triangles; the sweatshirt has 24,510 vertices and 48,824 triangles. Both use the original resolution. The function received areal density 0.30 kg/m² and particle radius 5 mm. The T-shirt's pattern area is 0.6154 m², giving about 185 g at that density. Particle radius is a collision length scale, treated separately from actual fabric thickness. Both women's garments used the same official T-shirt example's fabric values, so observed differences in the sweatshirt include sleeve length and cutting geometry. [Official Newton 1.7.0 fabric settings](https://github.com/newton-physics/newton/blob/v1.7.0/newton/examples/cloth/example_cloth_style3d.py)

The loaded 3D vertices and faces, pattern vertices in meters, and pattern indices are passed to the public `newton.solvers.style3d.add_cloth_mesh` API. The versioned example above shows the order for registering Style3D attributes on the builder and the complete call signature.

## Letting the neckline move when the grasp changes

<figure><img src="/media/newton-cloth-hanger/threading-stages.png" width="960" height="210" alt="Approach first shoulder, insert first tip, extend opposite sleeve, release both hands" loading="lazy" decoding="async"><figcaption>From left: lift one shoulder, insert the first tip, pull the opposite sleeve, release both hands. The hook's straight stem passes through the neckline while its rounded top stays outside.</figcaption></figure>

1. **Lift the first shoulder 16 cm.** Grasp a small shoulder region connected to the neckline. Only vertices held by the virtual hand are moved to prescribed positions each step; the rest respond to gravity and contact.
2. **Insert a hanger tip through the neckline.** Tilt the hanger 0.62 rad and push the first pad toward the held-side sleeve. Directly prescribing the hanger center makes its tip follow an arc during rotation. Subtracting the rotated offset from the target pad position keeps the inserted tip where intended during rotation.
3. **Grasp the opposite sleeve at its current position.** At about 3.23 seconds, we confirmed that only the first tip was inside. When the second hand closes, save the deformed vertex positions as a new reference, then pull the sleeve sideways. The first hand retains only a few outer points so the neckline can slide along the other tip.
4. **Level the hanger and release both hands.** Keep the hook above the neckline, pass the opposite tip through, and center the hanger. After releasing both grasps, alternate lateral hanger targets up to ±3 cm, then stop.

As a standard rigid coordinate transformation, this is expressed below. This explanatory pseudocode uses only NumPy. `rotation` is a 3×3 local-to-world rotation matrix, `local_tip` is the pad position in local coordinates, and `target_tip` is its desired world position. [NumPy matrix multiplication](https://numpy.org/doc/stable/reference/generated/numpy.matmul.html)

```python
import numpy as np

center = np.asarray(target_tip) - np.asarray(rotation) @ np.asarray(local_tip)
```

| Garment-specific setting                                | Unisex T-shirt            | Official women's T-shirt                               |
| ------------------------------------------------------- | ------------------------- | ------------------------------------------------------ |
| First-shoulder grasp vertices → retained outer vertices | 67 → 16                   | 55 → 17, initially spaced at least 14 mm apart         |
| Opposite-sleeve grasp center / vertex count             | (−.145, .060, 1.055) / 16 | (−.147, .058, 1.079) / 14, spaced at least 12 mm apart |
| First tip's neckline entry target                       | (.042, .032, 1.056)       | (.037, .033, 1.056)                                    |
| Deep target inside the held shoulder                    | (.142, .039, .915)        | (.135, .046, .934)                                     |
| Opposite-sleeve pull target                             | (−.249, .034, 1.100)      | (−.230, .037, 1.104)                                   |

Coordinates are (lateral X, depth Y, height Z) after garment orientation and position alignment, in meters. Initial placement translation and the 16 cm lift displacement are added to insertion and pulling targets to obtain world coordinates. The official T-shirt was first rotated 180° about Z to align its orientation. Other garments require locating the neckline boundary and both shoulders to redefine these coordinates. Fixing every vertex in the same region would capture hundreds of points on a high-resolution shirt, leaving no room for the neckline to bend.

## Shoulder-pad penetration and hook checks

The hanger collider combines a wire mesh and nine spherical pads on each side. Pad radius is 24 mm; the outermost pad center on each arm is 20.5 cm from the center. The women's-garment experiments retained fabric values and used cloth–rigid contact inputs `ke=500, kd=1e-5, mu=0.2`. Shape margins were 6 mm for the wire and 2 mm for pads. Each 1/600-second step follows drive, contact update, then cloth simulation.

<figure><img src="/media/newton-cloth-hanger/shoulder-contact.png" alt="Left shoulder's yellow pad before and after contact-stiffness adjustment while shaking the same unisex shirt" loading="lazy" decoding="async"><figcaption>A separate unisex-shirt experiment changing only contact stiffness from 10 to 100. With the same update interval, the minimum pad-surface–cloth-triangle gap changed from −12.36 mm to +0.71 mm. Peak horizontal fine-fold RMS on the torso during shaking changed 0.554 → 0.555 mm; the hem's lateral range in the final 0.5 seconds changed 0.70 → 0.91 cm. Removing penetration does not make the overall motion identical.</figcaption></figure>

Each substep updates state in this order:

1. Compute rigid actuation and obtain the actual hanger pose.
2. Feed that pose into cloth contact computation and apply active grasp targets.
3. Find collision candidates at the current state, then compute the next cloth state.
4. Swap current and next state roles for the following computation.

It matters that the cloth receives the actual pose computed by the rigid solver, rather than the target command. Virtual grasps prescribe active-group vertex positions. Evaluating finger friction, required grip force, or robot joint torque requires modeling a real gripper and transferring reaction forces.

### What measurements establish that the garment is hanging?

We separately checked wire–cloth triangle intersections, the shortest pad-center–cloth-triangle distance minus pad radius, and inside/outside classification with temporary caps over the neckline, both sleeves, and hem. These caps are only measurement tools. We tested whether the rounded hook's 526 triangles crossed the caps and recorded the winding number at a hook reference point. Outside, the winding number should be near zero. End pads should be inside the garment and the hook outside.

| Women's T-shirt insertion assessment                                | Recorded result                                                 |
| ------------------------------------------------------------------- | --------------------------------------------------------------- |
| Both hanger tips, 0 s → 3.23 s                                      | Both outside → only the first inserted tip inside               |
| Wire–cloth / rounded-hook–opening intersections over 7,320 substeps | 0 / 0; maximum \|hook winding number\| below 1.08×10⁻⁶          |
| Minimum pad-surface–cloth-midsurface gap                            | +6.55 mm                                                        |
| All four representative left/right pad centers inside after release | 98 / 98 frames; final garment lowest point 10.73 cm above table |

The minimum gap is a geometric measurement that includes collision clearance. It cannot determine each pad's normal load. Intersection checks were performed at substep endpoints, so they do not prove continuous collision freedom between those instants.

## Shaking the official women's sweatshirt

<figure><video controls="" playsinline="" preload="metadata" class="portrait" width="640" height="480" poster="/media/newton-cloth-hanger/sweatshirt-poster.png" src="/media/newton-cloth-hanger/sweatshirt-shake.mp4" aria-label="Official Style3D women's sweatshirt: settling, lateral shaking, and decay"></video><figcaption>A 6-second experiment with <code>Women_Sweatshirt.usd</code>: gravity settling at 0–3 s, lateral drive at 3–5 s, and decay after stopping at 5–6 s. The long free-hanging sleeves and folds above the ribbed hem are visible. <a href="https://github.com/newton-physics/newton-assets/blob/main/style3d/garments/Women_Sweatshirt.usd">Official sweatshirt asset</a></figcaption></figure>

This experiment began with both shoulders already on the hanger. The support was the same hanger as for the T-shirt, with no grasp vertices throughout. We kept the sweatshirt's original length, mapped USD coordinates to world axes as (x, −z, y), and translated it by (0, 0.043, −0.373) m. An initial placement had 7.47 mm pad penetration into the cloth and was adjusted. The selected placement had an initial minimum gap of +6.29 mm.

With a 3 cm amplitude coefficient at 1 Hz, the hanger actually moved about 2.60 cm to each side. Relative to the post-settling pose, the center of the +X cuff vertex group moved up to 3.31 cm; its lateral range over the final 0.5 seconds was 1.45 mm. Across the initial state and 3,600 substeps, the minimum pad gap was **+6.28 mm**, with zero wire–cloth and rounded-hook–opening intersections. All four representative pad centers were inside in every one of 181 saved frames. For the long-sleeved garment, the validated interval covers settling and shaking after placement.

## Starting from public examples

The experiments used Python 3.12 on a CUDA device, Newton 1.7.0, Warp 1.18.0, and MuJoCo and MuJoCo Warp 3.15.0. Public-library configuration and original garments are documented here:

- [Official Newton 1.7.0 Style3D example](https://github.com/newton-physics/newton/blob/v1.7.0/newton/examples/cloth/example_cloth_style3d.py): reading garment 3D meshes and cutting coordinates, and configuring cloth models and contact.
- [Official garments and USD format](https://github.com/newton-physics/newton-assets/tree/main/style3d): women's T-shirt and sweatshirt assets and cutting-data documentation.
- [Newton VBD documentation](https://newton-physics.github.io/newton/latest/solvers/vbd.html): solver scope and public APIs.

First inspect garment loading and fabric settings in the official example, then separately construct the hanger geometry, actuation, grasp targets, and validation procedure using the conditions above. This article describes saved experimental results and settings; it does not provide the videos' complete execution code or local modules.

<footer>Garment assets used in the videos © 2025 Style3D. <a href="https://github.com/newton-physics/newton-assets/tree/main/style3d/garments">Official garment list</a> · <a href="https://github.com/newton-physics/newton-assets/blob/main/style3d/LICENSE">Style3D BSD 3-Clause license</a></footer>
