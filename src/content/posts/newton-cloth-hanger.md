---
title: "Newton에서 옷을 옷걸이에 걸기 · VBD와 Style3D"
description: "Newton VBD와 Style3D의 셔츠 주름을 같은 메쉬에서 비교하고, 공식 여성용 티셔츠와 스웨트셔츠로 옷걸이 접촉과 파지 해제를 검증한다."
pubDatetime: 2026-11-09T11:00:00+09:00
tags: ["물리 시뮬레이션", "Newton", "Style3D", "로보틱스"]
featured: false
draft: false
---

옷걸이를 흔들었을 때 소매가 비슷하게 움직여도, 멈춘 뒤 밑단이 벌어지는 정도는 다를 수 있다. 같은 유니섹스 셔츠를 Newton VBD와 Style3D에 걸어 이 차이를 측정했다. 이어서 실제 재단 패턴을 가진 여성용 반팔 티셔츠로 한쪽 어깨부터 옷걸이를 끼웠다. 마지막 실험에서는 같은 옷걸이에 여성용 긴팔 스웨트셔츠를 걸어 손을 대지 않은 상태의 움직임을 확인했다.

## 반팔 티셔츠를 한쪽 어깨부터 걸기

<figure><video controls="" playsinline="" preload="metadata" width="1280" height="536" poster="/media/newton-cloth-hanger/female-tshirt-poster.png" src="/media/newton-cloth-hanger/female-tshirt-threading.mp4" aria-label="공식 여성용 반팔 티셔츠를 들고 옷걸이를 넣어 흔드는 12.2초 영상"></video><figcaption>공식 여성용 <code>Female_T_Shirt.usd</code>. 왼쪽은 겉면, 오른쪽은 같은 시각의 반투명 보기다. 주황색과 초록색 점은 각각 첫 번째와 두 번째 파지 위치를 가리킨다. 목 밖의 둥근 고리와 옷 안에서 회전하는 양쪽 끝을 함께 볼 수 있다.</figcaption></figure>

MuJoCo Warp에서 위치 액추에이터 5개로 옷걸이의 이동 3축과 회전 2축을 구동한다. Newton Style3D는 옷걸이의 실제 관절 위치를 받아 천을 계산한다. 양손을 놓은 첫 프레임은 8.97초다. 이후 옷은 어깨 접촉만으로 지탱되며, 옷걸이가 좌우로 움직일 때 소매와 밑단이 뒤따라온다. 천이 옷걸이에 가하는 반력은 이 구성에서 MuJoCo로 되돌려 보내지 않는다.

## VBD와 Style3D에서 밑단과 주름은 어떻게 달라졌나

두 솔버에 같은 유니섹스 셔츠의 시작 정점 3,033개와 삼각형 5,938개를 넣었다. 이미 걸린 옷을 3초 동안 둔 뒤, 옷걸이를 2초간 좌우로 흔들고 1초간 멈췄다. 구동은 최대 진폭 계수 5 cm, 1 Hz의 사인파에 시작과 끝이 부드러운 포락선을 곱했다. 이 6초 실험에서는 두 경우 모두 옷에 파지 구속을 걸지 않았다.

<figure><video controls="" playsinline="" preload="metadata" width="1280" height="524" poster="/media/newton-cloth-hanger/vbd-style3d-poster.png" src="/media/newton-cloth-hanger/vbd-style3d-comparison.mp4" aria-label="같은 유니섹스 셔츠의 VBD와 Style3D 동기 비교"></video><figcaption>왼쪽은 VBD, 오른쪽은 Style3D. 저장된 정점 궤적을 같은 카메라와 무광 재질로 다시 그렸다. 3초에서 멈춰 밑단을 보고, 5초 이후에는 옷걸이가 정지한 상태에서 옷의 움직임을 비교할 수 있다.</figcaption></figure>

| 같은 셔츠에서 측정한 항목                      | VBD              | Style3D          |
| ---------------------------------------------- | ---------------- | ---------------- |
| 3초의 밑단 중앙 앞뒤 간격                      | 5.76 cm          | 13.21 cm         |
| 3초의 몸통 세로 / 가로 잔굴곡 RMS              | 0.093 / 0.560 mm | 0.116 / 0.553 mm |
| 흔드는 동안 몸통 가로의 넓은 굴곡 RMS 최댓값   | 13.20 mm         | 7.09 mm          |
| 흔드는 동안 소맷단 중심의 최대 좌우 변위       | 4.57 cm          | 4.45 cm          |
| 정지 후 마지막 0.5초, 밑단 중심 좌우 이동 범위 | 2.62 mm          | 1.03 mm          |

<figure><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 850 195" role="img" aria-label="같은 축척의 밑단 외곽선. VBD의 중앙 깊이 5.76 cm, Style3D의 중앙 깊이 13.21 cm" width="850" height="195"><rect width="850" height="195" fill="#f0f6f6"></rect><path d="M210,40V166" fill="none" stroke="#81989d" stroke-dasharray="4 4"></path><polygon points="106.2,32.9 119.5,31.9 129.6,32.4 139.6,33.7 149.4,35.8 159.3,38.2 172.2,41.8 182.0,44.6 191.6,47.6 201.3,50.6 211.0,53.7 223.7,57.7 233.4,60.9 243.0,64.2 255.7,68.8 268.2,73.8 277.5,77.7 286.7,81.9 298.6,88.1 310.2,94.7 321.4,102.0 332.2,109.9 342.0,118.9 350.6,129.1 355.3,137.7 357.8,147.1 355.7,156.8 349.5,164.6 339.9,168.1 329.7,166.8 317.4,160.7 306.8,152.2 297.3,142.6 288.1,132.4 281.0,124.9 273.6,117.8 262.7,109.6 250.8,102.8 238.1,97.7 224.6,95.4 210.9,94.8 197.2,95.5 183.6,97.1 173.4,98.7 163.3,100.4 149.7,102.6 136.1,104.6 122.5,105.9 108.9,105.9 95.3,104.7 82.0,101.2 70.2,94.2 64.0,86.0 62.2,76.0 64.8,63.0 71.7,51.6 81.5,42.6 93.2,36.1" fill="none" stroke="#145f74" stroke-width="3"></polygon><text x="210" y="27" text-anchor="middle" font-size="17" fill="#145f74">VBD · 5.76 cm</text><path d="M635,40V166" fill="none" stroke="#81989d" stroke-dasharray="4 4"></path><polygon points="529.1,64.3 541.7,59.7 551.3,56.8 561.2,54.6 571.1,53.1 581.1,51.9 594.5,50.9 604.6,50.3 614.6,49.9 624.7,49.6 634.7,49.4 648.0,49.2 658.0,49.1 668.1,49.1 681.5,49.2 694.8,49.7 704.9,50.2 714.9,51.0 728.1,53.5 741.0,56.8 753.4,62.1 764.6,69.4 773.9,79.0 781.4,90.1 784.6,99.6 786.5,109.5 785.3,119.7 782.5,129.5 776.9,138.1 768.4,144.0 755.4,148.2 741.9,150.0 728.3,150.1 714.5,149.4 704.3,148.7 694.0,147.9 680.3,146.8 666.6,145.7 652.9,144.8 639.1,144.4 625.4,144.7 611.7,145.4 598.0,146.4 587.7,147.4 577.5,148.5 563.8,149.8 550.1,150.7 536.4,150.9 522.9,149.6 509.5,146.7 497.4,140.2 488.2,130.0 483.7,120.8 483.5,110.6 488.6,98.1 496.5,87.3 506.1,78.0 517.0,70.1" fill="none" stroke="#a14827" stroke-width="3"></polygon><text x="635" y="27" text-anchor="middle" font-size="17" fill="#a14827">Style3D · 13.21 cm</text><path d="M22,172h72" stroke="#37555c" stroke-width="3"></path><text x="26" y="190" font-size="14" fill="#37555c">10 cm</text></svg><figcaption>밑단의 열린 경계선을 위에서 본 모습. 각 외곽선의 중심만 맞추고 축척은 같게 유지했다. 가운데 세로선이 경계와 만나는 두 지점의 앞뒤 거리가 표의 첫 행이다.</figcaption></figure>

