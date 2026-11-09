# SintBot website

The homepage describes SintBot's project-group workflow, Claude Code / Codex execution routes and configurable models, including Claude, GLM, MiniMax and DeepSeek. The visual reference is tasteskill.dev, adapted with SintBot's graphite, copper and paper palette. Preserve the current typography, interactions and supplied JPEG brand icon.

The 1.4.3 download supports macOS, 1–32 Feishu China groups with Codex or Claude Code per group, chat commands and a local console, in the foreground. Keep this exact scope in the bilingual installation guide while the homepage and usage guide describe the product workflow. The primary installation command is `curl -fsSL https://sintbot.com/install.sh | bash`; Feishu credentials and project configuration are separate first-use steps.

Maintain homepage translations in `app.js`, then generate `index.html`, `zh/index.html` and `llms.txt` with `node scripts/build-zh.mjs`. Maintain the bilingual installation and usage guide HTML directly under `guide/` and `zh/guide/`, with shared `guide.css` and `guide.js`.

Keep `install.sh` identical to the currently audited installer in the public product repository. Installer and documentation improvements can follow a release without changing its immutable npm package or tag. The version-sync workflow copies the tagged installer only when npm `latest` advances, so a later reviewed installer fix survives same-version runs.

Before deployment, verify the npm artifact and installation instructions, run the bilingual generation and lastmod checks, and review desktop/mobile pages. Follow `CLAUDE.md` for the current design and maintenance rules. A push to main deploys the site; do not publish installation instructions before the corresponding package is available.
