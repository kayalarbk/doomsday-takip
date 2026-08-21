# Doomsday'e Hazırlık — geliştirme notları

MCU + Fox X-Men izleme takibi. Vanilla JS/HTML/CSS, build adımı yok,
GitHub Pages'e olduğu gibi atılır.

Hedef tarih: **18 Aralık 2026** (`Render.TARGET` içinde sabit).

---

## 1. Dosya yapısı

```
mcu/
├── index.html                 tek sayfa; script yükleme sırası burada sabit
├── manifest.webmanifest       PWA tanımı
├── sw.js                      çevrimdışı önbellek (SHELL listesi burada)
├── PROGRESS.md                bu dosya
├── icons/
│   ├── icon-192.png           üretilmiş ikon (istersen değiştir)
│   └── icon-512.png
├── css/
│   ├── base.css               DEĞİŞKENLER + reset + tipografi
│   ├── intro.css              açılış animasyonu (süreler js/intro.js ile eşleşmeli)
│   ├── layout.css             başlık, geri sayım, filtreler, yıl omurgası, ayarlar
│   └── card.css               yatay kart + damga + açılır panel
└── js/
    ├── util.js                tarih/metin yardımcıları, toast   (bağımlılığı yok)
    ├── storage.js             localStorage sarmalayıcı           (bağımlılığı yok)
    ├── posters.js             TMDB + üretilen kapak              (Store'a bağlı)
    ├── intro.js               açılış animasyonu                  (Store, Posters, Util)
    ├── data/
    │   ├── mcu.js             window.DATA_MCU  — 69 kayıt
    │   └── xmen.js            window.DATA_XMEN — 15 kayıt
    ├── render.js              liste, filtre, kart, istatistik    (hepsine bağlı)
    └── app.js                 başlangıç, ayarlar, dışa/içe aktarma, sw kaydı
```

**Yükleme sırası zorunlu:** `util → storage → posters → intro → data → render → app`.
Modül sistemi yok, hepsi `window` üzerinde global. Sıra bozulursa sessizce çöker.

---

## 2. Veri şeması

`js/data/*.js` içindeki her kayıt:

| alan   | zorunlu | açıklama |
|--------|---------|----------|
| `id`   | ✔ | benzersiz anahtar. **localStorage bunu kullanır — asla değiştirme**, değiştirirsen kullanıcının işareti kaybolur |
| `t`    | ✔ | başlık; TMDB araması da bununla yapılır (İngilizce başlık kalsın) |
| `y`    | ✔ | yıl, gruplama için |
| `d`    | ✔ | `YYYY-MM-DD` çıkış tarihi, sıralama için. Yılı `y` ile aynı olmalı |
| `k`    | ✔ | `film` / `dizi` / `ozel` |
| `u`    | ✔ | evren etiketi: `MCU` veya `X-Men (Fox)` |
| `ph`   | ✔ | faz / dönem |
| `ess`  |   | `true` → Disney+'ın resmî Doomsday listesinde (kırmızı RESMÎ rozeti) |
| `tv`   |   | `true` → TMDB'de dizi olarak aranır |
| `soon` |   | `true` → henüz çıkmadı |
| `note` |   | kart altındaki kısa açıklama |

**Yeni yapım eklerken:** ilgili data dosyasına nesneyi ekle, `sw.js` içindeki
`CACHE` sürümünü artır. Başka hiçbir yere dokunmaya gerek yok — liste,
sayaç, yıl grubu ve filtreler otomatik güncellenir.

Mevcut sayım: 84 kayıt (53 film, 26 dizi, 5 özel yapım) · 16 tanesi resmî listede
(resmî liste 15 başlık; Loki burada S1 ve S2 olarak ikiye ayrıldığı için 16 satır).

---

## 3. localStorage anahtarları

Hepsi `mcu2026:` önekli, tek giriş noktası `js/storage.js`.

| anahtar | içerik |
|---------|--------|
| `mcu2026:watched` | `{ "<id>": "YYYY-MM-DD" }` — izlendi kayıtları |
| `mcu2026:posters` | `{ "<id>": "<url>" }`, `""` = TMDB'de bulunamadı |
| `mcu2026:tmdbkey` | TMDB v3 API anahtarı |
| `mcu2026:introAt` | jeneriğin en son oynadığı gün (`YYYY-MM-DD`) |

