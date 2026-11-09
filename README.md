# PSL Tech

AstroPaper 기반의 한국어 기술 블로그입니다. Pretendard, 반응형 화면, 다크 모드, 목차, 코드 복사, Pagefind 검색, RSS, 한글 공유 이미지를 제공합니다.

- 배포 주소: **https://pslab-private.github.io/**
- 저장소: [pslab-private.github.io](https://github.com/pslab-private/pslab-private.github.io)
- 원본 테마: [AstroPaper](https://github.com/satnaing/astro-paper) (MIT, 7.1.0 기반)
- 실행 환경: Node.js 24, pnpm 11.25.0

## 로컬에서 실행

```sh
npm install -g pnpm@11.25.0
pnpm install
pnpm dev
```

http://localhost:4321/ 에서 확인합니다. `draft: true`인 글도 로컬 개발 모드에서는 미리 볼 수 있습니다. 저장하면 화면이 갱신됩니다.

검색은 빌드한 색인을 사용합니다. 검색까지 확인하려면 다음 명령을 사용하세요.

```sh
pnpm build
pnpm preview
```

http://localhost:4321/ 에서 배포될 화면을 확인합니다. 이 모드에서는 초안이 제외됩니다. 이미 사용 중인 포트가 있으면 터미널에 출력된 주소를 확인하세요. 글을 수정한 뒤 검색 결과까지 갱신하려면 다시 빌드해야 합니다.

## 새 글 작성

```sh
pnpm new-post my-first-note "첫 번째 기술 기록"
```

`src/content/posts/my-first-note.md`에 **초안**이 생성됩니다. 주소는 영문 소문자·숫자·하이픈으로 작성합니다. 같은 파일이 있으면 덮어쓰지 않습니다.

1. 제목·요약·태그와 본문을 작성합니다.
2. `pnpm dev`를 켜고 `/posts/my-first-note/`에서 미리 봅니다.
3. `pubDatetime`을 실제 발행일로 맞추고 `draft: false`로 변경합니다.
4. `pnpm test`, `pnpm build`, `pnpm verify`로 확인합니다.
5. GitHub의 `main`에 반영하면 자동으로 배포됩니다.

자세한 Markdown 문법, 이미지, 추천 글, 초안과 날짜 설정은 **[글 작성 안내](docs/WRITING.md)**를 참고하세요.

## GitHub Pages 최초 설정

저장소에 파일을 커밋하고 GitHub에 올린 뒤, 관리자 권한으로 다음을 한 번 설정합니다.

1. 저장소 **Settings → Pages → Build and deployment**로 이동합니다.
2. **Source → GitHub Actions**를 선택합니다.
3. **Actions → Build and deploy blog → Run workflow**를 실행하거나 `main`에 새 변경을 반영합니다.
4. 성공하면 https://pslab-private.github.io/ 에서 확인합니다.

`.github/workflows/deploy.yml`은 PR에서는 검증만, `main` 변경 시에는 검증 후 배포를 수행합니다. 별도의 개인 액세스 토큰은 필요하지 않습니다. 조직의 Actions 정책이 공식 액션을 허용해야 하고, 비공개 저장소는 계정 요금제에 따라 Pages 사용이 제한될 수 있습니다. 저장소의 공개 범위는 이 설정으로 변경되지 않습니다.

위 설정 파일만으로 원격 저장소의 Pages가 활성화되지는 않습니다. GitHub에서 최초 설정을 확인한 뒤 사용하세요.

## 사이트 설정 변경

| 파일                         | 역할                                        |
| ---------------------------- | ------------------------------------------- |
| `astro-paper.config.ts`      | 이름, 설명, 작성자, GitHub 링크, 언어, 기능 |
| `astro.config.ts`            | 루트(`/`) 배포 경로, Markdown 처리          |
| `src/content/posts/`         | 글 원문                                     |
| `src/content/pages/about.md` | 소개 페이지                                 |
| `src/styles/theme.css`       | 색상과 글꼴                                 |
| `src/styles/design.css`      | 화면 구성과 한글 본문 스타일                |
| `src/i18n/lang/ko.ts`        | 한국어 UI 문구                              |
| `frontmatter.json`           | VS Code Front Matter 글 관리 설정           |

저장소 이름이나 도메인을 바꾸면 `site.url`과 Astro의 `base`를 함께 바꾸고 `scripts/verify-build.mjs`의 기준 주소도 맞추세요. 개인 대표 주소 `계정.github.io`를 사용하면 `base`는 `/`입니다.

## 확인 명령

```sh
pnpm test       # 글 생성, 경로 검증, 덮어쓰기 방지
pnpm build      # 타입 검사, 정적 페이지, 공유 이미지, 검색 색인
pnpm verify     # 내부 링크, 하위 경로, 초안 제외, RSS·사이트맵 확인
```

## 라이선스

AstroPaper 원본의 MIT 라이선스는 `LICENSE`에 보존했습니다. Pretendard는 패키지에 포함된 SIL Open Font License를 따릅니다.
