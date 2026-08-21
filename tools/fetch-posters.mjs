/* ============================================================
   tools/fetch-posters.mjs — js/data/posters.js'i yeniden üretir
   ------------------------------------------------------------
   TMDB'de her kaydı arar, bulduğu poster yolunu (görseli değil,
   yalnızca /abc.jpg yolunu) js/data/posters.js içine yazar.
   Site bu dosya sayesinde anahtarsız da gerçek posterleri gösterir.

   Kullanım — token ASLA depoya yazılmaz, ortam değişkeniyle verilir:

     TMDB_TOKEN=<v4 okuma token'ı> node tools/fetch-posters.mjs

   PowerShell'de:
     $env:TMDB_TOKEN="..."; node tools/fetch-posters.mjs

   Token: themoviedb.org → Settings → API → "API Read Access Token".

   Veri dosyalarına yeni yapım ekledikten sonra bunu çalıştır,
   sonra sw.js içindeki CACHE sürümünü artırmayı unutma.
   ============================================================ */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const TOKEN = process.env.TMDB_TOKEN;
if (!TOKEN) {
  console.error('TMDB_TOKEN tanımlı değil. Kullanım: TMDB_TOKEN=<token> node tools/fetch-posters.mjs');
  process.exit(1);
}

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT  = path.join(ROOT, 'js', 'data', 'posters.js');
const H = { Authorization: `Bearer ${TOKEN}`, accept: 'application/json' };

// Arama yanlış yapımı getiriyorsa buraya elle TMDB poster yolu yaz.
// (ör. "X-Men" araması 2000 filmi yerine tanıtım programını getiriyor)
const OVERRIDE = {
  'fox-x-men': '/bRDAc4GogyS9ci3ow7UnInOcriN.jpg',   // X-Men (2000), TMDB 36657
  'fox-x2':    '/bst4alFUXCxISwdRUKSMhhkrX1M.jpg'    // X2 (2003), TMDB 36658
};

/* ---------- veri dosyalarını yükle ---------- */
// Modül sistemi yok, dosyalar window'a yazıyor — sahte bir window ver.
const win = {};
for (const f of ['mcu', 'xmen']) {
  new Function('window', fs.readFileSync(path.join(ROOT, 'js', 'data', `${f}.js`), 'utf8'))(win);
}
const items = [...win.DATA_MCU, ...win.DATA_XMEN];
console.log(`${items.length} kayıt yüklendi`);

/* ---------- TMDB ---------- */
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function api(p) {
  for (let a = 0; a < 3; a++) {
    const res = await fetch(`https://api.themoviedb.org/3${p}`, { headers: H });
    if (res.status === 429) { await sleep(2000); continue; }   // hız sınırı
    if (!res.ok) throw new Error(`${res.status} ${p}`);
    return res.json();
  }
  throw new Error('hız sınırı aşılamadı: ' + p);
}

const norm = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '');

async function findMovie(it) {
  const q = encodeURIComponent(it.t);
  let j = await api(`/search/movie?query=${q}&year=${it.y}&include_adult=false&language=en-US`);
  let hit = (j.results || []).find(r => r.poster_path);
  if (!hit) {                                    // yıl tutmuyorsa yılsız dene
    j = await api(`/search/movie?query=${q}&include_adult=false&language=en-US`);
    const rs = (j.results || []).filter(r => r.poster_path);
    hit = rs.find(r => norm(r.title) === norm(it.t)) || rs[0];
  }
  return hit ? { p: hit.poster_path, via: hit.title } : null;
}

async function findTv(it) {
  // Diziler yıl parametresiyle aranmaz: 2. sezon kaydının yılı,
  // dizinin ilk yayın yılıyla tutmaz. Önce diziyi bul, sonra
  // kaydın yılına denk gelen sezonun posterini al.
  const j = await api(`/search/tv?query=${encodeURIComponent(it.t)}&include_adult=false&language=en-US`);
  const rs = (j.results || []).filter(r => r.poster_path);
  const show = rs.find(r => norm(r.name) === norm(it.t)) || rs[0];
  if (!show) return null;
  try {
    const d = await api(`/tv/${show.id}?language=en-US`);
    const se = (d.seasons || []).find(s =>
      s.season_number > 0 && s.air_date && +s.air_date.slice(0, 4) === it.y);
    if (se?.poster_path) return { p: se.poster_path, via: `${show.name} S${se.season_number}` };
  } catch { /* sezon alınamadı — dizi posteri yeterli */ }
  return { p: show.poster_path, via: show.name };
}

/* ---------- topla ---------- */
const found = {}, missing = [];
for (const it of items) {
  if (OVERRIDE[it.id]) {
    found[it.id] = OVERRIDE[it.id];
    console.log(`  elle ${it.id}`);
    continue;
  }
  try {
    const r = it.tv ? await findTv(it) : await findMovie(it);
    if (r) { found[it.id] = r.p; console.log(`  ok   ${it.id}  <- ${r.via}`); }
    else   { missing.push(it);   console.log(`  YOK  ${it.id}  (${it.t} ${it.y})`); }
  } catch (e) {
    missing.push(it);            console.log(`  HATA ${it.id}  ${e.message}`);
  }
  await sleep(60);
}

/* ---------- yaz ---------- */
const w = Math.max(...items.map(i => i.id.length)) + 3;
const rows = items.filter(i => found[i.id])
  .map(i => '  ' + `'${i.id}':`.padEnd(w) + `'${found[i.id]}',`);
rows[rows.length - 1] = rows[rows.length - 1].replace(/,$/, '');

fs.writeFileSync(OUT, `/* ============================================================
   js/data/posters.js — TMDB poster yolları
   ------------------------------------------------------------
   ÜRETİLMİŞ DOSYA — elle düzenleme.
   Yeniden üretmek için:  node tools/fetch-posters.mjs
   Yanlış eşleşmeleri o dosyadaki OVERRIDE tablosundan düzelt.

   id → TMDB poster_path eşlemesi. Görselin kendisi depoda
   DEĞİL, yalnızca yolu; tam URL'i js/posters.js kurar:
     https://image.tmdb.org/t/p/w185<yol>

   Bu dosya sayesinde site TMDB anahtarı olmadan da gerçek
   posterleri gösterir. Anahtar girilirse burada karşılığı
   olmayan kayıtlar için canlı arama yine devreye girer.

   Üretim: ${new Date().toISOString().slice(0, 10)} · ${rows.length} kayıt
   ============================================================ */

window.DATA_POSTERS = {
${rows.join('\n')}
};
`);

console.log(`\n${rows.length}/${items.length} kayıt yazıldı → js/data/posters.js`);
if (missing.length) {
  console.log('eksik (üretilen kapakla görünecek): '
    + missing.map(m => `${m.id} (${m.t} ${m.y})`).join(', '));
}
