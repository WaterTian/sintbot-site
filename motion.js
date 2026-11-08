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
        x: tab.offsetLeft,
        y: tab.offsetTop,
        width: tab.offsetWidth,
        height: tab.offsetHeight,
      };
      if (instant || reduced.matches) gsap.set(indicator, target);
      else gsap.to(indicator, { ...target, duration: 0.28, ease: "power3.out", overwrite: true });
    }
    function select(tab, focus = false) {
      const key = tab.dataset.showcaseTab;
      const panel = panels.find(item => item.dataset.showcasePanel === key);
      if (!panel) return;
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
      if (changed) animate(panel, { opacity: 0, y: 10 }, {
        opacity: 1, y: 0, duration: 0.36, ease: "power3.out", clearProps: "opacity,transform",
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
        gsap.set(panels, { clearProps: "opacity,transform" });
      }
      place(true);
    });
  }

  function entrance() {
    const windowEl = document.querySelector(".showcase__window");
    if (!windowEl || !gsap || reduced.matches) return;
    const ScrollTrigger = window.ScrollTrigger;
    if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({
      desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
    }, context => {
      if (context.conditions.desktop && ScrollTrigger) {
        const host = windowEl.parentElement;
        gsap.set(host, { perspective: 1200 });
        gsap.set(windowEl, { transformOrigin: "center top" });
        gsap.fromTo(windowEl, { y: 40, rotationX: 26, scale: 0.84 }, {
          y: 0, rotationX: 0, scale: 1, ease: "none",
          scrollTrigger: {
            start: 0,
            end: () => Math.max(320, host.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.2),
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });
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

  function init() {
    showcase();
    entrance();
    navigation();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
