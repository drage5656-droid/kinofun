# KinoFun

The site is a React application built with Vite. Production builds pre-render the React pages as static HTML so search engines can read page content and metadata without running JavaScript.

## Run locally

1. Install Node.js 18 or later.
2. In this folder, run `npm install`.
3. Run `npm run dev` and open the local URL printed by Vite.

Opening an HTML file directly with `file://` is no longer supported.

## Build and publish

Run `npm run build`. The deployable static site is written to `dist/`, including pre-rendered pages for each catalog item, `robots.txt`, and `sitemap.xml`. Publish the contents of `dist/` to a static host and connect `kinofun.ru` to that host. Canonical URLs and the sitemap use `https://kinofun.ru`.

Run `npm run preview` to serve the production build locally.

The About page loads the community widget from VK to show current community information. Its group ID is configured as `SITE.vkGroupId` in `data.js`; no VK API token or server-side proxy is required.

## High-density screens

The decorative canvas renders at up to 2× the CSS pixel resolution. SVG branding stays sharp at any density. Catalog posters load responsively; add a full-resolution image in the editor's optional 2× poster field to provide a dedicated high-density source.

The local catalog editor is a convenience tool, not a protected admin panel. Do not publish it as a private service without adding authentication.
