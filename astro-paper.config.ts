import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://pslab-private.github.io/",
    title: "PSL Tech",
    description:
      "PHYSICS SiM Lab의 기술 블로그. 물리 시뮬레이션, 로봇 제어, Physical AI 학습 인프라의 구현과 검증을 기록합니다.",
    author: "PHYSICS SiM Lab",
    profile: "https://pslab.ai/",
    lang: "ko",
    timezone: "Asia/Seoul",
    dir: "ltr",
  },
  posts: { perPage: 8 },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: true,
      url: "https://github.com/pslab-private/pslab-private.github.io/edit/main/",
    },
    search: "pagefind",
    toc: true,
  },
  socials: [
    {
      name: "github",
      url: "https://github.com/pslab-private/pslab-private.github.io",
    },
    { name: "mail", url: "mailto:ask-psl@pslab.ai" },
  ],
  shareLinks: [],
});
