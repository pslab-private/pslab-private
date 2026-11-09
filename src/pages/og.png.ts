import type { APIRoute } from "astro";
import { generateOgImage } from "@/utils/generateOgImage";
import config from "@/config";
import { getLocale } from "@/i18n/locale";
import { useTranslations } from "@/i18n";
export const GET: APIRoute = ({ url }) =>
  generateOgImage(
    config.site.title,
    useTranslations(getLocale(url.pathname)).site.description
  );
