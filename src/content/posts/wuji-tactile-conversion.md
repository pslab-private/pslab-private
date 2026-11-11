---
title: "Wuji Hand 촉각 데이터: 실물 인터페이스에서 MuJoCo 4.0의 힘 출력까지"
description: "Wuji Hand의 촉각 데이터 계약을 MuJoCo 4.0.0으로 옮기고, 접촉력에서 176개 감지점·15개 합력·힘 이미지를 만드는 과정과 검증 한계를 살펴봅니다."
coverImage: "/media/wuji-tactile-conversion/foo-dog-ramp.png"
pubDatetime: 2026-11-11T06:03:06.178Z
draft: false
tags: ["물리 시뮬레이션", "MuJoCo", "로보틱스", "Wuji Hand"]
---

하드웨어가 보내는 정보를 먼저 정의하고, 그 계약을 시뮬레이션으로 옮긴 다음 접촉으로부터 촉각 값을 생성한다. 176개 감지점, 손가락별 3축 합력, 힘 이미지가 만들어지는 경로를 추적한다.

기술 조사·실험 기록일: 2026-11-11. 아래 결과는 원문에 포함된 저장 데이터이며, 블로그 편집 과정에서 물리 실험을 다시 실행하지 않았다.

**이 글의 구현 범위.** 공식 문서와 SDK 예제로 하드웨어 인터페이스를 조사하고, 제공된 `hand_tactile.xml`과 변환 코드의 실제 동작을 분석했다. 실물 장치의 원시 패킷이나 교정 데이터를 수집한 실험은 아니다. 아래의 **공식 계약**, **현재 구현**, **미확보 정보**를 구분해서 읽어야 한다.

<span id="real"></span>

## 01. 실제 하드웨어가 보내는 것은 무엇인가

