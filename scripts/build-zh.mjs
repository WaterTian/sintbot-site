#!/usr/bin/env node
// Renders the page's static text from the translations table in app.js — the one place copy lives —
// and derives everything that must say the same thing:
//
//   index.html     English body text, <head>, JSON-LD (SoftwareApplication + FAQPage)
//   zh/index.html  the same page with Chinese body text, <head>, JSON-LD
//   llms.txt       plain-text summary + FAQ in both languages, for AI assistants
//
// Why static: share-card unfurlers (Lark, WeChat, Slack) and AI crawlers read HTML without running JS.
// app.js still switches languages in the browser exactly as before.
//
//   node scripts/build-zh.mjs          write all three files
//   node scripts/build-zh.mjs --check  exit 1 if any is out of date (pre-commit hook)
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const check = process.argv.includes("--check");
const SITE = "https://sintbot.com";

// --- translations: evaluate just the literal out of app.js (the IIFE touches the DOM) ---
const appJs = readFileSync(join(root, "app.js"), "utf8");
const version = appJs.match(/const VERSION = "[^"]*";/);
const start = appJs.indexOf("const translations = {");
const end = appJs.indexOf("\n  };\n", start);
if (!version || start < 0 || end < 0) fail("could not locate VERSION / translations in app.js");
const t = vm.runInNewContext(`${version[0]}\n${appJs.slice(start, end + 5)}\ntranslations`);
for (const k of ["meta.title", "meta.description", "meta.ogAlt"]) {
  if (!t[k] || !t[k].en || !t[k].zh) fail(`translations["${k}"] needs both en and zh`);
}
const faqIds = Object.keys(t).map((k) => k.match(/^faq\.(\d+)\.q$/)).filter(Boolean).map((m) => m[1]).sort((a, b) => a - b);

const attr = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const text = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const plain = (html) => html.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();

// --- body: fill every data-i18n* element from the table --------------------------------
// Finds the element's matching close tag by counting nested tags of the same name, so inner
// markup (<em>, <code>, nested <span>) is replaced whole — the same thing innerHTML does in app.js.
function renderBody(html, lang) {
  const out = [];
  let pos = 0;
  const open = /<([a-zA-Z][\w-]*)\b[^>]*\sdata-i18n(-html|-svg)?="([^"]+)"[^>]*>/g;
  let m;
  while ((m = open.exec(html))) {
    const [tag, name, kind, key] = m;
    const entry = t[key];
    if (!entry) fail(`index.html uses data-i18n key "${key}" that app.js does not define`);
    const value = entry[lang] != null ? entry[lang] : entry.en;
    const innerStart = m.index + tag.length;
    const close = findClose(html, name, innerStart);
    out.push(html.slice(pos, innerStart), kind === "-html" ? value : text(value));
    pos = close;
    open.lastIndex = close;
  }
  out.push(html.slice(pos));
  let result = out.join("");
  // alt attributes
  result = result.replace(/(<img\b[^>]*\salt=")[^"]*("[^>]*\sdata-i18n-alt="([^"]+)")/g, (_, a, b, key) => {
    if (!t[key]) fail(`index.html uses data-i18n-alt key "${key}" that app.js does not define`);
    return a + attr(t[key][lang] != null ? t[key][lang] : t[key].en) + b;
  });
  // which language button reads as active before JS runs
  result = result.replace(/(<button type="button" data-lang="(en|zh)" class="lang-toggle__btn)( is-active)?(")/g,
    (_, a, l, _active, q) => a + (l === lang ? " is-active" : "") + q);
  return result;
}

function findClose(html, name, from) {
  const re = new RegExp(`<(/?)${name}\\b[^>]*>`, "gi");
  re.lastIndex = from;
  let depth = 1, m;
  while ((m = re.exec(html))) {
    if (m[0].endsWith("/>")) continue;
    depth += m[1] ? -1 : 1;
    if (depth === 0) return m.index;
  }
  fail(`no closing </${name}> after offset ${from}`);
}

// --- head --------------------------------------------------------------------------------
function setOnce(html, re, value, label) {
  const hits = html.match(new RegExp(re.source, "g"));
  if (!hits || hits.length !== 1) fail(`expected exactly one ${label} in index.html, found ${hits ? hits.length : 0}`);
  return html.replace(re, (_, a, b) => a + value + b);
}

function jsonLd(lang) {
  const page = lang === "zh" ? `${SITE}/zh/` : `${SITE}/`;
  const graph = [
    {
      "@type": "SoftwareApplication",
      name: "SintBot",
      url: page,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "macOS, Windows",
      inLanguage: lang === "zh" ? "zh-CN" : "en",
      description: t["meta.description"][lang],
    },
    {
      "@type": "FAQPage",
      url: `${page}#faq`,
      inLanguage: lang === "zh" ? "zh-CN" : "en",
      mainEntity: faqIds.map((i) => ({
        "@type": "Question",
        name: plain(t[`faq.${i}.q`][lang]),
        acceptedAnswer: { "@type": "Answer", text: plain(t[`faq.${i}.a`][lang]) },
      })),
    },
  ];
  const body = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2)
    .replace(/</g, "\\u003c").split("\n").map((l) => "      " + l).join("\n");
  return `<script type="application/ld+json">\n${body}\n    </script>`;
}

