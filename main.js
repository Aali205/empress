/* Empress Patisserie — interactions & scroll animations */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof gsap !== 'undefined';

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) window.scrollTo(0, 0);

  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- collection data (from Empress's own product line) ---------- */
  const cakes = [
    { img: 'cake5.jpg',  en: 'Strawberry Royale',  ar: 'كيك الفراولة',        d: 'Fresh strawberries crowned on light vanilla sponge and silky cream.' },
    { img: 'cake4.jpg',  en: 'Fruit Crown',        ar: 'كيك الفواكه',         d: 'Seasonal fruit jewels held in a hand-painted chocolate collar.' },
    { img: 'cake12.jpg', en: 'Noir Macaron',       ar: 'كيك الشوكولا',        d: 'Mirror-glazed dark chocolate, macarons and white-chocolate lace.' },
    { img: 'cake7.jpg',  en: 'Pink Donut Dream',   ar: 'كيك الفانيلا مع دوناتس', d: 'Vanilla layers, raspberry drip and glazed mini donuts.' },
    { img: 'cake9.jpg',  en: 'Chocolate Donut Tower', ar: 'كيك الشوكولا مع دوناتس', d: 'Chocolate drip, Oreo, biscuits and filled donuts. Pure indulgence.' },
    { img: 'cake13.jpg', en: 'Blanc Fraise',       ar: 'كيك الفراولة',        d: 'White chocolate ganache with chocolate-dipped strawberries.' },
    { img: 'cake1.jpg',  en: 'Caramel Praline',    ar: 'كيك الشوكولا',        d: 'Chocolate cake wrapped in toasted nuts and caramel crunch.' },
    { img: 'cake3.jpg',  en: 'Mother\'s Day Mint', ar: 'كيك عيد الام',        d: 'Pastel drip, macarons and a message made for Mum.' },
  ];
  const track = $('#hTrack');
  if (track) {
    const arrow = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
    track.innerHTML =
      `<div class="card card--intro"><p>Each creation begins with the finest ingredients and ends with a signature Empress flourish.</p><span>Drag your scroll →</span></div>` +
      cakes.map((c, i) => `
        <article class="card">
          <div class="card__media" data-cursor="Order">
            <img src="assets/img/${c.img}" alt="${c.en}" loading="lazy" />
            <span class="card__idx">N° ${String(i + 1).padStart(2, '0')}</span>
          </div>
          <div class="card__body">
            <div>
              <h3>${c.en}</h3>
              <p class="ar" dir="rtl">${c.ar}</p>
              <p class="desc">${c.d}</p>
            </div>
            <a class="card__order" href="https://wa.me/963985122225?text=${encodeURIComponent('Hello Empress, I would like to order: ' + c.en)}" target="_blank" rel="noopener" aria-label="Order ${c.en}">${arrow}</a>
          </div>
        </article>`).join('');
  }

  /* ---------- mobile menu ---------- */
  const burger = $('#burger');
  if (burger) {
    burger.addEventListener('click', () => document.body.classList.toggle('menu-open'));
    $$('#menu a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('menu-open')));
  }

  /* ---------- cursor + magnetic buttons ---------- */
  const cursor = $('#cursor');
  if (cursor && hasGsap && window.matchMedia('(hover: hover)').matches) {
    const xTo = gsap.quickTo(cursor, 'x', { duration: .35, ease: 'power3' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: .35, ease: 'power3' });
    window.addEventListener('mousemove', e => { xTo(e.clientX); yTo(e.clientY); });
    document.addEventListener('mouseover', e => {
      const view = e.target.closest('[data-cursor]');
      const link = e.target.closest('a, button, .opt');
      cursor.classList.toggle('is-view', !!view);
      cursor.classList.toggle('is-hover', !view && !!link);
      if (view) $('.cursor__label', cursor).textContent = view.dataset.cursor;
    });
    $$('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * .3, y: (e.clientY - r.top - r.height / 2) * .4, duration: .5, ease: 'power3' });
      });
      el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: .8, ease: 'elastic.out(1, .4)' }));
    });
  }

  if (!hasGsap) { $('#loader')?.remove(); return; }
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (!reduced && typeof Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const target = $(a.getAttribute('href'));
      if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -20 }); }
    }));
  }
  window.__lenis = lenis;

  /* ---------- nav hide / show ---------- */
  const nav = $('#nav');
  let lastY = 0;
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: self => {
      const y = self.scroll();
      nav.classList.toggle('is-scrolled', y > 40);
      nav.classList.toggle('is-hidden', y > lastY && y > 400 && !document.body.classList.contains('menu-open'));
      lastY = y;
    }
  });

  /* ---------- loader + hero intro ---------- */
  const loader = $('#loader');
  const heroIntro = () => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.from('.hero__title .split-line > span', { yPercent: 110, duration: 1.3, stagger: .12 })
      .from('.hero__eyebrow, .hero__ar, .hero__lead, .hero__actions', { y: 30, opacity: 0, duration: 1, stagger: .1 }, '-=.9')
      .from('.hero__frame', { clipPath: 'inset(100% 0 0 0 round 999px 999px 24px 24px)', duration: 1.6, ease: 'expo.inOut' }, 0)
      .from('.hero__img', { scale: 1.6, duration: 2.2, ease: 'expo.out' }, .3)
      .from('.hero__float', { scale: 0, rotate: -30, duration: 1.2, stagger: .15, ease: 'back.out(1.6)' }, .8)
      .from('.badge', { opacity: 0, scale: .5, duration: 1 }, 1)
      .from('.nav', { opacity: 0, duration: 1, clearProps: 'opacity' }, .6)
      .from('.hero__bg-word', { opacity: 0, letterSpacing: '.3em', duration: 2, ease: 'power2.out' }, 0);
    return tl;
  };

  if (loader && !reduced) {
    document.body.classList.add('is-loading');
    lenis?.stop();
    const counter = { v: 0 };
    const logoParts = $$('.loader__logo g path');
    logoParts.forEach(p => { const l = p.getTotalLength(); p.style.strokeDasharray = l; p.style.strokeDashoffset = l; });
    // one compound path (holes intact) for the final solid logo
    $('.loader__fill').setAttribute('d', logoParts.map(p => p.getAttribute('d')).join(' '));

    const draw = { strokeDashoffset: 0, ease: 'power1.inOut' };
    const tl = gsap.timeline();
    tl.to('.logo-draw__frame path', { ...draw, duration: 1.8, stagger: .15 }, 0)
      .to('.logo-draw__crown path', { ...draw, duration: 1, stagger: .2 }, .5)
      .to('.logo-draw__word path', { ...draw, duration: .9, stagger: .12 }, .9)
      .to('.logo-draw__script path', { ...draw, duration: .6, stagger: .05 }, 1.6)
      .to(counter, { v: 100, duration: 3, ease: 'power2.inOut', onUpdate: () => { $('#loaderCount').textContent = Math.round(counter.v); } }, 0)
      .to('.loader__fill', { opacity: 1, duration: .7, ease: 'power2.out' }, 2.9)
      .to(logoParts, { strokeOpacity: 0, duration: .7 }, 3.1)
      .to('.loader__logo', { scale: 1.04, duration: 1, ease: 'power2.out' }, 2.9)
      .to('.loader__inner', { opacity: 0, y: -30, duration: .6, ease: 'power2.in' }, 4)
      .to('.loader__count', { opacity: 0, duration: .4 }, 4)
      .to('.loader__panel--top', { yPercent: -100, duration: 1.2, ease: 'expo.inOut' }, 4.4)
      .to('.loader__panel--bottom', { yPercent: 100, duration: 1.2, ease: 'expo.inOut' }, 4.4)
      .add(() => {
        loader.remove();
        document.body.classList.remove('is-loading');
        lenis?.start();
        ScrollTrigger.refresh();
      })
      .add(heroIntro(), 4.6);
  } else {
    loader?.remove();
    if ($('.hero')) heroIntro();
  }

  if (reduced) return;
  const mm = gsap.matchMedia();

  /* ---------- hero scroll parallax ---------- */
  if ($('.hero')) {
    const st = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
    gsap.to('.hero__img', { yPercent: 12, scale: 1.05, scrollTrigger: st });
    gsap.to('.hero__float--a', { y: -160, rotate: -12, scrollTrigger: st });
    gsap.to('.hero__float--b', { y: 140, rotate: 18, scrollTrigger: st });
    gsap.to('.hero__bg-word', { xPercent: -18, scrollTrigger: st });
    gsap.to('.hero__content', { y: 120, opacity: .2, scrollTrigger: st });
  }

  /* ---------- velocity marquee ---------- */
  const marquee = $('#marquee');
  if (marquee) {
    let x = 0, speed = 1, dir = -1;
    ScrollTrigger.create({
      onUpdate: self => { dir = self.direction === 1 ? -1 : 1; speed = 1 + Math.min(Math.abs(self.getVelocity()) / 300, 8); }
    });
    gsap.ticker.add(() => {
      const half = marquee.scrollWidth / 2;
      x += dir * speed * 0.9;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      gsap.set(marquee, { x });
      speed += (1 - speed) * 0.05;
    });
  }

  /* ---------- story statement word-by-word ---------- */
  const statement = $('#statement');
  if (statement) {
    statement.innerHTML = statement.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ');
    gsap.to($$('.w', statement), {
      opacity: 1, stagger: .1, ease: 'none',
      scrollTrigger: { trigger: statement, start: 'top 80%', end: 'bottom 45%', scrub: true }
    });
  }
  $$('[data-speed]').forEach(el => {
    gsap.to(el, { yPercent: parseFloat(el.dataset.speed) * 100, ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo($('img', el), { scale: 1.3 }, { scale: 1, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* ---------- generic fade-ups ---------- */
  $$('.section-title, .eyebrow:not(.hero__eyebrow), .story__sign').forEach(el => {
    gsap.from(el, { y: 60, opacity: 0, duration: 1.2, ease: 'power4.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
  });

  /* ---------- horizontal collection ---------- */
  if (track) {
    mm.add('(min-width: 700px)', () => {
      const distance = () => track.scrollWidth - window.innerWidth;
      const tween = gsap.to(track, {
        x: () => -distance(), ease: 'none',
        scrollTrigger: {
          trigger: '.collection', start: 'top top', end: () => '+=' + distance(),
          pin: '.collection__pin', scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: self => gsap.set('#hProgress', { scaleX: self.progress })
        }
      });
      $$('.card:not(.card--intro) .card__media img', track).forEach(img => {
        gsap.fromTo(img, { xPercent: -8 }, { xPercent: 8, ease: 'none',
          scrollTrigger: { trigger: img.closest('.card'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
      });
    });
    mm.add('(max-width: 699px)', () => {
      $('.collection__track').style.cssText = 'width:auto;overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:20px';
      $('.collection__pin').style.height = 'auto';
    });
  }

  /* ---------- clip-path zoom reveal ---------- */
  if ($('#reveal')) {
    const tl = gsap.timeline({ scrollTrigger: { trigger: '#reveal', start: 'top top', end: 'bottom bottom', scrub: 1 } });
    tl.to('#revealMedia', { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'power2.inOut', duration: 1 })
      .to('#revealMedia img', { scale: 1, ease: 'power2.inOut', duration: 1 }, 0)
      .to('#revealMedia', { '--o': 1, duration: .1 }, .6)
      .to('.reveal__text', { opacity: 1, y: 0, duration: .4 }, .65)
      .set({}, {}, 1.3);
  }

  /* ---------- offerings ---------- */
  if ($('.offer')) {
    gsap.from('.offer', { y: 120, opacity: 0, rotateX: -12, duration: 1.3, stagger: .12, ease: 'power4.out',
      scrollTrigger: { trigger: '.offerings__grid', start: 'top 80%' } });
    $$('.tilt').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
        gsap.to(card, { rotateY: px * 12, rotateX: -py * 12, duration: .6, ease: 'power3' });
      });
      card.addEventListener('mouseleave', () => gsap.to(card, { rotateX: 0, rotateY: 0, duration: 1, ease: 'elastic.out(1,.5)' }));
    });
  }

  /* ---------- counters ---------- */
  $$('[data-count]').forEach(el => {
    const o = { v: 0 };
    gsap.to(o, { v: +el.dataset.count, duration: 2.2, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
      onUpdate: () => { el.textContent = Math.round(o.v); } });
  });

  /* ---------- gallery columns ---------- */
  $$('.gallery__col').forEach(col => {
    gsap.fromTo(col, { yPercent: 0 }, { yPercent: parseFloat(col.dataset.gspeed), ease: 'none',
      scrollTrigger: { trigger: '.gallery', start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* ---------- custom CTA ---------- */
  if ($('.custom')) {
    gsap.from('.custom__visual img', { clipPath: 'inset(100% 0 0 0)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: '.custom', start: 'top 70%' } });
    gsap.from('.custom__chip', { scale: 0, opacity: 0, duration: 1, stagger: .15, ease: 'back.out(1.8)', delay: .8, scrollTrigger: { trigger: '.custom', start: 'top 70%' } });
    $$('.custom__chip').forEach((chip, i) => gsap.to(chip, { y: (i % 2 ? 1 : -1) * 60, ease: 'none', scrollTrigger: { trigger: '.custom', start: 'top bottom', end: 'bottom top', scrub: true } }));
    gsap.from('.custom__list li', { x: -30, opacity: 0, duration: .9, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '.custom__list', start: 'top 85%' } });
  }

  /* ---------- visit + footer ---------- */
  if ($('.visit__title')) {
    gsap.from('.visit__title .split-line > span', { yPercent: 110, duration: 1.3, stagger: .12, ease: 'power4.out',
      scrollTrigger: { trigger: '.visit__title', start: 'top 80%' } });
    gsap.from('.visit__card', { y: 40, opacity: 0, duration: 1, stagger: .1, ease: 'power3.out',
      scrollTrigger: { trigger: '.visit__grid', start: 'top 85%' } });
  }
  if ($('.footer__big')) {
    gsap.from('.footer__big span', { yPercent: 100, duration: 1.2, stagger: .05, ease: 'power4.out',
      scrollTrigger: { trigger: '.footer', start: 'top 85%' } });
  }

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
