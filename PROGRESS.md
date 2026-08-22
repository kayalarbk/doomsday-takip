# Doomsday'e Hazırlık — geliştirme notları

MCU + Fox X-Men izleme takibi. Vanilla JS/HTML/CSS, build adımı yok,
GitHub Pages'e olduğu gibi atılır.

Hedef tarih: **18 Aralık 2026** (`Render.TARGET`).
Geri sayımın başlangıcı: **27 Temmuz 2024** (`Render.ANNOUNCED`) — filmin
SDCC 2024'te adıyla duyurulduğu gün. İkisi de `js/render.js` başında.

---

## 1. Dosya yapısı

```
mcu/
├── index.html                 tek sayfa; script yükleme sırası burada sabit
├── manifest.webmanifest       PWA tanımı
├── sw.js                      çevrimdışı önbellek (SHELL listesi burada)
├── PROGRESS.md                bu dosya
├── tools/
│   └── fetch-posters.mjs      posters.js'i TMDB'den yeniden üretir (node)
├── icons/
│   ├── apple-touch-icon.png   iOS ana ekran ikonu — 180x180 ve OPAK olmalı
│   ├── icon-192.png           uygulama ikonu (purpose: any)
│   ├── icon-512.png
│   ├── icon-maskable-192.png  kenar boşluklu sürüm (purpose: maskable)
│   └── icon-maskable-512.png
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
    ├── theme.js                kızıl→yeşil tema geçişi              (bağımlılığı yok)
    ├── data/
    │   ├── mcu.js             window.DATA_MCU  — 69 kayıt
    │   ├── xmen.js            window.DATA_XMEN — 15 kayıt
    │   └── posters.js         window.DATA_POSTERS — id→TMDB yolu (ÜRETİLMİŞ)
    ├── render.js              liste, filtre, kart, istatistik    (hepsine bağlı)
    └── app.js                 başlangıç, ayarlar, dışa/içe aktarma, sw kaydı
```

**Yükleme sırası zorunlu:**
`util → theme → storage → posters → intro → data → render → app`.
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

**Yeni yapım eklerken:** ilgili data dosyasına nesneyi ekle,
`node tools/fetch-posters.mjs` ile poster tablosunu tazele, `sw.js` içindeki
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

Görsellerin kendisi **depoya gömülmüyor** (telifli) — yalnızca TMDB yolları.
`Posters.urlFor(item)` sırayla üç kaynağa bakar:

1. **localStorage** (`mcu2026:posters`) — kullanıcının anahtarıyla daha önce
   bulunmuş poster. Her şeyden önce gelir.
2. **`js/data/posters.js`** — depoya gömülü `id → /abc.jpg` tablosu.
   Tam URL `https://image.tmdb.org/t/p/w185` + yol. Site anahtarsız da
   gerçek posterleri bunun sayesinde gösterir.
3. **TMDB canlı arama** — yalnızca ilk ikisinde karşılığı olmayan kayıtlar
   için, kullanıcı Ayarlar'a kendi anahtarını girmişse. Sonuç localStorage'a
   yazılır, istekler 90 ms aralıkla sıraya alınır.

Hiçbiri yoksa **üretilen kapak**: `id`'den kararlı bir renk + baş harf + yıl.
Site her koşulda eksiksiz çalışır.

Görseller `IntersectionObserver` ile, görünür alana 400 px kala yüklenir.
Jenerik şeridi de aynı `urlFor` üzerinden besleniyor.

**`js/data/posters.js` üretilmiş dosyadır, elle düzenleme.** Veri dosyalarına
yeni yapım ekledikten sonra tazelemek için:

```bash
TMDB_TOKEN=<v4 okuma tokenı> node tools/fetch-posters.mjs
```

Script filmleri başlık + yıl ile, dizileri başlıkla arar; dizide kaydın yılına
denk gelen **sezon** posterini seçer (Loki S2, What If...? S3 gibi kayıtlar
doğru kapağı alsın diye). Arama yanlış yapımı getiriyorsa scriptteki
`OVERRIDE` tablosuna elle yol yaz — `X-Men` ve `X2` şu an orada, çünkü
TMDB araması bu iki başlıkta tanıtım programlarını öne çıkarıyor.

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
- [x] Filtreler: Hepsi / Filmler / Diziler (özel yapımlar dizilerle sayılır)
- [x] Doomsday sayacı: ay · gün · saat, saniyelik tick, takvim tabanlı ay hesabı
- [x] Kızıldan yeşile dönen tema (`js/theme.js`) — son 180 günde, sona yığılı
- [x] Duyurudan vizyona zaman şeridi
- [x] İzleme ilerleme çubuğu + yıl bazlı sayaç
- [x] Özgün açılış animasyonu, günde bir kez
- [x] Depoya gömülü TMDB poster yolları (84/84) — anahtarsız gerçek kapaklar
- [x] Eksikler için TMDB canlı arama + üretilen kapak yedeği
- [x] `tools/fetch-posters.mjs` ile poster tablosunu yeniden üretme
- [x] Dışa/içe aktarma (JSON), sıfırlama
- [x] PWA: manifest (id, display_override, maskable ikon), service worker,
      iOS meta etiketleri, Ayarlar'da `beforeinstallprompt` ile yükle düğmesi
- [x] Klavye erişimi, `prefers-reduced-motion`, mobil düzen
- [x] Telefonda zoom kilidi (viewport `user-scalable=no` + `touch-action`)

## 7b. Tema geçişi

`js/theme.js` beş CSS değişkenini (`--void`, `--surface`, `--surface-2`,
`--line`, `--stamp`) çalışma anında `:root` üzerine yazar. `css/base.css`
bunları kırmızı hâliyle tanımlar, yani JS çalışmasa da site düzgün açılır.

İki karar açıklama ister:

- **Geçiş doğrusal değil** (`EASE = 3`). Doğrusal olsaydı 180 günün
  yarısında renk çoktan sarıya kaymış olurdu; oysa istenen "yaklaştıkça
  dönmeye başlasın". Üs sayesinde 90 gün kala %13, 30 gün kala %58,
  7 gün kala %89 yeşil olunur.
- **Vurgu rengi HSL'de karışır**, zeminler RGB'de. Kırmızıdan yeşile RGB'de
  gidilirse ara değerler çamur kahveye düşüyordu (`rgb(171 77 56)` gibi);
  HSL'de ton kırmızı → turuncu → yeşil yolunu izliyor ve her aşamada canlı
  kalıyor. Zeminler neredeyse siyah olduğu için orada RGB sorun çıkarmıyor.

Sayaç saniyede bir çalışır ama `Theme.apply` oran değişmediyse hiçbir stil
yazmaz — gereksiz stil hesabı olmasın diye.

## 8. Sıradaki fikirler

- [ ] "Sıradaki" kartı — resmî listeden bir sonraki izlenmemiş yapımı öne çıkar
- [ ] Haftalık tempo hesabı: kalan yapım ÷ kalan hafta, gecikme uyarısı
- [ ] Puan verme (1–5) ve kısa not alanı
- [ ] Derin ile ortak takip: Supabase üzerinden iki kişilik ilerleme
- [ ] İzleme süreleri ve toplam kalan saat
- [ ] `X-Men '97` S2 ve `YFNSM` S2 tarihleri kesinleşince `js/data/mcu.js` güncellensin
  (şu an tahmini, `soon`/`note` ile işaretli)
