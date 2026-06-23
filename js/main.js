/* ============================================
   MARKO BERA — Motion & Interactions
   GSAP + ScrollTrigger
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ============================================
     SMOOTH SCROLL (Lenis)
     ============================================ */
  let lenis = null;
  if (!reduceMotion && typeof Lenis !== "undefined") {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Anchor linkovi -> glatko skrolovanje kroz Lenis
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -20, force: true });
      });
    });
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============================================
     LOADER
     ============================================ */
  const loader = document.querySelector("[data-loader]");
  const counter = document.querySelector("[data-loader-count]");
  const loaderBar = document.querySelector("[data-loader-bar]");

  function startSite() {
    document.body.classList.add("is-ready");
    heroIntro();
  }

  if (loader && !reduceMotion) {
    // Intro reveal naziva i taga (cinematic)
    gsap.from(loader.querySelectorAll(".loader__name, .loader__tag"), {
      yPercent: 120,
      duration: 0.9,
      ease: "power4.out",
      stagger: 0.12,
    });
    gsap.from(counter, { opacity: 0, duration: 0.6 });

    let n = 0;
    const tick = setInterval(() => {
      n += Math.floor(Math.random() * 13) + 7;
      if (n >= 100) { n = 100; clearInterval(tick); }
      counter.textContent = n;
      if (loaderBar) loaderBar.style.width = n + "%";
      if (n === 100) {
        const out = gsap.timeline({
          delay: 0.25,
          onStart: startSite,
          onComplete: () => loader.classList.add("is-done"),
        });
        out
          .to(loader.querySelectorAll(".loader__count, .loader__reveal, .loader__bar"), {
            yPercent: -120,
            opacity: 0,
            duration: 0.6,
            ease: "power3.in",
            stagger: 0.05,
          })
          .to(loader, {
            yPercent: -100,
            duration: 0.85,
            ease: "power4.inOut",
          }, "-=0.2");
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
    const isDesktop = window.matchMedia("(min-width: 901px)").matches;

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
      .to(".hero__actions", { opacity: 1, duration: 0.01 }, "<");

    if (isDesktop) {
      tl.from(".hero__scroll", { opacity: 0, duration: 0.6 }, "-=0.3")
        .to(".hero__scroll", { opacity: 1, duration: 0.01 }, "<");
    }

    tl.from(".hero__viz", { opacity: 0, scale: 0.9, duration: 1.1, ease: "power3.out" }, "-=1.1")
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
      const open = mobileMenu.classList.contains("is-open");
      document.body.style.overflow = open ? "hidden" : "";
      if (lenis) open ? lenis.stop() : lenis.start();
    });
    mobileMenu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        burger.classList.remove("is-open");
        mobileMenu.classList.remove("is-open");
        document.body.style.overflow = "";
        if (lenis) lenis.start();
      })
    );
  }

  /* ============================================
     CONTACT FORM (Netlify Forms — AJAX submit)
     ============================================ */
  const form = document.querySelector("[data-form]");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btnText = form.querySelector("[data-submit-text]");
      const original = btnText.textContent;

      btnText.textContent = "Šaljem…";

      const body = new URLSearchParams(new FormData(form)).toString();
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      })
        .then(() => {
          btnText.textContent = "Hvala! ✦";
          gsap.fromTo(form.querySelector(".btn"), { scale: 0.96 }, { scale: 1, duration: 0.4, ease: "back.out(2)" });
          form.reset();
          setTimeout(() => { btnText.textContent = original; }, 2600);
        })
        .catch(() => {
          btnText.textContent = "Greška — pokušaj ponovo";
          setTimeout(() => { btnText.textContent = original; }, 3000);
        });
    });
  }

  /* ============================================
     CAPABILITY ORBIT (hero animacija)
     ============================================ */
  const viz = document.querySelector("[data-viz]");
  if (viz) {
    const nodes = Array.from(viz.querySelectorAll("[data-viz-node]"));
    const core = viz.querySelector(".viz__core");
    const coreIcon = viz.querySelector("[data-viz-icon]");
    const titleEl = viz.querySelector("[data-viz-title]");
    const textEl = viz.querySelector("[data-viz-text]");
    const beam = viz.querySelector("[data-viz-beam]");
    const step = 360 / nodes.length;
    let active = -1;
    let timer = null;

    /* Boje swirla po čvoru: [primarna, sekundarna] iz palete aqua/pink/lilac */
    const themes = [
      ["#5fd0ff", "#aebfd6"], // Dizajn — cijan + srebrna
      ["#2e8bff", "#5fd0ff"], // Cyber Security — plava + cijan
      ["#2e8bff", "#aebfd6"], // Performanse — plava + srebrna
      ["#aebfd6", "#5fd0ff"], // SEO — srebrna + cijan
      ["#5fd0ff", "#2e8bff"], // Motion — cijan + plava
    ];

    const swirl = createSwirl(viz.querySelector("[data-viz-swirl]"));

    function setActive(i) {
      if (i === active) return;
      active = i;
      const node = nodes[i];
      nodes.forEach((n, idx) => n.classList.toggle("is-active", idx === i));

      coreIcon.innerHTML = node.querySelector(".viz__node-icon").innerHTML;
      titleEl.textContent = node.dataset.title;
      textEl.textContent = node.dataset.text;

      const theme = themes[i % themes.length];
      if (core) core.style.setProperty("--accent", theme[0]);
      if (swirl) swirl.setTheme(theme[0], theme[1]);

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
     FLOW-FIELD SWIRL — živi vortex u jezgru
     (self-contained, bez biblioteka)
     ============================================ */
  function createSwirl(canvas) {
    if (!canvas || reduceMotion) return null;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return null;

    const TAU = Math.PI * 2;
    let dpr = 1, w = 0, h = 0, cx = 0, cy = 0, radius = 0;
    let particles = [];
    let t = 0;
    let raf = null, running = false, visible = true;
    const pointer = { x: 0, y: 0, str: 0 };
    const col = { a: [46, 139, 255], b: [174, 191, 214] };
    const target = { a: [46, 139, 255], b: [174, 191, 214] };
    const noise = makeNoise();

    function hexToRgb(hex) {
      const n = parseInt(hex.slice(1), 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }
    function rand(a, b) { return a + Math.random() * (b - a); }

    function spawn(p, fresh) {
      const ang = Math.random() * TAU;
      const rr = Math.sqrt(Math.random()) * radius * 0.96;
      p.x = cx + Math.cos(ang) * rr;
      p.y = cy + Math.sin(ang) * rr;
      p.px = p.x; p.py = p.y;
      p.life = rand(50, 190);
      p.age = fresh ? rand(0, p.life) : 0;
      p.mix = Math.random();
      p.spd = rand(0.6, 1.6);
    }

    function resize() {
      const r = canvas.getBoundingClientRect();
      if (!r.width || !r.height) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = Math.round(r.width * dpr);
      h = canvas.height = Math.round(r.height * dpr);
      cx = w / 2; cy = h / 2; radius = Math.min(w, h) / 2;
      const count = Math.max(80, Math.min(230, Math.round((w * h) / (dpr * dpr) / 90)));
      particles = [];
      for (let i = 0; i < count; i++) { const p = {}; spawn(p, true); particles.push(p); }
      ctx.fillStyle = "#060a12";
      ctx.fillRect(0, 0, w, h);
    }

    function frame() {
      if (!running) return;
      t += 0.0016;
      for (let k = 0; k < 3; k++) {
        col.a[k] += (target.a[k] - col.a[k]) * 0.045;
        col.b[k] += (target.b[k] - col.b[k]) * 0.045;
      }

      // gašenje tragova
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(6, 10, 18, 0.085)";
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, TAU);
      ctx.clip();
      ctx.globalCompositeOperation = "lighter";
      ctx.lineWidth = 1.15 * dpr;
      ctx.lineCap = "round";

      const fScale = 2.4 / radius;
      if (pointer.str > 0.001) pointer.str *= 0.94;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dx = p.x - cx, dy = p.y - cy;
        const dist = Math.hypot(dx, dy) || 1;

        // noise polje + vrtložni (tangencijalni) bias = vortex
        const n = noise(p.x * fScale + t, p.y * fScale - t * 0.6);
        const nAng = (n - 0.5) * Math.PI * 4;
        const tAng = Math.atan2(dy, dx) + Math.PI / 2;
        let vx = Math.cos(nAng) * 0.95 + Math.cos(tAng) * 0.75;
        let vy = Math.sin(nAng) * 0.95 + Math.sin(tAng) * 0.75;

        // blagi uticaj kursora — gurka čestice u stranu
        if (pointer.str > 0.001) {
          const pdx = p.x - pointer.x, pdy = p.y - pointer.y;
          const pd = Math.hypot(pdx, pdy) || 1;
          if (pd < radius) {
            const f = (1 - pd / radius) * pointer.str;
            vx += (pdx / pd) * f * 2.2;
            vy += (pdy / pd) * f * 2.2;
          }
        }

        const vlen = Math.hypot(vx, vy) || 1;
        const sp = p.spd * dpr;
        p.px = p.x; p.py = p.y;
        p.x += (vx / vlen) * sp;
        p.y += (vy / vlen) * sp;
        p.age++;

        if (p.age > p.life || dist > radius * 1.02) { spawn(p, false); continue; }

        // boja: mešavina dve teme, alfa po životu i blizini ivice
        const m = p.mix;
        const cr = (col.a[0] * (1 - m) + col.b[0] * m) | 0;
        const cg = (col.a[1] * (1 - m) + col.b[1] * m) | 0;
        const cb = (col.a[2] * (1 - m) + col.b[2] * m) | 0;
        const lifeF = Math.sin((p.age / p.life) * Math.PI);
        const edgeF = Math.min(1, (radius - dist) / (radius * 0.28));
        const alpha = 0.5 * lifeF * Math.max(0, edgeF);
        if (alpha <= 0.003) continue;

        ctx.strokeStyle = "rgba(" + cr + "," + cg + "," + cb + "," + alpha + ")";
        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
      ctx.restore();
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running || !visible) return;
      if (!w) resize();
      running = true;
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      if (raf) { cancelAnimationFrame(raf); raf = null; }
    }

    // kursor
    const stage = viz.querySelector(".viz__stage") || canvas;
    stage.addEventListener("pointermove", (e) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = (e.clientX - r.left) * dpr;
      pointer.y = (e.clientY - r.top) * dpr;
      pointer.str = 1;
    });

    // pauziraj van vidnog polja i kad tab nije aktivan
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting;
        if (visible) start(); else stop();
      }, { threshold: 0.05 }).observe(canvas);
    }
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop(); else if (visible) start();
    });
    if ("ResizeObserver" in window) {
      let rt;
      new ResizeObserver(() => { clearTimeout(rt); rt = setTimeout(resize, 150); }).observe(canvas);
    } else {
      window.addEventListener("resize", () => { clearTimeout(window.__swirlRT); window.__swirlRT = setTimeout(resize, 150); });
    }

    resize();
    start();

    return {
      setTheme(hexA, hexB) {
        target.a = hexToRgb(hexA);
        target.b = hexToRgb(hexB);
      },
    };
  }

  /* Vrednosni (value) noise — glatko 2D polje za swirl */
  function makeNoise() {
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    for (let i = 255; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      const tmp = p[i]; p[i] = p[j]; p[j] = tmp;
    }
    const perm = new Uint8Array(512);
    for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
    const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
    const lerp = (a, b, t) => a + (b - a) * t;
    const grad = (hash, x, y) => {
      const u = (hash & 1) ? x : -x;
      const v = (hash & 2) ? y : -y;
      return u + v;
    };
    return function (x, y) {
      const X = Math.floor(x) & 255, Y = Math.floor(y) & 255;
      x -= Math.floor(x); y -= Math.floor(y);
      const u = fade(x), v = fade(y);
      const aa = perm[perm[X] + Y], ab = perm[perm[X] + Y + 1];
      const ba = perm[perm[X + 1] + Y], bb = perm[perm[X + 1] + Y + 1];
      return (lerp(
        lerp(grad(aa, x, y), grad(ba, x - 1, y), u),
        lerp(grad(ab, x, y - 1), grad(bb, x - 1, y - 1), u),
        v) + 1) * 0.5;
    };
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

  /* ============================================
     ABOUT PHOTO — WebGL liquid hover distortion
     (raw WebGL, bez biblioteka; fallback na <img>)
     ============================================ */
  (function initPhotoFX() {
    if (reduceMotion) return;
    const wrap = document.querySelector("[data-photo-fx]");
    if (!wrap) return;
    const canvas = wrap.querySelector("[data-photo-canvas]");
    const img = wrap.querySelector("[data-photo-img]");
    if (!canvas || !img) return;

    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false, antialias: true });
    if (!gl) return; // fallback: ostaje <img>

    const begin = () => { try { run(); } catch (e) { /* fallback ostaje img */ } };
    if (img.complete && img.naturalWidth) begin();
    else img.addEventListener("load", begin, { once: true });

    function run() {
      const vsrc =
        "attribute vec2 aPos; varying vec2 vUv;" +
        "void main(){ vUv = aPos*0.5+0.5; gl_Position = vec4(aPos,0.0,1.0); }";
      const fsrc =
        "precision mediump float;" +
        "uniform sampler2D uTex; uniform vec2 uMouse; uniform float uHover;" +
        "uniform float uTime; uniform float uPlaneAspect; uniform float uImageAspect;" +
        "varying vec2 vUv;" +
        "vec2 coverUv(vec2 uv){" +
        "  vec2 r = vec2(min(uPlaneAspect/uImageAspect,1.0), min(uImageAspect/uPlaneAspect,1.0));" +
        "  return vec2(uv.x*r.x+(1.0-r.x)*0.5, uv.y*r.y+(1.0-r.y)*0.5); }" +
        "void main(){" +
        "  vec2 uv = vUv;" +
        "  vec2 d = uv - uMouse;" +
        "  float dist = length(d);" +
        "  float ripple = sin(dist*28.0 - uTime*4.0) * 0.018 * uHover * smoothstep(0.55,0.0,dist);" +
        "  uv.x += sin(uv.y*9.0 + uTime*0.7) * 0.0035;" +
        "  uv.y += cos(uv.x*9.0 + uTime*0.6) * 0.0035;" +
        "  uv += normalize(d + 0.0001) * ripple;" +
        "  float ca = 0.008 * uHover * smoothstep(0.6,0.0,dist);" +
        "  float rr = texture2D(uTex, coverUv(uv + vec2(ca,0.0))).r;" +
        "  vec4 g = texture2D(uTex, coverUv(uv));" +
        "  float bb = texture2D(uTex, coverUv(uv - vec2(ca,0.0))).b;" +
        "  gl_FragColor = vec4(rr, g.g, bb, 1.0); }";

      function compile(type, src) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src); gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
        return s;
      }
      const prog = gl.createProgram();
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, vsrc));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fsrc));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
      gl.useProgram(prog);

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const aPos = gl.getAttribLocation(prog, "aPos");
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

      gl.uniform1i(gl.getUniformLocation(prog, "uTex"), 0);
      gl.uniform1f(gl.getUniformLocation(prog, "uImageAspect"), img.naturalWidth / img.naturalHeight);
      const uMouse = gl.getUniformLocation(prog, "uMouse");
      const uHover = gl.getUniformLocation(prog, "uHover");
      const uTime = gl.getUniformLocation(prog, "uTime");
      const uPlane = gl.getUniformLocation(prog, "uPlaneAspect");

      function resize() {
        const r = canvas.getBoundingClientRect();
        if (!r.width || !r.height) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(r.width * dpr);
        canvas.height = Math.round(r.height * dpr);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform1f(uPlane, r.width / r.height);
      }
      resize();

      const mouse = { x: 0.5, y: 0.5 }, target = { x: 0.5, y: 0.5 };
      let hover = 0, hoverTarget = 0;
      wrap.addEventListener("pointerenter", () => (hoverTarget = 1));
      wrap.addEventListener("pointerleave", () => (hoverTarget = 0));
      wrap.addEventListener("pointermove", (e) => {
        const r = canvas.getBoundingClientRect();
        target.x = (e.clientX - r.left) / r.width;
        target.y = (e.clientY - r.top) / r.height;
      });

      wrap.classList.add("is-fx");

      let raf = null, visible = true;
      const t0 = performance.now();
      function frame(now) {
        const t = (now - t0) / 1000;
        mouse.x += (target.x - mouse.x) * 0.1;
        mouse.y += (target.y - mouse.y) * 0.1;
        hover += (hoverTarget - hover) * 0.08;
        gl.uniform2f(uMouse, mouse.x, mouse.y);
        gl.uniform1f(uHover, hover);
        gl.uniform1f(uTime, t);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        raf = requestAnimationFrame(frame);
      }
      function play() { if (!raf && visible) raf = requestAnimationFrame(frame); }
      function pause() { if (raf) { cancelAnimationFrame(raf); raf = null; } }

      if ("IntersectionObserver" in window) {
        new IntersectionObserver((en) => {
          visible = en[0].isIntersecting;
          visible ? play() : pause();
        }, { threshold: 0.05 }).observe(canvas);
      }
      if ("ResizeObserver" in window) {
        let rt;
        new ResizeObserver(() => { clearTimeout(rt); rt = setTimeout(resize, 150); }).observe(canvas);
      } else {
        window.addEventListener("resize", () => setTimeout(resize, 150));
      }
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) pause(); else if (visible) play();
      });
      play();
    }
  })();

  // Refresh ScrollTrigger after everything is laid out
  ScrollTrigger.refresh();
});
