# cc-bot for Slack — showcase site

Pure static HTML / CSS / JS — zero build tools. Single page, dark editorial layout, Slack-first content.

Live at <https://watertian.github.io/cc-bot-site/>.

## Preview locally

Just open `index.html` in any modern browser, or serve the parent dir with one of:

```bash
# Python (any version)
python -m http.server 8000
# then visit http://localhost:8000/website/

# Node (if you have it)
npx --yes serve .
```

## Files

- `index.html` — single-page site: Slack-led hero, "where cc-bot earns its keep" scenarios, capabilities, IMAdapter callout, architecture (with inline SVG diagram + permission matrix), Slack setup walkthrough (manifest + tokens + invite), CTA, footer.
- `styles.css` — raw CSS with custom properties; ink-black canvas, signal-orange accent, aqua-tinted Slack channel chips, Fraunces (display) + Inter (UI) + JetBrains Mono (code) loaded from Google Fonts.
- `app.js` — vanilla JS: IntersectionObserver reveal-on-scroll, soft cursor glow (pointer:fine only), copy-to-clipboard install commands and the full Slack manifest, gentle parallax on the hero marquee, smooth-scroll anchors. Honors `prefers-reduced-motion`.
- `assets/logo.png` — 512×512 PCB-styled "CC" mark, mirrored from the cc-bot repo. (`logo.svg` retained as a fallback alternative.)

## Content emphasis

The site reads as **"cc-bot for Slack"**. Lark / Feishu is mentioned as a secondary supported adapter — the same `IMAdapter` interface backs both. Hero, scenarios, setup walkthrough, and architecture diagram all lead with Slack terminology (channels, threads, Socket Mode push). Both adapters live on `main` in [`WaterTian/cc-bot`](https://github.com/WaterTian/cc-bot).

## Design rationale

Editorial calm from rouserlab — generous whitespace, oversized Fraunces display type, numbered story sections, a single muted accent color carrying the eye. Visual punch from the-field — animated grain, a giant background marquee of the product's keywords, scroll-triggered reveals, a soft cursor glow, and a tilted hero Slack-thread mockup that levels on hover. The result is an opinionated, distinctive cc-bot identity rather than a clone of either source.

## i18n — EN / 中文

Single-page bilingual via JS toggle in the nav (`EN / 中`). All prose strings carry `data-i18n` / `data-i18n-html` attributes and live in a `translations` object inside `app.js`. Code, command names and identifiers stay English in both modes. Language preference persists in `localStorage` (`cc_bot_site_lang`), and first-visit detection falls back to `navigator.language`.

Chinese typography uses Noto Serif SC (display) + Noto Sans SC (UI), loaded from the same Google Fonts URL as the English families. `html[lang="zh"]` relaxes line-height and drops letter-tracking so CJK reads cleanly.

中文版与英文版共用同一份 HTML — 不切路由，不分目录。导航右上角的 `EN / 中` 按钮即时切换。