localStorage kapalıysa `Store.live === false` olur ve her şey belleğe düşer;
uygulama çalışmaya devam eder, sadece kayıt kalıcı olmaz (kullanıcıya toast ile söylenir).

---

## 4. Kapak görselleri

Resmî posterler **depoya gömülmüyor** (telifli). İki kaynak:

1. **TMDB** — kullanıcı Ayarlar'dan kendi ücretsiz v3 anahtarını girer.
   `posters.js` başlık + yıl ile arar, bulduğu URL'i localStorage'a yazar,
   bir daha ağa çıkmaz. İstekler 90 ms aralıkla sıraya alınır.
2. **Üretilen kapak** — anahtar yoksa `id`'den kararlı bir renk + baş harf +
   yıl üretilir. Site anahtarsız da eksiksiz çalışır.

Görseller `IntersectionObserver` ile, görünür alana 400 px kala yüklenir.

---

## 5. Açılış animasyonu

Marvel'ın resmî jeneriği telifli olduğu için kullanılmıyor.
Yerine özgün bir animasyon var: kendi kapakların hızlı bir şerit halinde
akar, şeridin üstündeki `DOOMSDAY` yazısı harf aralığı daralarak yerine
oturur, mürekkep flaşıyla kapanır.

- Günde bir kez oynar (`introAt`), Ayarlar'daki **Jeneriği oynat** zorlar.
- Atla / Esc / Enter / ekrana dokunma → anında kapanır.
- `prefers-reduced-motion` açıksa şerit ve flaş devre dışı, 700 ms'de kapanır.
- **Süre iki yerde:** `js/intro.js` içindeki `TIMELINE = 2600` ile
  `css/intro.css` animasyon süreleri birbirini tutmalı. Birini değiştirirsen
  diğerini de değiştir.

---

## 6. Yayına alma

```bash
git init && git add -A && git commit -m "MCU takip sitesi"
git remote add origin git@github.com:kayalarbk/<repo>.git
git push -u origin main
# GitHub → Settings → Pages → Source: main / (root)
```

`sw.js` ve `manifest.webmanifest` göreli yol (`./`) kullanıyor, alt klasörde
de sorunsuz çalışır. Service worker yalnızca `http(s)` üzerinde kaydolur;
`file://` ile açarsan site çalışır ama çevrimdışı önbellek devreye girmez.

**Her yayından önce:** dosya ekleyip çıkardıysan `sw.js` içindeki `SHELL`
listesini güncelle ve `CACHE` sürümünü artır (`doomsday-v1` → `v2`).
Yoksa kullanıcıda eski sürüm takılı kalır.

---

## 7. Yapılanlar

- [x] 84 kayıtlık MCU + X-Men veri seti, çıkış tarihine göre sıralı
- [x] Yatay kartlar, sol tarafta kapak, yıl omurgası
- [x] Karta tıkla → panel → bugünün tarihiyle "izledim" damgası
- [x] Tarihi elle seçme, işareti kaldırma, tarihi düzeltme
- [x] Filtreler: Hepsi / Resmî liste / MCU / X-Men / Filmler / Diziler / İzlenmemişler
- [x] Doomsday geri sayımı + ilerleme çubuğu + yıl bazlı sayaç
- [x] Özgün açılış animasyonu, günde bir kez
- [x] TMDB kapak entegrasyonu + üretilen kapak yedeği
- [x] Dışa/içe aktarma (JSON), sıfırlama
- [x] PWA: manifest, service worker, ikonlar, çevrimdışı çalışma
- [x] Klavye erişimi, `prefers-reduced-motion`, mobil düzen

## 8. Sıradaki fikirler

- [ ] "Sıradaki" kartı — resmî listeden bir sonraki izlenmemiş yapımı öne çıkar
- [ ] Haftalık tempo hesabı: kalan yapım ÷ kalan hafta, gecikme uyarısı
- [ ] Puan verme (1–5) ve kısa not alanı
- [ ] Derin ile ortak takip: Supabase üzerinden iki kişilik ilerleme
- [ ] İzleme süreleri ve toplam kalan saat
- [ ] `X-Men '97` S2 ve `YFNSM` S2 tarihleri kesinleşince `js/data/mcu.js` güncellensin
  (şu an tahmini, `soon`/`note` ile işaretli)
