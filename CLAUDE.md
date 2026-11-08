# SintBot website

Public repository for sintbot.com. Describe the product separately from the availability of a specific release. Keep installation statements consistent with the exact released package and versioned installation guide.

## Product positioning (user correction, 2026-11-08 13:59)

SintBot connects project groups to local coding agents. Claude Code and Codex are execution routes; Claude, GLM, MiniMax and DeepSeek are models/providers, with compatible third-party endpoints configured through Claude Code. Model choice and project memory are core product capabilities, not peripheral future ideas. The user's later instruction at 14:03 replaces the old visual-preservation requirement: closely follow https://www.tasteskill.dev/ for layout, colors, typography and interactions, using inspected public frontend resources. Keep SintBot content and branding distinct. Do not turn the whole homepage into a Codex-only product because the current release has a narrower implementation. Explain exact release limitations beside installation and in the release FAQ; do not imply that downloading 1.3.0 restores every existing capability.

## Palette and product-window refinement (2026-11-08 14:25–14:28)

Keep the Taste Skill composition and interactions, with a restrained SintBot palette: graphite #13171c, copper #dd7d3d and paper #f6f5f1. Use the user-supplied dark app-card reference for the product window: charcoal surfaces, gray user bubble, unboxed assistant progress, fine separators and copper accents. Use the existing black-and-white symbol in assets/favicon.svg for SintBot branding; do not replace it with a letter S or the retired PCB logo. Provider logos and semantic status colors retain their meanings.

## Current release availability

SintBot 1.3.0 adds a built-in core and supports macOS, one Feishu group and Codex message turns. Operation is foreground only. Other platforms, model routes, multiple groups, whiteboards, console and schedules are not part of this release. Existing installations using those features keep their current version until a compatible migration is available.

SintBot's sole author is WaterTian; SintLab is the publisher. Use the name SintBot and the `sintbot` command on the website. The software license is PolyForm Shield 1.0.0; do not change license terms when updating page copy. Do not add prices or payment links.

## Changes and validation

- Keep English and Chinese copy in `app.js` translations. Generate `index.html`, `zh/index.html` and `llms.txt` with `node scripts/build-zh.mjs`.
- Run `node scripts/build-zh.mjs --check`, `node scripts/check-lastmod.mjs` and `node --check app.js`; review desktop and mobile pages.
- Copy `install.sh` unchanged from the audited product release. Do not advertise setup, service or multi-group commands that the release does not support.
- Keep fonts non-blocking, with system Chinese fallbacks. Follow the reference interaction behavior with reduced-motion and no-JavaScript fallbacks.
- Preserve CNAME, verification files and site metadata. Do not publish internal maintenance documents; keep `_config.yml` exclusions aligned.
- Pushing main deploys publicly. Deploy only after the exact npm package and version tag are available. Check the automatic version-sync workflow so it cannot publish mismatched copy or installers; restore it after any release-specific pause only when the live site is verified.
