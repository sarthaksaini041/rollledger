# RollLedger

A static label roll inventory calculator and print-run planner for print shops and shipping desks.

## Build

Run `npm run build` with Node.js. Vercel serves the generated `dist/` directory and maps clean URLs to the static HTML files. On another host, configure extensionless HTML routes, set `SITE_ORIGIN` to the production origin and rebuild. The build otherwise uses Vercel’s production host or the current public domain.

Set `GOOGLE_SITE_VERIFICATION` to the Google Search Console HTML tag's content value if you use HTML tag verification. It is emitted on the production homepage only. Submit `/sitemap.xml` from the verified URL-prefix property. Vercel preview builds set noindex and disallow crawlers.

The tools use no runtime packages, analytics, data service or third-party script. Edit guide content in `src/guides.mjs`, calculator pages in `src/pages.mjs`, form defaults in `src/forms.mjs` and shared logic in `src/calculations.mjs`.

## Preparing for AdSense review

1. Attach the final public hostname and set `SITE_ORIGIN` to it. Check that the site is accessible without a login, that the production homepage and sitemap use the final hostname, and that the Vercel plan permits commercial use before serving ads.
2. Add the final site in your AdSense account. Set the production variable `ADSENSE_PUBLISHER_ID` to the exact `pub-` ID shown in that account and redeploy. The build publishes the authorized Google seller record at `/ads.txt` and the account verification tag on the homepage. These verification files do not request or serve ads.
3. Verify ownership and request review in AdSense. Wait for the site to show **Ready**. Configure Privacy & Messaging and applicable privacy controls, including a Google-certified CMP where required. Update the live privacy page for the actual ad provider, its data usage, and users’ choices before adding the ad script.
4. Start with a single labeled display placement in the article or guide body, separated from navigation, calculators, results, CSV export, and forms. Keep ads off the privacy, contact, and error pages. Check that mobile layouts keep controls visible, ad space stays visually distinct, and content remains the main purpose of the page.
5. Use normal organic traffic, never incentivize any clicks, and monitor Policy Center and traffic sources after launch.

See [AdSense site review](https://support.google.com/adsense/answer/7584263), [publisher policies](https://support.google.com/admanager/answer/10502938), [ad placement](https://support.google.com/adsense/answer/1346295), [consent requirements](https://support.google.com/adsense/answer/13554116), and [Vercel’s terms](https://vercel.com/legal/terms).
