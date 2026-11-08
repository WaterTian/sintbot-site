/* SintBot product interactions. GSAP is vendored separately under its standard license. */
(() => {
  "use strict";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const gsap = window.gsap;
  const animate = (element, from, to) => {
    if (!element || !gsap || reduced.matches) return;
    gsap.killTweensOf(element);
    return gsap.fromTo(element, from, { ...to, overwrite: "auto" });
  };

  function showcase() {
    const list = document.querySelector(".showcase__tabs[role=tablist]");
    if (!list || list.dataset.motionBound) return;
    const tabs = [...list.querySelectorAll("[data-showcase-tab]")];
    const panels = [...document.querySelectorAll("[data-showcase-panel]")];
    if (!tabs.length || !panels.length) return;
    list.dataset.motionBound = "true";
    let indicator;
    let activeIndex = Math.max(0, tabs.findIndex(tab => tab.getAttribute("aria-selected") === "true"));
    if (gsap) {
      indicator = document.createElement("span");
      indicator.className = "showcase__indicator";
      indicator.setAttribute("aria-hidden", "true");
      list.prepend(indicator);
      document.documentElement.classList.add("motion-ready");
    }
    function place(instant = false) {
      if (!indicator) return;
      const tab = tabs.find(item => item.getAttribute("aria-selected") === "true");
      if (!tab) return;
      const target = {
        clipPath: `inset(${tab.offsetTop}px ${Math.max(0, list.clientWidth - tab.offsetLeft - tab.offsetWidth)}px ${Math.max(0, list.clientHeight - tab.offsetTop - tab.offsetHeight)}px ${tab.offsetLeft}px round 10px)`,
      };
      if (instant || reduced.matches) { gsap.killTweensOf(indicator); gsap.set(indicator, target); }
      else gsap.to(indicator, { ...target, duration: 0.52, ease: "expo.out", overwrite: true });
    }
    function select(tab, focus = false) {
      const key = tab.dataset.showcaseTab;
      const panel = panels.find(item => item.dataset.showcasePanel === key);
      if (!panel) return;
      const nextIndex = tabs.indexOf(tab);
      const direction = nextIndex >= activeIndex ? 1 : -1;
      activeIndex = nextIndex;
      const changed = tab.getAttribute("aria-selected") !== "true";
      tabs.forEach(item => {
        const active = item === tab;
        item.setAttribute("aria-selected", String(active));
        item.tabIndex = active ? 0 : -1;
        item.classList.toggle("is-active", active);
      });
      panels.forEach(item => {
        item.hidden = item !== panel;
        item.classList.toggle("is-active", item === panel);
      });
      place();
      if (focus) tab.focus({ preventScroll: true });
      if (gsap) {
        gsap.killTweensOf(panels);
        gsap.set(panels, { clearProps: "opacity,transform,clipPath" });
      }
      if (changed) animate(panel, {
        opacity: 0.65, x: direction * 16,
        clipPath: direction > 0 ? "inset(0% 0% 0% 8%)" : "inset(0% 8% 0% 0%)",
      }, {
        opacity: 1, x: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 0.62,
        ease: "power3.inOut", clearProps: "opacity,transform,clipPath",
      });
    }
    tabs.forEach(tab => tab.addEventListener("click", () => select(tab)));
    list.addEventListener("keydown", event => {
      const index = tabs.indexOf(document.activeElement);
      if (index < 0) return;
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      select(tabs[next], true);
    });
    select(tabs.find(tab => tab.getAttribute("aria-selected") === "true") || tabs[0]);
    place(true);
    if (window.ResizeObserver) new ResizeObserver(() => place(true)).observe(list);
    if (window.MutationObserver) {
      new MutationObserver(() => place(true)).observe(list, { childList: true, subtree: true, characterData: true });
    }
    document.fonts?.ready.then(() => place(true));
    reduced.addEventListener("change", () => {
      if (reduced.matches && gsap) {
        gsap.killTweensOf(panels);
        gsap.set(panels, { clearProps: "opacity,transform,clipPath" });
      }
      place(true);
    });
  }

  function entrance() {
    const windowEl = document.querySelector(".showcase__window");
    if (!windowEl || !gsap) return;
    const ScrollTrigger = window.ScrollTrigger;
    if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({
      desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
    }, context => {
      if (ScrollTrigger) {
        const host = windowEl.parentElement;
        gsap.set(host, { perspective: 1200 });
        gsap.set(windowEl, { transformOrigin: "center top" });
        const desktop = context.conditions.desktop;
        const trigger = {
          start: 0,
          end: () => Math.max(320, host.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.2),
          scrub: 0.5,
          invalidateOnRefresh: true,
        };
        gsap.fromTo(windowEl, { y: desktop ? 40 : 18, rotationX: desktop ? 26 : 12, scale: desktop ? 0.84 : 0.94 }, {
          y: 0, rotationX: 0, scale: 1, ease: "none",
          scrollTrigger: trigger,
        });
        const tabs = host.querySelector(".showcase__tabs");
        if (tabs) gsap.fromTo(tabs, { y: desktop ? 22 : 10 }, { y: 0, ease: "none", scrollTrigger: { ...trigger } });
        document.fonts?.ready.then(() => ScrollTrigger.refresh());
      } else if (windowEl.getBoundingClientRect().bottom >= 0) {
        gsap.fromTo(windowEl, { y: 18, opacity: 0.75, scale: 0.98 }, {
          y: 0, opacity: 1, scale: 1, duration: 0.9, delay: 0.18,
          ease: "power3.out", clearProps: "opacity,transform",
        });
      }
    });
  }

  function navigation() {
    const nav = document.querySelector(".nav");
    const hero = document.querySelector(".hero");
    if (!nav || !hero) return;
    let queued = false;
    const update = () => {
      queued = false;
      const navRect = nav.getBoundingClientRect();
      // The hero ends on the cream surface. Keep the dark glass over its
      // orange portion, then switch the floating bar to the light treatment.
      nav.classList.toggle("on-light", hero.getBoundingClientRect().bottom <= navRect.bottom + 24);
    };
    const schedule = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    if (window.ResizeObserver) new ResizeObserver(schedule).observe(hero);
    update();
  }


  // The reference's word masks and stagger, adapted to real bilingual text.
  // Default HTML remains visible. Every animation has a bounded final-state fallback.
  function heroEntrance() {
    const title = document.querySelector(".hero__title");
    if (!title || !Element.prototype.animate) return;
    let animations = [], fallback, generation = 0;
    const finish = () => {
      clearTimeout(fallback);
      animations.forEach(animation => animation.cancel());
      animations = [];
    };
    function enter() {
      finish();
      const run = ++generation;
      title.removeAttribute("aria-label");
      if (reduced.matches || scrollY > 80) return;
      const nodes = [];
      const walk = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
      while (walk.nextNode()) nodes.push(walk.currentNode);
      // A locale update replaces the title markup. Never wrap already decorated text twice.
      if (title.querySelector(".hero-word")) return;
      title.setAttribute("aria-label", title.innerText);
      let index = 0;
      nodes.forEach(node => {
        const words = /^zh/.test(document.documentElement.lang) && typeof Intl.Segmenter === "function"
          ? [...new Intl.Segmenter("zh", { granularity: "word" }).segment(node.data)].map(item => item.segment)
          : node.data.match(/\S+|\s+/g) || [];
        const fragment = document.createDocumentFragment();
        words.forEach(word => {
          if (!word.trim()) { fragment.append(document.createTextNode(word)); return; }
          const mask = document.createElement("span");
          const inner = document.createElement("span");
          mask.className = "hero-word";
          mask.setAttribute("aria-hidden", "true");
          inner.className = "hero-word__inner";
          inner.textContent = word;
          mask.append(inner);
          fragment.append(mask);
          const delay = 130 + Math.min(index++ * 42, 420);
          animations.push(inner.animate([
            { transform: "translateY(112%) rotate(7deg)" },
            { transform: "translateY(0) rotate(0)" },
          ], { duration: 950, delay, easing: "cubic-bezier(.16,1,.3,1)", fill: "both" }));
        });
        node.replaceWith(fragment);
      });
      [[".hero__eyebrow", 80], [".hero__lede", 430], [".hero__ctas .btn:first-child", 530], [".hero__ctas .btn:last-child", 600]].forEach(([selector, delay]) => {
        const el = document.querySelector(".hero " + selector);
        if (el) animations.push(el.animate([
          { opacity: 0, transform: "translateY(12px)" },
          { opacity: 1, transform: "translateY(0)" },
        ], { duration: 800, delay, easing: "cubic-bezier(.16,1,.3,1)", fill: "both" }));
      });
      Promise.all(animations.map(a => a.finished.catch(() => {}))).then(() => {
        if (run === generation) finish();
      });
      fallback = setTimeout(finish, 2400);
    }
    document.addEventListener("sintbot:languagechange", enter);
    reduced.addEventListener("change", finish);
    window.addEventListener("pagehide", finish);
    enter();
  }

  function init() {
    heroEntrance();
    showcase();
    entrance();
    navigation();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
