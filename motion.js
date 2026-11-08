/* SintBot product interactions. GSAP is vendored separately under its standard license. */
(() => {
  "use strict";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const gsap = window.gsap;
  function showcase() {
    const list = document.querySelector('.showcase__tabs[role=tablist]');
    if (!list || list.dataset.motionBound) return;
    const host = list.closest('.showcase');
    const workspace = host.querySelector('.showcase__workspace');
    const tabs = [...list.querySelectorAll('[data-showcase-tab]')];
    const panels = [...host.querySelectorAll('[data-showcase-panel]')];
    const control = host.querySelector('.showcase__playback');
    if (!tabs.length || !panels.length) return;
    list.dataset.motionBound = 'true';
    let activeIndex = Math.max(0, tabs.findIndex(t => t.getAttribute('aria-selected') === 'true'));
    let indicator, scene, transition, clock, remaining = 10000, started = 0;
    let visible = false, hovered = false, focusPaused = false, stopped = false, leaving = false, hasEntered = false;
    const progress = tabs.map(tab => {
      const el = document.createElement('span');
      el.className = 'showcase__progress'; el.setAttribute('aria-hidden', 'true'); tab.append(el); return el;
    });
    const parts = panels.flatMap(panel => [panel, ...panel.querySelectorAll('.showcase__message,.showcase__message--bot b,.showcase__status,[data-i18n="demo.task.reply"],.showcase__artifacts>span,.showcase__hint,h3,.showcase__content>p,.showcase__model-option,.showcase__editor,.showcase__editor-line,.showcase__file-tree,.showcase__diff')]);
    if (gsap) {
      indicator = document.createElement('span'); indicator.className = 'showcase__indicator'; indicator.setAttribute('aria-hidden','true');
      list.prepend(indicator); document.documentElement.classList.add('motion-ready');
    }
    function place(instant = false) {
      if (!indicator) return;
      const tab = tabs[activeIndex];
      const target = { clipPath: `inset(${tab.offsetTop}px ${Math.max(0,list.clientWidth-tab.offsetLeft-tab.offsetWidth)}px ${Math.max(0,list.clientHeight-tab.offsetTop-tab.offsetHeight)}px ${tab.offsetLeft}px round 10px)` };
      gsap.killTweensOf(indicator);
      if (instant || reduced.matches) gsap.set(indicator,target);
      else gsap.to(indicator,{...target,duration:.52,ease:'expo.out'});
    }
    // Measure real content at its current width; automatic changes never shift the page.
    function measure() {
      const css = getComputedStyle(workspace);
      const width = workspace.clientWidth - parseFloat(css.paddingLeft) - parseFloat(css.paddingRight);
      if (width <= 0) return;
      let height = 0;
      panels.forEach(panel => {
        const hidden = panel.hidden, style = panel.getAttribute('style');
        panel.hidden = false;
        Object.assign(panel.style,{position:'absolute',visibility:'hidden',width:`${width}px`,transform:'none'});
        height = Math.max(height,panel.offsetHeight);
        panel.hidden = hidden;
        if (style === null) panel.removeAttribute('style'); else panel.setAttribute('style',style);
      });
      workspace.style.minHeight = `${Math.ceil(height + parseFloat(css.paddingTop) + parseFloat(css.paddingBottom))}px`;
      place(true);
    }
    function clean() {
      scene?.kill(); transition?.kill(); scene = transition = null; leaving = false;
      if (gsap) { gsap.killTweensOf(parts); gsap.set(parts,{clearProps:'opacity,visibility,transform,clipPath'}); }
      host.querySelectorAll('[data-step-state]').forEach(el => el.removeAttribute('data-step-state'));
    }
    // TasteCode's .6s / 10px / expo.out progression, adapted to SintBot's real UI.
    function enter(panel) {
      if (!gsap || reduced.matches) return;
      scene?.kill();
      scene = gsap.timeline({defaults:{duration:.6,ease:'expo.out'}});
      const reveal = (selector, at, stagger = 0) => {
        const els = [...panel.querySelectorAll(selector)];
        if (els.length) scene.fromTo(els,{autoAlpha:0,y:10},{autoAlpha:1,y:0,stagger,clearProps:'opacity,visibility,transform'},at);
      };
      if (panel.dataset.showcasePanel === 'task') {
        reveal('.showcase__message--user',0);
        reveal('.showcase__message--bot',.45);
        reveal('.showcase__status',.85);
        const rows = [...panel.querySelectorAll('.showcase__artifacts>span')];
        rows.forEach((row,i) => {
          const at = 1.25 + i * .85;
          scene.set(row,{attr:{'data-step-state':'run'}},at);
          scene.fromTo(row,{autoAlpha:0,y:10},{autoAlpha:1,y:0,clearProps:'opacity,visibility,transform'},at);
          scene.set(row,{attr:{'data-step-state':'done'}},at+.7);
        });
        reveal('[data-i18n="demo.task.reply"]',3.1);
        reveal('.showcase__hint',3.35);
      } else {
        reveal('h3',0); reveal('.showcase__content>p:not(.showcase__hint)',.15);
        reveal('.showcase__model-option',.55,.12);
        reveal('.showcase__editor',.45); reveal('.showcase__editor-line',.85,.18);
        reveal('.showcase__file-tree',.45); reveal('.showcase__diff',.85);
        reveal('.showcase__hint',1.55);
      }
      if (!visible || document.hidden) scene.pause();
    }
    function stopClock() {
      if (clock) { clearTimeout(clock); clock = null; remaining = Math.max(0,remaining-(performance.now()-started)); }
      if (gsap) gsap.killTweensOf(progress);
    }
    function resetClock() {
      stopClock(); remaining = activeIndex === 0 ? 10000 : 8000;
      progress.forEach(el => el.style.transform = 'scaleX(0)');
    }
    function sync() {
      stopClock();
      const blocked = !visible || document.hidden || hovered || focusPaused || stopped || reduced.matches || !gsap || leaving;
      host.dataset.autoplay = blocked ? 'paused' : 'playing';
      if (control) {
        control.hidden = !gsap;
        control.dataset.paused = String(stopped || reduced.matches);
        control.disabled = reduced.matches;
        const label = control.querySelector(stopped || reduced.matches ? '[data-i18n="demo.play"]' : '[data-i18n="demo.pause"]')?.textContent;
        control.setAttribute('aria-label',label || 'Pause slideshow'); control.title = label || '';
      }
      host.dataset.scenePaused = String(!visible || document.hidden || stopped);
      if (!visible || document.hidden || stopped) scene?.pause(); else scene?.resume();
      if (blocked) return;
      started = performance.now();
      gsap.to(progress[activeIndex],{scaleX:1,duration:remaining/1000,ease:'none'});
      clock = setTimeout(() => {clock=null; remaining=0; select((activeIndex+1)%tabs.length);},remaining);
    }
    function select(index, focus = false) {
      if (index === activeIndex) { if (focus) tabs[index].focus({preventScroll:true}); return; }
      stopClock();
      const previous = panels.find(panel => !panel.hidden);
      clean();
      activeIndex = index;
      tabs.forEach((tab,i) => {
        tab.setAttribute('aria-selected',String(i===index)); tab.tabIndex = i===index ? 0 : -1; tab.classList.toggle('is-active',i===index);
      });
      host.querySelectorAll('.showcase__sidebar li').forEach((item,i) => item.classList.toggle('is-active',i===index));
      place();
      if (focus) tabs[index].focus({preventScroll:true});
      resetClock();
      const show = () => {
        leaving = false; transition = null;
        panels.forEach((panel,i) => {panel.hidden=i!==index; panel.classList.toggle('is-active',i===index);});
        if (gsap && previous) gsap.set(previous,{clearProps:'opacity,visibility,transform'});
        enter(panels[index]); sync();
      };
      if (previous && gsap && !reduced.matches && visible) {
        leaving = true;
        transition = gsap.to(previous,{autoAlpha:0,duration:.22,ease:'power1.in',onComplete:show});
      } else show();
    }
    tabs.forEach((tab,index) => tab.addEventListener('click',() => select(index)));
    list.addEventListener('keydown',event => {
      const index=tabs.indexOf(document.activeElement); if(index<0)return;
      const next = event.key==='ArrowRight'?(index+1)%tabs.length:event.key==='ArrowLeft'?(index+tabs.length-1)%tabs.length:event.key==='Home'?0:event.key==='End'?tabs.length-1:undefined;
      if(next===undefined)return; event.preventDefault(); focusPaused=true; select(next,true); sync();
    });
    control?.addEventListener('click',() => {stopped=!stopped; if(!stopped)focusPaused=false; sync();});
    host.addEventListener('pointerenter',event => {if(event.pointerType==='mouse'){hovered=true;sync();}});
    host.addEventListener('pointerleave',event => {if(event.pointerType==='mouse'){hovered=false;sync();}});
    host.addEventListener('pointerdown',() => {focusPaused=false;sync();});
    host.addEventListener('focusin',event => {if(event.target.matches(':focus-visible')){focusPaused=true;sync();}});
    host.addEventListener('focusout',() => queueMicrotask(() => {if(!host.contains(document.activeElement)){focusPaused=false;sync();}}));
    function settle() {
      tabs.forEach((tab,i) => tab.append(progress[i]));
      clean(); panels.forEach((panel,i) => {panel.hidden=i!==activeIndex;panel.classList.toggle('is-active',i===activeIndex);});
      measure(); resetClock(); sync();
    }
    document.addEventListener('sintbot:languagechange',settle);
    reduced.addEventListener('change',settle);
    document.addEventListener('visibilitychange',sync);
    window.addEventListener('pagehide',() => {stopClock();clean();});
    window.addEventListener('pageshow',sync);
    const observer = window.IntersectionObserver && new IntersectionObserver(entries => {
      visible=entries[0].isIntersecting && entries[0].intersectionRatio >= .2;
      if(visible&&!hasEntered){hasEntered=true;enter(panels[activeIndex]);}
      sync();
    },{threshold:.2});
    if(observer)observer.observe(host.querySelector('.showcase__window'));
    else visible=true;
    if(window.ResizeObserver)new ResizeObserver(measure).observe(workspace);
    window.addEventListener('resize',measure);
    document.fonts?.ready.then(measure);
    measure(); resetClock(); sync();
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
