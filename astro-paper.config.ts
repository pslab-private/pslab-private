import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://pslab-private.github.io/psl-tech/",
    title: "PSL Tech",
    description:
      "직접 만들고, 깊이 이해하고, 함께 나눕니다. 개발 과정에서 배운 기술과 문제 해결의 기록.",
    author: "PSL Tech",
    profile: "https://github.com/pslab-private",
    lang: "ko",
    timezone: "Asia/Seoul",
    dir: "ltr",
  },
  posts: { perPage: 8, perIndex: 6 },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: true,
      url: "https://github.com/pslab-private/psl-tech/edit/main/",
    },
    search: "pagefind",
    toc: true,
  },
  socials: [
    { name: "github", url: "https://github.com/pslab-private/psl-tech" },
  ],
  shareLinks: [],
});
