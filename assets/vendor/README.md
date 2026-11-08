# Website animation library

- GSAP 3.15.0, `gsap-3.15.0.min.js`, and ScrollTrigger 3.15.0, `ScrollTrigger-3.15.0.min.js`
- Sources: https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js and https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/ScrollTrigger.min.js
- Project: https://gsap.com/
- License: GSAP Standard No Charge License, reproduced in `GSAP-LICENSE.txt`; the original copyright banner remains in the JavaScript file.
- Retrieved 2026-11-08. Self-hosted so visitors do not need a third-party CDN connection.

The animation integration in `/motion.js` is SintBot-specific code. It implements the product example tabs and the desktop perspective scroll entrance with the same libraries found in the Taste Skill reference website. Desktop and mobile use the reference perspective scroll parameters with native scrolling; reduced-motion visitors receive the final static state. Taste Skill's compiled application bundles and proprietary page assets are not shipped in this website.

The button hover/press micro-interaction CSS is adapted from the MIT-licensed taste-skill assets/motion/motion.css, Copyright (c) 2026 Leonxlnx. Source: https://github.com/Leonxlnx/taste-skill/blob/main/skills/taste-skill/assets/motion/motion.css . Full license: TASTE-SKILL-LICENSE.txt. Reference-site timings guide the bilingual word entrance, clipped tab indicator and navigation crossfade.
