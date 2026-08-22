/* ============================================================
   js/theme.js — listede aşağı indikçe kızıldan yeşile dönen tema
   ------------------------------------------------------------
   Liste kronolojik: en üstte 2000 (X-Men), en altta 2026
   (Doomsday). Sayfada aşağı indikçe Doomsday'e yaklaştığın için
   palet Marvel kırmızısından Doctor Doom yeşiline kayar.
   Listenin başında tam kırmızı, sonunda tam yeşil.

   İlerleme, görüntü alanının ortasının #list içinde nerede
   olduğuyla ölçülür — sayfa başlığı ve alttaki Ayarlar bölümü
   hesabı kaydırmasın diye.

   İki ayrıntı önemli:

   1) Vurgu rengi (--stamp) RGB'de değil HSL'de karışır.
      Kırmızıdan yeşile RGB'de gidilirse ara değerler çamur
      kahveye düşer; HSL'de ton kırmızı → turuncu → yeşil yolunu
      izler ve her aşamada canlı kalır. Zemin renkleri zaten
      neredeyse siyah olduğu için onlarda RGB karışımı sorun
      çıkarmaz.

   2) Kaydırırken her karede stil yazılmaz. İlerleme STEPS
      kademeye yuvarlanır ve yalnızca kademe değişince :root
      güncellenir — 84 kartlık sayfada stil hesabı boşa gitmesin.

   Renkler css/base.css'te kırmızı hâliyle tanımlıdır; JS
   çalışmazsa site Marvel kırmızısıyla açılır, hiçbir şey bozulmaz.
   ============================================================ */

window.Theme = (function () {

  const STEPS = 200;   // ilerleme kaç kademeye yuvarlansın
  const EASE  = 1.8;   // 1 = düz geçiş; büyüdükçe kırmızı üstte daha uzun kalır

  /* Zemin renkleri — RGB'de karışır.
     İki uç birbirinden AÇIKÇA ayrılmalı: ilk denemede uçlar fazla
     yakındı (#12161f → #0c1811) ve kaydırırken zeminin döndüğü
     fark edilmiyordu. Şimdi üst uç sıcak kızıl-siyah, alt uç
     yosun yeşili-siyah. Metin rengi (--text #e7eaf0) her ikisinde
     de 12:1 üstü kontrast veriyor. */
  const BG_RED = {
    '--void':      [0x1a, 0x0f, 0x12],   // sıcak kızıl-siyah
    '--surface':   [0x26, 0x18, 0x1c],
    '--surface-2': [0x33, 0x21, 0x25],
    '--line':      [0x45, 0x2b, 0x30]
  };
  const BG_GREEN = {
    '--void':      [0x08, 0x1c, 0x13],   // yosun yeşili-siyah
    '--surface':   [0x10, 0x2b, 0x1d],
    '--surface-2': [0x18, 0x3a, 0x27],
    '--line':      [0x24, 0x4e, 0x34]
  };

  /* Vurgu — HSL'de karışır. h derece, s/l yüzde. */
  const ACCENT_RED   = [358, 84, 52];   // Marvel kırmızısı #ec1d24
  const ACCENT_GREEN = [145, 56, 42];   // Doom yeşili

  const clamp01 = n => Math.min(Math.max(n, 0), 1);
  const lerp = (a, b, t) => a + (b - a) * t;
  const mix = (a, b, t) => Math.round(lerp(a, b, t));

  /** HSL → [r,g,b]. h 0-360, s/l 0-100. */
  function hsl(h, s, l) {
    h = ((h % 360) + 360) % 360;
    s /= 100; l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    const [r, g, b] =
      h <  60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] :
      h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
    return [r, g, b].map(v => Math.round((v + m) * 255));
  }

  let sonKademe = null;

  /** Temayı 0 (kırmızı) – 1 (yeşil) arası bir orana getirir.

      Oran EASE ile eğrilir: düz geçişte sayfanın daha dörtte birinde
      renk turuncuya kayıyor, Marvel kırmızısı hiç görünmüyordu.
      Eğriyle üst yarı kırmızı kalıyor, yeşil son üçte bire — yani
      Doomsday'e yakın yapımlara — denk geliyor. Düz geçiş istersen
      EASE = 1 yap. */
  function apply(oran) {
    const kademe = Math.round(Math.pow(clamp01(oran), EASE) * STEPS);
    if (kademe === sonKademe) return;          // kademe değişmediyse dokunma
    sonKademe = kademe;
    const t = kademe / STEPS;
    const root = document.documentElement.style;

    /* --- zeminler --- */
    for (const key of Object.keys(BG_RED)) {
      const a = BG_RED[key], b = BG_GREEN[key];
      root.setProperty(key,
        `rgb(${mix(a[0], b[0], t)} ${mix(a[1], b[1], t)} ${mix(a[2], b[2], t)})`);
    }

    /* --- vurgu: ton kırmızıdan yeşile ileri yönde döner --- */
    const dh = ((ACCENT_GREEN[0] - ACCENT_RED[0]) + 360) % 360;   // 358 -> 145 = 147°
    const c = hsl(
      ACCENT_RED[0] + dh * t,
      lerp(ACCENT_RED[1], ACCENT_GREEN[1], t),
      lerp(ACCENT_RED[2], ACCENT_GREEN[2], t)
    );
    root.setProperty('--stamp', `rgb(${c[0]} ${c[1]} ${c[2]})`);
    root.setProperty('--stamp-dim', `rgba(${c[0]},${c[1]},${c[2]},.16)`);

    /* --- tarayıcı çubuğu zeminle aynı renk --- */
    const v = BG_RED['--void'], g = BG_GREEN['--void'];
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content',
        `rgb(${mix(v[0], g[0], t)} ${mix(v[1], g[1], t)} ${mix(v[2], g[2], t)})`);
    }

    document.documentElement.dataset.doom = Math.round(t * 100);
  }

  /** Görüntü alanının ortası listenin neresinde? 0 = başı, 1 = sonu. */
  function progress() {
    const list = document.getElementById('list');
    if (!list) return 0;
    const h = list.offsetHeight;
    if (h <= 0) return 0;
    const ust = list.getBoundingClientRect().top + window.scrollY;
    return clamp01((window.scrollY + window.innerHeight / 2 - ust) / h);
  }

  /** Kaydırmayı dinlemeye başlar. Kare başına en fazla bir hesap. */
  let bekleyen = false;
  function sync() {
    if (bekleyen) return;
    bekleyen = true;
    requestAnimationFrame(() => { bekleyen = false; apply(progress()); });
  }

  function watch() {
    addEventListener('scroll', sync, { passive: true });
    addEventListener('resize', sync);
    sync();
  }

  return { apply, progress, sync, watch, hsl };
})();
