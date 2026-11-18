import { mkdir, writeFile, copyFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { pages } from "./pages.mjs";
import { guides } from "./guides.mjs";
import { fields } from "./forms.mjs";
import { calculate } from "./calculations.mjs";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const configuredOrigin = process.env.SITE_ORIGIN || (productionHost ? "https://" + productionHost : "https://rollledger-tools.vercel.app");
const parsedOrigin = new URL(configuredOrigin);
if (!["https:", "http:"].includes(parsedOrigin.protocol) || parsedOrigin.username || parsedOrigin.password ||
    parsedOrigin.pathname !== "/" || parsedOrigin.search || parsedOrigin.hash) throw new Error("Set SITE_ORIGIN to a full origin.");
const origin = parsedOrigin.origin;
const isPreview = process.env.VERCEL_ENV === "preview";
const verification = process.env.GOOGLE_SITE_VERIFICATION?.trim() || "";
const siteId = origin + "/#website";
const organizationId = origin + "/#publisher";
const byMode = Object.fromEntries(pages.map((page) => [page.mode, page]));
const escape = (s) => String(s).replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
const url = (path = "") => `/${path}`;
const brand = '<span class="brand-symbol" aria-hidden="true"><i></i><i></i><i></i></span><span>Roll<span class="brand-light">Ledger</span></span>';
const circle = (cls) => `<span class="diagram-circle ${cls}"></span>`;
const cards = {
  reference: ["Reference roll", "Use the dimensions of a matching full roll when you don’t know the stock thickness.", "R"],
  diameter: ["Roll diameter", "Calculate web length and label count when you know caliper, spacing and lanes.", "D"],
  weight: ["Roll weight", "Estimate stock on a scale using a full roll and an empty core as references.", "W"],
  run: ["Print run", "Check unopened rolls, setup labels and a job buffer against your stock.", "P"],
  fit: ["Printer fit", "Compare roll diameter and web width against limits from your manual.", "F"]
};
function header() {
  return `<a href="#main" class="skip">Skip to content</a><header class="site-head"><div class="wrap topbar"><a class="brand" href="/" aria-label="RollLedger home">${brand}</a><nav aria-label="Main navigation"><a href="/#calculator">Calculator</a><a href="/#tools">All tools</a><a href="/method">Measure</a></nav></div></header>`;
}
function footer() {
  return `<footer class="site-foot"><div class="wrap bottom"><a href="/" class="brand" aria-label="RollLedger home">${brand}</a><span>Tools for print shops and shipping desks.</span><nav aria-label="Footer"><a href="/method">Method &amp; sources</a><a href="/privacy">Privacy</a></nav></div></footer>`;
}
function layout({path = "", title, description, markup, schema = [], indexable = true, article = false, interactive = false}) {
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(title)} | RollLedger</title><meta name="description" content="${escape(description)}">
<link rel="canonical" href="${escape(origin + url(path))}"><meta name="theme-color" content="#f8f5ed">
${!indexable || isPreview ? '<meta name="robots" content="noindex, follow">' : ""}
${!path && verification && !isPreview ? `<meta name="google-site-verification" content="${escape(verification)}">` : ""}
<meta property="og:site_name" content="RollLedger"><meta property="og:locale" content="en_US">
<meta property="og:type" content="${article ? "article" : "website"}"><meta property="og:title" content="${escape(title)} | RollLedger"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${escape(origin + url(path))}">
<meta property="og:image" content="${escape(origin)}/assets/social.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:image:alt" content="RollLedger label roll calculators with a cross-section of a wound roll"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/favicon.png" type="image/png"><link rel="stylesheet" href="/assets/site.css">
${interactive ? '<script type="module" src="/assets/app.mjs"></script>' : ""}
<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@graph":schema}).replace(/</g, "\\u003c")}</script></head>
<body>${header()}<main id="main">${markup}</main>${footer()}</body></html>`;
}
function hero(page) {
  if (page) return `<section class="subhero wrap"><nav class="crumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span>${escape(page.short)}</span></nav><p class="eyebrow"><span></span>${escape(page.kicker)}</p><h1>${escape(page.heading)}</h1><p>${escape(page.sub)}</p></section>`;
  return `<section class="hero wrap">
    <div class="hero-content"><p class="eyebrow"><span></span>LABEL INVENTORY TOOLS</p><h1>Label roll<br><em>calculators</em></h1>
      <p class="lede">Estimate how many labels are left on a roll. Check printer fit and make sure your stock covers the next print run.</p>
      <div class="hero-actions"><a class="button primary" href="#calculator">Open calculator <span aria-hidden="true">↓</span></a><a class="text-link" href="#tools">Browse all tools <span aria-hidden="true">→</span></a></div></div>
    <figure class="hero-drawing"><div class="drawing-top"><span><b></b> ROLL CROSS-SECTION</span></div>
      <div class="diagram" role="img" aria-label="Concentric circles showing a full label roll, the smaller partial roll and its empty core.">
        ${circle("full-ring")}${circle("partial-ring")}${circle("winding-ring")}${circle("winding-inner")}${circle("core-ring")}
        <span class="axis horizontal"></span><span class="axis vertical"></span><span class="core-center"></span>
        <span class="callout callout-full">FULL ROLL OD</span><span class="callout callout-part">CURRENT OD</span><span class="callout callout-core">CORE OD</span>
      </div>
      <figcaption><span>Measure straight across the center.</span><span>OD = OUTSIDE DIAMETER</span></figcaption>
    </figure></section>`;
}
function breadcrumbs(name, path) {
  return {"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":origin+"/"},{"@type":"ListItem","position":2,"name":name,"item":origin+url(path)}]};
}
function resultMarkup(result) {
  return `<strong class="result-number${/^\d/.test(result.value) ? "" : " result-text"}">${escape(result.value)}</strong><p class="result-caption">${escape(result.caption)}</p>
    ${result.fraction === null ? "" : `<div class="meter" aria-hidden="true"><span style="width:${Math.min(100, Math.max(0,result.fraction*100))}%"></span></div>`}
    <dl>${result.details.map(([k,v])=>`<div><dt>${escape(k)}</dt><dd>${escape(v)}</dd></div>`).join("")}</dl><p class="result-note">${escape(result.note)}</p>`;
}
function calculator(mode) {
  const page = byMode[mode];
  const isDim = fields[mode].some((f) => f.unit === "dim");
  const isMass = mode === "weight";
  const defaultResult = calculate(mode, Object.fromEntries(fields[mode].map((f)=>[f.key,f.value])));
  return `<section class="calc-section wrap" id="calculator"><div class="section-intro"><div><h2>${mode === "reference" ? "Estimate labels remaining" : escape(page.short)}</h2></div><a class="text-link guidance" href="/method">How to measure <span aria-hidden="true">→</span></a></div>
    <div class="calc-shell"><nav class="mode-switch" aria-label="Calculation modes">${pages.map((p)=>`<a href="${url(p.path)}#calculator" ${p.mode === mode ? 'aria-current="page"' : ""}>${escape(p.short)}</a>`).join("")}</nav>
      <div class="calc-body"><form data-mode="${mode}" data-planner="${url(byMode.run.path)}#calculator" novalidate>
        <div class="form-head"><div><p>${escape(page.intent)}</p></div>
        ${isDim || isMass ? `<fieldset class="units"><legend class="sr-only">${isDim ? "Measurements" : "Weights"}</legend>${(isDim ? ["mm","in"] : ["g","oz"]).map((u,i)=>`<label><input type="radio" name="units" value="${u}" ${i === 0 ? "checked" : ""}><span>${u}</span></label>`).join("")}</fieldset>` : ""}</div>
        <div class="grid-fields">${fields[mode].map((f)=>`<div class="field"><label for="f-${f.key}">${escape(f.label)}</label><div class="input-frame"><input id="f-${f.key}" name="${f.key}" type="number" step="any" min="0" inputmode="decimal" value="${f.value}" aria-describedby="hint-${f.key}" required><span data-unit="${f.unit}">${f.unit === "dim" ? "mm" : f.unit === "mass" ? "g" : f.unit}</span></div><small id="hint-${f.key}">${escape(f.hint)}</small></div>`).join("")}</div>
        <p class="form-error" id="form-error" role="alert" hidden></p><div class="form-actions"><button class="button primary" type="submit">Calculate <span aria-hidden="true">→</span></button><button type="reset" class="button tertiary">Reset example</button></div>
        <noscript><p>Enable JavaScript to calculate with your measurements. The default example is shown beside the form.</p></noscript>
      </form>
      <aside class="output" aria-label="Calculation result" tabindex="-1"><p class="output-label"><span></span> CALCULATION RESULT</p><div id="result" aria-live="polite">${resultMarkup(defaultResult)}</div>
      ${typeof defaultResult.remaining === "number" ? '<button type="button" id="transfer" class="transfer" hidden>Use count in print run <span aria-hidden="true">→</span></button>' : ""}</aside></div></div></section>`;
}
function directory(list = pages, search = false) {
  return `<section id="tools" class="tool-directory wrap"><div class="section-intro"><div><p class="eyebrow"><span></span>TOOL DIRECTORY</p><h2>${search ? "Find the right tool" : "Related calculators"}</h2></div>
  ${search ? '<div class="search-field"><label class="sr-only" for="tool-search">Search tools</label><span aria-hidden="true">⌕</span><input type="search" id="tool-search" placeholder="Search tools"></div>' : ""}</div>
  <div class="tool-grid">${list.map((p)=>{const [name,desc,letter]=cards[p.mode];return `<a class="tool-card" data-search="${escape([p.short,p.title,p.kicker,desc].join(" ").toLowerCase())}" href="${url(p.path)}"><span class="tool-icon" aria-hidden="true">${letter}</span><span class="tool-name">${escape(name)} <span aria-hidden="true">→</span></span><span class="tool-description">${escape(desc)}</span></a>`;}).join("")}</div>${search ? '<p id="tool-search-status" role="status"></p>' : ""}</section>`;
}
function detail(page) {
  return `<section class="detail wrap" aria-label="Worked example and formula">
    <div><h2>Worked example</h2><p>${escape(page.example)}</p><p>${escape(page.measuring)}</p></div>
    <div><h2>Formula and method</h2><p>${escape(page.method)}</p>
    ${page.link ? `<p><a class="text-link" href="${escape(page.link)}">${escape(page.source)} <span aria-hidden="true">→</span></a></p>` : ""}
    <details><summary>${escape(page.question)}</summary><p>${escape(page.answer)}</p></details></div></section>`;
}
function guideLinks(list = guides) {
  return `<section id="guides" class="wrap guide-list"><div class="section-intro"><h2>Label roll guides</h2></div>
    <ul>${list.map((guide) => `<li><a href="${url(guide.path)}"><strong>${escape(guide.title)}</strong><span>${escape(guide.description)}</span></a></li>`).join("")}</ul></section>`;
}
function stockMethods() {
  return `<section class="wrap overview"><h2>Choose a way to count your stock</h2>
    <dl><div><dt>Matching full roll</dt><dd><a href="${url(byMode.reference.path)}">Estimate labels remaining by reference</a> with the full and current diameters and the original label count.</dd></div>
    <div><dt>Known stock caliper</dt><dd><a href="${url(byMode.diameter.path)}">Calculate roll length from diameter</a> and convert the usable liner to complete labels.</dd></div>
    <div><dt>Scale and empty core</dt><dd><a href="${url(byMode.weight.path)}">Count labels by weight</a> using the difference between the roll and the bare core.</dd></div></dl></section>`;
}
const index = layout({
  title: "Label Roll Calculators and Print Run Planner",
  description: "Estimate labels left by diameter or weight, calculate liner length, check printer roll fit, and plan how many rolls you need for a print run.",
  markup: hero()+calculator("reference")+directory(pages,true)+stockMethods()+guideLinks(),
  interactive: true,
  schema: [
    {"@type":"WebSite","@id":siteId,"name":"RollLedger","url":origin+"/","inLanguage":"en","publisher":{"@id":organizationId}},
    {"@type":"Organization","@id":organizationId,"name":"RollLedger","url":origin+"/"},
    {"@type":"ItemList","name":"Label roll calculators","itemListElement":pages.map((p,i)=>({"@type":"ListItem","position":i+1,"name":p.title,"url":origin+url(p.path)}))}
  ]
});
function infoMarkup(title, description, content) {
  return `<article class="informational wrap"><nav class="crumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">${escape(title)}</span></nav>
    <h1>${escape(title)}</h1><p class="lede">${escape(description)}</p>${content}</article>`;
}
const privacyText = `<h2>Calculator inputs</h2><p>Calculations run in your browser. If you choose to send a label estimate to the print-run planner, the number passes between pages through session storage and is cleared after use. A query-parameter fallback is used when session storage is unavailable.</p>
<h2>Hosting and external links</h2><p>The hosting service may process ordinary request data to serve and protect the site. External sources have their own privacy policies. RollLedger uses no advertising scripts or site analytics.</p>`;

