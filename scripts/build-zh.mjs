#!/usr/bin/env node
// Generates zh/index.html from index.html, and keeps both <head>s in sync with the
// "meta.*" entries of the translations table in app.js — the one place that copy lives.
//
// Why: share-card unfurlers (Lark, WeChat, Slack) and most crawlers read only the static
// <head>, never the JS that switches the page to Chinese. /zh/ gives Chinese a static head
// of its own; the body is the same page, switched by app.js as before.
//
//   node scripts/build-zh.mjs          write index.html + zh/index.html
//   node scripts/build-zh.mjs --check  exit 1 if either file is out of date (pre-commit hook)
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

const attr = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const text = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

function setOnce(html, re, value, label) {
  const hits = html.match(new RegExp(re.source, "g"));
  if (!hits || hits.length !== 1) fail(`expected exactly one ${label} in index.html, found ${hits ? hits.length : 0}`);
  return html.replace(re, (_, a, b) => a + value + b);
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
  return html;
}

const MARK = "<!-- GENERATED from /index.html by scripts/build-zh.mjs — edit index.html / app.js, then run the script -->";
const src = readFileSync(join(root, "index.html"), "utf8");
const en = head(src, "en");
const zh = head(src, "zh").replace("<head>", `<head>\n    ${MARK}`);

const targets = [["index.html", en], [join("zh", "index.html"), zh]];
if (check) {
  const stale = targets.filter(([f, want]) => !existsSync(join(root, f)) || readFileSync(join(root, f), "utf8") !== want).map(([f]) => f);
  if (stale.length) fail(`out of date: ${stale.join(", ")} — run: node scripts/build-zh.mjs`);
  console.log("build-zh: up to date");
} else {
  mkdirSync(join(root, "zh"), { recursive: true });
  for (const [f, content] of targets) writeFileSync(join(root, f), content);
  console.log("build-zh: wrote index.html, zh/index.html");
}

function fail(msg) { console.error(`build-zh: ${msg}`); process.exit(1); }
