import { mkdir, writeFile } from "node:fs/promises";
import { resolve, relative } from "node:path";

const [slug, title = "새로운 기술 기록", ...extra] = process.argv.slice(2);

try {
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || extra.length) {
    throw new Error('사용법: pnpm new-post <영문-소문자-주소> "글 제목"');
  }
  if (!title.trim()) throw new Error("글 제목을 입력해주세요.");
  const directory = resolve("src/content/posts");
  const target = resolve(directory, `${slug}.md`);
  const content = `---
title: ${JSON.stringify(title)}
description: "이 글에서 다룰 문제와 해결 방법을 한두 문장으로 소개합니다."
coverImage: "" # 대표 이미지 한 장을 직접 지정하세요. 이미지가 없는 글만 비워둡니다.
pubDatetime: ${new Date().toISOString()}
draft: true
---

## 문제와 배경

어떤 환경에서 무엇을 해결하려 했는지 적습니다.

## 시도와 해결

최소한의 재현 예제와 선택한 방법의 이유를 적습니다.

## 결과와 배운 점

확인한 결과, 한계, 다음에 살펴볼 내용을 남깁니다.

## 참고 자료

- [공식 문서](https://example.com)
`;
  await mkdir(directory, { recursive: true });
  await writeFile(target, content, { encoding: "utf8", flag: "wx" });
  console.log(
    `초안 생성: ${relative(process.cwd(), target)}\n미리보기: /posts/${slug}/\n대표 이미지는 coverImage에 한 장을 직접 지정하세요. 이미지가 없는 글은 비워둡니다.\n발행할 때 draft를 false로 변경하고 날짜를 확인하세요.`
  );
} catch (error) {
  console.error(
    error.code === "EEXIST"
      ? "같은 주소의 글이 이미 있습니다. 다른 주소를 사용해주세요."
      : error.message
  );
  process.exitCode = 1;
}
