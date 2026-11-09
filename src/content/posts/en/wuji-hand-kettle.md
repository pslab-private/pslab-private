---
title: "Grasping a Kettle Handle with Wuji Hand 2.1 · Design and Validation"
description: "A simulation experiment measuring contact forces, tilt, and return error as four fingers of Wuji Hand 2.1 wrap around a 500 g kettle's handle and lift it."
pubDatetime: 2026-11-09T16:28:00+09:00
coverImage: "/media/wuji-hand-kettle/pour.png"
tags: ["물리 시뮬레이션", "Newton", "로보틱스", "Wuji Hand"]
draft: false
---

We wrapped four fingers around the handle of a 500 g kettle whose center of mass lies outside the handle. The goal was to lift it 12 cm, tilt it 60°, and return it in midair to its pose just before pouring. In the two runs, the kettle rose 120.56 mm and 120.25 mm, respectively, and rotated about 58.7°. Force equilibrium after stopping varied between runs.

## Lift → tilt → return in midair

The videos replay recorded hand and kettle poses and contact forces at 2× speed. Each lasts about 13.6 seconds from the start of the lift. Orange dots mark load-bearing contact points. The two views show whether the pink little finger slips below the handle and whether the kettle rotates relative to the hand during tilting and return.

<figure><video controls="" playsinline="" preload="metadata" width="1280" height="720" poster="/media/wuji-hand-kettle/lift.png" aria-label="Lifting, tilting, and returning a 500 g kettle in IsaacLab" src="/media/wuji-hand-kettle/isaaclab.mp4"></video><figcaption>A run using Newton and MuJoCo Warp in IsaacLab. Kettle height is relative to the pose just before lifting; the pour angle is relative to the pose just before pouring. <a href="/media/wuji-hand-kettle/isaaclab.mp4" download>Download MP4</a></figcaption></figure>

<figure><video controls="" playsinline="" preload="metadata" width="1280" height="720" poster="/media/wuji-hand-kettle/pour.png" aria-label="Kettle grasp using standalone Newton and MuJoCo Warp" src="/media/wuji-hand-kettle/standalone.mp4"></video><figcaption>A run driving Newton and MuJoCo Warp directly. The bottom of the frame shows the four fingers' squeeze forces and the sum of friction-force magnitudes across contacts. <a href="/media/wuji-hand-kettle/standalone.mp4" download>Download MP4</a></figcaption></figure>

## The load the hand must support

<div class="grid gap-6 sm:grid-cols-2">
<figure><img src="/media/wuji-hand-kettle/wuji-hand.png" width="800" height="720" loading="lazy" decoding="async" alt="Open right Wuji Hand 2.1 viewed from the palm"><figcaption>The right Wuji Hand 2.1. The glove model is a visual reference; colors in the grasp videos distinguish the fingers.</figcaption></figure>
<figure><img src="/media/wuji-hand-kettle/kettle.png" width="512" height="512" loading="lazy" decoding="async" alt="White glass kettle with a black loop handle beside its body"><figcaption>White Glass Kettle. Fingers enter the opening between the handle post and body. The experimental mass is 500 g, with no liquid.</figcaption></figure>
</div>

The kettle weighs 4.905 N. Upright, its center of mass is about 115 mm horizontally from the handle reference point. Gravity therefore creates a moment of about 0.56 N·m about the handle. Supporting 4.905 N vertically is not enough: unless contact forces counter this moment, the kettle tilts.

**Physics and motion settings used in both runs**

| Item                | Setting                                                                                                                                                                               |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hand and object     | Default right Wuji Hand 2.1, 20 joints. Identical kettle mass, center of mass, and inertia.                                                                                           |
| Contact materials   | Sliding friction: hand 1.0, handle 0.6. Hand collision shapes have higher material priority, so hand–handle contacts use 1.0.                                                         |
| Contact computation | Physics interval 2 ms, one substep. Internal contact detection with multiCCD; hydroelastic surface contact disabled. `elliptic`, `impratio=10`, `condim=3`, hand `solref=(0.008, 1)`. |
| Wrist and motion    | A physical constraint connects the wrist to a moving target. Commanded wrist rise: 123.4 mm; target kettle rise: 120 mm. The tilt rotation center is near the handle.                 |
| Sequence            | Initial settling 1 s → squeeze 8 s → hold 2 s → lift 6 s → hold 3 s → pour 6 s → hold 3 s → return 6 s → hold 3 s.                                                                    |

