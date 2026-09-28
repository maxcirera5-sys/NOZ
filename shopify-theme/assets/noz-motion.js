/* NOZ – motion layer (GSAP + ScrollTrigger). Content is fully visible without JS. */
(function () {
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
    document.documentElement.classList.add('noz-motion');
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

    /* Hero: headline char reveal, parallax video, content fade on exit */
    const hero = document.querySelector('.hero');
    if (hero) {
      // Only leaf text elements, so a wrapper never gets its inner <h1>/<p> replaced.
      const headlines = [...hero.querySelectorAll('.hero__content-wrapper :is(h1, .h1, .h1 p)')].filter(
        (el) => !el.querySelector('h1, h2, p, div')
      );
      headlines.forEach((h, i) => {
        gsap.from(splitChars(h), {
          yPercent: 110,
          rotate: 6,
          opacity: 0,
          duration: 0.9,
          stagger: 0.025,
          ease: 'expo.out',
          delay: 0.15 + i * 0.25,
        });
      });

      const media = hero.querySelector('.hero__media-grid');
      if (media) {
        gsap.to(media, {
          yPercent: 12,
          scale: 1.06,
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
        });
      }
      const content = hero.querySelector('.hero__content-wrapper');
      if (content) {
        gsap.to(content, {
          opacity: 0,
          y: -60,
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'center center', end: 'bottom top', scrub: true },
        });
      }
    }

    /* Marquee skews with scroll velocity */
    const marquee = document.querySelector('.noz-marquee__track');
    if (marquee) {
      const skewTo = gsap.quickTo(marquee, 'skewX', { duration: 0.4, ease: 'power3' });
      ScrollTrigger.create({
        onUpdate: (self) => skewTo(gsap.utils.clamp(-12, 12, self.getVelocity() / -150)),
      });
    }

    /* Manifesto: words light up as you scroll */
    document.querySelectorAll('.noz-manifesto__text').forEach((el) => {
      const words = el.querySelectorAll('.noz-mword');
      gsap.fromTo(
        words,
        { opacity: 0.15 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true },
        }
      );
    });

    /* Section headings: char reveal on enter */
    document
      .querySelectorAll('[id$="__benefits"] h2, [id$="__how_it_works"] .noz-steps__title, .noz-cta__title')
      .forEach((h) => {
        if (h.querySelector('br')) {
          gsap.from(h, { y: 60, opacity: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 85%' } });
          return;
        }
        gsap.from(splitChars(h), {
          yPercent: 100,
          opacity: 0,
          duration: 0.7,
          stagger: 0.02,
          ease: 'expo.out',
          scrollTrigger: { trigger: h, start: 'top 85%' },
        });
      });

    /* Staggered cards */
    document
      .querySelectorAll('[id$="__benefits"] .group-block .group-block-content, [id$="__ideal_for"] .group-block .group-block-content')
      .forEach((row) => {
        const items = row.querySelectorAll(':scope > .group-block');
        if (!items.length) return;
        gsap.from(items, {
          y: 48,
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: row, start: 'top 85%' },
        });
      });

    /* Stats: count up + stagger */
    document.querySelectorAll('.noz-stats').forEach((stats) => {
      gsap.from(stats.children, {
        y: 32,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: { trigger: stats, start: 'top 85%' },
      });
      stats.querySelectorAll('[data-count]').forEach((el) => {
        const end = parseFloat(el.dataset.count);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: end,
          duration: 1.4,
          ease: 'power2.out',
          scrollTrigger: { trigger: stats, start: 'top 85%' },
          onUpdate: () => (el.textContent = Math.round(obj.v)),
        });
      });
    });

    /* Sachet: pinned 3D scroll story (enter → flip to back → flip to front → strip pops out) */
    const pack = document.querySelector('.noz-pack');
    if (pack) {
      const stage = pack.querySelector('.noz-pack__stage');
      const card = pack.querySelector('.noz-pack__card');
      const strip = pack.querySelector('.noz-pack__strip');
      const callouts = pack.querySelectorAll('.noz-pack__callouts li');
      const copy = pack.querySelector('.noz-pack__copy');
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: pack, start: 'top top', end: '+=260%', pin: stage, scrub: 1, anticipatePin: 1 },
      });
      tl.fromTo(pack.querySelector('.noz-pack__bgword'), { xPercent: 10 }, { xPercent: -55, duration: 4 }, 0)
        .fromTo(pack.querySelector('.noz-pack__ring'), { scale: 0.4, opacity: 0 }, { scale: 1.25, opacity: 1, duration: 1.2 }, 0)
        .fromTo(card, { yPercent: 40, rotateX: 35, rotateY: -35, rotateZ: -8, scale: 0.7, opacity: 0 }, { yPercent: 0, rotateX: 6, rotateY: -18, rotateZ: 0, scale: 1, opacity: 1, duration: 1, ease: 'power2.out' }, 0)
        .fromTo(copy, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.3)
        .to(card, { rotateY: 180, rotateX: 0, duration: 1, ease: 'power1.inOut', '--shine': '0%' }, 1)
        .to(card, { rotateY: 360, rotateX: 4, duration: 1, ease: 'power1.inOut', '--shine': '100%' }, 2)
        .fromTo(callouts, { x: 40, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.15, duration: 0.5 }, 2)
        .to(card, { yPercent: 18, scale: 0.86, duration: 1 }, 3)
        .fromTo(strip, { yPercent: 40, rotate: 0, opacity: 0, scale: 0.7 }, { yPercent: -58, rotate: -8, opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }, 3);

      // Pointer tilt on a separate wrapper so it never fights the scroll timeline.
      const tilt = pack.querySelector('.noz-pack__tilt');
      if (tilt && window.matchMedia('(hover: hover)').matches) {
        const rx = gsap.quickTo(tilt, 'rotateX', { duration: 0.5, ease: 'power3' });
        const ry = gsap.quickTo(tilt, 'rotateY', { duration: 0.5, ease: 'power3' });
        stage.addEventListener('pointermove', (e) => {
          const r = stage.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 16);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 12);
        });
        stage.addEventListener('pointerleave', () => {
          rx(0);
          ry(0);
        });
      }
    }

    /* Final CTA */
    const cta = document.querySelector('.noz-cta__inner');
    if (cta) {
      gsap.from(cta.children, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: cta, start: 'top 80%' },
      });
    }
  });

  /* How it works: pinned horizontal scroll on desktop only */
  mm.add('(min-width: 990px) and (prefers-reduced-motion: no-preference)', () => {
    const wrap = document.querySelector('.noz-steps');
    const track = wrap && wrap.querySelector('.noz-steps__track');
    if (!track) return;
    wrap.classList.add('is-pinned');
    const distance = () => track.scrollWidth - window.innerWidth;
    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: wrap,
        start: 'top top',
        end: () => '+=' + distance(),
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });
    track.querySelectorAll('.noz-step__num').forEach((num) => {
      gsap.fromTo(
        num,
        { color: 'rgba(198,255,0,0)' },
        {
          color: 'rgba(198,255,0,1)',
          ease: 'none',
          scrollTrigger: { trigger: num, containerAnimation: tween, start: 'left 70%', end: 'left 30%', scrub: true },
        }
      );
    });
    return () => wrap.classList.remove('is-pinned');
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
