# Doomsday'e Hazırlık

**Avengers: Doomsday** (18 Aralık 2026) öncesi tüm MCU ve Fox X-Men yapımlarını
takip etmek için tek sayfalık bir web uygulaması. İzlediklerini tarihiyle
işaretle, ne kadar kaldığını gör.

Vanilla HTML/CSS/JS — build adımı, bağımlılık, sunucu yok.

## Neler var

- **84 yapım** (53 film, 26 dizi, 5 özel), çıkış tarihine göre sıralı yıl omurgası
- Disney+'ın **resmî Doomsday listesi** ayrı rozetle işaretli
- Karta tıkla → izledim damgası; tarihi elle düzelt ya da işareti kaldır
- Filtreler: Hepsi / Resmî liste / MCU / X-Men / Filmler / Diziler / İzlenmemişler
- Doomsday geri sayımı, ilerleme çubuğu, yıl bazlı sayaçlar
- Özgün açılış animasyonu (günde bir kez, atlanabilir)
- Gerçek **poster görselleri** — anahtar gerekmez
- Dışa/içe aktarma (JSON) ve sıfırlama
- **PWA**: çevrimdışı çalışır, ana ekrana eklenebilir
- Klavye erişimi ve `prefers-reduced-motion` desteği

## Çalıştırma

Depoyu klonla ve `index.html`'i tarayıcıda aç — bu kadar.

Service worker yalnızca `http(s)` üzerinden kaydolur, bu yüzden çevrimdışı
önbelleği denemek için basit bir sunucu gerekir:

```bash
python -m http.server 8000
# http://localhost:8000
```

## Yayınlama

GitHub Pages: **Settings → Pages → Source: `main` / `(root)`**.
Tüm yollar göreli (`./`) olduğu için alt klasörde de sorunsuz çalışır.

## Kapak görselleri

Görsellerin kendisi telifli olduğu için depoda tutulmuyor — yalnızca TMDB
yolları (`js/data/posters.js`, 84 kayıt). Görseller `image.tmdb.org`
üzerinden çekilir, yani **anahtar girmeden herkes gerçek posterleri görür**.

Bir kaydın karşılığı yoksa `id`'sinden üretilen kararlı bir kapak (renk +
baş harfler) gösterilir; site her koşulda eksiksiz çalışır. Ayarlar'dan kendi
[TMDB](https://www.themoviedb.org/settings/api) anahtarını girersen yalnızca
o eksik kayıtlar için canlı arama yapılır, sonuç `localStorage`'a yazılır.

Veri dosyalarına yeni yapım ekledikten sonra listeyi tazelemek için:

```bash
TMDB_TOKEN=<v4 okuma tokenı> node tools/fetch-posters.mjs
```

Token depoya yazılmaz, yalnızca ortam değişkeninden okunur.

> Bu ürün TMDB API'sini kullanır, TMDB tarafından onaylanmış ya da
> sertifikalanmış değildir.

## Veri

Hiçbir şey sunucuya gitmez. İşaretlerin, kapakların ve API anahtarın yalnızca
tarayıcının `localStorage`'ında (`mcu2026:` önekli) tutulur.

## Geliştirme

Dosya yapısı, veri şeması ve mimari notlar için [PROGRESS.md](PROGRESS.md).
