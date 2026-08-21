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
- İsteğe bağlı **TMDB** kapak görselleri — kendi ücretsiz v3 anahtarınla
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

Resmî posterler telifli olduğu için depoya dahil edilmiyor. Anahtar girmezsen
her yapım için `id`'sinden üretilen kararlı bir kapak gösterilir — site
eksiksiz çalışır. Gerçek posterler istersen Ayarlar'dan kendi
[TMDB](https://www.themoviedb.org/settings/api) v3 anahtarını gir; bulunan
URL'ler `localStorage`'a yazılır ve bir daha ağa çıkılmaz.

## Veri

Hiçbir şey sunucuya gitmez. İşaretlerin, kapakların ve API anahtarın yalnızca
tarayıcının `localStorage`'ında (`mcu2026:` önekli) tutulur.

## Geliştirme

Dosya yapısı, veri şeması ve mimari notlar için [PROGRESS.md](PROGRESS.md).
