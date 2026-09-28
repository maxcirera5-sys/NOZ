/* NOZ – motion layer. No scroll-jacking: nothing is pinned, content is fully visible without JS. */
(function () {
  // Sachet flip works without GSAP: a real button the user controls.
  document.querySelectorAll('[data-noz-flip]').forEach((btn) => {
    const scene = document.getElementById(btn.getAttribute('aria-controls'));
    if (!scene) return;
    btn.addEventListener('click', () => {
      const flipped = scene.classList.toggle('is-flipped');
      btn.setAttribute('aria-pressed', String(flipped));
      btn.querySelector('span').textContent = flipped ? 'Ver frente' : 'Ver dorso';
    });
  });

  if (!window.gsap || !window.ScrollTrigger) return;

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

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

  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    /* Reading progress bar */
    const bar = document.createElement('div');
    bar.className = 'noz-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    gsap.to(bar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
    });

    /* Hero: headline char reveal on load + subtle video parallax */
    const hero = document.querySelector('.hero');
    if (hero) {
      // Only leaf text elements, so a wrapper never gets its inner <h1>/<p> replaced.
      const headlines = [...hero.querySelectorAll('.hero__content-wrapper :is(h1, .h1, .h1 p)')].filter(
        (el) => !el.querySelector('h1, h2, p, div')
      );
      headlines.forEach((h, i) => {
        gsap.from(splitChars(h), {
          yPercent: 110,
          opacity: 0,
          duration: 0.8,
          stagger: 0.02,
          ease: 'expo.out',
          delay: 0.1 + i * 0.2,
        });
      });
      const media = hero.querySelector('.hero__media-grid');
      if (media) {
        gsap.to(media, {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
        });
      }
    }

    /* Marquee skews with scroll velocity */
    const marquee = document.querySelector('.noz-marquee__track');
    if (marquee) {
      const skewTo = gsap.quickTo(marquee, 'skewX', { duration: 0.4, ease: 'power3' });
      ScrollTrigger.create({
        onUpdate: (self) => skewTo(gsap.utils.clamp(-10, 10, self.getVelocity() / -150)),
      });
    }

    /* One entrance per block: heading, then its list items */
    document.querySelectorAll('.noz-sec__head, .noz-cta__inner').forEach((head) => {
      gsap.from(head.children, {
        y: 32,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: head, start: 'top 85%', once: true },
      });
    });
    document.querySelectorAll('.noz-feats, .noz-steps, .noz-ideal').forEach((list) => {
      gsap.from(list.children, {
        y: 32,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: list, start: 'top 85%', once: true },
      });
    });

    /* Sachet: tilts into place while it crosses the viewport (no pinning) */
    document.querySelectorAll('.noz-pack__visual').forEach((visual) => {
      const float = visual.querySelector('.noz-pack__float');
      const strip = visual.querySelector('.noz-pack__strip');
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: visual, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      });
      if (float) tl.fromTo(float, { rotateY: -28, rotateX: 12, yPercent: 10 }, { rotateY: 14, rotateX: -4, yPercent: -6 }, 0);
      if (strip) tl.fromTo(strip, { yPercent: 30, opacity: 0.2 }, { yPercent: -18, opacity: 1 }, 0);

      // Pointer tilt on its own wrapper so it never fights the scroll timeline.
      const tilt = visual.querySelector('.noz-pack__tilt');
      if (tilt && window.matchMedia('(hover: hover)').matches) {
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
    });
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
