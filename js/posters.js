/* ============================================================
   js/posters.js — kapak görselleri
   ------------------------------------------------------------
   Resmî posterler telifli olduğu için depoya GÖMÜLMEZ.
   İki kaynak var:

   1) TMDB API (themoviedb.org) — kullanıcı kendi ücretsiz
      anahtarını Ayarlar'a girer. Başlık + yıl ile aranır,
      bulunan poster yolu localStorage'a yazılır, bir daha
      ağa çıkılmaz.
   2) Anahtar yoksa: başlıktan üretilen kapak (renk, sayı ve
      baş harfler). Site anahtarsız da tam çalışır.

   Görseller görünür alana girince yüklenir (IntersectionObserver).
   ============================================================ */

window.Posters = (function () {
  const IMG = 'https://image.tmdb.org/t/p/w185';
  const API = 'https://api.themoviedb.org/3';
  const queue = [];
  let running = false;

  /* ---------- üretilen kapak ---------- */
  // id'den kararlı bir sayı üretir (aynı kart hep aynı rengi alır)
  function hash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
    return Math.abs(h);
  }
  function fallbackFor(item) {
    const h = hash(item.id);
    const a = h % 360;
    const b = (a + 38) % 360;
    return {
      css: `linear-gradient(155deg, hsl(${a} 34% 26%), hsl(${b} 40% 15%))`,
      abbr: initials(item.t)
    };
  }
  function initials(title) {
    return title
      .replace(/[^\p{L}\p{N} ]/gu, ' ')
      .split(/\s+/).filter(Boolean).slice(0, 3)
      .map(w => w[0].toUpperCase()).join('');
  }

  /* ---------- TMDB ---------- */
  async function lookup(item) {
    const key = Store.getKey();
    if (!key) return '';

    const path = item.tv ? '/search/tv' : '/search/movie';
    const yearParam = item.tv ? 'first_air_date_year' : 'year';
    const url = `${API}${path}?api_key=${encodeURIComponent(key)}`
      + `&query=${encodeURIComponent(item.t)}`
      + `&${yearParam}=${item.y}&include_adult=false&language=en-US`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('TMDB ' + res.status);
    const json = await res.json();
    const hit = (json.results || []).find(r => r.poster_path);
    return hit ? IMG + hit.poster_path : '';
  }

  // İstekleri sıraya alıp yavaşça işler (TMDB hız sınırına takılmamak için)
  async function drain() {
    if (running) return;
    running = true;
    while (queue.length) {
      const { item, el } = queue.shift();
      try {
        const url = await lookup(item);
        Store.setPoster(item.id, url);
        if (url) apply(el, url);
      } catch (e) {
        console.warn('[poster] alınamadı:', item.t, e.message);
        // hatayı önbelleğe yazma — anahtar düzelince tekrar denensin
      }
      await new Promise(r => setTimeout(r, 90));
    }
    running = false;
  }

  function apply(el, url) {
    const img = el.querySelector('img');
    if (!img) return;
    img.src = url;
    img.addEventListener('load', () => {
      img.classList.add('is-on');
      const fb = el.querySelector('.poster-fallback');
      if (fb) fb.style.opacity = '0';
    }, { once: true });
  }

  /* ---------- görünür olunca yükle ---------- */
  const io = ('IntersectionObserver' in window)
    ? new IntersectionObserver(onSee, { rootMargin: '400px 0px' })
    : null;

  function onSee(entries) {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      load(e.target);
    });
  }

  function load(el) {
    const item = el._item;
    if (!item) return;
    const cached = Store.getPoster(item.id);
    if (cached) { apply(el, cached); return; }   // önbellekte var
    if (cached === '') return;                   // daha önce bulunamadı
    if (!Store.getKey()) return;                 // anahtar yok, üretilen kapak kalsın
    queue.push({ item, el });
    drain();
  }

  /* ---------- dışa açık ---------- */
  function build(item) {
    const fb = fallbackFor(item);
    const el = document.createElement('div');
    el.className = 'poster';
    el.style.background = fb.css;
    el.innerHTML =
      `<div class="poster-fallback" style="transition:opacity .3s">${fb.abbr}<b>${item.y}</b></div>` +
      `<img alt="" loading="lazy" decoding="async">`;
    el._item = item;
    if (io) io.observe(el); else load(el);
    return el;
  }

  // Anahtar sonradan girilince tüm görünür kartları tekrar dener
  function refreshAll() {
    document.querySelectorAll('.poster').forEach(load);
  }

  return { build, refreshAll, fallbackFor };
})();
