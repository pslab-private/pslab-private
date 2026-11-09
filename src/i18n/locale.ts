export type Locale = "ko" | "en";

export function getLocale(path: string): Locale {
  return /^\/en(?:\/|$)/.test(path) ? "en" : "ko";
}

export function getContentLocale(id: string): Locale {
  return id.startsWith("en/") ? "en" : "ko";
}

export function getPreferredLocale(languages: readonly string[]): Locale {
  for (const language of languages) {
    const locale = language.toLowerCase().split("-")[0];
    if (locale === "ko" || locale === "en") return locale;
  }
  return "en";
}

export function localizePath(path: string, locale: Locale): string {
  const unprefixed = path.replace(/^\/en(?=\/|$)/, "") || "/";
  return locale === "en" ? `/en${unprefixed}` : unprefixed;
}

// Stable tag identifiers keep language switches on the same topic page.
const englishTags: Record<string, string> = {
  "물리 시뮬레이션": "Physics Simulation",
  로보틱스: "Robotics",
};

export function getTagName(tag: string, locale: string): string {
  return locale === "en" ? (englishTags[tag] ?? tag) : tag;
}

export function getHomeLocale(
  stored: string | null | undefined,
  languages: readonly string[]
): Locale {
  return stored === "ko" || stored === "en"
    ? stored
    : getPreferredLocale(languages);
}