## Sharing the handle load across four fingers

<figure><img loading="lazy" decoding="async" src="/media/wuji-hand-kettle/wrap-concept.png" width="1254" height="1254" alt="Grasp concept: four fingers enter the handle opening and wrap around its post" style="max-width:28rem;margin:auto"><figcaption>A generated image used to choose the grasp direction. Feasible joint angles and contact forces were calculated afterward using the hand model.</figcaption></figure>

We first simplified the handle post to a rectangular block. In the top view, we checked whether fingers and palm could press opposing faces. In the side view, we checked whether upper and lower contacts were far enough apart to resist the gravitational moment. Rather than prescribing which phalanx should touch, we compared candidates by transferable contact forces and joint torques.

<figure><a href="/media/wuji-hand-kettle/block-contact.png"><img loading="lazy" decoding="async" src="/media/wuji-hand-kettle/block-contact.png" width="2520" height="1260" alt="Top and side projections of a block and fingers, with red arrows marking opposing contact normals"></a><figcaption>Initial block study. Red arrows indicate intended normals for opposing squeeze forces. Little-finger support from below, shown on the right, was a candidate considered at this stage.</figcaption></figure>

Spreading the little finger outward can create a lower support, but its lateral joint must carry the transverse load. An earlier candidate reached 0.212 N·m at that joint, exceeding the hand model's 0.20 N·m limit. We therefore searched wrist position and orientation together with the 16 non-thumb joint angles. The little finger's initial spread angle fell from about 33° to 5.2°, while the thumb target pose stayed the same.

<figure><a href="/media/wuji-hand-kettle/grasp-candidates.png"><img loading="lazy" decoding="async" src="/media/wuji-hand-kettle/grasp-candidates.png" width="1920" height="1350" alt="Three poses from above and obliquely: the little finger is outside in the left pose; all four fingers are inside in the other two"></a><figcaption>Intermediate geometry-search candidates. We checked whether reference points on each finger's middle and distal links lay within the projected opening. Candidates with overlapping collision shapes from different fingers in the initial pose were excluded.</figcaption></figure>

## Supporting weight and moment with squeeze forces

We calculated finger and palm contact forces at upright, 30°, and 60° poses. Here _fᵢ_ is a force exerted by the hand on the kettle, and _rᵢ_ is the vector from the kettle's center of mass to that contact. Gravity acts at the center of mass, so its moment about that point is zero.

> Force equilibrium　Σ fᵢ + m g = 0<br>
> Moment equilibrium about the center of mass　Σ (rᵢ × fᵢ) = 0

We decomposed forces into contact-normal and tangential components, enforcing both friction and joint torque limits. We separately calculated loads tending to open the hand. While enforcing equilibrium at nominal weight, we checked whether the same squeeze could support 1.25 times the weight through a feasible force distribution. This margin comes from the geometry calculation; the actual motion used 500 g.

<figure><a href="/media/wuji-hand-kettle/force-plan.png"><img loading="lazy" decoding="async" src="/media/wuji-hand-kettle/force-plan.png" width="2550" height="1050" alt="Planned finger contact-force directions and palm squeeze forces at 0, 30, and 60 degrees"></a><figcaption>Planned palm squeeze forces: 18.9 N at 0°, 9.2 N at 30°, and 1.7 N at 60°. Tilting changes the relative positions of the center of mass and supports, so joint torque targets also change with angle.</figcaption></figure>

Initial squeeze torque targets ramped up over 8 seconds. Every 10 ms, the controller read measured torques and adjusted joint position commands at up to 0.04 rad/s. The four fingers' lateral joints used limits of 0.10 N·m in the geometry calculation and 0.16 N·m during execution. These are experimental actuation limits; physical actuators' continuous ratings require separate measurement.

