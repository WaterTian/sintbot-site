# SintBot — showcase site

Pure static HTML / CSS / JS — zero build tools, zero dependencies. Single page, bilingual (EN / 中), dark editorial layout.

Live at <https://sintbot.com>. Push to `main` = GitHub Pages deploys in ~seconds — there is no staging, so verify on the live URL after pushing.

SintBot's sole author is **WaterTian**. SintLab is its publisher and project studio, not an additional author.

## What the page covers

**`sintbot`** — a self-hosted daemon that binds a Feishu, Slack or WeCom group to a project and runs Claude Code or Codex headless inside it: just say what you need in the group, progress streams back, permissions and redaction are set per group, the model behind the agent is swappable (Claude / GPT / GLM / DeepSeek / MiniMax / Kimi). Feishu (the China edition; Lark is not supported yet), Slack and WeCom are all supported. It comes with a local console and a design toolchain, installs from npm (`npm i -g sintbot`), and is free; its full source code is publicly available to view and download under PolyForm Shield 1.0.0 in [`sintlab/sintbot`](https://github.com/sintlab/sintbot).

**`cc-bot`** — the companion MIT Claude Code **plugin**: it lives inside an interactive session and is bound to that session's model, with Feishu and Slack adapters ([`WaterTian/cc-bot`](https://github.com/WaterTian/cc-bot)). The page points to it in one line at the end of the setup section.

The desktop pet is a separate product line and is not mentioned on this site.

## Preview locally

Serve the directory (paths are root-absolute, so opening the file directly won't load assets):

```bash
python -m http.server 8000   # then visit http://localhost:8000/
# or:  npx --yes serve .
```

## Files

- `index.html` — the single page, in order: hero (a Feishu card and a Slack thread from the same daemon) → what it is → platforms → how it works (inline SVG flow) → models → design system → scenarios → governance → console → reliability → setup (npm in four steps, plus the cc-bot pointer) → FAQ → CTA → footer. A Lucide icon sprite is inlined at the top of `<body>`; the page uses no emoji.
- `styles.css` — raw CSS with custom properties; ink-black canvas, one copper accent, hairline cards. Fraunces (display) + Inter (UI) + JetBrains Mono (code) from Google Fonts, loaded without blocking first paint; Chinese renders in the platform font (PingFang / YaHei), nothing downloaded for it. Transitions only — nothing animates frame by frame.
- `app.js` — vanilla JS: the `translations` i18n table, IntersectionObserver reveal-on-scroll, soft cursor glow (pointer:fine only), copy-to-clipboard for the install commands, and Umami event tracking. Honors `prefers-reduced-motion`.
- `assets/` — `platforms/` (the Feishu, Slack and WeCom logos — each platform's own site icon, trademarks of their owners, used only to identify the platform; same set as the daemon's console); `favicon.svg`; `og-banner.png` (rendered from `og-banner.source.html` at 1200×630 — re-render after changing its copy); `logo.png` / `logo.svg` are retained but no longer referenced by the page.
- `privacy.html` · `terms.html` — legal pages.
- `CNAME` — GitHub Pages custom domain (`sintbot.com`); do not delete.
- `robots.txt` · `sitemap.xml` — a page's `lastmod` changes only when its visible text does; the pre-commit hook (`scripts/check-lastmod.mjs`) enforces that and checks every page is listed. After pushing, `node scripts/indexnow.mjs` pings search engines.
- `_config.yml` — keeps maintenance files (`README.md`, `CLAUDE.md`, `scripts/`, banner sources) off the live site; GitHub Pages would otherwise render Markdown as pages.
- `.github/workflows/version-check.yml` — daily check that the version shown on the page (`VERSION` in `app.js`) matches the latest `sintbot` on npm.

## i18n — EN / 中文

Bilingual via the `EN / 中` toggle. English lives at `/`, Chinese at `/zh/` — static text is generated from the `translations` table by `node scripts/build-zh.mjs` — both pages' body text, `<head>`, JSON-LD (incl. an FAQPage built from the FAQ entries) and `/llms.txt` — because share-card unfurlers and AI crawlers don't run JS, and a pre-commit hook in `.githooks/` rejects commits where it is out of date (enable once per clone: `git config core.hooksPath .githooks`); the toggle switches in place and moves the URL with `history.replaceState`. All prose carries `data-i18n` / `data-i18n-html` / `data-i18n-svg` / `data-i18n-alt` attributes; the strings live in a `translations` object in `app.js` with an `en` + `zh` for every key. Code, command names and identifiers stay English in both modes. English is the default; `/zh/` is always Chinese, and a choice is remembered in `localStorage` only after the visitor clicks the toggle; `?lang=en|zh` previews a language without saving it.

`html:lang(zh)` relaxes line-height and drops letter-tracking so CJK reads cleanly.

## Design rationale

Editorial calm — generous whitespace, oversized Fraunces display type, numbered sections, a single copper accent carrying the eye — with a grain texture, scroll-triggered reveals, a soft cursor glow, and a two-platform hero mockup showing one daemon in a Feishu card and a Slack thread. Every capability line on the page is checked against the daemon's current version before it goes up.
