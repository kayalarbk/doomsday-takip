/* ============================================================
   js/theme.js — Doomsday'e yaklaştıkça kızıldan yeşile dönen tema
   ------------------------------------------------------------
   Taban palet Marvel kırmızısı. Vizyona SHIFT_DAYS gün kala ekran
   Doctor Doom yeşiline kaymaya başlar, çıkış günü tamamen yeşil olur.

   İki ayrıntı önemli:

   1) Geçiş DOĞRUSAL DEĞİL (EASE üssü). Doğrusal olsaydı daha aylar
      varken renk çoktan kaymış olurdu; oysa istenen "yaklaştıkça
      dönmeye başlasın". Üs sayesinde son aya kadar kırmızı kalır,
      son haftalarda hızla yeşile geçer.

   2) Vurgu rengi (--stamp) RGB'de değil HSL'de karışır. Kırmızıdan
      yeşile RGB'de gidilirse ara değerler çamur kahveye düşer;
      HSL'de renk tonu kırmızı → turuncu → yeşil yolunu izler ve
      her aşamada canlı kalır. Zemin renkleri zaten neredeyse siyah
      olduğu için onlarda RGB karışımı sorun çıkarmaz.

   Renkler css/base.css'te kırmızı hâliyle tanımlıdır — JS çalışmazsa
   site Marvel kırmızısıyla açılır, hiçbir şey bozulmaz.
   ============================================================ */

window.Theme = (function () {

  const SHIFT_DAYS = 180;   // yeşile dönüş bu kadar gün kala başlar
  const EASE = 3;           // büyüdükçe geçiş sona yığılır

  /* Zemin renkleri — RGB'de karışır */
  const BG_RED = {
    '--void':      [0x12, 0x16, 0x1f],
    '--surface':   [0x1a, 0x20, 0x29],
    '--surface-2': [0x22, 0x2a, 0x36],
    '--line':      [0x2c, 0x36, 0x44]
  };
  const BG_GREEN = {
    '--void':      [0x0c, 0x18, 0x11],
    '--surface':   [0x13, 0x22, 0x19],
    '--surface-2': [0x1a, 0x2e, 0x22],
    '--line':      [0x25, 0x3f, 0x2e]
  };

  /* Vurgu — HSL'de karışır. h derece, s/l yüzde. */
  const ACCENT_RED   = [358, 84, 52];   // Marvel kırmızısı #ec1d24
  const ACCENT_GREEN = [145, 56, 42];   // Doom yeşili

  const clamp01 = n => Math.min(Math.max(n, 0), 1);
  const lerp = (a, b, t) => a + (b - a) * t;
  const mix = (a, b, t) => Math.round(lerp(a, b, t));

  /** Kalan güne göre yeşillik oranı: 0 = tam kırmızı, 1 = tam yeşil. */
  function ratio(daysLeft) {
    if (!isFinite(daysLeft)) return 0;
    const ham = clamp01((SHIFT_DAYS - daysLeft) / SHIFT_DAYS);
    return Math.pow(ham, EASE);
  }

  /** HSL → 'rgb(r g b)'. h 0-360, s/l 0-100. */
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

  let sonOran = null;

  /** Temayı kalan güne göre uygular, kullanılan oranı döndürür.
      Oran değişmediyse hiçbir stil yazılmaz — sayaç saniyede bir
      çağırdığı için gereksiz stil hesabı olmasın. */
  function apply(daysLeft) {
    const t = ratio(daysLeft);
    if (t === sonOran) return t;
    sonOran = t;
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
    return t;
  }

  return { apply, ratio, hsl, SHIFT_DAYS };
})();
