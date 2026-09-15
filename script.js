// ============ CipherX site script ============
(function () {
  "use strict";

  /* ---- yıl & saat ---- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const clockEl = document.getElementById("clock");
  function tick() {
    if (!clockEl) return;
    const d = new Date();
    const p = (n) => String(n).padStart(2, "0");
    clockEl.textContent = "canlı saat: " + p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds());
  }
  tick();
  setInterval(tick, 1000);

  /* ---- typing efekti ---- */
  const typingEl = document.getElementById("typing");
  const words = [
    "kendimi geliştiriyorum...",
    "programlar yazıyorum...",
    "uygulamalar geliştiriyorum...",
    "insanlara destek oluyorum...",
    "öğrenmeye devam ediyorum...",
    "404: ego bulunamadı :)"
  ];
  let wi = 0, ci = 0, deleting = false;
  function type() {
    if (!typingEl) return;
    const word = words[wi];
    typingEl.textContent = word.slice(0, ci);
    if (!deleting) {
      if (ci < word.length) { ci++; setTimeout(type, 70); }
      else { deleting = true; setTimeout(type, 1500); }
    } else {
      if (ci > 0) { ci--; setTimeout(type, 35); }
      else { deleting = false; wi = (wi + 1) % words.length; setTimeout(type, 350); }
    }
  }
  type();

  /* ---- scroll reveal ---- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* ---- mobil menü ---- */
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("open");
      toggle.classList.toggle("open");
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        links.classList.remove("open");
        toggle.classList.remove("open");
      })
    );
  }

  /* ---- aktif nav linki ---- */
  const sections = Array.from(document.querySelectorAll("section[id], header[id]"));
  const navAnchors = Array.from(document.querySelectorAll(".nav-links a"));
  window.addEventListener("scroll", () => {
    const y = window.scrollY + 160;
    let current = "";
    sections.forEach((s) => { if (s.offsetTop <= y) current = s.id; });
    navAnchors.forEach((a) =>
      a.classList.toggle("active", a.getAttribute("href") === "#" + current)
    );
  }, { passive: true });

  /* ---- matrix yağmuru (hafif, ~15fps) ---- */
  const canvas = document.getElementById("bg-canvas");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    const chars = "01アイウエオカキクケコサシスセソ<>{}=+-*/#$".split("");
    let cols = 0, drops = [], last = 0;
    const fontSize = 16;
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.ceil(canvas.width / fontSize);
      drops = new Array(cols).fill(0).map(() => Math.random() * -60);
    }
    resize();
    window.addEventListener("resize", resize);
    function draw(ts) {
      requestAnimationFrame(draw);
      if (ts - last < 66) return;
      last = ts;
      ctx.fillStyle = "rgba(10,14,20,0.18)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = fontSize + "px 'JetBrains Mono', monospace";
      for (let i = 0; i < cols; i++) {
        const ch = chars[(Math.random() * chars.length) | 0];
        ctx.fillStyle = Math.random() < 0.05 ? "rgba(88,196,255,0.5)" : "rgba(57,255,160,0.28)";
        ctx.fillText(ch, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }
    requestAnimationFrame(draw);
  }
})();
