import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getSortedPosts } from "@/utils/getSortedPosts";
import { getPostUrl } from "@/utils/getPostPaths";
import config from "@/config";

import type { APIContext } from "astro";
import { getLocale } from "@/i18n/locale";
import { useTranslations } from "@/i18n";

export async function GET({ url }: APIContext) {
  const locale = getLocale(url.pathname);
  const posts = await getCollection("posts");
  const sortedPosts = getSortedPosts(posts, locale);

  return rss({
    title: config.site.title,
    description: useTranslations(locale).site.description,
    customData: `<language>${locale}</language>`,
    site: config.site.url,
    items: sortedPosts.map(({ data, id, filePath }) => ({
      link: getPostUrl(id, filePath, locale),
      title: data.title,
      description: data.description,
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
    })),
  });
}
