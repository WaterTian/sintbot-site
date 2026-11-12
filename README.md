# SintBot website

Repository: [sintlab/sintbot-site](https://github.com/sintlab/sintbot-site). GitHub Pages serves [sintbot.com](https://sintbot.com/) from `main` using the existing custom domain.

The homepage describes SintBot's project-group workflow, Claude Code / Codex execution routes and configurable models, including Claude, GLM, MiniMax and DeepSeek. The visual reference is tasteskill.dev, adapted with SintBot's graphite, copper and paper palette. Preserve the current typography, interactions and supplied JPEG brand icon.

The 1.4.16 download supports macOS, 1–32 Feishu China groups with Codex or Claude Code per group, chat commands and a local console, in the foreground. Keep this exact scope in the bilingual installation guide while the homepage and usage guide describe the product workflow. The primary installation command is `curl -fsSL https://sintbot.com/install.sh | bash`; Feishu credentials and project configuration are separate first-use steps.

Maintain homepage translations in `app.js`, then generate `index.html`, `zh/index.html` and `llms.txt` with `node scripts/build-zh.mjs`. Maintain the bilingual installation and usage guide HTML directly under `guide/` and `zh/guide/`, with shared `guide.css` and `guide.js`.

Keep `install.sh` identical to the currently audited installer in the public product repository. Installer and documentation improvements can follow a release without changing its immutable npm package or tag. The version-sync workflow copies the tagged installer only when npm `latest` advances, so a later reviewed installer fix survives same-version runs.

Before deployment, verify the npm artifact and installation instructions, run the bilingual generation and lastmod checks, and review desktop/mobile pages. Follow `CLAUDE.md` for the current design and maintenance rules. A push to main deploys the site; do not publish installation instructions before the corresponding package is available.

## Search and share metadata

Homepage titles and descriptions live in `app.js`; `scripts/build-zh.mjs` generates the two locale-specific share images in the metadata (the PNG files themselves are rendered from the two `assets/og-banner*.source.html` files at 1200 × 630). Keep the supplied brand icon unchanged.

After editing guide titles or descriptions, run `node scripts/build-guide-seo.mjs`. It derives TechArticle, BreadcrumbList and share tags from each guide's own title, description and canonical URL; `--check` is part of the pre-commit hook. The custom `404.html` uses noindex and is intentionally excluded from the sitemap.

The site uses a derived Google Sans Flex file with ROND fixed at 100 and the used weight range 400–750; optical sizing and the original Latin character coverage remain intact. Rebuild with `python3 scripts/build-fonts.py` (fonttools[woff] required). Keep the original font and its SIL OFL alongside the derivative. If future CSS uses another roundness or weight, update the derivative and its @font-face range together.

Local performance checks are regression evidence, not real-user Core Web Vitals. The mobile LCP target is at most 2.5 seconds at the 75th percentile; verify it with field data when sufficient traffic exists, and keep throttled lab measurements separate. After an authorized deployment, verify the actual 404 response and submit the sitemap URLs with `node scripts/indexnow.mjs`.
