# SintBot website

Public repository for sintbot.com. Describe the product separately from the availability of a specific release. Keep installation statements consistent with the exact released package and versioned installation guide.

## Product positioning (user correction, 2026-11-08 13:59)

SintBot connects project groups to local coding agents. Claude Code and Codex are execution routes; Claude, GLM, MiniMax and DeepSeek are models/providers, with compatible third-party endpoints configured through Claude Code. Model choice and project memory are core product capabilities, not peripheral future ideas. The user's later instruction at 14:03 replaces the old visual-preservation requirement: closely follow https://www.tasteskill.dev/ for layout, colors, typography and interactions, using inspected public frontend resources. Keep SintBot content and branding distinct. Do not turn the whole homepage into a Codex-only product because the current release has a narrower implementation. Keep versioned installation steps accurate without adding marketing lists of unfinished features. Do not claim that a particular package version includes every product capability.

## Palette and product-window refinement (2026-11-08 14:25–14:28)

Keep the Taste Skill composition and interactions, with a restrained SintBot palette: graphite #13171c, copper #dd7d3d and paper #f6f5f1. Use the user-supplied dark app-card reference for the product window: charcoal surfaces, gray user bubble, unboxed assistant progress, fine separators and copper accents. Use the exact user-supplied 14:42 image in assets/favicon-20261108.jpg (black disc, white symbol with gray outline) for favicon and SintBot branding; it supersedes the earlier favicon.svg; do not replace it with a letter S or the retired PCB logo. Provider logos and semantic status colors retain their meanings.

## Workflow cards and copy (2026-11-08 14:48–14:49)

The three workflow panels contain static HTML examples of a group task, agent/model routing and returned files. Never replace them with large icon-only empty plates. Body content stays visible without scroll animation; only hero items use reveal. Stack workflow cards below 768px. Feature copy follows the original 733913b positioning: one group per project, work on your own machine, progress/results in the group, per-group model choice and saved local project memory. Use the product-copy rule below for marketing and keep installation instructions accurate.

## Product copy (user correction, 2026-11-08 14:58)

Present the complete product workflow using the original 733913b feature descriptions: multiple chat platforms, model choice, local project memory, visual collaboration, console, scheduling, per-group permissions and browser takeover. Do not add unfinished-feature lists, old-version retention notices or future-migration commentary to marketing sections or FAQs. Keep installation prerequisites and the linked versioned instructions accurate; product descriptions must not become a claim that every feature ships in a particular package version. Keep model/network and saved-memory semantics precise.

SintBot's sole author is WaterTian; SintLab is the publisher. Use the name SintBot and the `sintbot` command on the website. The software license is PolyForm Shield 1.0.0; do not change license terms when updating page copy. Do not add prices or payment links.

## Changes and validation

- Keep English and Chinese copy in `app.js` translations. Generate `index.html`, `zh/index.html` and `llms.txt` with `node scripts/build-zh.mjs`.
- Run `node scripts/build-zh.mjs --check`, `node scripts/check-lastmod.mjs` and `node --check app.js`; review desktop and mobile pages.
- Copy `install.sh` unchanged from the audited product release. Do not advertise setup, service or multi-group commands that the release does not support.
- Keep fonts non-blocking, with system Chinese fallbacks. Follow the reference interaction behavior with reduced-motion and no-JavaScript fallbacks.
- Preserve CNAME, verification files and site metadata. Do not publish internal maintenance documents; keep `_config.yml` exclusions aligned.
- Pushing main deploys publicly. Deploy only after the exact npm package and version tag are available. Check the automatic version-sync workflow so it cannot publish mismatched copy or installers; restore it after any release-specific pause only when the live site is verified.

## Motion details and FAQ (2026-11-08 15:02–15:08)

Reference Taste Skill's public frontend for word-mask hero entrance, native-scroll perspective on desktop and mobile, directional tab reveal, button press/arrow response and navigation background crossfade. Content remains visible without the animation layer. Keep reduced-motion support, rapid-tab cancellation, locale-safe title reconstruction and bounded entrance cleanup. Reused micro-interaction CSS retains the MIT notice and TASTE-SKILL-LICENSE.txt; GSAP keeps its own license. Do not reintroduce the removed license FAQ (user request 15:08); legal documents and third-party license files are retained.
