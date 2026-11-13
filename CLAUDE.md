# SintBot website

Public repository [sintlab/sintbot-site](https://github.com/sintlab/sintbot-site) for sintbot.com. Describe the product separately from the availability of a specific release. Keep installation statements consistent with the exact released package and versioned installation guide.

## Product positioning (user correction, 2026-11-08 13:59)

SintBot connects project groups to local coding agents. Claude Code and Codex are execution routes; Claude, GLM, MiniMax and DeepSeek are models/providers, with compatible third-party endpoints configured through Claude Code. Model choice and project memory are core product capabilities, not peripheral future ideas. The user's later instruction at 14:03 replaces the old visual-preservation requirement: closely follow https://www.tasteskill.dev/ for layout, colors, typography and interactions, using inspected public frontend resources. Keep SintBot content and branding distinct. Do not turn the whole homepage into a Codex-only product because the current release has a narrower implementation. Keep versioned installation steps accurate without adding marketing lists of unfinished features. Do not claim that a particular package version includes every product capability.

## Personal AI agent positioning (user decision, 2026-11-13)

SintBot is positioned in two layers: a personal AI agent that runs on the user's own Mac, and the same agent as a team's teammate in a project group. Name Feishu and Slack as the places it is messaged. This sits on top of the 2026-11-08 positioning above (project groups, execution routes, models), which still describes how it works. The hero title and eyebrow are unchanged; the hero lede and the meta description carry the new sentence. A desktop app download belongs on the site only once a signed release exists.

## Palette and product-window refinement (2026-11-08 14:25–14:28)

Keep the Taste Skill composition and interactions, with a restrained SintBot palette: graphite #13171c, copper #dd7d3d and paper #f6f5f1. Use the user-supplied dark app-card reference for the product window: charcoal surfaces, gray user bubble, unboxed assistant progress, fine separators and copper accents. The 2026-11-13 decision uses the current console SVG as the brand authority. The matching vector is assets/favicon.svg: use it for site favicons and brand marks, preserving its white backing disc and exact black path. This supersedes the earlier JPEG preference; do not redraw the mark or revive the retired PCB logo. Provider logos and semantic status colors retain their meanings.

## Workflow cards and copy (2026-11-08 14:48–14:49)

The three workflow panels contain static HTML examples of a group task, agent/model routing and returned files. Never replace them with large icon-only empty plates. Body content stays visible without scroll animation; only hero items use reveal. Stack workflow cards below 768px. Feature copy follows the original 733913b positioning: one group per project, work on your own machine, progress/results in the group, per-group model choice and saved local project memory. Use the product-copy rule below for marketing and keep installation instructions accurate.

## Product copy (user correction, 2026-11-08 14:58)

Present the complete product workflow using the original 733913b feature descriptions: multiple chat platforms, model choice, local project memory, visual collaboration, console, scheduling, per-group permissions and browser takeover. Do not add unfinished-feature lists, old-version retention notices or future-migration commentary to marketing sections or FAQs. Keep installation prerequisites and the linked versioned instructions accurate; product descriptions must not become a claim that every feature ships in a particular package version. Keep model/network and saved-memory semantics precise.

SintBot's sole author is WaterTian; SintLab is the publisher. Use the name SintBot and the `sintbot` command on the website. The software license is PolyForm Shield 1.0.0; do not change license terms when updating page copy. Do not add prices or payment links.

## Changes and validation

- Keep English and Chinese copy in `app.js` translations. Generate `index.html`, `zh/index.html` and `llms.txt` with `node scripts/build-zh.mjs`.
- Run `node scripts/build-zh.mjs --check`, `node scripts/check-lastmod.mjs` and `node --check app.js`; review desktop and mobile pages.
- Keep `install.sh` identical to the audited installer in the product repository. The 2026-11-08 16:04 user instruction replaces the initial release installer with the simplified fresh-user flow. Do not advertise setup, service or multi-group commands that the release does not support.
- Keep fonts non-blocking, with system Chinese fallbacks. Follow the reference interaction behavior with reduced-motion and no-JavaScript fallbacks.
- Preserve CNAME, verification files and site metadata. Do not publish internal maintenance documents; keep `_config.yml` exclusions aligned.
- Pushing main deploys publicly. Deploy only after the exact npm package and version tag are available. Check the automatic version-sync workflow so it cannot publish mismatched copy or installers; restore it after any release-specific pause only when the live site is verified.

## Motion details and FAQ (2026-11-08 15:02–15:08)

Reference Taste Skill's public frontend for word-mask hero entrance, native-scroll perspective on desktop and mobile, directional tab reveal, button press/arrow response and navigation background crossfade. Content remains visible without the animation layer. Keep reduced-motion support, rapid-tab cancellation, locale-safe title reconstruction and bounded entrance cleanup. Reused micro-interaction CSS retains the MIT notice and TASTE-SKILL-LICENSE.txt; GSAP keeps its own license. Do not reintroduce the removed license FAQ (user request 15:08); legal documents and third-party license files are retained.

## Autoplay and native guides (2026-11-08 15:13–15:20)

The four showcase tabs cycle automatically while in view (10 seconds for the conversation, 8 seconds for other scenes), with explicit pause, hover/keyboard reading pause, background/offscreen suspension and reduced-motion static fallback. TasteCode-style rows enter with 10px / .6s expo.out, completion states follow, then the previous panel fades out over .22s. Preserve rapid-switch cancellation and measured panel height.

Installation and usage are native bilingual pages at `/guide/install/`, `/guide/usage/` and `/zh/guide/...`, with shared `guide.css` and `guide.js`. Their HTML is maintained directly; homepage copy remains in app.js. Keep the installation guide tied to the exact release commands and configuration, while the usage guide explains the product workflow. Homepage navigation/install/footer point to the local guides; GitHub is not the primary documentation destination. Keep both languages, sitemap, copy controls, anchors and mobile layout aligned.

## Chinese typography (2026-11-08 15:40)

Chinese headings use semantic `.zh-title-line` spans in the homepage translation table, including the closing CTA; preserve them in static generation and language switching. Remove decorative commas between objects and verbs and trailing periods in display headings; retain meaningful list punctuation and question marks. Use natural Chinese tracking, strict punctuation wrapping and distinct hero/section/card/guide scales. Chinese-only rules follow shared responsive styles; do not compress Chinese with English negative tracking. Native guide titles and matching table-of-contents labels are edited together. Validate headline line breaks and overflow at 320, 390, 768, 820, 1024 and 1440, after entrance animations settle.

## English headings and showcase labels (2026-11-08 15:51)

Use concise, concrete English headings without decorative terminal periods. Keep model choice distinct from saved project notes; avoid implying that switching preserves the full conversation. English guide section headings use balanced wrapping and stay aligned with their table-of-contents entries. Showcase tabs are compact nouns (Tasks, Models, Memory, Local work); retain full readable labels in their own 44px hit areas, never overlapping, clipped or ellipsized. The mobile four-column layout must be checked at 320px in both languages with every active indicator position. Use `?lang=en` for English screenshots after language-switch testing, since a saved language preference can change the root URL to Chinese.


## One-line installation (2026-11-08 15:59–16:04)

The user explicitly dropped old-version compatibility from the public installation flow. The primary command is `curl -fsSL https://sintbot.com/install.sh | bash`. The installer checks macOS/Node/npm, installs pinned 1.3.0 under `~/.local/share/sintbot` without sudo, and verifies the executable and core. Its whole function is parsed before execution, and it never changes runtime configuration/state or starts a service. Preview and manual version checks are optional; the first initialization/preflight/start sequence is one copy block with failure short-circuiting. Keep both languages, public README/install docs, executable paths and copy payloads consistent. This updates the downloadable installer and docs, not the immutable npm package/tag.
