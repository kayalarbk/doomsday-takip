/* ============================================================
   js/util.js — küçük yardımcılar (tarih, metin, bildirim)
   ============================================================ */

window.Util = (function () {

  /** Bugünün yerel tarihi, YYYY-MM-DD. (toISOString UTC'ye kaydırır, o yüzden elle kuruyoruz.) */
  function todayISO(d) {
    d = d || new Date();
    const p = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  }

  /** "2026-08-21" -> "21.08.2026" */
  function fmtTR(iso) {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${d}.${m}.${y}`;
  }

  /** İki ISO tarih arasındaki tam gün farkı. */
  function daysBetween(fromISO, toISO) {
    const a = new Date(fromISO + 'T00:00:00');
    const b = new Date(toISO + 'T00:00:00');
    return Math.round((b - a) / 86400000);
  }

  const KIND = { film: 'Film', dizi: 'Dizi', ozel: 'Özel yapım' };
  function kindLabel(k) { return KIND[k] || k; }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /** Alt köşede kısa bildirim. */
  let toastEl = null, toastTimer = null;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 2200);
  }

  /** Metni panoya kopyalar; başarısızsa false döner. */
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch (e) { return false; }
  }

  return { todayISO, fmtTR, daysBetween, kindLabel, escapeHTML, toast, copy };
})();
