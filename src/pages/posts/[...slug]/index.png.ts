import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getPostSlug } from "@/utils/getPostPaths";
import { postFilter } from "@/utils/postFilter";
import { generateOgImage } from "@/utils/generateOgImage";
import config from "@/config";

export async function getStaticPaths() {
  if (!config.features.dynamicOgImage) return [];
  return (await getCollection("posts"))
    .filter(post => postFilter(post) && !post.data.ogImage)
    .map(post => ({
      params: { slug: getPostSlug(post.id, post.filePath) },
      props: post,
    }));
}

export const GET: APIRoute = ({ props }) =>
  generateOgImage(props.data.title, props.data.description);