## Finger loads and kettle tracking

The values below are mean normal forces over the 6-second lift. The palm and middle finger supplied the largest squeeze forces; ring and little fingers also carried load. In both runs, each of the four fingers had a handle normal force of at least 0.1 N in every recorded contact-force sample from lift through the final return hold.

**Mean lift squeeze forces and peak little-finger lateral load**

| Measurement                             | IsaacLab run  | Standalone run |
| --------------------------------------- | ------------- | -------------- |
| Index / middle                          | 4.91 / 9.19 N | 4.74 / 9.28 N  |
| Ring / little                           | 2.43 / 3.41 N | 2.27 / 3.34 N  |
| Palm                                    | 13.66 N       | 13.64 N        |
| Peak little-finger lateral load         | 1.15 N        | 1.35 N         |
| Peak little-finger lateral-joint torque | 0.028 N·m     | 0.030 N·m      |

Lateral load sums the absolute contact-force projections onto the little finger's lateral-joint motion direction across contacts. Peaks during initial settling were 11.43 N and 11.45 N, respectively. Friction force in the video sums tangential-force _magnitudes_. By contrast, the mean lift values of the signed _vertical component_ of handle tangential force were +1.40 N and +1.36 N. The total force supporting the weight also includes vertical components of contact-normal forces.

The standalone run used the same initial grasp and torque targets. Before comparison, we cross-checked 30 collision shapes, 40 actuators, mass and inertia, materials and collision filters, and wrist constraints. The table was fixed at the same position. The results below are measurements from one representative IsaacLab run and one standalone run.

**Motion comparison for the same 500 g kettle**

| Measurement                          | IsaacLab + Newton / MuJoCo Warp | Standalone Newton + MuJoCo Warp |
| ------------------------------------ | ------------------------------- | ------------------------------- |
| Minimum rise during lift hold        | 120.56 mm                       | 120.25 mm                       |
| Maximum tilt during lift             | 2.62°                           | 2.62°                           |
| Final pour rotation                  | 58.71°                          | 58.70°                          |
| Angle / position error after return  | 1.16° / 4.03 mm                 | 1.07° / 3.38 mm                 |
| Lift / pour scores (100 points each) | 60.02 / 76.95                   | 63.76 / 79.20                   |
| Overall score (200 points)           | 120.04                          | 127.52                          |

Return error uses the midair kettle pose just before pouring as its reference. The overall score is `2 × min(lift score, pour score)`, so the weaker motion determines the ranking. Adoption also requires passing return and static-equilibrium checks.

## Do forces balance after stopping?

Over the final 0.5 seconds of each hold, we vector-summed hand contact forces and gravity. We checked whether the 95th percentile of residual-force magnitude was below 0.491 N, or 10% of kettle weight. We also checked residual moment, linear and angular velocity, and table contact load over the same interval.

| Run condition                           | Motion and static-equilibrium assessment                                                                                                                    |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IsaacLab · 3-second lift hold · 2 runs  | Both completed lift, pour, and return. The representative run passed with a lift residual force of 0.029 N; the second exceeded the threshold at 0.550 N.   |
| IsaacLab · 5-second lift hold · 2 runs  | Both completed all motions. Each exceeded the equilibrium threshold in at least one hold. Increasing the wait alone did not establish repeatable stability. |
| Standalone · 3-second lift hold · 1 run | All three motions completed. Lift residual force exceeded the threshold at 0.544 N. Pour and return passed at 0.008 N and 0.015 N, respectively.            |

The recorded poses and loads show that a four-finger wrap grasp can lift the kettle 12 cm and tilt it about 59°. The remaining issue is force variation immediately after the lift stops. This comparison alone cannot confirm the hypothesis that contact-point changes cause oscillation. The experiment covers a rigid kettle without liquid and multiple point contacts; it does not measure physical glove-shell elasticity or vibration on a real robot.
