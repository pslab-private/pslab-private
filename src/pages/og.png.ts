import type { APIRoute } from "astro";
import { generateOgImage } from "@/utils/generateOgImage";
import config from "@/config";
export const GET: APIRoute = () =>
  generateOgImage(config.site.title, config.site.description);
