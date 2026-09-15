# SintBot — showcase site

Pure static HTML / CSS / JS — zero build tools, zero dependencies. Single page, bilingual (EN / 中), dark editorial layout.

Live at <https://sintbot.com>. Push to `main` = GitHub Pages deploys in ~seconds — there is no staging, so verify on the live URL after pushing.

## What the page sells

**`sintbot`** — a self-hosted daemon that binds a Lark or Slack group to a project and runs Claude Code or Codex headless inside it: just say what you need in the group, progress streams back, permissions and redaction are set per group, the model behind the agent is swappable (Claude / GPT / GLM / DeepSeek / MiniMax / Kimi). Lark and Slack are both supported; Discord is listed as planned. It ships as a package with a local console and a design toolchain. **Delivered with Pro, provided as is** — not a public download, and the subscription carries no support or update commitments.

**`cc-bot`** — the free way in: an MIT Claude Code **plugin** that lives inside an interactive session and is bound to that session's model, with Slack and Lark adapters. On `main` in [`WaterTian/cc-bot`](https://github.com/WaterTian/cc-bot). Its install walkthrough stays on the page unchanged.

The desktop pet is a separate line; the page mentions it only in the footer as "in the works".

## Preview locally

Open `index.html` in any modern browser, or serve the directory:

```bash
python -m http.server 8000   # then visit http://localhost:8000/
# or:  npx --yes serve .
```

## Files

- `index.html` — the single page, in order: hero (a Lark card and a Slack thread from the same daemon) → what it is → platforms → how it works (inline SVG flow) → models → design system → scenarios → governance → console → reliability → the cc-bot plugin and its setup steps → pricing → CTA → footer. A Lucide icon sprite is inlined at the top of `<body>`; the page uses no emoji.
- `styles.css` — raw CSS with custom properties; ink-black canvas, one copper accent, hairline cards. Fraunces (display) + Inter (UI) + JetBrains Mono (code) from Google Fonts, loaded without blocking first paint; Chinese renders in the platform font (PingFang / YaHei), nothing downloaded for it. Transitions only — nothing animates frame by frame.
- `app.js` — vanilla JS: the `translations` i18n table, IntersectionObserver reveal-on-scroll, soft cursor glow (pointer:fine only), copy-to-clipboard for the install commands and the Slack manifest, and Umami event tracking. Honors `prefers-reduced-motion`.
- `assets/` — `favicon.svg`; `og-banner.png` (rendered from `og-banner.source.html` at 1200×630 — re-render after changing its copy); `design-styles.png` (the daemon's 16 built-in styles, rendered by its own toolchain); `logo.png` / `logo.svg` are retained but no longer referenced by the page.
- `privacy.html` · `terms.html` · `thanks.html` — legal pages and the post-checkout page.
- `CNAME` — GitHub Pages custom domain (`sintbot.com`); do not delete.

## i18n — EN / 中文

Single-page bilingual via the `EN / 中` toggle in the nav — same HTML, no routing, no separate directory. All prose carries `data-i18n` / `data-i18n-html` / `data-i18n-svg` / `data-i18n-alt` attributes; the strings live in a `translations` object in `app.js` with an `en` + `zh` for every key. Code, command names and identifiers stay English in both modes. Preference persists in `localStorage`; first visit falls back to `navigator.language`; `?lang=en|zh` forces a language for screenshots.

`html[lang="zh"]` relaxes line-height and drops letter-tracking so CJK reads cleanly.

## Design rationale

Editorial calm — generous whitespace, oversized Fraunces display type, numbered sections, a single copper accent carrying the eye — with a grain texture, scroll-triggered reveals, a soft cursor glow, and a two-platform hero mockup showing one daemon in a Lark card and a Slack thread. Every capability line on the page is checked against the daemon's current version before it goes up.
