/* MEDLA · Extranjería — páginas internas: /agendar/, /whatsapp/ y /gracias/ */
(() => {
  'use strict';

  const d = document;
  const $ = (s, el = d) => el.querySelector(s);
  const $$ = (s, el = d) => [...el.querySelectorAll(s)];
  const M = window.MEDLA;
  const page = d.body.dataset.page;
  const params = new URLSearchParams(location.search);
  const origen = params.get('origen') || 'directo';

  /* ---------- Situación elegida en la landing ---------- */
  let motivo = params.get('motivo') || '';
  if (!motivo) {
    try { motivo = sessionStorage.getItem('medla-motivo') || ''; } catch (e) { motivo = ''; }
  }
  $$('[data-motivo-out]').forEach((o) => { o.textContent = motivo || o.dataset.default || 'Extranjería y movilidad'; });
  M.decorate(() => motivo);

  /* ---------- /agendar/: calendario de pago + aviso de reserva completada ---------- */
  if (page === 'agendar') {
    M.track('agendar_view', { origen, motivo: motivo || 'sin elegir' });
    const cal = $('[data-cal]');
    const skeleton = $('[data-cal-skeleton]');
    cal.addEventListener('load', () => setTimeout(() => skeleton.classList.add('is-gone'), 400), { once: true });
    cal.src = cal.dataset.src;
    const s = d.createElement('script');
    s.src = 'https://link.msgsndr.com/js/form_embed.js';
    s.defer = true;
    d.body.appendChild(s);
    M.onBookingComplete(() => motivo);
  }

  /* ---------- /whatsapp/: registra el clic, da las gracias y abre WhatsApp ---------- */
  if (page === 'whatsapp') {
    const text = `Hola MEDLA, quiero información sobre la consulta de extranjería${motivo ? ` (${motivo})` : ''}.`;
    const href = M.waLink(text);
    $$('[data-wa-link]').forEach((a) => { a.href = href; });
    M.track('whatsapp_click', { origen, motivo: motivo || 'sin elegir' });

    // Abre WhatsApp solo al llegar desde un botón (no al volver con "atrás").
    const nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
    const fresh = !nav || nav.type === 'navigate';
    const bar = $('[data-progress]');
    if (fresh) {
      requestAnimationFrame(() => bar && bar.classList.add('is-running'));
      setTimeout(() => { location.href = href; }, 1500);
    } else if (bar) {
      bar.hidden = true;
    }
    window.addEventListener('pageshow', (e) => { if (e.persisted && bar) bar.hidden = true; });
  }

  /* ---------- /gracias/: reserva completada ---------- */
  if (page === 'gracias') {
    M.track('gracias_view', { tipo: params.get('tipo') || 'reserva', motivo: motivo || 'sin elegir' });
    const text = `Hola MEDLA, acabo de reservar la consulta de extranjería${motivo ? ` (${motivo})` : ''} y tengo una pregunta.`;
    $$('[data-wa-link]').forEach((a) => { a.href = M.waLink(text); });
  }
})();
