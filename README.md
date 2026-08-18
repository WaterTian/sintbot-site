# Sintbot — showcase site

Pure static HTML / CSS / JS — zero build tools, zero dependencies. Single page, bilingual (EN / 中), dark editorial layout.

Live at <https://sintbot.com>. Push to `main` = GitHub Pages deploys in ~seconds — there is no staging, so verify on the live URL after pushing.

## The two pillars

Sintbot is one local-first platform with two pillars, both on a single page:

- **① Multi-model group bot** — drop an AI agent into a Slack / Lark channel; mention it, it works. This pillar ships in **two forms**:
  - **`cc-bot`** — a **plugin**: it installs into Claude Code, lives inside an interactive session, and is bound to that session's model. MIT and free, on `main` in [`WaterTian/cc-bot`](https://github.com/WaterTian/cc-bot); both IM adapters share one `IMAdapter` interface.
  - **`sintbot`** — a **standalone daemon**, not a plugin: it owns its own message loop, needs nobody at the terminal, drives **Claude Code and Codex** headless, and swaps the model behind them (Claude / GPT / GLM / DeepSeek / MiniMax). One project per group, per-group permissions, local web console. Lark-native today. **Delivered with Pro** — not a public download.
- **② Desktop pet (`sintpet`)** — a desktop companion that watches your local Claude Code session, speaks with on-device voice + lip-sync, and reacts out loud. Its character is settled — personality and voice included.

cc-bot (MIT, free) is the top of the funnel; Pro unlocks `sintbot` — see the pricing section.

## Preview locally

Open `index.html` in any modern browser, or serve the directory:

```bash
python -m http.server 8000   # then visit http://localhost:8000/
# or:  npx --yes serve .
```

## Files

- `index.html` — the single page: hero (both pillars + a Slack-thread mockup), "what Sintbot is", the cc-bot pillar (scenarios, capabilities, IMAdapter, architecture with an inline SVG diagram + permission matrix, Slack setup walkthrough), the `#pet` pillar, pricing, CTA, footer.
- `styles.css` — raw CSS with custom properties; ink-black canvas, signal-orange accent, PCB-board detailing. Fraunces (display) + Inter (UI) + JetBrains Mono (code), plus Noto Serif / Sans SC for CJK, all from Google Fonts.
- `app.js` — vanilla JS: the `translations` i18n table, IntersectionObserver reveal-on-scroll, soft cursor glow (pointer:fine only), copy-to-clipboard for install commands + the full Slack manifest, hero parallax, smooth-scroll anchors, and Umami event tracking. Honors `prefers-reduced-motion`.
- `assets/logo.png` — the PCB-styled "CC" brand mark (favicon + nav / footer + OG share image); `logo.svg` retained as a vector fallback.
- `CNAME` — GitHub Pages custom domain (`sintbot.com`); do not delete.

> The old circuit-board bot mascot (`assets/bot/*.webp`) and its JS cross-fade cycle were removed 2026-07: the desktop pet is becoming a real character with its own look and voice, so the placeholder no longer represented it. The CC mark above is the brand logo, kept.

## i18n — EN / 中文

Single-page bilingual via the `EN / 中` toggle in the nav — same HTML, no routing, no separate directory. All prose carries `data-i18n` / `data-i18n-html` / `data-i18n-svg` attributes; the strings live in a `translations` object in `app.js` with an `en` + `zh` for every key. Code, command names and identifiers stay English in both modes. Preference persists in `localStorage`; first visit falls back to `navigator.language`.

Chinese typography uses Noto Serif SC (display) + Noto Sans SC (UI); `html[lang="zh"]` relaxes line-height and drops letter-tracking so CJK reads cleanly.

## Design rationale

Editorial calm — generous whitespace, oversized Fraunces display type, numbered story sections, a single muted accent carrying the eye — with visual punch: animated grain, a giant background keyword marquee, scroll-triggered reveals, a soft cursor glow, and a tilted hero Slack-thread mockup that levels on hover. An opinionated, distinctive identity rather than a template.
