import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { ITEMS, SITE } from "../../data.js";
import { getSeoMetadata, seoRoutes, seoSiteUrl } from "../seo.js";

test("public pages have canonical metadata", () => {
  assert.equal(seoRoutes.length, 5);
  assert.equal(getSeoMetadata("/").canonical, `${seoSiteUrl}/`);
  assert.equal(getSeoMetadata("/cartoons.html").robots, "index,follow");
  assert.match(getSeoMetadata("/faq.html").description, /CinePix/);
  assert.equal(getSeoMetadata("/").title, "Каталог фильмов и мультфильмов — CinePix");
  assert.equal(seoSiteUrl, "https://kinofun.onrender.com");
});

test("editor is excluded from search results", () => {
  assert.equal(getSeoMetadata("/admin.html").robots, "noindex,nofollow");
  assert.ok(!seoRoutes.includes("/admin.html"));
});

test("each catalog item has a canonical movie page and structured data", () => {
  assert.ok(ITEMS.length > 0);
  for (const item of ITEMS) {
    const route = `/movie/${encodeURIComponent(item.id)}/`;
    const metadata = getSeoMetadata(route);
    assert.ok(metadata.title.startsWith(item.title));
    assert.equal(metadata.canonical, `${seoSiteUrl}${route}`);
    assert.equal(metadata.structuredData["@type"], "Movie");
    assert.equal(metadata.structuredData.name, item.title);
  }
});

test("site name is used in structured website metadata", () => {
  assert.equal(getSeoMetadata("/").structuredData.name, SITE.name);
});

test("all catalog posters are bundled at standard and double pixel density", async () => {
  for (const item of ITEMS) {
    for (const density of ["1x", "2x"]) {
      const posterPath = `/posters/${item.id}-${density}.jpg`;
      assert.equal(item[density === "1x" ? "poster" : "poster2x"], posterPath);
      const poster = await readFile(new URL(`../../public${posterPath}`, import.meta.url));
      assert.ok(poster.byteLength > 1000, `Poster asset is empty: ${posterPath}`);
    }
  }
});

test("recent films use their own channel trailers and release status", () => {
  const expectedTrailers = {
    "play-dirty": "456239164",
    "the-uprising": "456239163",
    "fall-2-deadpoint": "456239165",
    "the-mastermind": "456239162",
    "one-night-only": "456239161",
    "the-sheep-detectives": "456239160",
  };

  for (const [id, videoId] of Object.entries(expectedTrailers)) {
    const item = ITEMS.find((entry) => entry.id === id);
    assert.ok(item, `Missing catalog item: ${id}`);
    assert.equal(item.comingSoon, true);
    assert.equal(item.links.vk, "");
    assert.equal(item.trailer, `https://vkvideo.ru/video-242325248_${videoId}`);
    assert.ok(item.poster);
  }

  const latestUpload = ITEMS.find((item) => item.id === "never-on-the-first-night");
  assert.ok(latestUpload);
  assert.equal(latestUpload.title, "Мечтать не вредно");
  assert.equal(latestUpload.details.originalTitle, "Le rêve américain");
  assert.equal(latestUpload.team.director, "Антони Марсиано");
  assert.match(latestUpload.description, /НБА/);
  assert.equal(latestUpload.year, 2026);
  assert.equal(latestUpload.links.vk, "https://vkvideo.ru/video-242325248_456239157");

  const masterplan = ITEMS.find((item) => item.id === "the-mastermind");
  assert.ok(masterplan);
  assert.equal(masterplan.details.originalTitle, "Masterplan");
  assert.equal(masterplan.team.director, "Тома Венсан");
  assert.equal(masterplan.year, 2026);
  assert.match(masterplan.description, /Мону Лизу/);
  assert.equal(SITE.stats.materials, ITEMS.length);
});
