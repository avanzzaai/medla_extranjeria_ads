/* MEDLA · Extranjería y Movilidad — interacción y motion */
(() => {
  'use strict';

  const d = document;
  const $ = (s, el = d) => el.querySelector(s);
  const $$ = (s, el = d) => [...el.querySelectorAll(s)];
  const curtain = $('.curtain');

  /* ---------- Medición para anuncios ----------
     Empuja eventos a dataLayer (GTM) y, si existe, al píxel de Meta. */
  const track = (event, data = {}) => {
    (window.dataLayer = window.dataLayer || []).push({ event, ...data });
    if (typeof window.fbq === 'function') {
      if (event.startsWith('cta_') || event === 'case_select') window.fbq('trackCustom', 'BookingIntent', data);
      if (event === 'click_whatsapp') window.fbq('track', 'Contact', { method: 'whatsapp' });
      if (event === 'calendar_view') window.fbq('track', 'ViewContent', { content_name: 'Calendario extranjería' });
    }
  };

  /* ---------- Situación elegida → tarjeta de precio ---------- */
  const state = { motivo: '' };
  const setMotivo = (motivo) => {
    state.motivo = motivo;
    $$('[data-motivo-chip]').forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.motivo === motivo)));
    $$('[data-motivo-out]').forEach((o) => { o.textContent = motivo || 'Extranjería y movilidad'; });
    try { sessionStorage.setItem('medla-motivo', motivo); } catch (e) { /* almacenamiento no disponible */ }
  };
  /* ---------- Mensaje adaptado al anuncio: ?caso=<clave> ----------
     Cada campaña enlaza con su caso para que el titular repita la promesa del anuncio. */
  const VARIANTS = {
    regularizacion: {
      h1: 'Regularización 2026: <em>aún puedes actuar.</em>',
      lead: '¿Sigues sin respuesta después de 3 meses o te llegó una denegación? Todavía puedes recurrir. En 45 minutos un abogado de extranjería revisa tu expediente y te dice si conviene recurrir ya o esperar.',
      motivo: 'Regularización 2026',
    },
    arraigo: {
      h1: 'Dos años en España. <em>Ya toca tener papeles.</em>',
      lead: 'Social, sociolaboral, socioformativo o familiar: en 45 minutos un abogado de extranjería te dice qué arraigo te corresponde y qué te falta para presentarlo bien a la primera.',
      motivo: 'Arraigo',
    },
    nacionalidad: {
      h1: 'Tu nacionalidad española, <em>sin sustos.</em>',
      lead: 'Las denegaciones se han triplicado desde 2023. En 45 minutos un abogado de extranjería revisa tus años de residencia y tus documentos antes de que presentes la solicitud.',
      motivo: 'Nacionalidad española',
    },
    visados: {
      h1: 'Múdate a España <em>con el visado correcto.</em>',
      lead: 'Estudios, nómada digital o no lucrativa: en 45 minutos un abogado de extranjería te dice cuál encaja con tus ingresos y tus planes, y qué documentos de tu país hay que apostillar y traducir.',
      motivo: 'Visado (estudios, nómada digital, no lucrativa)',
    },
    renovacion: {
      h1: 'Renueva tu permiso <em>antes de que venza.</em>',
      lead: 'Renovaciones y cambios de permiso —de estudiante o no lucrativa a trabajo, o de la regularización a un permiso ordinario—: un abogado de extranjería revisa tus requisitos en 45 minutos.',
      motivo: 'Renovación o cambio de permiso',
    },
    recurso: {
      h1: 'Te lo denegaron. <em>Todavía hay plazo.</em>',
      lead: 'Contra una denegación tienes 1 mes para el recurso de reposición. En 45 minutos un abogado de extranjería revisa la resolución y te dice si el recurso es viable.',
      motivo: 'Recurso por denegación',
    },
  };
  const caso = (new URLSearchParams(location.search).get('caso') || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const variant = VARIANTS[caso];
  let restored = '';
  try { restored = sessionStorage.getItem('medla-motivo') || ''; } catch (e) { /* almacenamiento no disponible */ }
  if (variant) {
    $('[data-hero-title]').innerHTML = variant.h1;
    $('[data-hero-copy]').textContent = variant.lead;
    if (caso === 'regularizacion' || caso === 'recurso') $('[data-alert]').hidden = true;
    setMotivo(variant.motivo);
    (window.dataLayer = window.dataLayer || []).push({ event: 'landing_variant', caso });
  } else if (restored) {
    setMotivo(restored);
  }

  d.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-motivo-chip]');
    if (chip) {
      setMotivo(chip.getAttribute('aria-pressed') === 'true' ? '' : chip.dataset.motivo);
      return;
    }
    const pick = e.target.closest('[data-motivo]');
    if (pick) setMotivo(pick.dataset.motivo);
    const t = e.target.closest('[data-track]');
    if (t) track(t.dataset.track, { motivo: state.motivo || 'sin elegir' });
  });

  /* ---------- Calendario de HighLevel (carga diferida) ---------- */
  const cal = $('[data-cal]');
  const skeleton = $('[data-cal-skeleton]');
  let calLoaded = false;
  const loadCalendar = () => {
    if (calLoaded || !cal) return;
    calLoaded = true;
    cal.addEventListener('load', () => {
      setTimeout(() => skeleton && skeleton.classList.add('is-gone'), 400);
    }, { once: true });
    cal.src = cal.dataset.src;
    const s = d.createElement('script');
    s.src = 'https://link.msgsndr.com/js/form_embed.js';
    s.defer = true;
    d.body.appendChild(s);
    track('calendar_view');
  };
  if (cal && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((en) => en.isIntersecting)) { loadCalendar(); io.disconnect(); }
    }, { rootMargin: '1200px 0px' });
    io.observe(cal);
  } else {
    loadCalendar();
  }
  // Si alguien pulsa un CTA, el calendario empieza a cargar antes de llegar.
  d.addEventListener('click', (e) => { if (e.target.closest('a[href="#reserva"]')) loadCalendar(); });

  /* ---------- Acordeón ---------- */
  $$('.acc__btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const acc = btn.closest('.acc');
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      acc.classList.toggle('is-open', open);
      if (open) track('faq_open', { question: btn.textContent.trim() });
    });
  });

  /* ---------- Carrusel de reseñas ---------- */
  const revTrack = $('[data-rev-track]');
  if (revTrack) {
    const step = (dir) => {
      const card = revTrack.querySelector('.review');
      const gap = parseFloat(getComputedStyle(revTrack).columnGap) || 20;
      revTrack.scrollBy({ left: dir * (card.getBoundingClientRect().width + gap), behavior: 'smooth' });
    };
    $('[data-rev-prev]').addEventListener('click', () => step(-1));
    $('[data-rev-next]').addEventListener('click', () => step(1));
  }

  /* ---------- Barra fija móvil + nav que se esconde ---------- */
  const dock = $('[data-dock]');
  const nav = $('[data-nav]');
  const heroCard = $('[data-hero-card]');
  const booking = $('#reserva');
  let pastHero = false;
  let onBooking = false;
  const syncDock = () => {
    const show = pastHero && !onBooking;
    dock.classList.toggle('is-visible', show);
    dock.setAttribute('aria-hidden', String(!show));
    $$('a', dock).forEach((a) => a.setAttribute('tabindex', show ? '0' : '-1'));
  };
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => { pastHero = !en.isIntersecting; syncDock(); }).observe(heroCard);
    new IntersectionObserver(([en]) => { onBooking = en.isIntersecting; syncDock(); }, { threshold: 0.05 }).observe(booking);
  }
  let lastY = window.scrollY;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const down = y > lastY + 4;
      const up = y < lastY - 4;
      if (down && y > 400) nav.classList.add('is-hidden');
      else if (up || y < 400) nav.classList.remove('is-hidden');
      lastY = y;
      ticking = false;
    });
  }, { passive: true });
  nav.addEventListener('focusin', () => nav.classList.remove('is-hidden'));

  /* ---------- Partir texto en palabras ---------- */
  const splitWords = (el, cls = 'w', innerCls = 'wi') => {
    if (el.dataset.splitDone) return $$(`.${innerCls}`, el);
    el.dataset.splitDone = '1';
    const out = [];
    const walk = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === 3) {
          const parts = child.textContent.split(/(\s+)/);
          const frag = d.createDocumentFragment();
          parts.forEach((p) => {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(d.createTextNode(' ')); return; }
            const outer = d.createElement('span');
            outer.className = cls;
            const inner = d.createElement('span');
            inner.className = innerCls;
            inner.textContent = p;
            outer.appendChild(inner);
            frag.appendChild(outer);
            out.push(inner);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1) {
          walk(child);
        }
      });
    };
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    walk(el);
    $$(`.${cls}`, el).forEach((w) => w.setAttribute('aria-hidden', 'true'));
    return out;
  };

  /* ---------- Sin GSAP: todo visible y la cortina fuera ---------- */
  const removeCurtain = () => { if (curtain) curtain.remove(); };
  if (!window.gsap || !window.ScrollTrigger) {
    removeCurtain();
    return;
  }

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power3.out', duration: 0.9 });
  if (curtain) curtain.style.animation = 'none';

  const mm = gsap.matchMedia();
  mm.add(
    {
      motion: '(prefers-reduced-motion: no-preference)',
      reduce: '(prefers-reduced-motion: reduce)',
    },
    (ctx) => {
      const { motion } = ctx.conditions;
      const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      const isDesktop = () => window.innerWidth >= 1024;

      /* --- Movimiento reducido: estado final, sin coreografía --- */
      if (!motion) {
        removeCurtain();
        $('[data-marquee]').classList.add('marquee--static');
        return undefined;
      }

      /* ===== 1 · Entrada de página + hero ===== */
      const words = splitWords($('[data-split]'));
      const orbs = $$('[data-orb]');
      const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
      intro
        .to(curtain, { yPercent: -100, duration: 1, ease: 'expo.inOut', onComplete: removeCurtain })
        .from(heroCard, { scale: 0.92, duration: 1.4 }, 0.45)
        .from('[data-hero-img]', { scale: 1.28, duration: 2, ease: 'power3.out' }, 0.45)
        .from('[data-hero-proof]', { y: 24, autoAlpha: 0, duration: 0.8 }, 0.8)
        .from('.hero__alert', { y: -16, autoAlpha: 0, duration: 0.8 }, 0.7)
        .from(words, { yPercent: 115, duration: 1.1, stagger: 0.06 }, 0.85)
        .from('[data-hero-lead]', { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.12 }, 1.2)
        .from('[data-hero-ctas] > *', { y: 22, autoAlpha: 0, duration: 0.8, stagger: 0.08 }, 1.3)
        .from(orbs, {
          scale: 0, autoAlpha: 0, duration: 1.2, ease: 'back.out(1.6)',
          stagger: { each: 0.08, from: 'random' },
        }, 1.0)
        .from('[data-finder]', { y: 48, autoAlpha: 0, duration: 1 }, 1.45);

      // Flotación continua de las órbitas
      orbs.forEach((orb, i) => {
        gsap.to(orb, {
          y: gsap.utils.random(-14, 14),
          x: gsap.utils.random(-8, 8),
          duration: gsap.utils.random(3.2, 4.8),
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: 2 + i * 0.15,
        });
      });

      // Al hacer scroll: las órbitas se abren, el contenido sube y la tarjeta se recoge
      const orbScroll = gsap.timeline({
        scrollTrigger: { trigger: heroCard, start: 'top top', end: 'bottom top', scrub: 0.6 },
      });
      orbs.forEach((orb) => {
        const [dx, dy] = orb.dataset.dir.split(',').map(Number);
        const fig = orb.firstElementChild;
        orbScroll.to(fig, { xPercent: dx * 70, yPercent: dy * 50 - 40, scale: 0.8, ease: 'none' }, 0);
      });
      orbScroll
        .to('[data-hero-content]', { y: -80, autoAlpha: 0.2, ease: 'none' }, 0)
        .to('[data-hero-img]', { yPercent: 10, ease: 'none' }, 0);

      // Parallax por cursor (solo puntero fino)
      if (finePointer) {
        const movers = orbs.map((orb, i) => ({
          x: gsap.quickTo(orb.firstElementChild, 'x', { duration: 0.9, ease: 'power3.out' }),
          y: gsap.quickTo(orb.firstElementChild, 'y', { duration: 0.9, ease: 'power3.out' }),
          depth: 10 + (i % 3) * 8,
        }));
        const onMove = (e) => {
          const r = heroCard.getBoundingClientRect();
          const nx = gsap.utils.mapRange(r.left, r.right, -1, 1, e.clientX);
          const ny = gsap.utils.mapRange(r.top, r.bottom, -1, 1, e.clientY);
          movers.forEach((m) => { m.x(nx * m.depth); m.y(ny * m.depth); });
        };
        heroCard.addEventListener('pointermove', onMove);
        ctx.add(() => () => heroCard.removeEventListener('pointermove', onMove));
      }

      /* ===== 2 · Marquesina con velocidad reactiva ===== */
      const mTrack = $('[data-marquee-track]');
      const list = $('.marquee__list', mTrack);
      if (!$('.marquee__list[aria-hidden]', mTrack)) {
        const clone = list.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        $$('img', clone).forEach((img) => { img.alt = ''; });
        mTrack.appendChild(clone);
      }
      const marquee = gsap.to(mTrack, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 });
      const boost = gsap.quickTo(marquee, 'timeScale', { duration: 0.6, ease: 'power3.out' });
      ScrollTrigger.create({
        trigger: '.allies',
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const v = gsap.utils.clamp(-6, 6, self.getVelocity() / 300);
          boost(1 + Math.abs(v));
          clearTimeout(marquee._idle);
          marquee._idle = setTimeout(() => boost(1), 120);
        },
      });

      /* ===== Revelados genéricos ===== */
      const reveals = $$('[data-reveal]');
      gsap.set(reveals, { y: 48, autoAlpha: 0 });
      ScrollTrigger.batch(reveals, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) => gsap.to(batch, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.09, ease: 'expo.out', overwrite: true }),
      });

      /* ===== 3 · Situaciones ===== */
      const cases = $$('[data-case]');
      gsap.set(cases, { y: 80, autoAlpha: 0 });
      ScrollTrigger.batch(cases, {
        start: 'top 90%',
        once: true,
        onEnter: (batch) => gsap.to(batch, {
          y: 0, autoAlpha: 1, duration: 1.1, stagger: 0.12, ease: 'expo.out', overwrite: true,
          clearProps: 'transform',
        }),
      });
      $$('[data-parallax]').forEach((img) => {
        gsap.fromTo(img, { yPercent: -6 }, {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: { trigger: img.closest('.case__media'), start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });

      /* ===== 4 · Contadores ===== */
      $$('[data-count]').forEach((el) => {
        const end = Number(el.dataset.count);
        const obj = { v: 0 };
        el.textContent = '0';
        ScrollTrigger.create({
          trigger: el,
          start: 'top 90%',
          once: true,
          onEnter: () => gsap.to(obj, {
            v: end, duration: 1.6, ease: 'power3.out',
            onUpdate: () => { el.textContent = Math.round(obj.v).toLocaleString('es-ES'); },
          }),
        });
      });

      /* ===== 5 · Pasos: línea con scrub + paso activo ===== */
      const stepsEl = $('[data-steps]');
      const steps = $$('[data-step]');
      stepsEl.classList.add('steps--live');
      gsap.fromTo('[data-steps-fill]', { scaleY: 0 }, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: stepsEl, start: 'top 60%', end: 'bottom 60%', scrub: 0.4 },
      });
      steps.forEach((step) => {
        ScrollTrigger.create({
          trigger: step,
          start: 'top 62%',
          end: 'bottom 62%',
          toggleClass: 'is-active',
        });
        gsap.from(step.querySelector('.h3'), {
          x: 24, duration: 0.9, ease: 'expo.out',
          scrollTrigger: { trigger: step, start: 'top 80%', once: true },
        });
      });
      ctx.add(() => () => stepsEl.classList.remove('steps--live'));

      /* ===== 6 · Zoom con pin + scrub ===== */
      const zoom = $('[data-zoom]');
      zoom.classList.add('zoom--live');
      const stage = $('[data-zoom-stage]');
      const center = $('[data-zoom-center]');
      const sides = $$('[data-zoom-side]');
      const quoteWords = splitWords($('[data-words]'), 'zw', 'zwi');
      const coverScale = () => {
        return Math.max(window.innerWidth / center.offsetWidth, window.innerHeight / center.offsetHeight) * 1.02;
      };
      const zoomTl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: () => `+=${window.innerHeight * (isDesktop() ? 1.8 : 1.4)}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
      zoomTl
        .to(center, { scale: coverScale, ease: 'power2.inOut', duration: 1 }, 0)
        .to(sides, {
          xPercent: (i, el) => Number(el.dataset.zoomSide) * 130,
          autoAlpha: 0,
          scale: 0.85,
          ease: 'power2.in',
          duration: 0.8,
        }, 0)
        .fromTo('[data-zoom-shade]', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: 'none' }, 0.55)
        .fromTo('[data-zoom-quote]', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, ease: 'none' }, 0.7)
        .fromTo(quoteWords, { opacity: 0.12 }, { opacity: 1, stagger: 0.03, duration: 0.25, ease: 'none' }, 0.75)
        .fromTo('[data-zoom-quote] footer', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.3 }, '>-0.1')
        .to({}, { duration: 0.3 });
      ctx.add(() => () => zoom.classList.remove('zoom--live'));

      /* ===== 7 · Checklist que se marca en secuencia ===== */
      const checklist = $('[data-checklist]');
      checklist.classList.add('checklist--live');
      const items = $$('li', checklist);
      ScrollTrigger.create({
        trigger: checklist,
        start: 'top 72%',
        once: true,
        onEnter: () => items.forEach((li, i) => {
          gsap.delayedCall(0.25 + i * 0.28, () => li.classList.add('is-done'));
        }),
      });
      ctx.add(() => () => {
        checklist.classList.remove('checklist--live');
        items.forEach((li) => li.classList.remove('is-done'));
      });

      /* ===== 11 · Banda final: fotos que salen del centro ===== */
      const finale = $('[data-finale]');
      const flyers = $$('[data-fly]');
      gsap.fromTo(flyers, {
        x: (i, el) => finale.offsetWidth / 2 - (el.offsetLeft + el.offsetWidth / 2),
        y: (i, el) => finale.offsetHeight / 2 - (el.offsetTop + el.offsetHeight / 2),
        scale: 0.4,
        autoAlpha: 0,
      }, {
        x: 0,
        y: 0,
        scale: 1,
        autoAlpha: 1,
        ease: 'power3.out',
        stagger: 0.04,
        scrollTrigger: {
          trigger: finale,
          start: 'top 85%',
          end: 'center 55%',
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      return () => { removeCurtain(); };
    }
  );

  // Recalcular al terminar de cargar fuentes e imágenes
  if (d.fonts && d.fonts.ready) d.fonts.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
