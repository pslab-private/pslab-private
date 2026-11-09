import type { CollectionEntry } from "astro:content";
import { postFilter } from "./postFilter";
import { getContentLocale } from "@/i18n/locale";
import config from "@/config";

/**
 * Returns posts that are eligible to be shown to users, sorted by “last updated”
 * descending (uses `modDatetime` when present, otherwise `pubDatetime`).
 *
 * Note: filtering respects drafts and scheduled posts via `postFilter()`.
 */
export function getSortedPosts(
  posts: CollectionEntry<"posts">[],
  locale: string = config.site.lang
) {
  return posts
    .filter(post => getContentLocale(post.id) === locale)
    .filter(postFilter)
    .sort(
      (a, b) =>
        Math.floor(
          new Date(b.data.modDatetime ?? b.data.pubDatetime).getTime() / 1000
        ) -
        Math.floor(
          new Date(a.data.modDatetime ?? a.data.pubDatetime).getTime() / 1000
        )
    );
}