흔들 때 소매 이동량은 0.12 cm 차이였지만, 정지 상태의 밑단 간격은 7.45 cm 차이였다. VBD 설정에서는 밑단이 더 납작했고 흔들 때 몸통의 큰 굴곡은 더 깊었다. 잔굴곡은 앞·뒤판의 같은 재료점을 따라 4 cm 구간의 중점 깊이를 측정하고, 12 cm 구간의 완만한 곡률 성분을 빼서 구했다. 넓은 굴곡은 12 cm 구간에서 직접 측정했다. 실제 의류를 촬영해 맞춘 수치가 아니므로 어느 쪽이 현실에 더 가까운지는 이 실험만으로 판정할 수 없다.

### 같게 둔 조건과 솔버에 따라 달라지는 입력

비교에 사용한 Newton은 1.7.0, Warp는 1.18.0이다. 두 경우 모두 Z-up, 중력 9.81 m/s², 면밀도 0.10 kg/m², 입자 반경 8 mm, 시간 간격 1/600초다. 옷걸이 자세는 120 Hz로 갱신하고 매 서브스텝에 강체 접촉을 계산했다. 강체 형상 마찰 입력은 0.02, 천–강체 접촉 입력 `(ke, kd, mu)`는 `(10000, 0.01, 0.3)`, 탐색 간격은 8 mm였다. 두 경우에 같은 정점별 속도 제곱 항력 계수 0.0005를 사용했다.

| 구현             | Newton VBD                                                                                                                                          | Newton Style3D                                                                                                                                             |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 변형을 푸는 방법 | 같은 색 그룹 안의 정점은 병렬로, 그룹 사이는 순차적으로 갱신한다. 서브스텝당 8회 반복했다.                                                          | Projective Dynamics로 재료 제약의 목표를 갱신하고 천 전체의 변위를 PCG로 푼다. 외부 반복 4회, 내부 선형 반복 설정은 10회다.                                |
| 막과 굽힘        | Neo-Hookean 막 입력 `tri_ke=tri_ka=500`, 이웃 삼각형의 굽힘 `edge_ke=0.0625`. 정지 이면각을 0으로 두었다. 삼각형·모서리 감쇠 입력은 각각 0.001이다. | 위사·경사·전단 강성 `(100,100,10)`과 방향별 굽힘 `(2e-5,1e-5,5e-6)`. 유니섹스에는 실물 재단 좌표가 없어 삼각형 접평면에 세로축을 투영해 재료축을 구성했다. |
| 접촉과 적용처    | 자기접촉을 켜고 탐색 마진 6 mm, 간격 3 mm로 설정했다. 강체·연체를 함께 처리할 수 있으며, 이번 비교에서는 옷걸이를 외부 구동했다.                    | Style3D 내부의 천 자기접촉과 Newton 충돌 파이프라인의 강체 접촉을 사용했다. 재단 조각의 실 방향과 면적을 보존할 수 있어 공식 의류 장착 실험에 선택했다.    |

