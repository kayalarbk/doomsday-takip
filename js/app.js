/* ============================================================
   js/app.js — başlangıç, ayarlar, veri aktarımı, servis işçisi
   ------------------------------------------------------------
   Yükleme sırası index.html'de sabittir:
     util -> storage -> posters -> intro -> data -> render -> app
   ============================================================ */

(function () {
  const ITEMS = [].concat(window.DATA_MCU || [], window.DATA_XMEN || []);

  /* Tarayıcı "yüklenebilir" dediği anı yakala. Bu olay DOMContentLoaded'dan
     önce de gelebildiği için dinleyici en başta kurulur, olay saklanır. */
  let installEvent = null;
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    installEvent = e;
    showInstall();
  });

  function standalone() {
    return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches)
      || navigator.standalone === true;
  }

  function showInstall(text) {
    const row = document.getElementById('install-row');
    const wrap = document.getElementById('install-wrap');
    if (!row || standalone()) return;              // zaten uygulama olarak açık
    if (text) row.textContent = text;
    row.hidden = false;
    if (!text && wrap) wrap.hidden = false;        // iOS'ta buton yok, yalnız yönerge
  }

  document.addEventListener('DOMContentLoaded', function () {

    /* --- liste --- */
    Render.init(ITEMS);

    /* --- açılış animasyonu (günde bir kez) --- */
    Intro.play(ITEMS);

    /* --- TMDB anahtarı --- */
    const keyInput = document.getElementById('tmdb-key');
    keyInput.value = Store.getKey();
    document.getElementById('save-key').addEventListener('click', function () {
      Store.setKey(keyInput.value);
      Store.clearPosters();
      Posters.refreshAll();
      Util.toast(keyInput.value.trim() ? 'Anahtar kaydedildi, kapaklar çekiliyor' : 'Anahtar silindi');
    });

    /* --- dışa aktar --- */
    document.getElementById('export').addEventListener('click', async function () {
      const json = Store.exportJSON();
      const ok = await Util.copy(json);
      if (ok) { Util.toast('Kayıtlar panoya kopyalandı'); return; }
      const blob = new Blob([json], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'mcu-izleme-' + Util.todayISO() + '.json';
      a.click();
      URL.revokeObjectURL(a.href);
      Util.toast('Dosya indirildi');
    });

    /* --- içe aktar --- */
    document.getElementById('import').addEventListener('click', function () {
      const text = prompt('Dışa aktardığın JSON metnini yapıştır:');
      if (!text) return;
      try {
        const n = Store.importJSON(text);
        Render.apply();
        Util.toast(n + ' kayıt yüklendi');
      } catch (e) {
        Util.toast('Okunamadı: ' + e.message);
      }
    });

    /* --- sıfırla --- */
    document.getElementById('reset').addEventListener('click', function () {
      if (!confirm('Tüm "izledim" kayıtları silinecek. Devam edilsin mi?')) return;
      Store.resetWatched();
      Render.apply();
      Util.toast('Kayıtlar silindi');
    });

    /* --- jeneriği tekrar oynat --- */
    document.getElementById('replay').addEventListener('click', function () {
      Intro.play(ITEMS, { force: true });
    });

    /* --- uygulama olarak yükle --- */
    const installBtn = document.getElementById('install');
    installBtn.addEventListener('click', async function () {
      if (!installEvent) return;
      installEvent.prompt();
      const res = await installEvent.userChoice;
      installEvent = null;
      document.getElementById('install-wrap').hidden = true;
      if (res.outcome !== 'accepted') {
        document.getElementById('install-row').textContent =
          'Yükleme iptal edildi. Tarayıcı menüsünden "Uygulama olarak yükle" ile tekrar deneyebilirsin.';
      }
    });
    window.addEventListener('appinstalled', function () {
      document.getElementById('install-row').hidden = true;
      document.getElementById('install-wrap').hidden = true;
      Util.toast('Uygulama yüklendi');
    });
    // iOS'ta beforeinstallprompt yok — elle yönerge göster
    if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !installEvent) {
      showInstall("iPhone/iPad: Safari'de Paylaş düğmesi → Ana Ekrana Ekle. Uygulama tam ekran açılır ve çevrimdışı çalışır.");
    } else if (installEvent) {
      showInstall();
    }

    /* --- kayıt uyarısı --- */
    if (!Store.live) {
      Util.toast('Tarayıcı kaydı kapalı — işaretler kalıcı olmayacak');
    }
  });

  /* --- çevrimdışı desteği --- */
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('./sw.js').catch(function (e) {
        console.warn('[sw] kayıt edilemedi:', e.message);
      });
    });
  }
})();
