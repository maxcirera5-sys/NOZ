/* NOZ – motion layer.
   Horizon scrolls inside .page-wrapper on desktop (≥990px) and the window on mobile, so:
   - entrance reveals use IntersectionObserver (works with any scroll container) and never
     hide content unless JS, GSAP and the observer are all available;
   - scrubbed effects use ScrollTrigger with the scroller that is actually scrolling. */
(function () {
  // Sachet flip: a real button the user controls, independent of GSAP.
  document.querySelectorAll('[data-noz-flip]').forEach((btn) => {
    const scene = document.getElementById(btn.getAttribute('aria-controls'));
    if (!scene) return;
    btn.addEventListener('click', () => {
      const flipped = scene.classList.toggle('is-flipped');
      btn.setAttribute('aria-pressed', String(flipped));
      btn.querySelector('span').textContent = flipped ? 'Ver frente' : 'Ver dorso';
    });
  });

  if (!window.gsap || !window.ScrollTrigger || !('IntersectionObserver' in window)) return;

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  const pageWrapper = document.querySelector('.page-wrapper');
  const activeScroller = () =>
    pageWrapper && getComputedStyle(pageWrapper).overflowY === 'auto' ? pageWrapper : window;

  // Split a heading's text into word/char spans, keeping the full text for screen readers.
  function splitChars(el) {
    if (el.dataset.nozSplit) return el.querySelectorAll('.noz-char');
    const text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    el.dataset.nozSplit = '1';
    el.innerHTML = text
      .split(' ')
      .map(
        (word) =>
          '<span class="noz-word" aria-hidden="true">' +
          [...word].map((c) => '<span class="noz-char">' + c + '</span>').join('') +
          '</span>'
      )
      .join(' ');
    return el.querySelectorAll('.noz-char');
  }

  // Entrance reveal: hide children only once we know we can show them again.
  function reveal(group, stagger) {
    const items = [...group.children];
    if (!items.length) return;
    gsap.set(items, { opacity: 0, y: 28 });
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        gsap.to(items, { opacity: 1, y: 0, duration: 0.6, stagger, ease: 'power3.out', clearProps: 'transform' });
      },
      { rootMargin: '0px 0px -12% 0px' }
    );
    io.observe(group);
  }

  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    /* One entrance per block */
    document.querySelectorAll('.noz-sec__head, .noz-cta__inner').forEach((g) => reveal(g, 0.08));
    document.querySelectorAll('.noz-feats, .noz-steps, .noz-ideal').forEach((g) => reveal(g, 0.1));

    /* Hero headline: letters rise on load (no scroll dependency) */
    const hero = document.querySelector('.hero');
    if (hero) {
      [...hero.querySelectorAll('.hero__content-wrapper :is(h1, .h1, .h1 p)')]
        .filter((el) => !el.querySelector('h1, h2, p, div'))
        .forEach((h, i) => {
          gsap.from(splitChars(h), { yPercent: 110, opacity: 0, duration: 0.8, stagger: 0.02, ease: 'expo.out', delay: 0.1 + i * 0.2 });
        });
    }
  });

  // Scrubbed effects are rebuilt whenever the active scroller changes (desktop ↔ mobile).
  mm.add(
    { desktop: '(min-width: 990px)', motion: '(prefers-reduced-motion: no-preference)' },
    (ctx) => {
      if (!ctx.conditions.motion) return;
      const scroller = activeScroller();
      ScrollTrigger.defaults({ scroller });

      /* Reading progress bar */
      const main = document.querySelector('#MainContent') || document.body;
      const bar = document.createElement('div');
      bar.className = 'noz-progress';
      bar.setAttribute('aria-hidden', 'true');
      document.body.appendChild(bar);
      gsap.to(bar, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: main, start: 'top top', end: 'bottom bottom', scrub: 0.3 } });

      /* Hero is sticky (CSS); as the page slides over it, zoom + dim the video and fade the copy */
      const hero = document.querySelector('.hero');
      if (hero) {
        const media = hero.querySelector('.hero__media-grid');
        const content = hero.querySelector('.hero__content-wrapper');
        const veil = document.createElement('div');
        veil.className = 'noz-hero-veil';
        veil.setAttribute('aria-hidden', 'true');
        if (media) media.after(veil);
        else hero.appendChild(veil);
        const exit = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
        });
        if (media) exit.to(media, { scale: 1.12 }, 0);
        if (content) exit.to(content, { opacity: 0, y: -40 }, 0);
        exit.to(veil, { opacity: 0.75 }, 0);
      }

      /* Marquee skews with scroll velocity */
      const marquee = document.querySelector('.noz-marquee__track');
      if (marquee) {
        const skewTo = gsap.quickTo(marquee, 'skewX', { duration: 0.4, ease: 'power3' });
        ScrollTrigger.create({ onUpdate: (self) => skewTo(gsap.utils.clamp(-10, 10, self.getVelocity() / -150)) });
      }

      /* Sachet tilts into place while it crosses the viewport (no pinning) */
      document.querySelectorAll('.noz-pack__visual').forEach((visual) => {
        const float = visual.querySelector('.noz-pack__float');
        const strip = visual.querySelector('.noz-pack__strip');
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: visual, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        });
        if (float) tl.fromTo(float, { rotateY: -24, rotateX: 10, yPercent: 8 }, { rotateY: 12, rotateX: -4, yPercent: -6 }, 0);
        if (strip) tl.fromTo(strip, { yPercent: 30, opacity: 0.3 }, { yPercent: -18, opacity: 1 }, 0);
      });

      return () => {
        bar.remove();
        document.querySelectorAll('.noz-hero-veil').forEach((v) => v.remove());
      };
    }
  );

  /* Pointer tilt on the sachet (desktop pointers only) */
  const visual = document.querySelector('.noz-pack__visual');
  const tilt = visual && visual.querySelector('.noz-pack__tilt');
  if (tilt && window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) {
    const rx = gsap.quickTo(tilt, 'rotateX', { duration: 0.5, ease: 'power3' });
    const ry = gsap.quickTo(tilt, 'rotateY', { duration: 0.5, ease: 'power3' });
    visual.addEventListener('pointermove', (e) => {
      const r = visual.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 18);
      rx(-((e.clientY - r.top) / r.height - 0.5) * 12);
    });
    visual.addEventListener('pointerleave', () => {
      rx(0);
      ry(0);
    });
  }

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
