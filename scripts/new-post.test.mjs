import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const script = fileURLToPath(new URL("./new-post.mjs", import.meta.url));

test("새 글은 안전한 YAML 제목을 가진 초안으로 생성되고 기존 글을 덮어쓰지 않는다", () => {
  const cwd = mkdtempSync(join(tmpdir(), "psl-post-"));
  try {
    const run = (...args) =>
      spawnSync(process.execPath, [script, ...args], { cwd, encoding: "utf8" });
    const title = '한글 제목: "따옴표"\n여러 줄';
    assert.equal(run("my-first-note", title).status, 0);
    const path = join(cwd, "src/content/posts/my-first-note.md");
    const before = readFileSync(path, "utf8");
    assert.ok(before.includes(`title: ${JSON.stringify(title)}`));
    assert.ok(before.includes("draft: true"));
    assert.notEqual(run("my-first-note", "다른 제목").status, 0);
    assert.equal(readFileSync(path, "utf8"), before);
    for (const slug of [
      "../escape",
      "Uppercase",
      "a/b",
      "a\\b",
      "",
      "-bad",
      "a--b",
    ]) {
      assert.notEqual(run(slug).status, 0);
    }
    assert.equal(existsSync(join(cwd, "src/content/escape.md")), false);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});
