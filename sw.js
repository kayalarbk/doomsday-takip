/* ============================================================
   sw.js — çevrimdışı önbellek
   ------------------------------------------------------------
   ÖNEMLİ: Dosya ekleyip çıkardığında hem CACHE adını artır
   hem de SHELL listesini güncelle. Aksi halde kullanıcıda eski
   sürüm takılı kalır.
   ============================================================ */
const CACHE = 'doomsday-v5';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './css/base.css',
  './css/intro.css',
  './css/layout.css',
  './css/card.css',
  './js/util.js',
  './js/theme.js',
  './js/storage.js',
  './js/posters.js',
  './js/intro.js',
  './js/data/mcu.js',
  './js/data/xmen.js',
  './js/data/posters.js',
  './js/render.js',
  './js/app.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  // TMDB istekleri önbelleğe alınmaz — sonuçlar zaten localStorage'da
  if (url.hostname.endsWith('themoviedb.org')) return;

  if (url.origin === location.origin) {
    // uygulama dosyaları: önce önbellek
    e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request)));
  } else {
    // font ve poster görselleri: önce ağ, sonra önbellek
    e.respondWith(
      fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      }).catch(() => caches.match(e.request))
    );
  }
});
