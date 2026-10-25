import { ITEMS, SITE } from "../data.js";

const siteUrl = "https://kinofun.onrender.com";
const pages = {
  "/": {
    title: "Каталог фильмов и мультфильмов — CinePix",
    description:
      "Ищите фильмы и мультфильмы по названию, жанру и настроению. Описания, постеры, трейлеры и ссылки на просмотр в каталоге CinePix.",
  },
  "/about.html": {
    title: "О проекте — CinePix",
    description:
      "История проекта CinePix, каталога фильмов и мультфильмов и сообщества.",
  },
  "/cartoons.html": {
    title: "Мультфильмы — CinePix",
    description:
      "Каталог мультфильмов CinePix: подборки по жанрам, описания, постеры и трейлеры.",
  },
  "/faq.html": {
    title: "Частые вопросы — CinePix",
    description:
      "Ответы на вопросы о поиске фильмов, просмотре трейлеров и использовании каталога CinePix.",
  },
  "/support.html": {
    title: "Поддержка — CinePix",
    description:
      "Свяжитесь с CinePix через VK или Telegram, сообщите об ошибке или предложите фильм для каталога.",
  },
  "/admin.html": {
    title: "Редактор каталога — CinePix",
    description: "Локальный редактор материалов каталога CinePix.",
  },
  "/movie.html": {
    title: "Фильм — CinePix",
    description: "Описание фильма или мультфильма из каталога CinePix.",
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
      title: `${movie.title} — CinePix`,
      description: movie.description,
      canonical,
      image: movie.poster?.startsWith("http") ? movie.poster : `${siteUrl}/cinepix-vk-avatar.png`,
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
    image: `${siteUrl}/cinepix-vk-avatar.png`,
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
