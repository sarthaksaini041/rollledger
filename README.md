# RollLedger

A static label roll inventory calculator and print-run planner for print shops and shipping desks.

## Build

Run `npm run build` with Node.js. Vercel serves the generated `dist/` directory and maps clean URLs to the static HTML files. On another host, configure extensionless HTML routes, set `SITE_ORIGIN` to the production origin and rebuild. The build otherwise uses Vercel’s production host or the current public domain.

Set `GOOGLE_SITE_VERIFICATION` to the Google Search Console HTML tag's content value if you use HTML tag verification. It is emitted on the production homepage only. Submit `/sitemap.xml` from the verified URL-prefix property. Vercel preview builds set noindex and disallow crawlers.

The tools use no runtime packages, analytics, data service or third-party script. Edit guide content in `src/guides.mjs`, calculator pages in `src/pages.mjs`, form defaults in `src/forms.mjs` and shared logic in `src/calculations.mjs`.
