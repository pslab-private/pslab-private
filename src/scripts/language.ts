import { getHomeLocale } from "@/i18n/locale";

// Explicit language URLs stay shareable. Only the entry home selects a default.
if (window.location.pathname === "/") {
  let preferred = new URLSearchParams(window.location.search).get("lang");
  try {
    if (preferred !== "ko" && preferred !== "en")
      preferred = localStorage.getItem("language");
  } catch {
    // Language links still work when browser storage is unavailable.
  }
  const locale = getHomeLocale(
    preferred,
    navigator.languages ?? [navigator.language]
  );
  if (locale === "en") {
    window.location.replace(
      `/en/${window.location.search}${window.location.hash}`
    );
  }
}

document.addEventListener("click", event => {
  const link = (event.target as Element).closest<HTMLAnchorElement>(
    "a[data-language]"
  );
  if (
    !link ||
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  )
    return;
  let storageUnavailable = false;
  try {
    localStorage.setItem("language", link.dataset.language!);
    sessionStorage.removeItem("backUrl");
  } catch {
    storageUnavailable = true;
  }
  const target = new URL(link.href);
  target.search = window.location.search;
  target.searchParams.delete("lang");
  target.hash = window.location.hash;
  if (storageUnavailable && target.pathname === "/")
    target.searchParams.set("lang", link.dataset.language!);
  link.href = target.href;
});