await mkdir(dist+"/assets",{recursive:true});
await writeFile(dist+"/index.html",index);
for (const page of pages) {
  const pageUrl = origin+url(page.path);
  await writeFile(dist+"/"+page.path+".html",layout({path:page.path,title:page.title,description:page.sub,interactive:true,
    markup:hero(page)+calculator(page.mode)+detail(page)+directory(page.related.map((k)=>byMode[k]))+guideLinks(),
    schema:[breadcrumbs(page.heading,page.path),{"@type":"WebApplication","@id":pageUrl+"#calculator","name":page.title,"url":pageUrl,"description":page.sub,"applicationCategory":"UtilitiesApplication","operatingSystem":"Any","browserRequirements":"Requires JavaScript for interactive calculations","isAccessibleForFree":true,"offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}}]}));
}
for (const guide of guides) {
  const {path,title,description,sections,sources,tools} = guide;
  const body = sections.map(([heading,copy])=>`<h2>${escape(heading)}</h2><p>${escape(copy)}</p>`).join("");
  const references = sources.length ? `<h2>Sources</h2><ul>${sources.map(([name,href])=>`<li><a href="${escape(href)}">${escape(name)}</a></li>`).join("")}</ul>` : "";
  await writeFile(dist+"/"+path+".html",layout({path,title,description,article:true,
    markup:infoMarkup(title,description,body+references)+directory(tools.map((k)=>byMode[k]))+guideLinks(guides.filter((g)=>g.path!==path)),
    schema:[breadcrumbs(title,path),{"@type":"TechArticle","headline":title,"description":description,"url":origin+url(path),"mainEntityOfPage":origin+url(path),"inLanguage":"en","publisher":{"@type":"Organization","name":"RollLedger","url":origin+"/"},"citation":sources.map(([,href])=>href)}]}));
}
const privacyDescription = "How RollLedger handles calculator inputs and local browser storage.";
await writeFile(dist+"/privacy.html",layout({path:"privacy",title:"Privacy",description:privacyDescription,indexable:false,markup:infoMarkup("Privacy",privacyDescription,privacyText)}));
await writeFile(dist+"/404.html",layout({path:"404",title:"Page not found",description:"This RollLedger page could not be found.",indexable:false,markup:infoMarkup("Page not found","This page may have moved.",'<p><a class="button primary" href="/#tools">Browse calculators</a></p>')}));
const publicPaths = ["",...pages.map((p)=>p.path),...guides.map((g)=>g.path)];
await writeFile(dist+"/robots.txt",isPreview ? "User-agent: *\nDisallow: /\n" : `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
await writeFile(dist+"/sitemap.xml",`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${publicPaths.map((p)=>`  <url><loc>${escape(origin+url(p))}</loc></url>`).join("\n")}\n</urlset>\n`);
for (const f of ["calculations.mjs","app.mjs","site.css","favicon.png","social.png"]) await copyFile(new URL(f,import.meta.url), dist+"/assets/"+f);
