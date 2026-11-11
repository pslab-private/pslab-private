import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://notes.pslab.ai/",
    title: "PSL Notes",
    description:
      "PHYSICS SiM Lab의 회사 블로그, PSL Notes. 기술 개발, 실험에서 배운 점, 아이디어 스케치를 기록합니다.",
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
