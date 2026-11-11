import type { UIStrings } from "../types";

export default {
  site: {
    description:
      "PHYSICS SiM Lab의 회사 블로그, PSL Notes. 기술 개발, 실험에서 배운 점, 아이디어 스케치를 기록합니다.",
    heroTitle: "만들고, 실험하고, 생각을 기록합니다.",
    heroDescription:
      "PSL Notes는 PHYSICS SiM Lab의 회사 블로그입니다. 기술 개발부터 아이디어 스케치까지, 팀이 쌓아가는 생각과 경험을 공유합니다.",
    companySummary:
      "물리 시뮬레이션과 로보틱스를 연구하며 만난 질문, 실험에서 배운 점, 다음 시도를 위한 아이디어를 남깁니다.",
    companyWebsite: "회사 홈페이지",
    footerDescription:
      "기술 개발, 실험, 아이디어를 담는 PHYSICS SiM Lab의 기록.",
    emailContact: "이메일 문의하기",
    mainMenu: "메인 메뉴",
    language: "언어 선택",
    breadcrumb: "현재 위치",
    pagination: "페이지 이동",
  },
  nav: {
    home: "홈",
    posts: "전체 글",
    tags: "태그",
    about: "소개",
    archives: "아카이브",
    search: "검색",
  },
  post: {
    publishedAt: "발행일",
    updatedAt: "수정일",
    sharePostIntro: "이 글 공유하기",
    sharePostOn: "{{platform}}에 공유하기",
    sharePostViaEmail: "이메일로 공유하기",
    tagLabel: "태그",
    backToTop: "맨 위로",
    tableOfContents: "이 글의 목차",
    goBack: "돌아가기",
    editPage: "글 수정 제안",
    previousPost: "이전 글",
    nextPost: "다음 글",
  },
  pagination: { prev: "이전", next: "다음", page: "페이지" },
  home: {
    socialLinks: "더 만나보기",
  },
  footer: {
    copyright: "Copyright",
    allRightsReserved: "생각과 경험을 나눕니다.",
  },
  pages: {
    tagTitle: "태그",
    tagDesc: "이 주제로 쌓인 기록입니다.",
    tagsTitle: "태그",
    tagsDesc: "관심 있는 주제로 기록을 찾아보세요.",
    postsTitle: "전체 글",
    postsDesc: "기술 개발부터 실험과 아이디어 스케치까지, 팀이 쌓아가는 기록.",
    archivesTitle: "아카이브",
    archivesDesc: "시간의 흐름을 따라 기록을 살펴보세요.",
    searchTitle: "검색",
    searchDesc: "궁금한 주제나 키워드로 기록을 찾아보세요.",
  },
  a11y: {
    skipToContent: "본문으로 바로가기",
    skipTableOfContents: "목차 건너뛰기",
    openMenu: "메뉴 열기",
    closeMenu: "메뉴 닫기",
    toggleTheme: "화면 테마 전환",
    searchPlaceholder: "어떤 기록을 찾으시나요?",
    noResults: "검색 결과가 없습니다.",
    goToPreviousPage: "이전 페이지",
    goToNextPage: "다음 페이지",
  },
  notFound: {
    title: "페이지를 찾을 수 없습니다",
    message: "이 기록은 아직 없거나 주소가 바뀌었어요.",
    goHome: "홈으로 돌아가기",
  },
} satisfies UIStrings;
