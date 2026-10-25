import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { createServer } from "vite";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ITEMS } from "../data.js";
import { getSeoMetadata, seoRoutes, seoSiteUrl } from "../src/seo.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = path.join(root, "dist");
const routeFiles = new Map([
  ["/", "index.html"],
  ["/about.html", "about.html"],
  ["/cartoons.html", "cartoons.html"],
  ["/faq.html", "faq.html"],
  ["/support.html", "support.html"],
  ["/admin.html", "admin.html"],
  ["/movie.html", "movie.html"],
]);
const server = await createServer({
  configFile: path.join(root, "vite.config.js"),
  server: { middlewareMode: true },
  appType: "custom",
});

try {
  const { default: App } = await server.ssrLoadModule("/src/App.jsx");
  const shell = await readFile(path.join(output, "index.html"), "utf8");

  async function writeRoute(file, pathname, search = "") {
    const metadata = getSeoMetadata(pathname, search);
    const url = `${pathname}${search}`;
    const markup = renderToString(createElement(App, { url }));
    const jsonLd = JSON.stringify(metadata.structuredData).replace(/</g, "\\u003c");
    let html = shell.replace('<div id="root"></div>', `<div id="root">${markup}</div>`);
    html = html
      .replaceAll("__SEO_TITLE__", () => escapeHtml(metadata.title))
      .replaceAll("__SEO_DESCRIPTION__", () => escapeHtml(metadata.description))
      .replaceAll("__SEO_ROBOTS__", metadata.robots)
      .replaceAll("__CANONICAL_URL__", () => escapeHtml(metadata.canonical))
      .replaceAll("__SEO_IMAGE__", () => escapeHtml(metadata.image))
      .replaceAll("__TWITTER_CARD__", metadata.twitterCard)
      .replace("__SEO_JSONLD__", () => jsonLd);
    if (html.includes("__SEO_") || html.includes("__CANONICAL_URL__"))
      throw new Error(`SEO placeholders were not replaced for ${url}`);
    await mkdir(path.dirname(path.join(output, file)), { recursive: true });
    await writeFile(path.join(output, file), html, "utf8");
  }

  for (const [pathname, file] of routeFiles) {
    if (pathname === "/movie.html") {
      await writeRoute(file, pathname, "?id=missing");
    } else {
      await writeRoute(file, pathname);
    }
  }

  for (const item of ITEMS) {
    const slug = encodeURIComponent(item.id);
    await writeRoute(`movie/${slug}/index.html`, `/movie/${slug}/`);
  }

  const sitemapRoutes = [
    ...seoRoutes,
    ...ITEMS.map((item) => `/movie/${encodeURIComponent(item.id)}/`),
  ];
  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...sitemapRoutes.map((route) => `  <url><loc>${seoSiteUrl}${route === "/" ? "/" : route}</loc></url>`),
    "</urlset>",
    "",
  ].join("\n");
  await writeFile(path.join(output, "sitemap.xml"), sitemap, "utf8");
  await writeFile(
    path.join(output, "robots.txt"),
    `User-agent: *\nAllow: /\nDisallow: /admin.html\nSitemap: ${seoSiteUrl}/sitemap.xml\n`,
    "utf8",
  );
} finally {
  await server.close();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
