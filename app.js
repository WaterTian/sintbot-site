// cc-bot showcase — vanilla JS for reveal-on-scroll, copy buttons,
// soft cursor glow, and per-element reveal delays. No deps.
(function () {
  "use strict";

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1) Reveal on scroll ---------------------------------------------------
  const revealEls = Array.from(document.querySelectorAll("[data-reveal]"));
  revealEls.forEach((el) => {
    const delay = parseInt(el.getAttribute("data-reveal-delay") || "0", 10);
    if (delay) el.style.transitionDelay = delay + "ms";
  });

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  // 2) Soft cursor glow ---------------------------------------------------
  if (!prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
    const glow = document.querySelector(".cursor-glow");
    if (glow) {
      let raf = 0;
      let tx = window.innerWidth / 2;
      let ty = window.innerHeight / 2;
      let cx = tx;
      let cy = ty;
      document.body.classList.add("cursor-on");
      window.addEventListener(
        "mousemove",
        (e) => {
          tx = e.clientX;
          ty = e.clientY;
          if (!raf) raf = requestAnimationFrame(tick);
        },
        { passive: true }
      );
      window.addEventListener("mouseleave", () => {
        document.body.classList.remove("cursor-on");
      });
      window.addEventListener("mouseenter", () => {
        document.body.classList.add("cursor-on");
      });
      function tick() {
        // gentle lerp for trailing motion
        cx += (tx - cx) * 0.14;
        cy += (ty - cy) * 0.14;
        glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
        if (Math.abs(tx - cx) > 0.3 || Math.abs(ty - cy) > 0.3) {
          raf = requestAnimationFrame(tick);
        } else {
          raf = 0;
        }
      }
    }
  }

  // 3) Copy buttons -------------------------------------------------------
  document.querySelectorAll(".copy[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.getAttribute("data-copy") || "";
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          const ta = document.createElement("textarea");
          ta.value = text;
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
        }
        const original = btn.textContent;
        btn.textContent = "copied";
        btn.classList.add("is-ok");
        setTimeout(() => {
          btn.textContent = original;
          btn.classList.remove("is-ok");
        }, 1400);
      } catch (err) {
        btn.textContent = "press ctrl-c";
        setTimeout(() => (btn.textContent = "copy"), 1600);
      }
    });
  });

  // 4) Subtle parallax on hero marquee -----------------------------------
  if (!prefersReducedMotion) {
    const marquee = document.querySelector(".hero__marquee-track");
    if (marquee) {
      let lastY = 0;
      let raf2 = 0;
      const onScroll = () => {
        lastY = window.scrollY;
        if (!raf2) raf2 = requestAnimationFrame(applyParallax);
      };
      const applyParallax = () => {
        // marquee already auto-scrolls; we add a vertical drift for depth
        const offset = Math.min(lastY * 0.08, 60);
        marquee.style.translate = `0 ${offset}px`;
        raf2 = 0;
      };
      window.addEventListener("scroll", onScroll, { passive: true });
    }
  }

  // 5) Smooth-scroll anchors with offset for sticky nav ------------------
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navH = document.querySelector(".nav")?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 8;
      window.scrollTo({
        top,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  });
})();
