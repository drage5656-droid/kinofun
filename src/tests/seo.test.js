import assert from "node:assert/strict";
import test from "node:test";
import { ITEMS, SITE } from "../data.js";
import { getSeoMetadata, seoRoutes, seoSiteUrl } from "../src/seo.js";

test("public pages have canonical metadata", () => {
  assert.equal(seoRoutes.length, 5);
  assert.equal(getSeoMetadata("/").canonical, `${seoSiteUrl}/`);
  assert.equal(getSeoMetadata("/cartoons.html").robots, "index,follow");
  assert.match(getSeoMetadata("/faq.html").description, /KinoFun/);
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
