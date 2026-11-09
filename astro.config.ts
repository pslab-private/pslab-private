import { defineConfig, envField, svgoOptimizer } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { rehypeHeadingIds, unified } from "@astrojs/markdown-remark";
import rehypeCallouts from "rehype-callouts";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import { rehypeTableWrapper } from "./src/utils/rehypeTableWrapper";
import {
  inlineTocDeprecation,
  rehypeInlineToc,
} from "./src/utils/rehypeInlineToc";
import config from "./astro-paper.config";

export default defineConfig({
  site: config.site.url,
  base: "/",
  trailingSlash: "always",
  integrations: [
    mdx(),
    sitemap({
      filter: page =>
        config.features?.showArchives !== false || !/\/archives\/?$/.test(page),
    }),
    inlineTocDeprecation(),
    {
      name: "english-pages",
      hooks: {
        "astro:config:setup": ({ injectRoute }) => {
          // Both languages share templates; content is selected by routePattern.
          for (const [pattern, entrypoint] of [
            ["/", "index.astro"],
            ["/about", "about.astro"],
            ["/search", "search.astro"],
            ["/404", "404.astro"],
            ["/archives", "archives/index.astro"],
            ["/tags", "tags/index.astro"],
            ["/tags/[tag]/[...page]", "tags/[tag]/[...page].astro"],
            ["/posts/[...page]", "posts/[...page].astro"],
            ["/posts/[...slug]", "posts/[...slug]/index.astro"],
            ["/posts/[...slug]/index.png", "posts/[...slug]/index.png.ts"],
            ["/rss.xml", "rss.xml.ts"],
            ["/og.png", "og.png.ts"],
          ]) {
            injectRoute({
              pattern: `/en${pattern}`,
              entrypoint: `./src/pages/${entrypoint}`,
            });
          }
        },
      },
    },
  ],
  i18n: {
    locales: ["ko", "en"],
    defaultLocale: "ko",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    // Deprecated: the theme no longer uses remark-toc or remark-collapse. They
    // stay in package.json so a customised config importing them still builds,
    // and are removed in v8.
    processor: unified({
      rehypePlugins: [
        rehypeHeadingIds,
        rehypeInlineToc,
        rehypeCallouts,
        rehypeTableWrapper,
      ],
    }),
    shikiConfig: {
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    svgOptimizer: svgoOptimizer(),
  },
});
