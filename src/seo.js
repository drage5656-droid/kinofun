import { ITEMS, SITE } from "../data.js";

const siteUrl = "https://kinofun.ru";
const pages = {
  "/": {
    title: "Каталог фильмов и мультфильмов — KinoFun",
    description:
      "Ищите фильмы и мультфильмы по названию, жанру и настроению. Описания, постеры, трейлеры и ссылки на просмотр в каталоге KinoFun.",
  },
  "/about.html": {
    title: "О проекте — KinoFun",
    description:
      "История проекта KinoFun — КиноФан, каталог фильмов и мультфильмов и команда сообщества.",
  },
  "/cartoons.html": {
    title: "Мультфильмы — KinoFun",
    description:
      "Каталог мультфильмов KinoFun: подборки по жанрам, описания, постеры и трейлеры.",
  },
  "/faq.html": {
    title: "Частые вопросы — KinoFun",
    description:
      "Ответы на вопросы о поиске фильмов, просмотре трейлеров и использовании каталога KinoFun.",
  },
  "/support.html": {
    title: "Поддержка — KinoFun",
    description:
      "Свяжитесь с KinoFun через VK или Telegram, сообщите об ошибке или предложите фильм для каталога.",
  },
  "/admin.html": {
    title: "Редактор каталога — KinoFun",
    description: "Локальный редактор материалов каталога KinoFun.",
  },
  "/movie.html": {
    title: "Фильм — KinoFun",
    description: "Описание фильма или мультфильма из каталога KinoFun.",
  },
};

export function getSeoMetadata(pathname, search = "") {
  const routeMatch = pathname.match(/^\/movie\/([^/]+)\/?$/);
  const queryId = new URLSearchParams(search).get("id");
  const movieId = routeMatch ? decodeURIComponent(routeMatch[1]) : queryId;
  const movie = movieId ? ITEMS.find((item) => item.id === movieId) : null;

  if (movie) {
    const canonical = `${siteUrl}/movie/${encodeURIComponent(movie.id)}/`;
    return {
      title: `${movie.title} — KinoFun`,
      description: movie.description,
      canonical,
      image: movie.poster?.startsWith("http") ? movie.poster : `${siteUrl}/kinofun-favicon.svg`,
      robots: "index,follow",
      twitterCard: "summary_large_image",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "Movie",
        name: movie.title,
        description: movie.description,
        genre: movie.genre,
        datePublished: String(movie.year),
        image: movie.poster?.startsWith("http") ? movie.poster : undefined,
        director: movie.team?.director
          ? { "@type": "Person", name: movie.team.director }
          : undefined,
      },
    };
  }

  const page = pages[pathname] || pages["/"];
  const isAdmin = pathname === "/admin.html";
  const canonical = `${siteUrl}${pathname === "/index.html" ? "/" : pathname}`;
  return {
    ...page,
    canonical,
    image: `${siteUrl}/kinofun-favicon.svg`,
    robots: isAdmin || pathname === "/movie.html" ? "noindex,nofollow" : "index,follow",
    twitterCard: "summary",
    structuredData: pathname === "/"
      ? {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE.name,
          url: siteUrl,
          description: page.description,
          potentialAction: {
            "@type": "SearchAction",
            target: `${siteUrl}/#catalog`,
            "query-input": "required name=search_term_string",
          },
        }
      : {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: page.title,
          description: page.description,
          url: canonical,
          isPartOf: { "@type": "WebSite", name: SITE.name, url: siteUrl },
        },
  };
}

export const seoRoutes = Object.keys(pages).filter(
  (pathname) => pathname !== "/movie.html" && pathname !== "/admin.html",
);
export const seoSiteUrl = siteUrl;
