import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const base = "/";
const site = "https://notes.pslab.ai";
const walk = async directory =>
  (
    await Promise.all(
      (await readdir(directory, { withFileTypes: true })).map(entry =>
        entry.isDirectory()
          ? walk(join(directory, entry.name))
          : join(directory, entry.name)
      )
    )
  ).flat();
const files = await walk("dist");
let checked = 0;
for (const path of files.filter(file => file.endsWith(".html"))) {
  const html = await readFile(path, "utf8");
  const locale = relative("dist", path).replaceAll("\\", "/").startsWith("en/")
    ? "en"
    : "ko";
  assert.match(html, new RegExp(`<html[^>]*lang="${locale}"`), path);
  assert.ok(
    html.includes('href="mailto:ask-psl@pslab.ai"'),
    `문의 링크 누락: ${path}`
  );
  for (const language of ["ko", "en"]) {
    assert.ok(
      html.includes(`hreflang="${language}"`),
      `언어 링크 누락: ${path}`
    );
  }
  assert.ok(!html.includes("발행되지 않는 초안 예시"), `초안 노출: ${path}`);
  assert.ok(!html.includes("astro-paper.pages.dev"), `템플릿 주소: ${path}`);
  assert.ok(!html.includes("/psl-tech/"), `이전 배포 경로: ${path}`);
  for (const [, value] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (value.startsWith("//")) continue;
    const url = new URL(value, `${site}${base}`);
    if (
      url.origin !== site ||
      (!value.startsWith("/") && !value.startsWith(site))
    )
      continue;
    assert.ok(
      url.pathname.startsWith(base),
      `하위 경로 누락: ${value} (${path})`
    );
    const relative = decodeURIComponent(url.pathname.slice(base.length));
    const target = join("dist", relative);
    const entry = await stat(target).catch(() => null);
    assert.ok(entry, `깨진 링크: ${value} (${path})`);
    if (entry.isDirectory()) await stat(join(target, "index.html"));
    checked++;
  }
}
for (const name of ["rss.xml", "en/rss.xml", "sitemap-0.xml"]) {
  const xml = await readFile(join("dist", name), "utf8");
  assert.ok(!xml.includes("example-draft"), `${name}에 초안 노출`);
  assert.ok(xml.includes(`${site}${base}`), `${name} 주소 오류`);
  assert.ok(
    !xml.includes(`${site}/psl-tech/`),
    `${name}에 이전 배포 경로 포함`
  );
}
assert.ok(
  !files.some(file => /example-draft/.test(file)),
  "초안 파일이 배포 결과에 포함됨"
);
await stat("dist/pagefind/pagefind.js");
await stat("dist/og.png");
await stat("dist/en/og.png");
const koreanFeed = await readFile("dist/rss.xml", "utf8");
const englishFeed = await readFile("dist/en/rss.xml", "utf8");
assert.ok(
  !koreanFeed.includes(site + "/en/posts/"),
  "한국어 RSS에 영어 글 포함"
);
assert.ok(englishFeed.includes(site + "/en/posts/"), "영어 RSS에 영어 글 누락");
console.log(
  `검증 완료: HTML 언어, 내부 링크 ${checked}개, 초안 제외, RSS·사이트맵·검색·공유 이미지`
);
