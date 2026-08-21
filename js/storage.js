/* ============================================================
   js/storage.js — kalıcı kayıt katmanı
   ------------------------------------------------------------
   Tek giriş noktası. localStorage kapalıysa (gizli sekme, izin
   yok) sessizce belleğe düşer; uygulama çökmez, sadece kayıt
   sekme kapanınca kaybolur.

   Anahtarlar:
     mcu2026:watched  -> { "<id>": "YYYY-MM-DD" }
     mcu2026:posters  -> { "<id>": "<url>" | "" }   ("" = bulunamadı)
     mcu2026:tmdbkey  -> string
     mcu2026:introAt  -> "YYYY-MM-DD" (jenerik en son ne zaman oynadı)
   ============================================================ */

window.Store = (function () {
  const NS = 'mcu2026:';
  const mem = {};
  let live = true;

  try {
    localStorage.setItem(NS + '_probe', '1');
    localStorage.removeItem(NS + '_probe');
  } catch (e) {
    live = false;
    console.warn('[store] localStorage kapalı, bellek moduna geçildi');
  }

  function raw(key) {
    if (!live) return mem[key] ?? null;
    try { return localStorage.getItem(NS + key); } catch (e) { return null; }
  }
  function put(key, val) {
    if (!live) { mem[key] = val; return; }
    try { localStorage.setItem(NS + key, val); } catch (e) { mem[key] = val; }
  }

  function readJSON(key, fallback) {
    const s = raw(key);
    if (!s) return fallback;
    try { return JSON.parse(s); } catch (e) { return fallback; }
  }
  function writeJSON(key, obj) { put(key, JSON.stringify(obj)); }

  /* ---------- izlenenler ---------- */
  let watched = readJSON('watched', {});

  function getWatched() { return watched; }
  function isWatched(id) { return Object.prototype.hasOwnProperty.call(watched, id); }
  function dateOf(id) { return watched[id] || null; }
  function mark(id, dateStr) { watched[id] = dateStr; writeJSON('watched', watched); }
  function unmark(id) { delete watched[id]; writeJSON('watched', watched); }
  function countWatched() { return Object.keys(watched).length; }

  /* ---------- poster önbelleği ---------- */
  let posters = readJSON('posters', {});
  function getPoster(id) { return posters[id]; }              // undefined = hiç denenmedi
  function setPoster(id, url) { posters[id] = url || ''; writeJSON('posters', posters); }
  function clearPosters() { posters = {}; writeJSON('posters', posters); }
  function allPosters() { return posters; }

  /* ---------- TMDB anahtarı ---------- */
  function getKey() { return raw('tmdbkey') || ''; }
  function setKey(k) { put('tmdbkey', (k || '').trim()); }

  /* ---------- jenerik ---------- */
  function introSeenToday(today) { return raw('introAt') === today; }
  function markIntro(today) { put('introAt', today); }

  /* ---------- dışa / içe aktarma ---------- */
  function exportJSON() {
    return JSON.stringify({
      app: 'mcu-doomsday-takip',
      version: 1,
      exportedAt: new Date().toISOString(),
      watched: watched
    }, null, 2);
  }
  function importJSON(text) {
    const data = JSON.parse(text);
    if (!data || typeof data.watched !== 'object') throw new Error('Beklenen alan yok: watched');
    watched = data.watched;
    writeJSON('watched', watched);
    return Object.keys(watched).length;
  }
  function resetWatched() { watched = {}; writeJSON('watched', watched); }

  return {
    live,
    getWatched, isWatched, dateOf, mark, unmark, countWatched,
    getPoster, setPoster, clearPosters, allPosters,
    getKey, setKey,
    introSeenToday, markIntro,
    exportJSON, importJSON, resetWatched
  };
})();