표는 실행한 두 설정을 비교한다. VBD의 이면각 기준과 Style3D의 재료 좌표가 다르고 강성 계수도 서로 다른 에너지 식에 들어간다. 따라서 밑단 간격 차이 전체를 반복 알고리즘 한 가지의 효과로 해석할 수 없다. [Newton VBD 문서](https://newton-physics.github.io/newton/latest/solvers/vbd.html) · [Newton Style3D 구현](https://github.com/newton-physics/newton/blob/main/newton/_src/solvers/style3d/solver_style3d.py)

<details>
<summary>VBD 비교 설정을 Newton 빌더에 등록하는 코드</summary>

옷걸이 강체와 형상을 등록한 빌더에 적용한다. 아래의 `vertices`와 `faces`는 같은 유니섹스 셔츠의 초기 위치와 면 배열이다.

```python
builder.add_cloth_mesh(
    pos=(0, 0, 0), rot=wp.quat_identity(), vel=(0, 0, 0),
    vertices=vertices, indices=faces.ravel().tolist(),
    density=0.10, particle_radius=0.008,
    tri_ke=500.0, tri_ka=500.0, tri_kd=0.001,
    edge_ke=0.0625, edge_kd=0.001,
)
builder.edge_rest_angle = [0.0] * len(builder.edge_rest_angle)
builder.color(include_bending=True)
model = builder.finalize(device="cuda:0")
model.soft_contact_ke, model.soft_contact_kd, model.soft_contact_mu = 1e4, .01, .3
solver = newton.solvers.SolverVBD(
    model, iterations=8, particle_enable_self_contact=True,
    particle_self_contact_margin=.006, particle_self_contact_gap=.003,
    integrate_with_external_rigid_solver=True,
)
pipe = newton.CollisionPipeline(model, soft_contact_gap=.008)
```

</details>

## 공식 의류의 재단 패턴과 원단 설정

공식 USD에는 봉제 후의 3D 삼각형과 재단 전의 2D 삼각형이 모두 있다. 솔기에서 이어진 3D 정점 하나가 패턴에서는 여러 조각의 서로 다른 꼭짓점으로 나뉜다. 그래서 각 삼각형의 세 모서리점에 해당하는 UV 인덱스도 별도로 읽어야 한다. 공식 파일의 3D 길이는 m, 패턴 좌표 `primvars:st`는 mm다. 패턴 좌표에만 0.001을 곱한다. [Style3D USD 형식 설명](https://github.com/newton-physics/newton-assets/tree/main/style3d)

```python
faces = np.asarray(mesh.GetFaceVertexIndicesAttr().Get()).reshape(-1, 3)
st = UsdGeom.PrimvarsAPI(mesh).GetPrimvar("st")
assert st.IsIndexed() and st.GetInterpolation() == "faceVarying"
uv = np.asarray(st.Get()) * 0.001
corners = np.asarray(st.GetIndices()).reshape(-1, 3)
assert faces.shape == corners.shape
panel_tri = uv[corners]
assert np.all(np.linalg.det(panel_tri[:, 1:] - panel_tri[:, :1]) > 0)
```

반팔은 45,167정점·89,912삼각형, 긴팔은 24,510정점·48,824삼각형이다. 양쪽 모두 원본 해상도를 사용했다. 함수에 넘긴 면밀도는 0.30 kg/m², 입자 반경은 5 mm다. 반팔의 패턴 면적은 0.6154 m²로, 면밀도를 곱하면 약 185 g이다. 입자 반경은 충돌 계산의 길이 척도다. 실제 원단 두께와 별도로 취급한다. 두 여성용 의류에 같은 공식 티셔츠 예제의 원단값을 썼으므로, 긴팔에서 관찰한 차이에는 소매 길이와 재단 형상의 영향이 들어 있다. [공식 원단 설정](https://github.com/newton-physics/newton/blob/main/newton/examples/cloth/example_cloth_style3d.py)

```python
from newton.solvers import style3d

builder = newton.ModelBuilder(gravity=(0., 0., -9.81))
newton.solvers.SolverStyle3D.register_custom_attributes(builder)
# rest: 장면 좌표에 배치한 3D 정점. uv, corners: 위에서 읽은 2D 패턴.
style3d.add_cloth_mesh(builder,pos=(0,0,0),rot=wp.quat_identity(),vel=(0,0,0),vertices=rest,
    indices=faces.ravel().tolist(),density=.3,particle_radius=.005,panel_verts=uv,panel_indices=corners,
    tri_aniso_ke=wp.vec3(100.,100.,10.),edge_aniso_ke=wp.vec3(2e-5,1e-5,5e-6))
```

## 손이 바뀌는 순간, 옷깃을 풀어 준다

<figure><img src="/media/newton-cloth-hanger/threading-stages.png" width="960" height="210" alt="외부에서 첫 어깨로 접근, 첫 끝 삽입, 반대 소매 확장, 두 손 해제 순서" loading="lazy" decoding="async"><figcaption>왼쪽부터 한쪽 어깨 들기, 첫 끝 삽입, 반대 소매 당기기, 양손 해제. 고리의 직선 기둥은 목을 지나고, 둥근 윗부분은 밖에 남는다.</figcaption></figure>

1. **첫 어깨를 16 cm 든다.** 목과 이어진 어깨의 작은 영역을 잡는다. 가상 손이 잡는 정점만 매 스텝 지정 위치로 옮기며, 나머지 정점은 중력과 접촉에 반응한다.
2. **옷걸이 끝을 목으로 넣는다.** 옷걸이를 0.62 rad 기울여 잡은 쪽 소매 방향으로 첫 패드를 밀어 넣는다. 옷걸이 중심을 직접 지정하면 회전할 때 끝이 원호를 그린다. 아래 함수처럼 목표 패드 위치에서 회전된 오프셋을 빼면 회전 중에도 먼저 들어간 끝을 원하는 위치에 둘 수 있다.
3. **반대 소매를 현재 위치에서 잡는다.** 약 3.23초에 첫 끝만 안에 있는지 확인했다. 두 번째 손이 닫힐 때 변형된 정점 위치를 새 기준으로 저장한 뒤 소매를 옆으로 당긴다. 첫 손은 바깥쪽 몇 점만 남겨 옷깃이 다른 끝을 따라 미끄러지게 한다.
4. **수평을 맞추고 양손을 놓는다.** 고리를 옷깃 위에 둔 채 반대 끝을 통과시키고 중심을 맞춘다. 양쪽 파지를 해제한 뒤 옷걸이를 최대 ±3 cm 목표로 번갈아 움직이고 멈춘다.

```python
def from_tip(tip,yaw,pitch):
    # Keep the first shoulder pad at the specified world point while pivoting the hanger.
    x,z=.205,-.075
    horizontal=np.cos(pitch)*x+np.sin(pitch)*z
    offset=np.array([np.cos(yaw)*horizontal,np.sin(yaw)*horizontal,-np.sin(pitch)*x+np.cos(pitch)*z])
    return np.r_[np.asarray(tip)-offset,yaw,pitch]
```

| 옷마다 바꾼 값                          | 유니섹스 반팔             | 공식 여성용 반팔                           |
| --------------------------------------- | ------------------------- | ------------------------------------------ |
| 첫 어깨 파지 정점 수 → 바깥쪽만 남긴 수 | 67 → 16                   | 55 → 17, 처음에 14 mm 이상 간격            |
| 반대 소매 파지 중심 / 정점 수           | (−.145, .060, 1.055) / 16 | (−.147, .058, 1.079) / 14, 12 mm 이상 간격 |
| 첫 끝의 목 진입 목표                    | (.042, .032, 1.056)       | (.037, .033, 1.056)                        |
| 잡은 어깨 안쪽의 깊은 목표              | (.142, .039, .915)        | (.135, .046, .934)                         |
| 반대 소매를 당긴 목표                   | (−.249, .034, 1.100)      | (−.230, .037, 1.104)                       |

좌표는 옷을 방향·위치 정렬한 뒤의 (좌우 X, 깊이 Y, 높이 Z), 단위는 m다. 삽입·당김 목표에는 `pt()`에서 초기 배치 이동량과 16 cm 들기 변위를 더해 월드 좌표로 변환한다. 공식 반팔에는 방향을 맞추기 위해 Z축 주위 180° 회전을 먼저 적용했다. 다른 옷에서는 목 경계와 양쪽 어깨를 찾아 이 좌표를 다시 정한다. 같은 영역 안의 정점을 전부 고정하면 고해상도 셔츠에서는 수백 점이 붙잡혀 옷깃이 굽을 여유가 사라진다.

## 어깨 패드가 뚫리는 문제와 고리 검사

옷걸이 충돌체는 철사 메쉬와 좌우 9개씩의 구형 패드로 구성했다. 패드 반경은 24 mm, 각 팔의 가장 바깥쪽 패드 중심은 중앙에서 20.5 cm 떨어져 있다. 여성용 의류 실험은 원단값을 유지하고 천–강체 접촉 입력을 `ke=500, kd=1e-5, mu=0.2`로 두었다. 형상 마진은 철사 6 mm, 패드 2 mm다. 매 1/600초마다 구동, 접촉 갱신, 천 계산 순서를 지킨다.

<figure><img src="/media/newton-cloth-hanger/shoulder-contact.png" alt="같은 유니섹스 셔츠를 흔들 때 왼쪽 어깨의 노란 패드가 접촉 강성 조정 후 옷 안으로 들어간 비교" loading="lazy" decoding="async"><figcaption>유니섹스 셔츠로 접촉 강성만 10에서 100으로 바꾼 별도 실험. 같은 갱신 주기에서 패드 표면과 천 삼각형의 최소 간격이 −12.36 mm에서 +0.71 mm로 바뀌었다. 흔들 때 몸통 가로 잔굴곡 최댓값은 0.554 → 0.555 mm, 마지막 0.5초의 밑단 좌우 이동 범위는 0.70 → 0.91 cm였다. 관통을 없애도 움직임 전체가 같아지는 것은 아니다.</figcaption></figure>

```python
wp.launch(control,5,[target,rd.ctrl]);mjw.step(rigid,rd)
wp.launch(transfer,1,[rd.qpos,b.body_q])
a.clear_forces();wp.launch(grip,len(rest),[group,active,delta,saved,model.particle_flags,a.particle_q,a.particle_qd])
pipe.collide(a,contacts);solver.step(a,b,cmd,contacts,DT)
```

이 코드에서 `a`는 현재 상태, `b`는 다음 상태다. `transfer`는 목표 명령 대신 MuJoCo Warp가 계산한 `rd.qpos`를 다음 옷걸이 자세에 쓴다. 충돌 후보는 현재 상태에서 만들고, 천 스텝 후에는 두 버퍼의 역할을 바꾼다. 가상 파지는 활성 그룹의 정점 위치를 지정하는 방식이다. 손가락 마찰, 필요한 악력, 로봇 관절 토크를 평가하려면 실제 그리퍼를 모델링하고 반력을 전달해야 한다.

### 무엇을 측정하면 ‘걸렸다’고 볼 수 있을까

철사 삼각형과 천 삼각형의 교차, 패드 중심에서 천 삼각형까지의 최단거리에서 반경을 뺀 값, 목·소매 둘·밑단을 임시로 막았을 때의 안팎을 따로 검사했다. 이 가상 덮개는 측정에만 쓰인다. 둥근 고리 526개 삼각형이 덮개를 가로지르는지 검사하고 고리 기준점의 감김수도 기록했다. 바깥이면 감김수는 0에 가깝다. 두 끝의 패드는 옷 안쪽, 고리는 바깥쪽이어야 한다.

| 여성용 반팔 장착 판정                                 | 저장된 결과                                         |
| ----------------------------------------------------- | --------------------------------------------------- |
| 0초 → 3.23초, 옷걸이 양 끝의 위치                     | 양쪽 밖 → 먼저 넣은 끝만 안                         |
| 7,320 서브스텝의 철사–천 교차 / 둥근 고리–개구부 교차 | 0회 / 0회, 최대 \|고리 감김수\| 1.08×10⁻⁶ 미만      |
| 패드 표면과 천 중간면의 최소 간격                     | +6.55 mm                                            |
| 양손을 놓은 뒤, 좌우 대표 패드 4개 중심이 모두 안쪽   | 98 / 98 프레임, 최종 옷의 최저점은 탁자 위 10.73 cm |

최소 간격은 충돌 여유 거리가 포함된 기하학적 측정값이다. 이 값으로 패드별 수직 하중을 계산할 수는 없다. 또한 교차 검사는 각 서브스텝의 끝에서 수행했으므로 두 시점 사이의 연속 충돌까지 증명하지는 않는다.

## 공식 여성용 긴팔 스웨트셔츠를 흔들면

<figure><video controls="" playsinline="" preload="metadata" class="portrait" width="640" height="480" poster="/media/newton-cloth-hanger/sweatshirt-poster.png" src="/media/newton-cloth-hanger/sweatshirt-shake.mp4" aria-label="Style3D 공식 여성용 긴팔 스웨트셔츠의 정지, 좌우 흔들기, 감쇠"></video><figcaption><code>Women_Sweatshirt.usd</code>의 6초 실험. 0–3초는 중력으로 정착, 3–5초는 좌우 구동, 5–6초는 정지 후 감쇠다. 자유롭게 내려온 긴 소매와 밑단 시보리 위의 주름을 볼 수 있다. <a href="https://github.com/newton-physics/newton-assets/blob/main/style3d/garments/Women_Sweatshirt.usd">공식 스웨트셔츠 원본</a></figcaption></figure>

이 실험은 두 어깨가 옷걸이에 들어간 상태에서 시작했다. 어깨를 지지하는 물체는 반팔과 같은 옷걸이이며, 전 구간에 파지 정점은 없다. 스웨트셔츠의 원래 길이를 유지하고 USD의 (x, −z, y)를 월드축으로 삼아 (0, 0.043, −0.373) m 평행이동했다. 첫 배치에서 패드가 천 안으로 7.47 mm 겹치는 것을 발견해 이 위치를 조정했다. 채택한 배치의 초기 최소 간격은 +6.29 mm였다.

3 cm를 진폭 계수로 둔 1 Hz 구동에서 옷걸이는 실제로 좌우 약 2.60 cm까지 움직였다. 정착 직후를 기준으로 +X 쪽 소맷단 정점군의 중심은 최대 3.31 cm 움직였고, 마지막 0.5초 동안의 좌우 이동 범위는 1.45 mm였다. 초기 상태와 3,600 서브스텝에서 패드 최소 간격은 **+6.28 mm**, 철사–천 교차와 둥근 고리–개구부 교차는 모두 0회였다. 대표 패드 네 개의 중심은 181개 저장 프레임 모두에서 안쪽에 있었다. 긴팔에서 검증한 구간은 장착 후의 정착과 흔들기다.

## 다른 Newton 프로젝트에서 재현하기

아래 묶음에는 두 공식 의류의 3D 삼각형과 2D 패턴, 옷걸이 충돌·표시 메쉬, 실행 코드와 라이선스가 들어 있다. Python 3.12와 CUDA 장치에서 Newton 1.7.0, Warp 1.18.0, MuJoCo와 MuJoCo Warp 3.15.0을 사용했다. 압축을 풀고 가상환경에서 다음 순서로 실행한다. <a href="/media/newton-cloth-hanger/newton-cloth-hanger-examples.zip" download="newton-cloth-hanger-examples.zip">재현 예제 내려받기 (ZIP)</a>

```sh
python -m pip install -r requirements.txt

# 공식 여성용 반팔 · 삽입부터 양손 해제까지
python simulate.py
python verify.py
python render.py

# 공식 여성용 긴팔 · 장착 후 정착과 흔들기
python test_sweatshirt.py
python render_sweatshirt.py
```

반팔은 `output/dressing.mp4`, 긴팔은 `sweatshirt.mp4`를 만든다. 블로그의 반팔 영상에는 같은 궤적 위에 단계 자막을 덧붙였다. 프로젝트에 이식할 때는 먼저 원단 등록과 옷걸이 형상을 옮기고, 프로젝트에서 구동한 실제 자세를 매 스텝 전달한다. 마지막으로 새 옷의 목 경계에서 첫 패드만 통과하는 시점, 고리가 바깥인 상태, 해제 후 양쪽 어깨 지지가 재현되는지 검사한다.

<details>
<summary>반팔 장착의 전체 코드 보기 · simulate.py</summary>

```python
"""Single-shoulder lift and neck-first hanger insertion. Distances are in metres."""
from pathlib import Path
import numpy as np
import mujoco
import mujoco_warp as mjw
import newton
import warp as wp
from newton.solvers import style3d
from setup_scene import ASSETS, OUT, DEPTH, LIFT, shoulder_pads, read_mesh, local_panels

PIV=np.array([0.,DEPTH,LIFT+.275])
FPS=30
DT=1/600
@wp.kernel
def control(command:wp.array[float],ctrl:wp.array2d[float]):
    i=wp.tid()
    ctrl[0,i]=command[i]

@wp.kernel
def transfer(q:wp.array2d[float],out:wp.array[wp.transform]):
    yaw=wp.quat_from_axis_angle(wp.vec3(0.,0.,1.),q[0,3])
    pitch=wp.quat_from_axis_angle(wp.vec3(0.,1.,0.),q[0,4])
    out[0]=wp.transform(wp.vec3(q[0,0],q[0,1],q[0,2]),yaw*pitch)

@wp.kernel
def grip(group:wp.array[int],active:wp.array[int],delta:wp.array[wp.vec3],saved:wp.array[wp.vec3],
         flags:wp.array[int],q:wp.array[wp.vec3],v:wp.array[wp.vec3]):
    i=wp.tid()
    g=group[i]
    flags[i]=1
    if g>=0 and active[g]!=0:
        flags[i]=0
        q[i]=saved[i]+delta[g]
        v[i]=wp.vec3(0.)

from newton._src.geometry.kernels import triangle_closest_point

@wp.kernel
def clearance(q:wp.array[wp.vec3],faces:wp.array2d[int],pads:wp.array[wp.vec3],
              pose:wp.array[wp.transform],step:wp.array[int],gap:wp.array[float]):
    i,j=wp.tid()
    center=wp.transform_point(pose[0],pads[j])
    a=q[faces[i,0]];b=q[faces[i,1]];c=q[faces[i,2]]
    lower=wp.min(a,wp.min(b,c));upper=wp.max(a,wp.max(b,c))
    separation=wp.max(lower-center,center-upper)
    if wp.max(separation)>.05:
        return
    near,weights,kind=triangle_closest_point(a,b,c,center)
    wp.atomic_min(gap,step[0],wp.length(near-center)-.024)

@wp.func
def intersects(a:wp.vec3,b:wp.vec3,c:wp.vec3,u:wp.vec3,v:wp.vec3,w:wp.vec3):
    # Warp's Moller test uses a fixed epsilon on unnormalized plane equations.
    # Use centimetres and doubles so millimetre wire facets are not classified as coplanar.
    scale=wp.float64(100.)
    return wp.intersect_tri_tri(wp.vec3d(a)*scale,wp.vec3d(b)*scale,wp.vec3d(c)*scale,
                                wp.vec3d(u)*scale,wp.vec3d(v)*scale,wp.vec3d(w)*scale)

@wp.kernel
def check_wire(q:wp.array[wp.vec3],faces:wp.array2d[int],mesh:wp.uint64,pose:wp.array[wp.transform],
               step:wp.array[int],hits:wp.array[int]):
    i=wp.tid()
    inv=wp.transform_inverse(pose[0])
    a=wp.transform_point(inv,q[faces[i,0]])
    b=wp.transform_point(inv,q[faces[i,1]])
    c=wp.transform_point(inv,q[faces[i,2]])
    query=wp.mesh_query_aabb(mesh,wp.min(a,wp.min(b,c)),wp.max(a,wp.max(b,c)))
    j=int(0)
    while wp.mesh_query_aabb_next(query,j):
        u=wp.mesh_get_point(mesh,3*j)
        v=wp.mesh_get_point(mesh,3*j+1)
        w=wp.mesh_get_point(mesh,3*j+2)
        if intersects(a,b,c,u,v,w):
            wp.atomic_add(hits,step[0],1)

@wp.kernel
def cap_center(q:wp.array[wp.vec3],offset:wp.array[int],verts:wp.array[int],centers:wp.array[wp.vec3]):
    i=wp.tid()
    s=wp.vec3(0.)
    for j in range(offset[i],offset[i+1]):
        s=s+q[verts[j]]
    centers[i]=s/float(offset[i+1]-offset[i])

@wp.kernel
def hook_outside(q:wp.array[wp.vec3],faces:wp.array2d[int],edges:wp.array2d[int],centers:wp.array[wp.vec3],
                 hook:wp.uint64,pose:wp.array[wp.transform],step:wp.array[int],cap_hits:wp.array[int],
                 solid_angle:wp.array[float]):
    i=wp.tid()
    a=wp.vec3(0.); b=wp.vec3(0.); c=wp.vec3(0.)
    if i<faces.shape[0]:
        a=q[faces[i,0]]; b=q[faces[i,1]]; c=q[faces[i,2]]
    else:
        j=i-faces.shape[0]
        a=q[edges[j,0]];b=q[edges[j,1]];c=centers[edges[j,2]]
        inv=wp.transform_inverse(pose[0])
        u=wp.transform_point(inv,a);v=wp.transform_point(inv,b);w=wp.transform_point(inv,c)
        query=wp.mesh_query_aabb(hook,wp.min(u,wp.min(v,w)),wp.max(u,wp.max(v,w)))
        f=int(0)
        while wp.mesh_query_aabb_next(query,f):
            if intersects(u,v,w,wp.mesh_get_point(hook,3*f),wp.mesh_get_point(hook,3*f+1),wp.mesh_get_point(hook,3*f+2)):
                wp.atomic_add(cap_hits,step[0],1)
    ref=wp.transform_point(pose[0],wp.vec3(.027,0.,.102))
    a=a-ref;b=b-ref;c=c-ref
    al=wp.length(a);bl=wp.length(b);cl=wp.length(c)
    angle=wp.atan2(wp.dot(a,wp.cross(b,c)), al*bl*cl+cl*wp.dot(a,b)+al*wp.dot(b,c)+bl*wp.dot(c,a))
    wp.atomic_add(solid_angle,step[0],angle/(2.*wp.pi))

@wp.kernel
def increment(step:wp.array[int]):
    step[0]+=1

def fixture():
    joints=''; motors=''
    for i,(axis,typ) in enumerate(zip(['1 0 0','0 1 0','0 0 1','0 0 1','0 1 0'],['slide']*3+['hinge']*2)):
        joints+=f'<joint name="j{i}" type="{typ}" axis="{axis}"/>'
        motors+=f'<position joint="j{i}" kp="{800 if i<3 else 12}" kv="{14 if i<3 else .35}"/>'
    xml=f"""<mujoco><option timestep="{DT}" gravity="0 0 0"/><worldbody><body>{joints}
    <inertial pos="0 0 0" mass=".08" diaginertia=".001 .001 .001"/></body></worldbody>
    <actuator>{motors}</actuator></mujoco>"""
    m=mujoco.MjModel.from_xml_string(xml)
    return mjw.put_model(m),mjw.make_data(m,nworld=1)

def main():
    OUT.mkdir(exist_ok=True)
    with np.load(ASSETS/'Female_T_Shirt_panels.npz') as data:
        rest,faces=data['vertices'].copy(),data['faces']
        uv,corners=data['uv'],data['corners']
    # Register the opposite-facing neckline with the hanger approach; preserve all lengths.
    rest[:,:2]*=-1
    rest += [0.,.110,-.033]
    garment = rest.copy()
    # Start with the open hem at tabletop height; the shoulder grip is active from frame zero.
    rest=rest.copy()
    rest[:,1]-=.06
    rest[:,2]+=.42-rest[:,2].min()
    builder=newton.ModelBuilder(gravity=(0.,0.,-9.81))
    newton.solvers.SolverStyle3D.register_custom_attributes(builder)
    body=builder.add_body(is_kinematic=True)
    wire,wf=read_mesh(ASSETS/'wire.obj')
    wire_cfg=builder.default_shape_cfg.copy();wire_cfg.margin=.006
    builder.add_shape_mesh(body,mesh=newton.Mesh(wire-PIV,wf.ravel()),cfg=wire_cfg)
    pad_cfg=builder.default_shape_cfg.copy()
    pad_cfg.margin=.002
    for x,z,r in shoulder_pads():
        builder.add_shape_sphere(body,xform=wp.transform(np.array([x,DEPTH,z])-PIV,wp.quat_identity()),radius=r,cfg=pad_cfg)
    builder.add_shape_box(-1,xform=wp.transform((0.,.16,.38),wp.quat_identity()),hx=.70,hy=.63,hz=.04)
    assert corners.shape==faces.shape and len(faces)==89912
    style3d.add_cloth_mesh(builder,pos=(0,0,0),rot=wp.quat_identity(),vel=(0,0,0),vertices=rest,
        indices=faces.ravel().tolist(),density=.3,particle_radius=.005,panel_verts=uv,panel_indices=corners,
        tri_aniso_ke=wp.vec3(100.,100.,10.),edge_aniso_ke=wp.vec3(2e-5,1e-5,5e-6))
    model=builder.finalize(device='cuda:0')
    model.soft_contact_ke,model.soft_contact_kd,model.soft_contact_mu=500.,1e-5,.2
    state=[model.state(),model.state()];pipe=newton.CollisionPipeline(model)
    contacts=pipe.contacts();cmd=model.control();solver=newton.solvers.SolverStyle3D(model,iterations=4)
    rigid,rd=fixture()
    def patch(near,n):
        return np.argsort(np.linalg.norm(garment-np.asarray(near),axis=1))[:n]
    ids=[np.flatnonzero((garment[:,0]>.020)&(garment[:,0]<.133)&(garment[:,2]>1.067)),patch((-.147,.058,1.079),180)]

    # Keep high-resolution neighboring triangles free to respond to contact.
    # Match the physical footprint of the virtual jaw, rather than fixing every vertex in it.
    def spaced(pool,spacing):
        chosen=[]
        for idx in sorted(pool):
            if not chosen or np.min(np.linalg.norm(garment[chosen]-garment[idx],axis=1)) >= spacing:
                chosen.append(idx)
        return np.array(chosen)
    ids=[spaced(ids[0],.014),spaced(ids[1],.012)]
    print("anchors",len(ids[0]),len(ids[1]),flush=True)
    # True neck boundary.
    edges,cnt=np.unique(np.sort(faces[:,[[0,1],[1,2],[2,0]]].reshape(-1,2),axis=1),axis=0,return_counts=True)
    rim=np.unique(edges[cnt==1]);collar=rim[(garment[rim,2]>1.06)&(abs(garment[rim,0])<.08)]
    group=np.full(len(rest),-1,np.int32)
    for i,g in enumerate(ids):group[g]=i
    group=wp.array(group,dtype=int)
    active=wp.array([1,0],dtype=int)
    delta=wp.zeros(2,dtype=wp.vec3)
    saved=wp.array(rest,dtype=wp.vec3)
    initial=np.array([-.32,-.25,1.06,0.,.8],np.float32)
    target=wp.array(initial,dtype=float)
    rd.qpos.assign(initial[None]);wp.launch(transfer,1,[rd.qpos,state[0].body_q])
    wp.launch(transfer,1,[rd.qpos,state[1].body_q])
    pads=wp.array([(x,0.,z-PIV[2]) for x,z,_ in shoulder_pads()],dtype=wp.vec3)
    wm=wp.Mesh(points=wp.array(wire-PIV,dtype=wp.vec3),indices=wp.array(wf.ravel(),dtype=int))
    from verify import caps
    loops=caps(faces)
    cap_offsets=wp.array(np.cumsum([0]+[len(l) for l in loops]),dtype=int)
    cap_vertices=wp.array(np.concatenate(loops),dtype=int)
    cap_edges=wp.array(np.vstack([np.column_stack((l,np.roll(l,-1),np.full(len(l),k))) for k,l in enumerate(loops)]),dtype=int)
    center_buffer=wp.zeros(len(loops),dtype=wp.vec3)
    # All 16 curved tube spans and the tip cap (512+14 faces); exclude the straight neck stem.
    upper_faces=wf[wire[wf][:,:,2].min(axis=1)>PIV[2]+.05]
    assert len(upper_faces)==526
    hook_mesh=wp.Mesh(points=wp.array(wire-PIV,dtype=wp.vec3),indices=wp.array(upper_faces.ravel(),dtype=int))
    cap_hits=wp.zeros(12000,dtype=int)
    winding=wp.zeros(12000,dtype=float)
    hits=wp.zeros(12000,dtype=int)
    counter=wp.zeros(1,dtype=int);gap=wp.full(12000,.026,dtype=float)
    def substep(i):
        a,b=state[i],state[1-i]
        wp.launch(control,5,[target,rd.ctrl]);mjw.step(rigid,rd)
        wp.launch(transfer,1,[rd.qpos,b.body_q])
        a.clear_forces();wp.launch(grip,len(rest),[group,active,delta,saved,model.particle_flags,a.particle_q,a.particle_qd])
        pipe.collide(a,contacts);solver.step(a,b,cmd,contacts,DT)
        wp.launch(clearance,(len(faces),len(pads)),[b.particle_q,model.tri_indices,pads,b.body_q,counter,gap])
        wp.launch(check_wire,len(faces),[b.particle_q,model.tri_indices,wm.id,b.body_q,counter,hits])
        wp.launch(cap_center,len(loops),[b.particle_q,cap_offsets,cap_vertices,center_buffer])
        wp.launch(hook_outside,len(faces)+len(cap_edges),[b.particle_q,model.tri_indices,cap_edges,center_buffer,hook_mesh.id,b.body_q,counter,cap_hits,winding])
        wp.launch(increment,1,[counter])
    with wp.ScopedCapture() as cap:
        for k in range(20):substep(k%2)
    report_start=0
    positions=[rest];poses=[initial];holds=[[True,False]]
    hand=np.zeros((2,3),np.float32)
    def run(seconds,goal,displacement,flags):
        nonlocal report_start
        start=poses[-1].copy();old=hand.copy()
        active.assign(np.array(flags,np.int32))
        for k in range(round(seconds*FPS)):
            u=(k+1)/round(seconds*FPS);u=u*u*(3-2*u)
            target.assign(np.array(start+(goal-start)*u,np.float32))
            hand[:]=old+(displacement-old)*u;delta.assign(hand)
            wp.capture_launch(cap.graph)
            positions.append(state[0].particle_q.numpy());assert np.isfinite(positions[-1]).all();poses.append(rd.qpos.numpy()[0].copy());holds.append(flags)
        stop=int(counter.numpy()[0])
        seg=slice(report_start,stop)
        print("audit",stop/600, gap.numpy()[seg].min()*1000, np.count_nonzero(hits.numpy()[seg]),np.count_nonzero(cap_hits.numpy()[seg]),np.max(np.abs(winding.numpy()[seg])),flush=True)
        report_start=stop
        v=positions[-1]
        print(len(poses)/30,'neck',v[collar].mean(0),'neck bounds',v[collar].min(0),v[collar].max(0),'shoulders',v[ids[0]].mean(0),v[ids[1]].mean(0),'low',v[:,2].min(),flush=True)
    lift=np.array([[0.,0.,.16],[0.,0.,0.]])
    run(1.,initial,lift,[1,0])
    def from_tip(tip,yaw,pitch):
        # Keep the first shoulder pad at the specified world point while pivoting the hanger.
        x,z=.205,-.075
        horizontal=np.cos(pitch)*x+np.sin(pitch)*z
        offset=np.array([np.cos(yaw)*horizontal,np.sin(yaw)*horizontal,-np.sin(pitch)*x+np.cos(pitch)*z])
        return np.r_[np.asarray(tip)-offset,yaw,pitch]

    # The held shoulder includes both lips of the adjacent collar section.
    offset=rest[ids[0]].mean(0)-garment[ids[0]].mean(0)+lift[0]
    def pt(x,y,z):return np.array([x,y,z])+offset
    run(.8,from_tip(pt(-.055,.018,1.20),0.,.62),lift,[1,0])
    run(.75,from_tip(pt(.037,.033,1.056),0.,.62),lift,[1,0])
    run(.7,from_tip(pt(.135,.046,.934),0.,.62),lift,[1,0])
    now=positions[-1].copy()
    saved_np=rest.copy()
    saved_np[ids[1]]=now[ids[1]]
    saved.assign(saved_np)
    sleeve=now[ids[1]].mean(0)
    def hands(to):
        return np.array([lift[0],np.asarray(to)-sleeve])
    two=hands(pt(-.230,.037,1.104))
    run(1.1,from_tip(pt(.135,.046,.928),0.,.62),two,[1,1])
    # Once the other sleeve is held, leave only the outer pinch fixed so that
    # the neck edge can slide around the hanger rather than intersect a fixed patch.
    narrow=group.numpy()
    narrow[(narrow==0)&(garment[:,0]<.104)] = -1
    group.assign(narrow)
    two[0]=lift[0]+[.066,.006,.061]
    run(.70,from_tip(pt(.13,.040,.967),0.,.57),two,[1,1])
    def pivot(x,y,z,angle):
        return np.r_[pt(x,y,z),0.,angle]
    # Keep the hook above the collar. Carry the near end into the sleeve
    # while moving the far tip over the opening widened by the opposite hand.
    run(.9,pivot(.066,.035,1.147,.52),two,[1,1])
    run(.8,pivot(.085,.035,1.122,.30),two,[1,1])
    run(.75,pivot(.081,.035,1.116,.02),two,[1,1])
    balance=two.copy()
    run(.85,pivot(.005,.043,1.11,0.),balance,[1,1])
    final=pivot(0.,.055,1.100,0.)
    two=balance.copy()
    run(.6,final,two,[1,1])
    run(.8,final,two,[0,0])
    for offset_x in [.03,-.03,.03,-.03,0.]:
        goal=final.copy();goal[0]+=offset_x
        run(.35,goal,two,[0,0])
    run(.8,final,two,[0,0])
    np.savez_compressed(OUT/'trajectory.npz',pos=np.array(positions),pose=np.array(poses),active=np.array(holds),faces=faces,grip_ids_0=ids[0],grip_ids_1=ids[1],collar=collar,hook_cap_hits=cap_hits.numpy()[:int(counter.numpy()[0])],hook_winding=winding.numpy()[:int(counter.numpy()[0])],wire_hits=hits.numpy()[:int(counter.numpy()[0])],pad_gap=gap.numpy()[:int(counter.numpy()[0])])

if __name__=='__main__':main()
```

</details>

<details>
<summary>안팎 판정과 장착 후 검사 보기 · verify.py</summary>

```python
import numpy as np


from setup_scene import OUT
def caps(f):
    edges=f[:,[[0,1],[1,2],[2,0]]].reshape(-1,2)
    _,inv,cnt=np.unique(np.sort(edges,1),axis=0,return_inverse=True,return_counts=True)
    rev={j:i for i,j in edges[cnt[inv]==1]}
    loops=[]
    while rev:
        v=next(iter(rev));l=[]
        while v in rev: l.append(v);v=rev.pop(v)
        loops.append(np.array(l))
    return loops
def rot(q):
    cy,sy=np.cos(q[3]),np.sin(q[3]);c,s=np.cos(q[4]),np.sin(q[4])
    return np.array([[cy*c,-sy,cy*s],[sy*c,cy,sy*s],[-s,0,c]])
def winding(v,f,loops,g):
    tri=v[f]
    for l in loops:
        tri=np.concatenate([tri,np.stack([v[l],v[np.roll(l,-1)],np.tile(v[l].mean(0),(len(l),1))],axis=1)])
    a,b,c=(tri-g).transpose(1,0,2);al,bl,cl=[np.linalg.norm(x,axis=1) for x in (a,b,c)]
    dot=lambda a,b:np.sum(a*b,axis=1)
    return abs(np.arctan2(dot(a,np.cross(b,c)),al*bl*cl+dot(a,b)*cl+dot(b,c)*al+dot(c,a)*bl).sum()/(2*np.pi))
if __name__=='__main__':
    from setup_scene import shoulder_pads
    d=np.load(OUT/'trajectory.npz')
    p,f=d['pos'],d['faces']
    loops=caps(f)
    ids=np.flatnonzero(~d['active'].any(1))
    assert np.isfinite(p).all() and np.all(np.diff(ids)==1)
    pads=np.array([[x,0,.003-.38*abs(x)] for x,z,r in shoulder_pads()])
    endpads=pads[[0,8,9,17]]
    inside=[]
    for frame in ids:
        q=d['pose'][frame]
        inside.append([winding(p[frame],f,loops,point)>.5 for point in endpads@rot(q).T+q[:3]])
    first_pull=np.flatnonzero(d['active'][:,1])[0]
    for frame in (0,first_pull-1):
        q=d["pose"][frame]
        tips=pads[[17,8]]@rot(q).T+q[:3]
        membership=[winding(p[frame],f,loops,x)>.5 for x in tips]
        print("right/left tips inside",frame/30,membership)
        assert membership==([False,False] if frame==0 else [True,False])
    gap=d['pad_gap'];cross=d['wire_hits']; events=np.where(cross>0)[0]
    print("released at",ids[0]/30,"seconds; checked",len(ids),"released frames; all four pad centers inside",np.all(inside))
    print("substeps",len(gap),"min pad clearance mm",1000*gap.min(),"wire intersection steps",len(events))
    if len(events):
        print("intersection intervals (s)",[(seg[0]/600,seg[-1]/600) for seg in np.split(events,np.flatnonzero(np.diff(events)>1)+1)])
    print("lift cm",100*(p[30,d['grip_ids_0'],2]-p[0,d['grip_ids_0'],2]).mean(),
          "final tabletop clearance cm",100*(p[-1,:,2].min()-.42))
    hook_caps=d["hook_cap_hits"]
    winding_max=np.max(np.abs(d["hook_winding"]))
    print("curved hook/opening crossing steps",np.count_nonzero(hook_caps),"max outside winding error",winding_max)
    assert len(gap)==20*(len(p)-1) and np.all(gap<1.)
    assert np.all(inside) and gap.min()>0 and p[-1,:,2].min()>.42
    assert not np.any(cross) and not np.any(hook_caps) and winding_max<.01
```

</details>

<details>
<summary>긴팔 흔들기와 접촉 검사 보기 · test_sweatshirt.py</summary>

```python
"""Position an already-threaded sweatshirt on the same hanger, settle, shake and stop.

Place beside simulate.py in the standalone T-shirt example. Input: sweatshirt.npz
with vertices in Z-up metres (USD x, -z, y), faces, panel uv and corners.
"""
from pathlib import Path
import numpy as np
import newton
import warp as wp
import simulate as sim
from verify import caps, winding
from newton.solvers import style3d

def run():
    base = Path(__file__).resolve().parent
    data = np.load(base / "sweatshirt.npz")
    verts = data["vertices"] + np.array([0, .043, -.373], np.float32)
    faces = data["faces"]
    builder = newton.ModelBuilder(gravity=(0, 0, -9.81))
    newton.solvers.SolverStyle3D.register_custom_attributes(builder)
    hanger = builder.add_body(is_kinematic=True)
    wire, wf = sim.read_mesh(sim.ASSETS / "wire.obj")
    wire = wire - sim.PIV
    config = builder.default_shape_cfg.copy()
    config.margin = .006
    builder.add_shape_mesh(hanger, mesh=newton.Mesh(wire,wf.ravel()), cfg=config)
    config = builder.default_shape_cfg.copy()
    config.margin = .002
    centers = np.array([(x,0,z-sim.PIV[2]) for x,z,_ in sim.shoulder_pads()])
    for center in centers:
        builder.add_shape_sphere(hanger, xform=wp.transform(center,wp.quat_identity()), radius=.024, cfg=config)
    style3d.add_cloth_mesh(builder, pos=(0,0,0),rot=wp.quat_identity(),vel=(0,0,0),
        vertices=verts,indices=faces.ravel().tolist(),density=.3,particle_radius=.005,
        panel_verts=data["uv"],panel_indices=data["corners"],
        tri_aniso_ke=wp.vec3(100,100,10),edge_aniso_ke=wp.vec3(2e-5,1e-5,5e-6))
    model=builder.finalize(device="cuda:0")
    model.soft_contact_ke,model.soft_contact_kd,model.soft_contact_mu=500.,1e-5,.2
    solver=newton.solvers.SolverStyle3D(model,iterations=4)
    pipe=newton.CollisionPipeline(model)
    contacts,cmd=pipe.contacts(),model.control()
    st=[model.state(),model.state()]
    rigid,rd=sim.fixture()
    initial=np.r_[sim.PIV,0.,0.].astype(np.float32)
    target=wp.array(initial,dtype=float)
    rd.qpos.assign(initial[None])
    for s in st:
        wp.launch(sim.transfer,1,[rd.qpos,s.body_q])
    loops=caps(faces)
    assert len(loops)==4
    offsets=wp.array(np.cumsum([0]+list(map(len,loops))),dtype=int)
    indices=wp.array(np.concatenate(loops),dtype=int)
    edges=wp.array(np.vstack([np.column_stack((l,np.roll(l,-1),np.full(len(l),i))) for i,l in enumerate(loops)]),dtype=int)
    cap_pos=wp.zeros(4,dtype=wp.vec3)
    hk=wf[wire[wf][:,:,2].min(axis=1)>.05]
    assert len(hk)==526
    mesh=lambda f: wp.Mesh(points=wp.array(wire,dtype=wp.vec3),indices=wp.array(f.ravel(),dtype=int))
    wm,hm=mesh(wf),mesh(hk)
    pads=wp.array(centers,dtype=wp.vec3)
    n=3600
    gap=wp.full(n+1,.026,dtype=float)
    wire_hits=wp.zeros(n+1,dtype=int)
    hook_hits=wp.zeros(n+1,dtype=int)
    wind=wp.zeros(n+1,dtype=float)
    tick=wp.zeros(1,dtype=int)
    def audit(state):
        q,pose=state.particle_q,state.body_q
        wp.launch(sim.clearance,(len(faces),len(pads)),[q,model.tri_indices,pads,pose,tick,gap])
        wp.launch(sim.check_wire,len(faces),[q,model.tri_indices,wm.id,pose,tick,wire_hits])
        wp.launch(sim.cap_center,len(loops),[q,offsets,indices,cap_pos])
        wp.launch(sim.hook_outside,len(faces)+len(edges),[q,model.tri_indices,edges,cap_pos,hm.id,pose,tick,hook_hits,wind])
        wp.launch(sim.increment,1,[tick])
    audit(st[0])
    print("initial gap/wire/hook/winding",gap.numpy()[0],wire_hits.numpy()[0],hook_hits.numpy()[0],wind.numpy()[0],flush=True)
    with wp.ScopedCapture() as cap:
        for i in range(20):
            a,b=st[i%2],st[1-i%2]
            wp.launch(sim.control,5,[target,rd.ctrl])
            sim.mjw.step(rigid,rd)
            wp.launch(sim.transfer,1,[rd.qpos,b.body_q])
            a.clear_forces()
            pipe.collide(a,contacts)
            solver.step(a,b,cmd,contacts,sim.DT)
            audit(b)
    pos=[verts]
    poses=[initial]
    for k in range(1,181):
        u=np.clip(k/30-3,0,2)
        goal=initial.copy()
        goal[0]=.03*np.sin(2*np.pi*u)*np.sin(np.pi*u/2)**2
        target.assign(goal)
        wp.capture_launch(cap.graph)
        pos.append(st[0].particle_q.numpy())
        poses.append(rd.qpos.numpy()[0].copy())
    pos=np.array(pos)
    poses=np.array(poses)
    members=np.array([[winding(v,faces,loops,x)>.5 for x in centers[[0,8,9,17]]+q[:3]] for v,q in zip(pos,poses)])
    print("min gap mm",gap.numpy().min()*1000,"wire steps",np.count_nonzero(wire_hits.numpy()),
          "hook cap steps",np.count_nonzero(hook_hits.numpy()),"max |winding|",abs(wind.numpy()).max(),
          "four pads inside frames",members.all(1).sum(),"min z at end",pos[-1,:,2].min(),flush=True)
    assert np.isfinite(pos).all() and int(tick.numpy()[0])==n+1
    np.savez_compressed(base/"sweatshirt_trajectory.npz",pos=pos,pose=poses,faces=faces,
        gap=gap.numpy(),wire=wire_hits.numpy(),cap=hook_hits.numpy(),winding=wind.numpy(),inside=members)
    assert members.all() and gap.numpy().min()>0 and not wire_hits.numpy().any() and not hook_hits.numpy().any() and abs(wind.numpy()).max()<.01

if __name__=="__main__":
    run()
```

</details>

<footer>의류 원본 © 2025 Style3D. 재현 묶음에 원본 배포 조건과 출처를 포함했다. <a href="https://github.com/newton-physics/newton-assets/tree/main/style3d/garments">공식 의류 목록</a> · <a href="https://github.com/newton-physics/newton-assets/blob/main/style3d/LICENSE">Style3D BSD 3-Clause 라이선스</a></footer>
