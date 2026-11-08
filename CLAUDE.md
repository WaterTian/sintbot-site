# SintBot website

Public repository for sintbot.com. Keep website statements consistent with the exact released package and versioned installation guide.

## Current scope

SintBot 1.3.0 adds a built-in core and supports macOS, one Feishu group and Codex message turns. Operation is foreground only. Other platforms, model routes, multiple groups, whiteboards, console and schedules are not part of this release. Existing installations using those features keep their current version until a compatible migration is available.

SintBot's sole author is WaterTian; SintLab is the publisher. Use the name SintBot and the `sintbot` command on the website. The software license is PolyForm Shield 1.0.0; do not change license terms when updating page copy. Do not add prices or payment links.

## Changes and validation

- Keep English and Chinese copy in `app.js` translations. Generate `index.html`, `zh/index.html` and `llms.txt` with `node scripts/build-zh.mjs`.
- Run `node scripts/build-zh.mjs --check`, `node scripts/check-lastmod.mjs` and `node --check app.js`; review desktop and mobile pages.
- Copy `install.sh` unchanged from the audited product release. Do not advertise setup, service or multi-group commands that the release does not support.
- Keep Latin webfonts non-blocking and use system fonts for Chinese. Avoid continuous animation and scroll-driven movement.
- Preserve CNAME, verification files and site metadata. Do not publish internal maintenance documents; keep `_config.yml` exclusions aligned.
- Pushing main deploys publicly. Deploy only after the exact npm package and version tag are available. Check the automatic version-sync workflow so it cannot publish mismatched copy or installers; restore it after any release-specific pause only when the live site is verified.