대상은 **Wuji Hand 2.2의 손끝 패드형 촉각 인터페이스**다. 손 제조사와 공식 인터페이스 제공자는 Wuji Technology다. 공개 자료에서 별도 촉각 모듈 공급사·변환 소자 원리·물리적 full-scale을 확정할 근거는 찾지 못했다. 따라서 특정 외부 제조사나 자기식·압저항식 센서라고 단정하지 않는다. 실제 연결 시 `FingertipSensorInfo.model`과 장치 사양을 함께 확인해야 하며, 모델 문자열은 비어 있을 수도 있다. [[1]](#r1)

또한 Hand 2의 손끝 패드, 손 전체의 수동 외피, Wuji Glove의 촉각 데이터는 서로 다른 대상이다. 이 글은 손끝의 다섯 데이터 스트림을 다룬다. 공식 모델은 패드 형상이 있는 강체 모델이며, 그것만으로 탄성 패드의 변형과 전기적 센서 응답까지 시뮬레이션되는 것은 아니다. [[2]](#r2)

<span id="real-format"></span>

### 1.1 먼저 메타데이터, 그다음 데이터 프레임

실물 입력은 처음부터 고정 길이의 `float[528]` 배열이라고 가정하지 않는다. 손가락별 `info.format`을 읽어 바이트 배열을 해석하고, 프레임의 `info_digest`가 메타데이터와 맞는지 확인한다. 메타데이터가 바뀌면 디코더도 갱신한다. [[1]](#r1)

| 정보      | 하드웨어 계약에서 읽을 항목                                            | 시뮬레이션으로 가져올 의미                |
| --------- | ---------------------------------------------------------------------- | ----------------------------------------- |
| 센서 구성 | `point_count`, `rate_hz`                                               | 감지점 수와 출력 주기                     |
| 페이로드  | `point_stride`, `point_fields`, `aggregate_stride`, `aggregate_fields` | 점별 3축과 손가락 합력을 별도 채널로 취급 |
| 수치 해석 | 필드별 `type`, `offset`, `scale`, `unit`                               | N과 정규화 출력을 혼동하지 않기           |
| 공간 배치 | `positions`, `point_rpy`, `base_xyz`, `base_rpy`                       | 감지점 위치와 각 점의 힘 축               |
| 합력 좌표 | `aggregate_xyz`, `aggregate_rpy`                                       | 합력 좌표축과 고정된 기준 작용점          |
| 동기화    | `header`, `digest`, `info_digest`                                      | 시간·순서·메타데이터 일치 여부            |

표의 필드 정의: 공식 촉각 계약 [1], 공식 디코딩 예제 [3]. 아래 의사식은 이 계약을 설명하기 위해 다시 작성했다.

```text
프레임 길이 = point_count × point_stride + aggregate_stride
값 = little-endian으로 type·offset에 맞춰 해석한 원시값 × scale
```

공식 예제의 점별 디코더는 각 점의 시작 위치에 필드 offset을 더해 읽고, 마지막 별도 영역에서 합력과 온도를 읽는다. **점별 값의 단순 합이 펌웨어 합력과 언제나 일치한다고 가정하면 안 된다.** 축이 다르면 회전부터 필요하고, 내부 집계·교정 방식도 별도로 확인해야 한다. [[3]](#r3)

### 1.2 같은 fx/fy/fz라도 단위가 다를 수 있다

| 채널                        | 공식 명세                              | 주의할 경계                                                        |
| --------------------------- | -------------------------------------- | ------------------------------------------------------------------ |
| 점별 3축                    | 엄지 40점, 나머지 각 34점. 합계 176점. | 실장치의 `point_count`를 우선한다.                                 |
| 점별 값, 펌웨어 v2.4.0 이전 | 힘 단위 N                              | 물리적 측정 상한은 여기서 확정하지 않는다.                         |
| 점별 값, v2.4.0 이상        | 법선축 fz: 0…1<br>접선축 fx/fy: −1…1   | full-scale 대비 정규화, 범위 밖 포화. 1을 1 N으로 해석하지 않는다. |
| 손가락별 합력               | 3축, N                                 | 5개 손가락이면 15개 힘 값. 점별 정규화와 별개다.                   |
| 온도·주기                   | 온도 °C, 문서상 native 100 Hz          | 프레임 도착 시각과 장치 측정 시각을 구분한다.                      |

점 수·주기 및 축 정의 [1,3], 펌웨어별 단위 변경 [4,5]. 손 하드웨어 버전 “2.2”와 펌웨어 버전 “v2.4.0”은 다른 버전 체계다.

**정규화 값을 N으로 바꾸는 데 빠진 정보가 있다.** `scale`은 원시 필드를 선언된 단위로 해석하는 계수다. 그 단위가 `normalized`라면 이것만으로 N이 되지 않는다. 축별 full-scale 또는 실측 교정 함수가 추가로 필요하다. 현재 시뮬레이션은 그 숫자를 추정해 넣지 않고 N을 유지한다.

<span id="port"></span>

## 02. 하드웨어 정보를 시뮬레이션에 이식한다

이식 대상은 외형만이 아니다. **어디에서, 어느 축으로, 어떤 단위로, 얼마나 자주 읽는가**를 함께 옮겨야 한다. 아래는 실물 메타데이터를 확보했을 때 적용할 좌표 변환이다. 이 프로젝트의 합성 감지점 배치와 구분한다.

```text
R(rpy) = Rz(yaw) Ry(pitch) Rx(roll)
pᵢ(link) = R(base_rpy) pᵢ(module) + base_xyz
fᵢ(link) = R(base_rpy) R(point_rpy[i]) fᵢ(point)
F(link)  = R(base_rpy) R(aggregate_rpy) F(aggregate)
```

SDK의 위치는 m, 각도는 rad다. 프레임을 혼합하지 않도록 `tip_sensor_frame`에서 시뮬레이션 distal 프레임으로 가는 고정 변환도 모델에서 확인한다. 마운팅 필드가 일부만 있으면 임의 보완하지 않고 잘못된 메타데이터로 처리한다. 합력 기준점 `aggregate_xyz`는 고정된 패드 기하 중심이며, 매 순간 움직이는 압력 중심이나 측정된 접촉 토크가 아니다. [[1]](#r1) [[3]](#r3)

<span id="port-status"></span>

### 2.1 현재 구현에 옮겨진 것과 아직 가정인 것

| 항목                | 현재 구현                                           | 실물 일치를 위한 다음 단계                  |
| ------------------- | --------------------------------------------------- | ------------------------------------------- |
| 손과 패드 형상      | 공식 2.1 오른손 강체 본체 + 2.2 패드 외부 곡면 참조 | 대상 장치와 같은 모델 리비전·장착 변환 확인 |
| 감지점 수           | 40 + 34 × 4 = 176                                   | 장치의 점 수 확인                           |
| 감지점 좌표·순서    | 표면에서 합성한 점과 인덱스                         | 실제 `positions`·인덱스로 교체              |
| 힘 좌표계           | 손가락마다 하나의 고정 패드 프레임                  | 실물 점별·합력 축으로 각각 변환             |
| 센서 출력           | 접촉력 기반 N, 176×3 / 5×3                          | 하드웨어 교정·정규화·포화 모델 추가         |
| 공간 응답·시간 응답 | 가우시안 σ=1.5 mm, 100 Hz 기록                      | 실측 응답 폭·지연·노이즈·히스테리시스 식별  |

따라서 현재 결과는 **Wuji의 출력 형태에 맞춘 접촉력 기반 가상 촉각**이다. 실물 펌웨어나 센서 내부 역학까지 재현한 디지털 복제라고 주장하지 않는다. 공식 2.2 CAD에 패드 링크가 추가된 사실과, 현재 작업물이 2.1 본체를 사용한 사실을 구분한다. [[6]](#r6)

### 2.2 패드 생성은 측정 위치를 정하는 준비 단계다

프로젝트 README와 `build.py`를 기준으로, 2.2 STL의 바깥 +Y 곡면에서 면적 비례 후보를 만들고 2.1 충돌 표면으로 투영했다. 법선 Y 성분 >0.2, 위치 Y>0, 근위 경계 1 mm 제외 조건을 적용한 뒤 farthest-point 선택으로 40/34점을 배치했다. 각 점에는 법선과 직교하는 두 접선이 붙는다. 이 점군은 **실물 내부 taxel의 측정 좌표가 아니다.**

<figure><img src="/media/wuji-tactile-conversion/pad-render.png" width="1400" height="880" alt="직접 렌더링한 검지 패드의 정면과 사선 모습. 청록색 패드 곡면 위에 합성한 감지점 34개가 노란색으로 표시된다." loading="lazy"><figcaption>그림 1. 로컬 모델로 직접 생성한 패드 렌더링. 청록색은 2.2 참조 형상, 노란 점은 시뮬레이션 측정 위치다. Wuji 모델 자산: MIT, Copyright © 2025 Wuji Technology.</figcaption></figure>

센서용 geom은 충돌·질량을 추가하지 않는다. 기존 손 geom이 물리 충돌을 맡고, 센서 mesh는 읽을 위치와 방향을 제공한다. 노란 site는 표시 마커다. 원본 20개 관절·액추에이터 및 본체 질량·관성은 유지했다. 이후의 힘 생성은 이 준비 단계와 별개로 접촉 해에서 수행된다.

<span id="generate"></span>

## 03. MuJoCo 4.0에서 촉각 정보를 생성한다

**지원·검증 기준은 MuJoCo 4.0.0이다.** 아래 설명은 이 버전의 문서·API 및 설치된 엔진의 실행 결과에 맞춘다. 특히 native `<tactile>`의 의미를 과거 버전 설명으로 대체하지 않는다. `mj_contactForce` 자체는 4.0에서 처음 생긴 API가 아니지만, 이 구현의 센서 구성·읽기 경로·검증 대상은 4.0.0으로 한정했다.

<figure><img src="/media/wuji-tactile-conversion/pipeline-ko.svg" alt="접촉에서 깊이·속력과 힘으로 갈라지는 두 경로"><figcaption>그림 2. 직접 작성한 생성 경로. A와 B는 같은 시뮬레이션 상태를 보지만 다른 물리량을 만든다. 이 구현의 힘 이미지는 B에서 나온다.</figcaption></figure>

<span id="native"></span>

### 3.1 MuJoCo 4.0 native tactile의 정확한 출력

4.0의 `<tactile>`은 센서 mesh의 N개 정점에서 **비음수 침투 깊이와 두 접선 방향의 절댓값 미끄럼 속력**을 계산한다. 출력은 `[d₀…dₙ₋₁, |vₜ₁|₀…|vₜ₁|ₙ₋₁, |vₜ₂|₀…|vₜ₂|ₙ₋₁]`의 세 블록이다. 3축 힘이나 RGB 영상이 아니며, 점마다 세 개의 법선 벡터(법선·접선1·접선2)를 제공해야 접선 채널이 계산된다. [[7]](#r7)

검지 34점을 예로 들면 앞의 34개는 깊이(m), 다음 34개는 첫 접선의 절댓값 속력(m/s), 마지막 34개는 두 번째 접선의 절댓값 속력(m/s)이다. 접촉하지 않으면 모두 0이다. 아래 수식과 처리 순서는 원리를 설명하기 위한 표기이며, 실행 가능한 재현 코드는 아니다.

실제 코드는 센서 주소 `sensor_adr`와 점 수로 `sensordata` 구간을 읽는다. 다섯 패드는 528개 값이며, 원본 IMU 6개를 포함한 이 모델의 전체 `sensordata`는 534개다. 하드웨어의 176×3도 528개지만 **차원 수만 같고 물리량과 배열 구조는 다르다.**

엔진은 센서와 같은 weld body의 충돌에서 상대 geom을 모으고 중복을 제거한다. 각 taxel을 상대 geom 좌표로 바꿔 signed distance를 평가한다. 현 소스에서는 깊이는 상대 geom들에 대한 최대 침투량, 접선 속력은 침투한 상대 geom별 절댓값 성분의 누적이다. 따라서 접선값에 방향을 임의로 붙이거나 이를 전단력으로 읽어서는 안 된다. [[8]](#r8)

```text
dᵢ = max(0, −signed_distance(pᵢ, 상대 형상))
접촉 없음 → dᵢ = 0, |vₜ₁|ᵢ = 0, |vₜ₂|ᵢ = 0
```

위 식은 상대 형상 하나에 대한 의미다. `depth × 임의 강성`은 이번 힘 생성식이 아니다.

### 3.2 메시와 접촉해도 native 값이 0일 수 있는 이유

4.0의 native tactile이 상대 `mesh`의 signed distance를 읽으려면 컴파일 전에 `needsdf`로 SDF octree를 준비해야 한다. 준비하지 않은 상대 mesh는 tactile 평가에서 건너뛴다. 물리 충돌이 정상이라는 사실만으로 native 출력까지 정상이라고 판단할 수 없다. primitive는 해석적 거리, SDF geom은 플러그인을 사용한다. [[7]](#r7)

설정 순서는 장면을 `MjSpec`으로 읽기 → 상대 충돌 메시의 `needsdf`를 활성화하기 → 모델 컴파일하기다. 입력은 사용자가 준비한 장면과 상대 충돌 메시이며, 센서 표면만 설정하는 것으로는 충분하지 않다.

기존 `surface_contact.py`의 메시 판 실험은 이 설정을 사용한다. 반면 Foo Dog 힘 실험은 원본 19개 충돌 형상의 **해결된 접촉력**을 사용하며 native 깊이를 입력으로 삼지 않는다. Foo Dog mesh에 native용 SDF를 만들지 않았으므로, native 깊이와 힘 이미지가 함께 변해야 한다고 기대하면 안 된다. 작은 시각적 조각 무늬의 힘까지 재현되는지도 충돌 분해 형상의 해상도에 달려 있다.

<span id="forces"></span>

### 3.3 힘은 접촉 솔버의 해에서 추출한다

관절 제어 입력, 자세와 속도, 질량·관성, 중력, 마찰, 접촉 설정이 주어지면 MuJoCo가 운동 방정식과 제약을 풀어 접촉력을 계산한다. 개념적으로 다음 관계의 제약력 부분을 이용한다. 실제 해는 접촉 모델·솔버·시간 간격의 영향을 받는다. [[9]](#r9)

```text
M(q) q̈ + c(q,q̇) = τ + J(q)ᵀ λ
                                    ↑ 접촉·기타 제약의 힘
```

`mj_contactForce(model, data, contact_id, wrench)`는 특정 접촉의 힘 3개와 토크 3개를 **접촉 좌표계**에서 얻는 API다. 이 구현은 앞의 힘 성분만 사용하며, 15개 출력에 토크는 포함하지 않는다. `efc_force`를 단순히 세 개씩 잘라 읽는 대신 이 API를 사용해 접촉 제약 표현에 따른 해석을 엔진에 맡긴다. [[10]](#r10)

모든 접촉을 무조건 더하지 않는다. 먼저 `efc_address < 0`인 접촉을 제외하고, 한쪽이 해당 distal의 충돌 geom인지 확인한다. Foo Dog 실험에서는 상대 geom이 지정한 물체의 19개 충돌 형상 중 하나여야 한다. 같은 접촉 레코드를 중복 합산하지 않으며, 서로 다른 부품에서 실제로 생긴 접촉은 각각 합산한다.

| 활성 패드 판정 | 실제 구현 조건                                     |
| -------------- | -------------------------------------------------- |
| 앞면 영역      | distal 로컬 Y > 0                                  |
| 감지점 주변    | 최근접 합성 taxel까지 거리 ≤ 반경 r                |
| 방향           | 접촉 바깥 법선과 최근접 taxel 법선의 내적 ≥ 0.25   |
| 반경           | r = 0.9 × 해당 패드의 최대 최근접 점 간격 + 0.2 mm |

이 판정은 패드 활성 영역의 근사 마스크다. 실제 패드 경계와 교정 데이터로 검증해야 한다. 같은 distal의 뒷면, 손가락끼리의 접촉, 지지대 접촉을 물체용 촉각 이미지에 섞지 않기 위한 절차이며, 충돌 자체를 비활성화하는 조작은 아니다.

### 3.4 부호를 정하고 접촉 축을 패드 축으로 바꾼다

접촉의 첫 번째 geom을 G0=`contact.geom[0]`, 두 번째를 G1=`contact.geom[1]`로 표기하자. `contact.frame`의 행은 월드 좌표로 표현한 접촉 기저이며 첫 행의 법선은 G0에서 G1을 향한다. 반환된 힘을 월드로 회전한 뒤, 패드가 어느 쪽인지에 따라 부호를 맞춘다. [[10]](#r10) [[11]](#r11)

```text
C = contact.frame.reshape(3, 3)
fᴡ(on G1) = Cᵀ fᶜ
fᴡ(pad)   = +fᴡ(on G1),  패드가 G1일 때
             −fᴡ(on G1),  패드가 G0일 때
```

이제 `R`을 distal에서 월드로 가는 회전으로 두면, 현재 구현의 고정 패드 좌표는 다음과 같다. 패드의 +x는 distal +X, +y는 distal +Z, +z는 distal −Y다. 이는 **현재 코드의 약속**이며 하드웨어의 모든 taxel 축과 같다는 뜻이 아니다.

```text
A = [ 1  0  0 ]     # 각 열: 패드 축을 distal 좌표로 표현
    [ 0  0 −1 ]
    [ 0  1  0 ]

fᴾ = Aᵀ Rᵀ fᴡ(pad)
Fᴾ_finger = Σ fᴾ_contact
```

손가락 순서 `엄지 → 검지 → 중지 → 약지 → 소지`로 `[Fx,Fy,Fz]`를 펼치면 15개다. 힘의 크기는 `‖Σf‖`이며 `Σ‖f‖`와 다르다. 손가락마다 자세가 다르므로 이 15개를 그대로 더해 손 전체 힘으로 해석하지 않는다. 전체 합력이 필요하면 먼저 같은 월드 좌표계로 회전한다.

접촉 위치도 원점과 구분한다. 코드는 패드에서 상대 물체로 향하는 법선을 n으로 잡고, 접촉 중간점에서 `p_surface = contact.pos − n × contact.dist / 2`로 패드 쪽 표면 위치를 구한다. 이를 distal 로컬 좌표로 옮겨 활성 영역 판정과 공간 배분에 사용한다.

<span id="images"></span>

### 3.5 접촉력을 176개 감지점과 이미지로 배분한다

접촉 솔버의 접촉점은 실물 taxel과 일대일로 대응하지 않는다. 따라서 해에서 얻은 힘을 어느 감지점이 관찰할지 정하는 **사용자 정의 공간 응답 모델**이 필요하다. 현재는 접촉 위치 주변으로 가우시안 가중치를 주되, 세 축 합력이 보존되도록 정규화한다.

```text
rⱼ² = ‖pⱼ − p_contact‖²
Δⱼ  = rⱼ² − minₖ rₖ²
uⱼ  = exp(−Δⱼ / (2σ²)),  Δⱼ ≤ (3σ)²
      0,                  그 외
wⱼ  = uⱼ / Σₖ uₖ           (σ = 1.5 mm)
fⱼ  += wⱼ f_contact
```

위 식은 원문에 기록된 공간 응답 규칙을 수학적으로 표현한 것이다. 입력 pⱼ는 유효 표본 위치, p_contact는 패드 표면 접촉 위치, f_contact는 같은 패드 축으로 회전한 접촉력이다. 컷오프는 절대 거리 3σ가 아니라 **최소 거리 제곱을 뺀 상대 거리 제곱**을 기준으로 한다. 접촉점이 표면 표본에서 조금 벗어나도 가장 가까운 유효 점에는 가중치가 남는다. 거리도 표면을 따라 잰 geodesic이 아닌 로컬 3차원 Euclidean 거리다.

<figure><img src="/media/wuji-tactile-conversion/spatial-kernel.svg" alt="같은 0.5 N 접촉력을 서로 다른 공간 응답 폭으로 배분한 세 힘 이미지. 폭이 달라도 전체 힘 합은 각각 0.500 N이다." loading="lazy"><figcaption>그림 3. 직접 생성한 단일 접촉 예시. 같은 0.5 N을 세 가지 σ로 배분했다. 분포 모양은 달라도 합력은 유지된다. 실제 재료의 측정 결과가 아니다.</figcaption></figure>

같은 계산을 **① 기존 176점**과 **② 패드별 48행×32열의 유효 표면 픽셀**에 각각 적용한다. 이미지 격자는 STL에서 별도로 샘플링한 곡면 좌표이고, 176점 이미지를 단순 확대하는 방식이 아니다. 유효 영역 밖은 마스크 처리한다. 다섯 패드의 유효 픽셀 수는 1208 / 1111 / 1111 / 1111 / 1098개다.

```text
Σ_pixel f_pixel = Σ_taxel f_taxel = F_finger     (세 축 각각)
```

이 등식은 **벡터 힘의 합**을 보존한다. 분배 후 모멘트, 연속체 압력장, 실물 센서의 점별 출력까지 보존한다고 주장하지 않는다. 면적 가중 적분이나 FEM 탄성 해석도 아니다. 이미지 단위는 **N/픽셀**이고, 압력(Pa)을 얻으려면 실제 표면 면적과 법선 성분에 대한 별도 모델이 필요하다.

<figure><img src="/media/wuji-tactile-conversion/force-maps.svg" alt="9초 시점의 다섯 패드 Fz 힘 이미지와 각 이미지의 합력. 고정 색 범위는 -0.01부터 +0.01 N/픽셀이다." loading="lazy"><figcaption>그림 4. Foo Dog 실험의 9초 출력으로 직접 그린 Fz 지도. 색은 픽셀에 배분된 힘, 제목의 값은 패드 전체 Fz 합이다. 로컬 고정 Fz와 곡면 각 점의 법선은 동일한 개념이 아니다.</figcaption></figure>

<span id="timing"></span>

### 3.6 언제 읽는가: 1 ms 물리 계산과 100 Hz 출력

접촉력은 센서 메타데이터를 선언했다고 생기지 않는다. 현재 상태에서 충돌 검사와 제약 계산까지 실행되어야 한다. native tactile은 엔진의 속도 단계에서 계산하지만, 이번 힘 출력에는 제약 솔버의 결과가 필요하다. 위치 단계만 갱신하고 접촉력을 읽으면 충분하지 않다. 현재 데모는 1 ms 간격으로 물리를 10회 진행하고 `mj_forward`를 한 번 호출한 다음 읽는다. 이는 적분 후의 자세와 접촉·힘을 같은 시점으로 맞추기 위한 처리다. `mj_forward`는 시간을 전진시키지 않는다. [[8]](#r8) [[10]](#r10)

처리 순서는 다음과 같다. 입력은 손·물체의 모델, 현재 상태, 관절 목표와 1 ms 시간 간격이다.

1. 관절 목표를 갱신하고 `mj_step`으로 물리를 한 번 진행하는 동작을 10회 반복한다.
2. `mj_forward`로 적분 후 상태의 접촉과 제약력을 갱신한다.
3. 유효 접촉의 힘을 읽고, 부호·좌표 변환 후 감지점과 픽셀에 배분한다.
4. 합력과 분포를 현재 시뮬레이션 시간과 함께 기록한다.

이 순서는 설명용이며 제어기나 비공개 변환 함수의 소스를 포함하지 않는다.

**4.0 전용 설정 주의.** 원본 XML의 `interval=".01"`에는 `nsample`이 없고, 실제 컴파일된 `sensor_history`도 0이다. 이 경우 엔진은 센서를 직접 계산하므로 `interval` 하나로 100 Hz가 보장되지 않는다. native 센서 자체의 주기 제한에는 이력 버퍼가 필요하다. 현재 힘 데모는 `interval=0`으로 두고 위의 읽기 루프로 100 Hz를 만든다. [[8]](#r8) [[12]](#r12)

native tactile을 별도로 주기 갱신하려면, 이미 정의된 센서 geom과 측정 mesh를 참조하는 `<tactile>`에 `nsample="2"`, `interval=".01"`을 함께 지정하는 구성을 고려할 수 있다. 이는 MuJoCo 4.0.0의 공개 설정을 설명한 것이며, 전체 장면을 포함한 실행 예제는 아니다.

100 Hz 기록은 여기서는 10 ms마다 한 번 읽는 샘플링이다. 실물 센서의 저역통과 필터나 10 ms 적분 평균을 구현했다는 뜻은 아니다. 동일한 주파수여도 지연·대역폭·프레임 드롭까지 일치해야 시간적 Sim-to-Real 차이가 줄어든다.

### 3.7 4.0에 맞춘 부분을 버전별 의미와 함께 정리한다

| 구현 지점          | MuJoCo 4.0.0 기준                                                              | 잘못된 해석                                              |
| ------------------ | ------------------------------------------------------------------------------ | -------------------------------------------------------- |
| native tactile     | 깊이(m), 두 절댓값 접선 속력(m/s)                                              | 세 채널을 Fx/Fy/Fz라고 읽기                              |
| 과거 설명과의 차이 | 3.3.5 문서의 penetration-pressure 함수 설명을 4.0에 적용하지 않음 [[13]](#r13) | 이전 문서의 비선형 값을 현재 깊이에 적용하기             |
| 센서 표면과 충돌   | 같은 weld body의 충돌로 비충돌 센서 geom 활성화                                | 센서 geom에도 충돌을 켜 이중 접촉 만들기                 |
| 상대 mesh 거리     | `MjSpec`에서 `needsdf` 후 컴파일                                               | 시각 mesh가 있으면 native 값도 자동 생성된다고 가정      |
| native 주기        | `interval`과 `nsample` 조건 확인                                               | XML의 .01만 보고 100 Hz로 단정                           |
| 사용자 정의 힘     | `mj_contactForce` → 부호·회전·합산·배분                                        | 4.0 native tactile이 이 힘 이미지를 직접 반환한다고 설명 |

<span id="results"></span>

### 3.8 생성된 촉각 값으로 점진 가압을 검증한다

Wooden Foo Dog의 몸통을 엄지와 나머지 네 손가락이 마주 보며 누르게 했다. 물체 크기는 약 57×93×103 mm이며 16개 볼록 메시와 3개 박스의 원본 충돌 형상을 사용한다. 물체는 고정 지지 조건이다. 손목을 옮기고 기울여 패드 높이를 맞춘 뒤, **측정된 합력 크기를 피드백해 관절 목표를 조정**한다. 힘 출력에 배율을 곱해 목표를 만들어내는 방식이 아니다.

<figure><video width="1280" height="889" controls="" playsinline="" preload="metadata" poster="/media/wuji-tactile-conversion/foo-dog-ramp.png" aria-label="미접촉에서 시작해 다섯 패드의 힘을 0.5 N까지 높이고 해제하는 13초 시뮬레이션 영상"><source src="/media/wuji-tactile-conversion/foo-dog-ramp.mp4" type="video/mp4">이 브라우저에서는 영상 재생을 지원하지 않습니다. <a href="/media/wuji-tactile-conversion/foo-dog-ramp.mp4">MP4 내려받기</a></video><figcaption>영상 1. 직접 생성한 MuJoCo 시뮬레이션. 0–3초 접근·약한 접촉, 3–7초 목표 0.05→0.50 N 증가, 7–10.5초 유지, 이후 해제. Foo Dog는 프로젝트 소유자가 공개 이용을 확인한 자산이다. 무음 영상이며, 단계와 힘 값은 화면에 표시된다.</figcaption></figure>

<figure><img src="/media/wuji-tactile-conversion/force-timeline.svg" alt="13초 동안의 손가락별 합력 곡선. 처음 0 N에서 시작해 약한 접촉 후 0.5 N까지 증가하고 마지막에 0으로 복귀한다. 아래 그래프는 몸통 접촉의 월드 Z 높이이다." loading="lazy"><figcaption>그림 5. 저장된 100 Hz 원본으로 직접 작성한 그래프. 색 선은 실제 접촉력, 점선은 목표다. 접촉 형성 시 과도응답과 램프 구간의 추종 지연을 제거하지 않았다. 높이는 합력 크기가 0.05 N보다 큰 구간만 표시했다.</figcaption></figure>

| 유지 구간 지표            | 원문 보고값 |
| ------------------------- | ----------- |
| 동시 접촉                 | 5 / 5       |
| 0.5 N 목표 대비 최대 오차 | 0.000615 N  |
| 패드 중심 최대 높이 차이  | 5.80 mm     |

검증 구간은 8–10.3초다. 접촉 중심 높이 차이는 최대 6.70 mm, 엄지와 다른 손가락의 접촉 법선 대향각은 최소 120.59°였다. 이는 고정 물체와 특정 자세에서의 결과이며 범용 파지 성공률이나 실물 정확도가 아니다. 힘으로 가중한 접촉 위치 평균도 진정한 압력 중심과 구별한다.

### 저장된 값 직접 살펴보기

아래 그림은 물리 시뮬레이션을 브라우저에서 다시 실행하지 않는다. 위 실험의 저장 프레임을 보여준다. 표시 범위를 고정해 접촉력 증가를 비교할 수 있다.

<div data-tactile-explorer data-locale="ko">
<p role="status">저장 프레임을 불러오는 중…</p>
<fieldset hidden style="border:0;padding:0;min-width:0">
<legend>기록된 힘 지도</legend>
<div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center">
<label>축 <select aria-label="힘 성분" style="color:#172c3b;background:#fff;padding:.25rem"><option value="0">Fx</option><option value="1">Fy</option><option value="2" selected>Fz</option></select></label>
<label style="display:flex;gap:.5rem;align-items:center">시점 <input type="range" min="0" max="9" value="7" step="1" aria-label="저장 프레임"></label>
<output aria-live="polite">9.00 s</output>
</div>
<div style="overflow-x:auto"><canvas width="1000" height="390" style="display:block;width:100%;min-width:600px;height:auto" aria-label="다섯 패드 힘 지도. 아래 표에 수치 표시"></canvas></div>
<table><thead><tr><th>손가락</th><th>Fx (N)</th><th>Fy (N)</th><th>Fz (N)</th><th>합력 크기 (N)</th></tr></thead><tbody></tbody></table>
</fieldset>
<p>색 범위 ±0.01 N/픽셀 · 빨강 + / 파랑 − · 밝은 영역은 센서 마스크 밖. 표는 픽셀 합력이다.</p>
</div>
<script type="module" src="/media/wuji-tactile-conversion/explorer.js"></script>

<noscript>JavaScript가 꺼져 있으면 시점 선택이 동작하지 않습니다. 위 정적 그래프·영상과 아래 CSV로 동일한 실험을 확인할 수 있습니다.</noscript>

### 3.9 숫자 범위와 검증이 말해주는 것

| 출력           | 형태·단위           | 범위의 의미                                            |
| -------------- | ------------------- | ------------------------------------------------------ |
| 합력           | 5×3, N              | 현재 코드에서 강제 상·하한 없음. 부호 유지.            |
| 가상 감지점 힘 | 176×3, N            | 접촉력을 분배한 결과. 실물 ADC나 정규화 SDK 값이 아님. |
| 힘 이미지      | 5×3×48×32, N/픽셀   | 색상만 ±0.01에서 포화. 저장 값은 자르지 않음.          |
| 가압 목표      | 손가락별 ‖F‖=0.50 N | 실험 목표. 센서 full-scale이나 액추에이터 한계가 아님. |

예를 들어 이번 실행의 엄지 Fx는 약 −0.00295…+0.14030 N, 검지 Fx는 −0.13559…+0.00000162 N이었다. 이는 특정 동작에서의 관측 범위다. 하드웨어의 측정 가능 범위를 추정하는 근거로 쓰지 않는다. [전체 15축 관측 범위](/media/wuji-tactile-conversion/range.json)와 [100 Hz CSV](/media/wuji-tactile-conversion/force15.csv)를 함께 제공한다.

원문이 보고한 17개 검사에서는 초기 미접촉·점진 가압·대향 접촉·해제, 좌표 회전 및 geom 순서에 따른 부호, 픽셀·감지점의 힘 합 보존을 확인했다. native `sensordata`를 0으로 바꾸어도 힘 출력이 유지되고, 접촉 제약력을 0으로 바꾸면 힘 출력도 사라지는 검사로 두 경로의 독립성도 확인했다. [가압 검증 수치](/media/wuji-tactile-conversion/validation.json)

<figure><video width="1280" height="889" controls="" playsinline="" preload="metadata" poster="/media/wuji-tactile-conversion/block-lift.png" aria-label="엄지와 검지가 자유 블록을 들어 올리고 내려놓는 11초 시뮬레이션"><source src="/media/wuji-tactile-conversion/block-lift.mp4" type="video/mp4"><a href="/media/wuji-tactile-conversion/block-lift.mp4">블록 상승 MP4 내려받기</a></video><figcaption>영상 2. 직접 생성한 별도 물리 검증. 30 g 자유 블록을 약 79.87 mm 들어 올렸다. 공중 유지 중 손의 월드 수직 지지력은 0.2943 N으로 무게와 일치했고 받침대 힘은 0이었다. 이 실험은 엄지·검지 두 패드이며, 위의 다섯 패드 고정 물체 실험과 혼동하지 않는다. <a href="/media/wuji-tactile-conversion/block-validation.json">검증 결과</a></figcaption></figure>

<span id="next"></span>

## 실물과 맞추려면 무엇이 더 필요한가

이 파이프라인은 데이터 형식을 연결하고 물리적으로 일관된 힘을 만든다. 실물 일치는 아직 별도 과제다. 다음 순서로 가정을 측정값으로 바꾸는 것이 핵심이다.

- **데이터 계약 확정.** 실제 장치의 info와 프레임을 함께 기록한다. 단위·full-scale·인덱스·시간·교정 상태를 고정하고, 펌웨어 변경 후 다시 확인한다. 최신 API의 `calibrate_fingertip()`는 영점 보정이며 전체 힘 교정과 다르다. [[1]](#r1)

- **공간 대응.** 합성한 176점 대신 실제 위치를 사용하고, 점별 축과 합력 축을 각각 대응시킨다. 곡면 법선과 고정 패드 Fz를 혼동하지 않는다.

- **힘 기준으로 동역학 식별.** 알려진 하중·전단 변위·접촉 위치에서 실물과 시뮬레이션을 비교한다. 마찰, 접촉 유연성, 관절 제어 이득을 조정한다. 깊이만 맞는 모델이 힘도 맞는다는 보장은 없다.

- **센서 관측 모델 식별.** 점하중을 이동하며 σ·비대칭 응답·축 간 간섭을 추정한다. 하중 증가/감소를 모두 측정해 히스테리시스, 온도 드리프트, 노이즈, 필터·지연·포화를 식별한다.

- **분리 검증.** 교정에 쓰지 않은 형상과 하중으로 합력 오차·접촉 위치 오차·시간 지연·포화율을 평가한다. 실물 aggregate와 시뮬레이션 15축을 같은 좌표·단위로 비교한다.

full-scale F<sub>FS</sub>를 확보한 뒤에야 하드웨어 형태의 관측값을 만들 수 있다. 예를 들어 법선 관측은 `clip(Fn/Fn_FS, 0, 1)`, 접선 관측은 `clip(Ft/Ft_FS, −1, 1)`로 표현할 수 있지만, 이는 센서 축 정렬과 교정이 완료되었다는 조건 아래의 예시다. 원본 N 출력은 별도로 남겨 포화로 잃은 정보를 추적한다. **이 관측층은 현재 코드에 구현되어 있지 않다.**

도메인 랜덤화는 측정 후 남은 불확실성 범위를 다루는 보조 수단으로 사용할 수 있다. 좌표계나 단위 오류를 임의의 노이즈로 덮는 용도로 사용하지 않는다. 관련 연구 [15]는 시각 기반 전이를 다룬 일반 배경이며, 본 Wuji 촉각 모델의 정확도를 검증한 논문은 아니다.

**이 구현에서 생성되는 값의 정체:** MuJoCo 4.0의 접촉 해에서 추출한 **힘**을, 가정한 패드 감지 영역과 공간 응답을 거쳐 표현한 것이다. 하드웨어 계약을 참조하지만 아직 하드웨어가 측정한 값과 동일하다고 주장하지 않는다.

<span id="references"></span>

## 참고 자료와 재현 근거

원문의 외부 자료 확인일: 2026-11-11. 블로그 편집 시 핵심 MuJoCo API와 Wuji 촉각 계약의 공개 출처를 재확인했다. MuJoCo 링크는 4.0.0으로 고정했다. Wuji의 latest 문서와 SDK main 예제는 변경될 수 있으므로 실제 연결 시 메타데이터가 우선이다. 외부 이미지·논문 도표·제품 사진은 사용하지 않았다.

1. <span id="r1"></span> [Wuji Docs — Wuji Hand 2 Fingertip Tactile](https://docs.wuji.tech/docs/en/wuji-sdk/latest/wuji-hand-2-tactile). 센서 구성, 메타데이터, 단위, 좌표계, 현재 API 및 영점 보정.

2. <span id="r2"></span> [Wuji Docs — Product Introduction, 2.2 Beta](https://docs.wuji.tech/docs/en/wuji-hand/latest/overview). 손 구조와 강체 모델의 범위.

3. <span id="r3"></span> [Wuji SDK — 3.fingertip_typed.py](https://github.com/wuji-technology/wuji-sdk/blob/main/examples/python/wuji_hand_2/3.fingertip_typed.py). 필드 기반 디코딩, 단위 확인, 점별·합력 좌표 변환. 코드 전재 없이 동작을 분석했다.

4. <span id="r4"></span> [Wuji Docs — Fingertip Tactile in practice](https://docs.wuji.tech/docs/en/wuji-sdk/latest/sdk-practice/hand2-fingertip). 버전별 단위와 기능 확인. 일부 예제는 과거 API명이므로 본문 API명은 [1]을 우선했다.

5. <span id="r5"></span> [Wuji SDK release notes](https://github.com/wuji-technology/wuji-sdk/releases). 펌웨어 v2.4.0부터의 점별 정규화 변경 및 구 API 폐기 예고.

6. <span id="r6"></span> [Wuji robot description](https://github.com/wuji-technology/wuji-description). 2.1/2.2 모델, 패드 형상, MIT 라이선스. 로컬 참조 커밋 `5c4dfa16917355d073e2e1d7e3d03897b6cf9508`.

7. <span id="r7"></span> [MuJoCo 4.0.0 — XML reference: tactile](https://mujoco.readthedocs.io/en/4.0.0/XMLreference.html#sensor-tactile). native 출력과 상대 mesh SDF 조건.

8. <span id="r8"></span> [MuJoCo 4.0.0 — engine_sensor.c](https://github.com/google-deepmind/mujoco/blob/4.0.0/src/engine/engine_sensor.c). taxel 계산, 상대 geom 처리, 센서 이력·주기 로직. 별도 로컬 소스 대조 커밋 `a937a4f916dc586660145973b015e56e04043377`.

9. <span id="r9"></span> [MuJoCo 4.0.0 — Computation](https://mujoco.readthedocs.io/en/4.0.0/computation/index.html). 접촉·마찰·제약 해의 의미. 이 글의 단순 운동 방정식은 설명을 위한 개념식이다.

10. <span id="r10"></span> [MuJoCo 4.0.0 — API functions](https://mujoco.readthedocs.io/en/4.0.0/APIreference/APIfunctions.html#mj-contactforce). `mj_contactForce`, `mj_step`, `mj_forward`.

11. <span id="r11"></span> [MuJoCo 4.0.0 — mjContact](https://mujoco.readthedocs.io/en/4.0.0/APIreference/APItypes.html#mjcontact). 접촉 위치·거리·기저·geom 순서. 부호 처리는 로컬 자동 검사로도 확인했다.

12. <span id="r12"></span> [MuJoCo 4.0.0 — Modeling: Sensors](https://mujoco.readthedocs.io/en/4.0.0/modeling.html#csensor). interval, nsample, delay.

13. <span id="r13"></span> [MuJoCo 3.3.5 — tactile, 비교용](https://mujoco.readthedocs.io/en/3.3.5/XMLreference.html#sensor-tactile). 과거 penetration-pressure 설명을 4.0 깊이 출력과 혼동하지 않기 위한 출처.

14. <span id="r14"></span> E. Todorov, T. Erez, Y. Tassa. [MuJoCo: A physics engine for model-based control](https://homes.cs.washington.edu/~todorov/papers/TodorovIROS12.pdf), IROS 2012. 엔진의 배경 논문이며 4.0 tactile API 명세는 [7–12]를 따른다.

15. <span id="r15"></span> J. Tobin et al. [Domain Randomization for Transferring Deep Neural Networks from Simulation to the Real World](https://arxiv.org/abs/1703.06907), IROS 2017. 시각 기반 sim-to-real의 일반 배경.

16. <span id="r16"></span> S. Wang, M. Lambeta, P.-W. Chou, R. Calandra. [TACTO: A Fast, Flexible, and Open-source Simulator for High-Resolution Vision-based Tactile Sensors](https://arxiv.org/abs/2012.08456), IEEE RA-L 7(2), 3930–3937, 2022. DOI: [10.1109/LRA.2022.3146945](https://doi.org/10.1109/LRA.2022.3146945). 광학식 촉각 시뮬레이션과의 비교 배경이다. 이 글은 TACTO나 GelSight 영상을 생성한 구현이 아니다.

### 원문에서 검토한 구현과 결과의 대응

| 파일                   | 이 글에서 검토한 역할                  |
| ---------------------- | -------------------------------------- |
| `README.md / build.py` | 모델 출처, 점군 배치, 질량·충돌 보존   |
| `tactile_force.py`     | 접촉 판정, 힘 부호, 좌표계, 15축 출력  |
| `force_image.py`       | 공간 가중치, 176점·픽셀 힘 배분과 보존 |
| `surface_contact.py`   | 곡면 격자와 native SDF 판 실험         |
| `foo_touch.py`         | 고정 물체, 몸통 대향 접촉, 점진 가압   |
| `foo_touch_viewer.py`  | 읽기 주기, 데이터·영상 저장, 검증      |

[파일 해시와 생성 이력](/media/wuji-tactile-conversion/provenance.json) · [시간별 힘·높이 데이터](/media/wuji-tactile-conversion/contact_balance.csv). 패키지는 기술 문서와 시각자료·결과 데이터를 제공하며 전체 시뮬레이터 소스 배포본은 아니다.

### 시각자료 출처 및 자산 고지

원문에 따르면 모든 도식과 그래프는 이 문서를 위해 직접 작성하거나 저장된 시뮬레이션 데이터에서 생성했다. 두 영상과 패드 이미지는 로컬 MuJoCo 모델을 직접 렌더링한 결과다. Wuji 형상은 Wuji Technology의 MIT 모델 자산을 사용했으며 [원문 라이선스](/media/wuji-tactile-conversion/LICENSE.wuji.txt)를 동봉한다. Foo Dog 형상은 프로젝트 소유자가 외부 사용 권한을 확인했다. 이 문서 패키지는 원본 Foo Dog 모델 파일을 재배포하지 않는다.