function head(html, lang) {
  const zh = lang === "zh";
  const pick = (k) => t[k][lang];
  const page = zh ? `${SITE}/zh/` : `${SITE}/`;
  const banner = `${SITE}/assets/${zh ? "og-banner-zh.png" : "og-banner.png"}`;
  const meta = (attrName, key) => new RegExp(`(<meta\\s+${attrName}="${key}"\\s+content=")[^"]*(")`);
  html = setOnce(html, /(<html lang=")[^"]*(")/, zh ? "zh-CN" : "en", "<html lang>");
  html = setOnce(html, /(<title>)[^<]*(<\/title>)/, text(pick("meta.title")), "<title>");
  html = setOnce(html, meta("name", "description"), attr(pick("meta.description")), "meta description");
  html = setOnce(html, meta("property", "og:title"), attr(pick("meta.title")), "og:title");
  html = setOnce(html, meta("property", "og:description"), attr(pick("meta.description")), "og:description");
  html = setOnce(html, meta("property", "og:image:alt"), attr(pick("meta.ogAlt")), "og:image:alt");
  html = setOnce(html, meta("name", "twitter:title"), attr(pick("meta.title")), "twitter:title");
  html = setOnce(html, meta("name", "twitter:description"), attr(pick("meta.description")), "twitter:description");
  html = setOnce(html, meta("property", "og:url"), page, "og:url");
  html = setOnce(html, meta("property", "og:locale"), zh ? "zh_CN" : "en_US", "og:locale");
  html = setOnce(html, meta("property", "og:image"), banner, "og:image");
  html = setOnce(html, meta("name", "twitter:image"), banner, "twitter:image");
  html = setOnce(html, /(<link rel="canonical" href=")[^"]*(")/, page, "canonical");
  const ld = html.match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g);
  if (!ld || ld.length !== 1) fail(`expected exactly one JSON-LD block in index.html, found ${ld ? ld.length : 0}`);
  return html.replace(ld[0], jsonLd(lang));
}

// --- llms.txt ----------------------------------------------------------------------------
function llms() {
  const faq = (lang) => faqIds.map((i) => `### ${plain(t[`faq.${i}.q`][lang])}\n\n${plain(t[`faq.${i}.a`][lang])}`).join("\n\n");
  return `# SintBot

> ${t["meta.description"].en}

Generated from ${SITE}/ by scripts/build-zh.mjs — the same facts as the page.

## Pages

- [SintBot (English)](${SITE}/): what it does, platforms, models, design toolchain, governance, console, reliability
- [SintBot（中文）](${SITE}/zh/): 同一页面的中文版
- [Terms of Service](${SITE}/terms.html): licensing of sintbot and cc-bot, subscription terms
- [Privacy Policy](${SITE}/privacy.html): what the site and the software do and do not send
- [cc-bot on GitHub](https://github.com/WaterTian/cc-bot): the free, MIT-licensed Claude Code plugin

## FAQ

${faq("en")}

## 中文

> ${t["meta.description"].zh}

## 常见问题

${faq("zh")}
`;
}

// --- write / check -----------------------------------------------------------------------
const MARK = "<!-- GENERATED from /index.html by scripts/build-zh.mjs — edit index.html / app.js, then run the script -->";
const src = readFileSync(join(root, "index.html"), "utf8");
const en = renderBody(head(src, "en"), "en");
const zh = renderBody(head(src, "zh"), "zh").replace("<head>", `<head>\n    ${MARK}`);

const targets = [["index.html", en], [join("zh", "index.html"), zh], ["llms.txt", llms()]];
if (check) {
  const stale = targets.filter(([f, want]) => !existsSync(join(root, f)) || readFileSync(join(root, f), "utf8") !== want).map(([f]) => f);
  if (stale.length) fail(`out of date: ${stale.join(", ")} — run: node scripts/build-zh.mjs`);
  console.log("build-zh: up to date");
} else {
  mkdirSync(join(root, "zh"), { recursive: true });
  for (const [f, content] of targets) writeFileSync(join(root, f), content);
  console.log(`build-zh: wrote index.html, zh/index.html, llms.txt (${faqIds.length} FAQ entries)`);
}

function fail(msg) { console.error(`build-zh: ${msg}`); process.exit(1); }
