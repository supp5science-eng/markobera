/* ============================================
   MARKO BERA — Motion & Interactions
   GSAP + ScrollTrigger
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Footer year ---------- */
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============================================
     LOADER
     ============================================ */
  const loader = document.querySelector("[data-loader]");
  const counter = document.querySelector("[data-loader-count]");

  function startSite() {
    document.body.classList.add("is-ready");
    heroIntro();
  }

  if (loader && !reduceMotion) {
    let n = 0;
    const tick = setInterval(() => {
      n += Math.floor(Math.random() * 13) + 7;
      if (n >= 100) { n = 100; clearInterval(tick); }
      counter.textContent = n;
      if (n === 100) {
        gsap.to(loader, {
          yPercent: -100,
          duration: 0.65,
          ease: "power4.inOut",
          delay: 0.1,
          onStart: startSite,
          onComplete: () => loader.classList.add("is-done"),
        });
      }
    }, 30);
  } else {
    if (loader) loader.style.display = "none";
    startSite();
  }

  /* ============================================
     CUSTOM CURSOR
     ============================================ */
  const cursor = document.querySelector("[data-cursor]");
  const dot = document.querySelector("[data-cursor-dot]");
  if (cursor && window.matchMedia("(min-width: 901px)").matches) {
    let mx = 0, my = 0, cx = 0, cy = 0;
    window.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      gsap.set(dot, { x: mx - 3, y: my - 3 });
    });
    gsap.ticker.add(() => {
      cx += (mx - cx) * 0.15;
      cy += (my - cy) * 0.15;
      gsap.set(cursor, { x: cx - 19, y: cy - 19 });
    });

    document.querySelectorAll("a, button, [data-tilt], input, textarea").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
    });
  }

  /* ============================================
     HERO INTRO
     ============================================ */
  function heroIntro() {
    if (reduceMotion) return;
    const lines = gsap.utils.toArray("[data-hero-line] > *, [data-hero-line]");
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.from("[data-hero-line]", {
      yPercent: 120,
      duration: 1.1,
      stagger: 0.12,
    })
      .from(".hero__eyebrow", { y: 20, opacity: 0, duration: 0.6 }, "-=0.6")
      .to(".hero__eyebrow", { opacity: 1, duration: 0.01 })
      .from(".hero__sub", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
      .to(".hero__sub", { opacity: 1, duration: 0.01 }, "<")
      .from(".hero__actions", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
      .to(".hero__actions", { opacity: 1, duration: 0.01 }, "<")
      .from(".hero__scroll", { opacity: 0, duration: 0.6 }, "-=0.3")
      .to(".hero__scroll", { opacity: 1, duration: 0.01 }, "<")
      .from(".hero__viz", { opacity: 0, scale: 0.9, duration: 1.1, ease: "power3.out" }, "-=1.1")
      .from(".viz__node", { opacity: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }, "-=0.7");

    // The hero reveal items are handled here, so unmark them for the generic reveal
    document.querySelectorAll(".hero [data-reveal]").forEach((el) => {
      el.removeAttribute("data-reveal");
      el.style.opacity = "";
      el.style.transform = "";
    });
  }

  /* ============================================
     SCROLL REVEAL
     ============================================ */
  if (!reduceMotion) {
    gsap.utils.toArray("[data-reveal]").forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
        },
      });
    });
  } else {
    document.querySelectorAll("[data-reveal]").forEach((el) => {
      el.style.opacity = 1; el.style.transform = "none";
    });
  }

  /* ============================================
     MARQUEE
     ============================================ */
  const marquee = document.querySelector("[data-marquee]");
  if (marquee && !reduceMotion) {
    const w = marquee.scrollWidth / 2;
    gsap.to(marquee, {
      x: -w,
      duration: 22,
      ease: "none",
      repeat: -1,
    });
  }

  /* ============================================
     MAGNETIC BUTTONS
     ============================================ */
  if (window.matchMedia("(min-width: 901px)").matches && !reduceMotion) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        gsap.to(el, { x: x * 0.35, y: y * 0.35, duration: 0.6, ease: "power3.out" });
      });
      el.addEventListener("mouseleave", () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
      });
    });
  }

  /* ============================================
     CARD TILT + GLOW
     ============================================ */
  if (window.matchMedia("(min-width: 901px)").matches && !reduceMotion) {
    document.querySelectorAll("[data-tilt]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const rx = (py - 0.5) * -8;
        const ry = (px - 0.5) * 8;
        gsap.to(el, { rotateX: rx, rotateY: ry, transformPerspective: 900, duration: 0.5, ease: "power2.out" });
        el.style.setProperty("--mx", px * 100 + "%");
        el.style.setProperty("--my", py * 100 + "%");
      });
      el.addEventListener("mouseleave", () => {
        gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.7, ease: "power3.out" });
      });
    });
  }

  /* ============================================
     PARALLAX BLOBS ON SCROLL
     ============================================ */
  if (!reduceMotion && window.matchMedia("(min-width: 901px)").matches) {
    gsap.to(".blob--1", { yPercent: 30, scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 1 } });
    gsap.to(".blob--2", { yPercent: -25, scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 1.5 } });
  }

  /* ============================================
     STAT COUNTERS
     ============================================ */
  document.querySelectorAll("[data-count]").forEach((el) => {
    const target = +el.getAttribute("data-count");
    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () => {
        gsap.fromTo(el, { innerText: 0 }, {
          innerText: target,
          duration: 1.6,
          ease: "power2.out",
          snap: { innerText: 1 },
          onUpdate() {
            el.textContent = Math.round(el.innerText);
          },
        });
      },
    });
  });

  /* ============================================
     NAV BEHAVIOUR (hide on scroll down)
     ============================================ */
  const nav = document.querySelector("[data-nav]");
  let lastY = 0;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    if (y > 60) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");

    if (y > lastY && y > 400) nav.classList.add("is-hidden");
    else nav.classList.remove("is-hidden");
    lastY = y;
  });

  /* ============================================
     MOBILE MENU
     ============================================ */
  const burger = document.querySelector("[data-burger]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  if (burger) {
    burger.addEventListener("click", () => {
      burger.classList.toggle("is-open");
      mobileMenu.classList.toggle("is-open");
      document.body.style.overflow = mobileMenu.classList.contains("is-open") ? "hidden" : "";
    });
    mobileMenu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        burger.classList.remove("is-open");
        mobileMenu.classList.remove("is-open");
        document.body.style.overflow = "";
      })
    );
  }

  /* ============================================
     CONTACT FORM (demo handling)
     ============================================ */
  const form = document.querySelector("[data-form]");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btnText = form.querySelector("[data-submit-text]");
      const original = btnText.textContent;
      btnText.textContent = "Hvala! ✦";
      gsap.fromTo(form.querySelector(".btn"), { scale: 0.96 }, { scale: 1, duration: 0.4, ease: "back.out(2)" });
      form.reset();
      setTimeout(() => { btnText.textContent = original; }, 2600);
    });
  }

  /* ============================================
     CAPABILITY ORBIT (hero animacija)
     ============================================ */
  const viz = document.querySelector("[data-viz]");
  if (viz) {
    const nodes = Array.from(viz.querySelectorAll("[data-viz-node]"));
    const coreIcon = viz.querySelector("[data-viz-icon]");
    const titleEl = viz.querySelector("[data-viz-title]");
    const textEl = viz.querySelector("[data-viz-text]");
    const beam = viz.querySelector("[data-viz-beam]");
    const step = 360 / nodes.length;
    let active = -1;
    let timer = null;

    function setActive(i) {
      if (i === active) return;
      active = i;
      const node = nodes[i];
      nodes.forEach((n, idx) => n.classList.toggle("is-active", idx === i));

      coreIcon.innerHTML = node.querySelector(".viz__node-icon").innerHTML;
      titleEl.textContent = node.dataset.title;
      textEl.textContent = node.dataset.text;

      if (!reduceMotion) {
        gsap.fromTo([coreIcon, titleEl, textEl],
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.05 });
        gsap.to(beam, { rotation: i * step - 90, transformOrigin: "0% 50%", duration: 0.7, ease: "power3.inOut", overwrite: true });
      }
    }

    function next() { setActive((active + 1) % nodes.length); }
    function play() { if (reduceMotion) return; stop(); timer = setInterval(next, 2800); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    nodes.forEach((n, idx) => {
      n.addEventListener("click", () => { setActive(idx); play(); });
      n.addEventListener("mouseenter", () => { setActive(idx); stop(); });
      n.addEventListener("mouseleave", play);
    });

    gsap.set(beam, { rotation: -90, transformOrigin: "0% 50%" });
    setActive(0);
    play();
  }

  /* ============================================
     WORK — LIVE DEMO TILES
     ============================================ */
  const dashVal = document.querySelector("[data-dash-val]");

  if (reduceMotion) {
    // Reduced motion: prikaži finalno stanje bez animacije
    document.querySelectorAll(".project[data-demo]").forEach((c) => c.classList.add("is-live"));
    const line = document.querySelector(".demo-dash__line");
    const area = document.querySelector(".demo-dash__area");
    if (line) line.style.strokeDashoffset = 0;
    if (area) area.style.opacity = 1;
    if (dashVal) dashVal.textContent = "€ 24.580";
  } else {
    // Aktiviraj demo kada uđe u vidno polje
    document.querySelectorAll(".project[data-demo]").forEach((card) => {
      ScrollTrigger.create({
        trigger: card,
        start: "top 85%",
        once: true,
        onEnter: () => card.classList.add("is-live"),
      });
    });

    // Dashboard brojač
    if (dashVal) {
      ScrollTrigger.create({
        trigger: dashVal.closest(".project"),
        start: "top 85%",
        once: true,
        onEnter: () => {
          const o = { v: 0 };
          gsap.to(o, {
            v: 24580,
            duration: 2,
            ease: "power2.out",
            onUpdate() {
              dashVal.textContent = "€ " + Math.round(o.v).toLocaleString("de-DE");
            },
          });
        },
      });
    }
  }

  /* ---------- E-commerce demo (swatch + korpa) ---------- */
  const shop = document.querySelector("[data-shop]");
  if (shop) {
    const swatches = Array.from(shop.querySelectorAll("[data-shop-swatches] button"));
    const cart = shop.querySelector("[data-shop-cart]");
    let si = 0, shopTimer = null;

    function setSwatch(i) {
      si = i;
      swatches.forEach((b, idx) => b.classList.toggle("is-active", idx === i));
      shop.style.setProperty("--shop-c", swatches[i].dataset.color);
    }
    function cycle() { setSwatch((si + 1) % swatches.length); }
    function startShop() { if (reduceMotion) return; stopShop(); shopTimer = setInterval(cycle, 2400); }
    function stopShop() { if (shopTimer) { clearInterval(shopTimer); shopTimer = null; } }

    swatches.forEach((b, idx) =>
      b.addEventListener("click", () => { setSwatch(idx); startShop(); })
    );

    if (cart) {
      const label = cart.querySelector("span");
      const original = label.textContent;
      cart.addEventListener("click", () => {
        cart.classList.add("is-added");
        label.textContent = "✓ Dodato";
        if (!reduceMotion) gsap.fromTo(cart, { scale: 0.94 }, { scale: 1, duration: 0.4, ease: "back.out(2)" });
        clearTimeout(cart._t);
        cart._t = setTimeout(() => {
          cart.classList.remove("is-added");
          label.textContent = original;
        }, 1800);
      });
    }

    setSwatch(0);
    ScrollTrigger.create({ trigger: shop, start: "top 85%", once: true, onEnter: startShop });
  }

  // Refresh ScrollTrigger after everything is laid out
  ScrollTrigger.refresh();
});
