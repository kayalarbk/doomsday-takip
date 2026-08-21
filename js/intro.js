/* ============================================================
   js/intro.js — açılış animasyonu
   ------------------------------------------------------------
   NOT: Marvel'ın resmî jenerik videosu telifli. Burada onun
   yerine aynı fikri (kapakların şerit halinde akıp yazıya
   dönüşmesi) kendi verimizle kuran özgün bir animasyon var.

   Kurallar:
   - Günde bir kez oynar. "Tekrar oynat" düğmesi zorlayabilir.
   - Atla düğmesi, Esc, ekrana dokunma → anında kapanır.
   - prefers-reduced-motion açıksa animasyon yok, 700 ms'de kapanır.
   - Şerit karoları, poster önbelleğindeki gerçek kapakları
     kullanır; yoksa üretilen renkli kapaklara düşer.
   ============================================================ */

window.Intro = (function () {
  const TIMELINE = 2600;      // css/intro.css süreleriyle eşleşmeli

  // matchMedia her ortamda yok (eski WebView, test ortamları) — sorulduğu anda
  // ve korumalı biçimde okunur, modül yüklenirken değil.
  function reduced() {
    try { return !!(window.matchMedia &&
                    window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
    catch (e) { return false; }
  }

  let node = null, timer = null, done = false;

  function tiles(items) {
    const pool = items.slice().sort(() => Math.random() - 0.5).slice(0, 26);
    return pool.map(it => {
      const d = document.createElement('div');
      d.className = 'intro-tile';
      const url = Posters.urlFor(it);
      if (url) d.style.backgroundImage = `url("${url}")`;
      else d.style.background = Posters.fallbackFor(it).css;
      return d;
    });
  }

  function play(items, opts) {
    opts = opts || {};
    const today = Util.todayISO();
    if (!opts.force && Store.introSeenToday(today)) return;
    Store.markIntro(today);

    done = false;
    node = document.createElement('div');
    node.id = 'intro';
    node.setAttribute('role', 'presentation');
    node.innerHTML = `
      <div class="intro-strip"></div>
      <div class="intro-veil"></div>
      <div class="intro-flash"></div>
      <div class="intro-mask">
        <span class="intro-word">DOOMSDAY</span>
        <span class="intro-sub">18 Aralık 2026'ya hazırlık</span>
      </div>
      <button class="intro-skip" type="button">Atla</button>`;

    const slow = reduced();

    if (!slow) {
      const strip = node.querySelector('.intro-strip');
      tiles(items).forEach(t => strip.appendChild(t));
    }

    document.body.appendChild(node);
    document.body.style.overflow = 'hidden';

    node.querySelector('.intro-skip').addEventListener('click', close);
    node.addEventListener('click', close);
    document.addEventListener('keydown', onKey);

    timer = setTimeout(close, slow ? 700 : TIMELINE);
  }

  function onKey(e) { if (e.key === 'Escape' || e.key === 'Enter') close(); }

  function close() {
    if (done || !node) return;
    done = true;
    clearTimeout(timer);
    document.removeEventListener('keydown', onKey);
    node.classList.add('is-closing');
    setTimeout(() => {
      if (node && node.parentNode) node.parentNode.removeChild(node);
      node = null;
      document.body.style.overflow = '';
    }, 480);
  }

  return { play, close };
})();
