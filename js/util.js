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

  /** Bir tarihe n ay ekler. Ayın son günlerinde taşmayı engeller:
      31 Ocak + 1 ay = 28 Şubat, 3 Mart değil. */
  function addMonths(date, n) {
    const r = new Date(date.getTime());
    const day = r.getDate();
    r.setDate(1);
    r.setMonth(r.getMonth() + n);
    const son = new Date(r.getFullYear(), r.getMonth() + 1, 0).getDate();
    r.setDate(Math.min(day, son));
    return r;
  }

  /** İki an arasındaki farkı ay / gün / saat / dakika / saniye olarak verir.
      Ay sayısı takvimden hesaplanır (30 gün varsayımı yok), kalan süre
      son tam aydan sonra ölçülür. Hedef geçmişse null döner. */
  function countdownParts(from, to) {
    if (to <= from) return null;
    let ay = 0;
    while (addMonths(from, ay + 1) <= to) ay++;
    let kalan = to - addMonths(from, ay);
    const gun = Math.floor(kalan / 86400000);  kalan -= gun * 86400000;
    const saat = Math.floor(kalan / 3600000);  kalan -= saat * 3600000;
    const dk = Math.floor(kalan / 60000);      kalan -= dk * 60000;
    return { ay, gun, saat, dk, sn: Math.floor(kalan / 1000) };
  }

  const AY = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
  /** '2024-07-27' -> '27 Tem 2024' */
  function fmtShortTR(iso) {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${+d} ${AY[+m - 1]} ${y}`;
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

  return { todayISO, fmtTR, fmtShortTR, daysBetween, addMonths, countdownParts,
           kindLabel, escapeHTML, toast, copy };
})();
