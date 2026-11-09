import { getLocale } from "@/i18n/locale";
import type { GetStaticPathsOptions } from "astro";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getPostSlug } from "@/utils/getPostPaths";
import { getSortedPosts } from "@/utils/getSortedPosts";
import { generateOgImage } from "@/utils/generateOgImage";
import config from "@/config";

export async function getStaticPaths({ routePattern }: GetStaticPathsOptions) {
  if (!config.features.dynamicOgImage) return [];
  return getSortedPosts(await getCollection("posts"), getLocale(routePattern))
    .filter(post => !post.data.ogImage)
    .map(post => ({
      params: { slug: getPostSlug(post.id, post.filePath) },
      props: post,
    }));
}

export const GET: APIRoute = ({ props }) =>
  generateOgImage(props.data.title, props.data.description);
