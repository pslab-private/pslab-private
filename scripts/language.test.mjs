import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";
import { runInNewContext } from "node:vm";
import {
  getLocale,
  getContentLocale,
  getHomeLocale,
  localizePath,
} from "../src/i18n/locale.ts";

const script = stripTypeScriptTypes(
  readFileSync(
    new URL("../src/scripts/language.ts", import.meta.url),
    "utf8"
  ).replace('import { getHomeLocale } from "@/i18n/locale";', "")
);

function visit(
  pathname,
  languages,
  stored,
  blocked = false,
  search = "?q=Newton"
) {
  const redirects = [];
  const listeners = {};
  const saved = {};
  runInNewContext(script, {
    getHomeLocale,
    URL,
    URLSearchParams,
    window: {
      location: {
        pathname,
        search,
        hash: "#results",
        replace: value => redirects.push(value),
      },
    },
    navigator: { languages },
    localStorage: {
      getItem() {
        if (blocked) throw new Error("Storage blocked");
        return stored;
      },
      setItem(key, value) {
        if (blocked) throw new Error("Storage blocked");
        saved[key] = value;
      },
    },
    sessionStorage: { removeItem() {} },
    document: {
      addEventListener: (name, callback) => {
        listeners[name] = callback;
      },
    },
  });
  return { redirects, listeners, saved };
}

test("home follows browser preference, remembers manual choice, and preserves explicit URLs", () => {
  assert.deepEqual(visit("/", ["en-US", "ko-KR"], null).redirects, [
    "/en/?q=Newton#results",
  ]);
  assert.deepEqual(visit("/", ["ko-KR", "en-US"], null).redirects, []);
  assert.deepEqual(visit("/", ["en-US"], "ko").redirects, []);
  assert.deepEqual(visit("/", ["ko-KR"], "en").redirects, [
    "/en/?q=Newton#results",
  ]);
  assert.deepEqual(visit("/", ["ja-JP"], null, true).redirects, [
    "/en/?q=Newton#results",
  ]);
  assert.deepEqual(visit("/en/", ["ko-KR"], "ko").redirects, []);
  assert.deepEqual(visit("/posts/example/", ["en-US"], null).redirects, []);
  assert.equal(getHomeLocale("invalid", ["fr-FR", "KO-kr"]), "ko");
});

test("language links save choice and retain query and anchor even without storage", () => {
  for (const blocked of [false, true]) {
    const session = visit("/en/posts/example/", ["en-US"], null, blocked);
    const link = {
      href: "https://example.com/posts/example/",
      dataset: { language: "ko" },
    };
    session.listeners.click({ target: { closest: () => link }, button: 0 });
    assert.equal(
      link.href,
      "https://example.com/posts/example/?q=Newton#results"
    );
    assert.equal(session.saved.language, blocked ? undefined : "ko");
  }
  assert.equal(localizePath("/en/posts/example/", "ko"), "/posts/example/");
  assert.equal(localizePath("/posts/example/", "en"), "/en/posts/example/");
  assert.equal(getLocale("/engineering/"), "ko");
  assert.equal(getContentLocale("en/example"), "en");
});

test("manual Korean home remains accessible when browser storage is blocked", () => {
  const session = visit("/en/", ["en-US"], null, true);
  const link = { href: "https://example.com/", dataset: { language: "ko" } };
  session.listeners.click({ target: { closest: () => link }, button: 0 });
  const target = new URL(link.href);
  assert.equal(target.searchParams.get("lang"), "ko");
  assert.deepEqual(
    visit("/", ["en-US"], null, true, target.search).redirects,
    []
  );
});

test("a previous language query cannot override a new manual choice", () => {
  const session = visit("/en/", ["en-US"], null, false, "?q=Newton&lang=en");
  const link = { href: "https://example.com/", dataset: { language: "ko" } };
  session.listeners.click({ target: { closest: () => link }, button: 0 });
  assert.equal(new URL(link.href).searchParams.get("lang"), null);
  assert.equal(session.saved.language, "ko");
});
