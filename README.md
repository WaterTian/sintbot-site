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
- `assets/logo.svg` — animated inline-friendly SVG mark (chat bubble + two carets + blinking cursor).

## Content emphasis

The site reads as **"cc-bot for Slack"**. Lark / Feishu is mentioned as a secondary supported adapter — the same `IMAdapter` interface backs both. Hero, scenarios, setup walkthrough, and architecture diagram all lead with Slack terminology (channels, threads, Socket Mode push). Source for the Slack adapter is on the [`slack-v0.1.12`](https://github.com/WaterTian/cc-bot/tree/slack-v0.1.12) branch of `WaterTian/cc-bot`.

## Design rationale

Editorial calm from rouserlab — generous whitespace, oversized Fraunces display type, numbered story sections, a single muted accent color carrying the eye. Visual punch from the-field — animated grain, a giant background marquee of the product's keywords, scroll-triggered reveals, a soft cursor glow, and a tilted hero Slack-thread mockup that levels on hover. The result is an opinionated, distinctive cc-bot identity rather than a clone of either source.
