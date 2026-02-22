/* ═══════════════════════════════════════════════════════════
   fx.js — Nexora · Anime.js Effects (v2)
   Philosophy: minimal, eye-catching, never tacky

   EFFECTS:
   01. Hero title — swoosh + elastic pop (replaces char scramble)
   02. Section titles — clean slide-up with soft overshoot
   03. Morphing SVG blob background (hero)
   04. 3D magnetic tilt on feature cards
   05. Spotlight glow follows cursor on cards + pricing
   06. Ripple burst on primary button clicks
   07. Floating ambient particle field (canvas, hero)
   08. Particle micro-trail on cursor move
   09. Scroll progress bar (gradient, top of page)
   10. Nav link underline draw on hover
   11. Hero badge pulse rings
   12. Click shockwave on empty areas
   13. Logo mark spin + glow on hover
   14. Stat numbers flip-in (slot machine)
   15. Smooth counter-number animation on scroll
   16. VS cards — perspective lean on hover
═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    if (!window.anime) { console.warn('fx.js: anime.js not loaded'); return; }

    /* ═══════════════════════════════════
       01. HERO TITLE — SWOOSH + ELASTIC POP
       Each word slides in fast from below,
       overshoots slightly, snaps into place.
       Feels like a pro motion reel.
    ═══════════════════════════════════ */
    (function heroTitleSwoosh() {
      const title = document.querySelector('.hero-title');
      if (!title) return;

      // Wrap each word in a .word-wrap > .word-inner so we can clip
      const rawHTML = title.innerHTML;

      // Split by whitespace but preserve <br> and <span class="gradient-text">
      // We work on childNodes directly
      function wrapWords(el) {
        const nodes = [...el.childNodes];
        el.innerHTML = '';

        nodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR') {
            el.appendChild(document.createElement('br'));
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            // e.g. <span class="gradient-text">
            const wrapper = document.createElement('span');
            wrapper.className = 'word-clip';
            wrapper.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;';
            const inner = document.createElement('span');
            inner.className = 'word-inner';
            inner.style.cssText = 'display:inline-block;will-change:transform,opacity;';
            inner.innerHTML = node.outerHTML;
            wrapper.appendChild(inner);
            el.appendChild(wrapper);
          } else if (node.nodeType === Node.TEXT_NODE) {
            // Split by words
            const words = node.textContent.split(/(\s+)/);
            words.forEach(w => {
              if (/^\s+$/.test(w)) {
                el.appendChild(document.createTextNode(w));
              } else if (w.length) {
                const wrapper = document.createElement('span');
                wrapper.className = 'word-clip';
                wrapper.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;';
                const inner = document.createElement('span');
                inner.className = 'word-inner';
                inner.style.cssText = 'display:inline-block;will-change:transform,opacity;';
                inner.textContent = w;
                wrapper.appendChild(inner);
                el.appendChild(wrapper);
              }
            });
          }
        });
      }

      wrapWords(title);

      const words = title.querySelectorAll('.word-inner');

      // Step 1: start hidden below
      anime.set(words, { translateY: '110%', opacity: 0 });

      // Step 2: swoosh up with elastic overshoot — staggered per word
      anime({
        targets: words,
        translateY: ['110%', '0%'],
        opacity: [0, 1],
        duration: 900,
        delay: anime.stagger(80, { start: 200 }),
        easing: 'easeOutElastic(1, 0.55)',
      });
    })();


    /* ═══════════════════════════════════
       02. SECTION TITLES — SLIDE-UP SOFT POP
       Titles slide up cleanly with a tiny
       overshoot — no scramble, no gimmicks.
    ═══════════════════════════════════ */
    (function sectionTitleReveal() {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (!e.isIntersecting || e.target.dataset.animated) return;
          e.target.dataset.animated = '1';

          anime({
            targets: e.target,
            translateY: [40, 0],
            opacity: [0, 1],
            duration: 800,
            easing: 'easeOutExpo',
          });

          // After title settles, do a tiny scale pop
          setTimeout(() => {
            anime({
              targets: e.target,
              scale: [1, 1.018, 1],
              duration: 380,
              easing: 'easeInOutSine',
            });
          }, 820);

          obs.unobserve(e.target);
        });
      }, { threshold: 0.35 });

      document.querySelectorAll('.section-title').forEach(el => {
        el.style.opacity = '0';
        obs.observe(el);
      });
    })();


    /* ═══════════════════════════════════
       03. MORPHING SVG BLOB
       Slow organic shape in hero bg
    ═══════════════════════════════════ */
    (function morphingBlob() {
      const hero = document.getElementById('hero');
      if (!hero) return;

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 600 600');
      svg.style.cssText = [
        'position:absolute', 'top:-80px', 'right:-100px',
        'width:680px', 'height:680px',
        'pointer-events:none', 'z-index:1',
        'opacity:0.06', 'will-change:transform',
      ].join(';');

      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      defs.innerHTML = `<linearGradient id="blobGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#3b82f6"/>
        <stop offset="100%" stop-color="#6366f1"/>
      </linearGradient>`;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('fill', 'url(#blobGrad)');

      const SHAPES = [
        'M300,80 C420,80 520,160 520,300 C520,440 420,520 300,520 C180,520 80,440 80,300 C80,160 180,80 300,80Z',
        'M300,60 C460,100 540,180 500,320 C460,460 360,540 220,500 C80,460 60,340 100,200 C140,60 200,30 300,60Z',
        'M300,100 C400,60 520,140 540,280 C560,420 460,540 320,520 C180,500 60,420 80,280 C100,140 200,140 300,100Z',
        'M300,80 C440,60 560,160 540,300 C520,440 400,560 260,520 C120,480 60,360 100,220 C140,80 220,100 300,80Z',
      ];

      path.setAttribute('d', SHAPES[0]);
      svg.appendChild(defs);
      svg.appendChild(path);
      hero.appendChild(svg);

      let idx = 0;
      function morph() {
        idx = (idx + 1) % SHAPES.length;
        anime({
          targets: path,
          d: SHAPES[idx],
          duration: 4000,
          easing: 'easeInOutSine',
          complete: () => setTimeout(morph, 1000),
        });
      }
      setTimeout(morph, 1500);

      anime({
        targets: svg,
        rotate: ['0deg', '360deg'],
        duration: 32000,
        loop: true,
        easing: 'linear',
      });
    })();


    /* ═══════════════════════════════════
       04. 3D MAGNETIC TILT — feature cards
    ═══════════════════════════════════ */
    (function cardTilt() {
      document.querySelectorAll('.feat-card').forEach(card => {
        card.style.transformStyle = 'preserve-3d';

        card.addEventListener('mousemove', e => {
          const r  = card.getBoundingClientRect();
          const dx = ((e.clientX - r.left) / r.width  - 0.5) * 2;
          const dy = ((e.clientY - r.top)  / r.height - 0.5) * 2;

          anime({
            targets: card,
            rotateY:  dx * 8,
            rotateX: -dy * 8,
            duration: 180,
            easing: 'easeOutQuad',
          });

          const glow = card.querySelector('.feat-glow');
          if (glow) {
            glow.style.left    = (e.clientX - r.left - 60) + 'px';
            glow.style.top     = (e.clientY - r.top  - 60) + 'px';
            glow.style.opacity = '1';
          }
        });

        card.addEventListener('mouseleave', () => {
          anime({
            targets: card,
            rotateX: 0,
            rotateY: 0,
            duration: 600,
            easing: 'easeOutElastic(1, 0.5)',
          });
          const glow = card.querySelector('.feat-glow');
          if (glow) glow.style.opacity = '0';
        });
      });
    })();


    /* ═══════════════════════════════════
       05. SPOTLIGHT GLOW — cards + pricing
       Soft radial glow follows cursor
    ═══════════════════════════════════ */
    (function spotlight() {
      document.querySelectorAll('.price-card, .tcard, .demo-card').forEach(card => {
        if (getComputedStyle(card).position === 'static') card.style.position = 'relative';
        card.style.overflow = 'hidden';

        const spot = document.createElement('div');
        spot.style.cssText = [
          'position:absolute', 'width:220px', 'height:220px',
          'border-radius:50%',
          'background:radial-gradient(circle,rgba(99,102,241,0.13) 0%,transparent 70%)',
          'pointer-events:none',
          'transform:translate(-50%,-50%)',
          'transition:opacity 0.35s',
          'opacity:0', 'z-index:0',
        ].join(';');
        card.appendChild(spot);

        card.addEventListener('mouseenter', () => spot.style.opacity = '1');
        card.addEventListener('mouseleave', () => spot.style.opacity = '0');
        card.addEventListener('mousemove', e => {
          const r = card.getBoundingClientRect();
          spot.style.left = (e.clientX - r.left) + 'px';
          spot.style.top  = (e.clientY - r.top)  + 'px';
        });
      });
    })();


    /* ═══════════════════════════════════
       06. RIPPLE BURST on primary buttons
    ═══════════════════════════════════ */
    (function ripple() {
      document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';

        btn.addEventListener('click', e => {
          const r    = btn.getBoundingClientRect();
          const size = Math.max(r.width, r.height) * 2.6;
          const x    = e.clientX - r.left - size / 2;
          const y    = e.clientY - r.top  - size / 2;

          const rip = document.createElement('span');
          rip.style.cssText = [
            'position:absolute', 'border-radius:50%', 'pointer-events:none',
            `width:${size}px`, `height:${size}px`,
            `left:${x}px`, `top:${y}px`,
            'background:rgba(255,255,255,0.28)',
            'transform:scale(0)',
          ].join(';');
          btn.appendChild(rip);

          anime({
            targets: rip,
            scale: [0, 1],
            opacity: [0.8, 0],
            duration: 650,
            easing: 'easeOutExpo',
            complete: () => rip.remove(),
          });
        });
      });
    })();


    /* ═══════════════════════════════════
       07. AMBIENT PARTICLE FIELD (canvas)
       Slow rising glowing dots in hero
    ═══════════════════════════════════ */
    (function particleField() {
      const hero = document.getElementById('hero');
      if (!hero) return;

      const cv  = document.createElement('canvas');
      cv.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:1;opacity:0.5;';
      hero.appendChild(cv);
      const ctx = cv.getContext('2d');
      const COLS = ['#3b82f6','#6366f1','#a78bfa','#34d399'];
      let W, H, pts;

      function resize() {
        W = cv.width  = hero.offsetWidth;
        H = cv.height = hero.offsetHeight;
      }

      function make() {
        return {
          x: Math.random() * W,
          y: H + 10,
          r: 0.8 + Math.random() * 2,
          vy: 0.25 + Math.random() * 0.55,
          vx: (Math.random() - 0.5) * 0.3,
          a: 0.3 + Math.random() * 0.55,
          c: COLS[Math.floor(Math.random() * COLS.length)],
          life: 0,
          max: 140 + Math.random() * 180,
        };
      }

      resize();
      pts = Array.from({ length: 55 }, () => { const p = make(); p.y = Math.random() * H; return p; });

      (function draw() {
        ctx.clearRect(0, 0, W, H);
        pts.forEach((p, i) => {
          p.x += p.vx; p.y -= p.vy; p.life++;
          const t = p.life / p.max;
          const alpha = t < 0.15 ? (t / 0.15) * p.a : t > 0.75 ? ((1 - t) / 0.25) * p.a : p.a;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = p.c;
          ctx.globalAlpha = alpha;
          ctx.fill();
          // soft glow halo
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
          g.addColorStop(0, p.c); g.addColorStop(1, 'transparent');
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
          ctx.fillStyle = g; ctx.globalAlpha = alpha * 0.25; ctx.fill();
          ctx.globalAlpha = 1;
          if (p.life >= p.max || p.y < -10) pts[i] = make();
        });
        requestAnimationFrame(draw);
      })();

      window.addEventListener('resize', resize, { passive: true });
    })();


    /* ═══════════════════════════════════
       08. CURSOR MICRO-TRAIL
       Tiny dots, subtle, only when moving fast
    ═══════════════════════════════════ */
    (function cursorTrail() {
      let lx = 0, ly = 0, tick = 0;
      const COLS = ['#3b82f6','#6366f1','#a78bfa'];

      document.addEventListener('mousemove', e => {
        tick++;
        if (tick % 5 !== 0) return;
        const speed = Math.hypot(e.clientX - lx, e.clientY - ly);
        if (speed < 12) return;
        lx = e.clientX; ly = e.clientY;

        // Only 1 particle per event — minimal, not spammy
        const p = document.createElement('div');
        p.style.cssText = [
          'position:fixed', 'pointer-events:none', 'z-index:9985',
          'border-radius:50%', 'width:5px', 'height:5px',
          `left:${e.clientX}px`, `top:${e.clientY}px`,
          `background:${COLS[Math.floor(Math.random() * COLS.length)]}`,
          'transform:translate(-50%,-50%)',
          'will-change:transform,opacity',
        ].join(';');
        document.body.appendChild(p);

        const angle = Math.random() * Math.PI * 2;
        anime({
          targets: p,
          translateX: Math.cos(angle) * (15 + Math.random() * 20),
          translateY: Math.sin(angle) * (15 + Math.random() * 20),
          scale: [1, 0],
          opacity: [0.7, 0],
          duration: 480 + Math.random() * 200,
          easing: 'easeOutExpo',
          complete: () => p.remove(),
        });
      });
    })();


    /* ═══════════════════════════════════
       09. SCROLL PROGRESS BAR
    ═══════════════════════════════════ */
    (function scrollProgress() {
      const bar = document.createElement('div');
      bar.style.cssText = [
        'position:fixed', 'top:0', 'left:0',
        'height:2px', 'width:0%',
        'background:linear-gradient(90deg,#3b82f6,#6366f1,#34d399)',
        'z-index:9999', 'pointer-events:none',
        'box-shadow:0 0 10px rgba(59,130,246,0.7)',
        'transition:width 0.08s linear',
      ].join(';');
      document.body.appendChild(bar);

      window.addEventListener('scroll', () => {
        const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
        bar.style.width = Math.min(pct, 100) + '%';
      }, { passive: true });
    })();


    /* ═══════════════════════════════════
       10. NAV UNDERLINE DRAW
    ═══════════════════════════════════ */
    (function navUnderline() {
      document.querySelectorAll('.nav-links a').forEach(a => {
        a.style.position = 'relative';
        const line = document.createElement('span');
        line.style.cssText = [
          'position:absolute', 'bottom:-2px', 'left:0',
          'height:1.5px', 'width:0',
          'background:var(--accent)',
          'border-radius:1px', 'display:block',
        ].join(';');
        a.appendChild(line);
        a.addEventListener('mouseenter', () =>
          anime({ targets: line, width: ['0%','100%'], duration: 260, easing: 'easeOutExpo' }));
        a.addEventListener('mouseleave', () =>
          anime({ targets: line, width: ['100%','0%'], duration: 180, easing: 'easeInQuad' }));
      });
    })();


    /* ═══════════════════════════════════
       11. HERO BADGE PULSE RINGS
    ═══════════════════════════════════ */
    (function badgePulse() {
      const badge = document.querySelector('.hero-badge');
      if (!badge) return;
      badge.style.position = 'relative';

      function ring() {
        const el = document.createElement('span');
        el.style.cssText = [
          'position:absolute', 'inset:0', 'border-radius:999px',
          'border:1px solid rgba(16,185,129,0.55)',
          'pointer-events:none',
        ].join(';');
        badge.appendChild(el);
        anime({
          targets: el,
          scale: [1, 2.4],
          opacity: [0.7, 0],
          duration: 1400,
          easing: 'easeOutExpo',
          complete: () => el.remove(),
        });
      }

      setTimeout(() => { ring(); setTimeout(ring, 350); setTimeout(ring, 700); }, 700);
      setInterval(() => { ring(); setTimeout(ring, 350); }, 4500);
    })();


    /* ═══════════════════════════════════
       12. CLICK SHOCKWAVE (non-interactive areas)
    ═══════════════════════════════════ */
    (function clickShockwave() {
      document.addEventListener('click', e => {
        if (e.target.closest('a,button,input,.btn,.fc-send,.demo-send')) return;
        const el = document.createElement('div');
        el.style.cssText = [
          'position:fixed', 'border-radius:50%',
          'border:1px solid var(--accent)',
          'pointer-events:none', 'z-index:9990',
          `left:${e.clientX}px`, `top:${e.clientY}px`,
          'width:20px', 'height:20px',
          'transform:translate(-50%,-50%)',
          'opacity:0.6',
        ].join(';');
        document.body.appendChild(el);
        anime({
          targets: el,
          scale: [0, 6],
          opacity: [0.6, 0],
          duration: 650,
          easing: 'easeOutExpo',
          complete: () => el.remove(),
        });
      });
    })();


    /* ═══════════════════════════════════
       13. LOGO MARK — SPIN + GLOW on hover
    ═══════════════════════════════════ */
    (function logoHover() {
      const mark = document.querySelector('.logo-mark');
      if (!mark) return;
      let spinning = false;

      mark.addEventListener('mouseenter', () => {
        if (spinning) return;
        spinning = true;
        anime({
          targets: mark,
          rotateY: [0, 360],
          duration: 700,
          easing: 'easeOutBack',
          complete: () => spinning = false,
        });
        // glow pulse
        anime({
          targets: mark,
          boxShadow: [
            '0 0 16px rgba(59,130,246,0.4)',
            '0 0 36px rgba(99,102,241,0.8)',
            '0 0 16px rgba(59,130,246,0.4)',
          ],
          duration: 700,
          easing: 'easeInOutSine',
        });
      });
    })();


    /* ═══════════════════════════════════
       14. STAT NUMBERS — SLOT MACHINE FLIP
       Stats fly in from below like a ticker
    ═══════════════════════════════════ */
    (function statFlip() {
      const stats = document.querySelectorAll('.hstat');
      const obs = new IntersectionObserver(entries => {
        if (!entries[0].isIntersecting) return;
        anime({
          targets: stats,
          translateY: [30, 0],
          opacity: [0, 1],
          scale: [0.85, 1],
          duration: 650,
          delay: anime.stagger(100),
          easing: 'easeOutBack(1.4)',
        });
        obs.disconnect();
      }, { threshold: 0.6 });
      if (stats.length) obs.observe(stats[0].closest('.hero-stats') || stats[0]);
    })();


    /* ═══════════════════════════════════
       15. VS CARDS — PERSPECTIVE LEAN
       Before/After cards lean on hover
    ═══════════════════════════════════ */
    (function vsLean() {
      const bad  = document.querySelector('.vs-bad');
      const good = document.querySelector('.vs-good');

      if (bad) {
        bad.addEventListener('mouseenter', () =>
          anime({ targets: bad, rotateY: -4, translateX: -6, duration: 400, easing: 'easeOutExpo' }));
        bad.addEventListener('mouseleave', () =>
          anime({ targets: bad, rotateY: 0, translateX: 0, duration: 500, easing: 'easeOutElastic(1,0.5)' }));
      }
      if (good) {
        good.addEventListener('mouseenter', () =>
          anime({ targets: good, rotateY: 4, translateX: 6, duration: 400, easing: 'easeOutExpo' }));
        good.addEventListener('mouseleave', () =>
          anime({ targets: good, rotateY: 0, translateX: 0, duration: 500, easing: 'easeOutElastic(1,0.5)' }));
      }
    })();


    /* ═══════════════════════════════════
       16. STEP NUMBERS — COUNT UP RING
       The step "01 02 03" nums get a brief
       border-radius morph when revealed
    ═══════════════════════════════════ */
    (function stepReveal() {
      const nums = document.querySelectorAll('.step-num');
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (!e.isIntersecting || e.target.dataset.done) return;
          e.target.dataset.done = '1';
          anime({
            targets: e.target,
            scale: [0.6, 1.08, 1],
            opacity: [0, 1],
            borderRadius: ['50%', '12px'],
            duration: 700,
            easing: 'easeOutExpo',
          });
          obs.unobserve(e.target);
        });
      }, { threshold: 0.7 });
      nums.forEach(n => { n.style.opacity = '0'; obs.observe(n); });
    })();


    console.log('%c✦ Nexora FX v2 — 16 effects active', 'color:#3b82f6;font-family:monospace;font-weight:bold;');
  });
})();