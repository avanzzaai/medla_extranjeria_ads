/* MEDLA · Extranjería — utilidades compartidas por la landing y las páginas internas:
   medición, enlaces que conservan la atribución de la campaña y aviso de reserva completada. */
(() => {
  'use strict';

  const WA_NUMBER = '34914321457';
  const KEEP = /^(utm_[a-z_]+|gclid|gbraid|wbraid|fbclid|msclkid|ttclid|caso)$/i;
  const STORE = 'medla-attrib';

  /* ---------- Atribución: los parámetros del anuncio viajan entre páginas ---------- */
  // Si la visita trae parámetros de campaña, sustituyen a los guardados (gana el último anuncio).
  const incoming = {};
  new URLSearchParams(location.search).forEach((value, key) => {
    if (KEEP.test(key) && value) incoming[key] = value;
  });
  let attrib = {};
  try { attrib = JSON.parse(sessionStorage.getItem(STORE) || '{}'); } catch (e) { attrib = {}; }
  if (Object.keys(incoming).length) attrib = incoming;
  try { sessionStorage.setItem(STORE, JSON.stringify(attrib)); } catch (e) { /* almacenamiento no disponible */ }

  const withParams = (href, extra = {}) => {
    const url = new URL(href, location.origin);
    Object.entries(attrib).forEach(([k, v]) => { if (!url.searchParams.has(k)) url.searchParams.set(k, v); });
    Object.entries(extra).forEach(([k, v]) => { if (v) url.searchParams.set(k, v); });
    return url.pathname + url.search + url.hash;
  };

  /* ---------- Medición ----------
     Cada evento va a dataLayer (GTM). Si está el píxel de Meta, también se envía allí.
     Las conversiones principales se miden por URL: /agendar/, /whatsapp/ y /gracias/. */
  const track = (event, data = {}) => {
    (window.dataLayer = window.dataLayer || []).push({ event, ...data });
    const fbq = window.fbq;
    if (typeof fbq !== 'function') return;
    if (event === 'agendar_view') fbq('track', 'InitiateCheckout', { content_name: 'Consulta extranjería' });
    if (event === 'whatsapp_click') fbq('track', 'Contact', { method: 'whatsapp' });
    if (event === 'reserva_completada') fbq('trackCustom', 'ReservaCompletada', data);
  };

  /* ---------- Enlaces con seguimiento ----------
     Los botones llevan href="/agendar/" o "/whatsapp/" (funcionan sin JS). Al pulsarlos se les añade
     la situación elegida, el botón de origen y los parámetros de la campaña. */
  const decorate = (getMotivo = () => '') => {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[data-go]');
      if (!a) return;
      if (!a.dataset.base) a.dataset.base = a.getAttribute('href');
      a.href = withParams(a.dataset.base, {
        motivo: a.dataset.motivo || getMotivo(),
        origen: a.dataset.track || '',
      });
    }, true);
  };

  /* ---------- Reserva completada en el calendario de HighLevel ----------
     El widget avisa a la página con postMessage(["msgsndr-booking-complete", {...}]). */
  const onBookingComplete = (getMotivo = () => '') => {
    let done = false;
    window.addEventListener('message', (e) => {
      const data = e.data;
      if (done || !Array.isArray(data) || data[0] !== 'msgsndr-booking-complete') return;
      if (!/(^|\.)(leadconnectorhq|msgsndr|gohighlevel)\.com$/.test(new URL(e.origin).hostname)) return;
      done = true;
      track('reserva_completada', { motivo: getMotivo() || 'sin elegir' });
      setTimeout(() => {
        location.href = withParams('/gracias/', { tipo: 'reserva', motivo: getMotivo() });
      }, 800);
    });
  };

  const waLink = (text) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

  window.MEDLA = { track, withParams, decorate, onBookingComplete, waLink, attrib };
})();
