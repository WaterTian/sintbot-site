# cc-bot showcase site

Pure static HTML / CSS / JS — zero build tools.

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

- `index.html` — single-page site: hero, premise, capabilities, architecture (with inline SVG diagram + permission matrix), install, CTA, footer.
- `styles.css` — raw CSS with custom properties; ink-black canvas, signal-orange accent, Fraunces (display) + Inter (UI) + JetBrains Mono (code) loaded from Google Fonts.
- `app.js` — vanilla JS: IntersectionObserver reveal-on-scroll, soft cursor glow (pointer:fine only), copy-to-clipboard install commands, gentle parallax on the hero marquee, smooth-scroll anchors. Honors `prefers-reduced-motion`.
- `assets/logo.svg` — animated inline-friendly SVG mark (chat bubble + two carets + blinking cursor).

## Design rationale

Editorial calm from rouserlab — generous whitespace, oversized Fraunces display type, numbered story sections, a single muted accent color carrying the eye. Visual punch from the-field — animated grain, a giant background marquee of the product's keywords, scroll-triggered reveals, a soft cursor glow, and a tilted hero chat mockup that levels on hover. The result is an opinionated, distinctive cc-bot identity rather than a clone of either source.
