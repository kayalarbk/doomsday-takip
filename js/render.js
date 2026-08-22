/* ============================================================
   js/render.js — listeyi çizer, filtreler, kart etkileşimi
   ------------------------------------------------------------
   Akış:
     Render.init(items)  -> tüm veriyi alır, tarihe göre sıralar
     Render.apply()      -> aktif filtreye göre listeyi yeniden çizer
     Render.stats()      -> ilerleme sayıları

   Filtre durumu tek bir nesnede tutulur (state). Yeni filtre
   eklemek için: FILTERS dizisine ekle + match() içine koşulu yaz.

   Geri sayım iki tarih arasında ölçülür: ANNOUNCED (filmin
   duyurulduğu gün) ve TARGET (vizyon). Üstteki sayaç kalan
   ay/gün/saati saniyede bir tazeler, alttaki şerit yolun ne
   kadarının geçtiğini gösterir. Aynı tick temayı da günceller
   (bkz. js/theme.js — yaklaştıkça kızıldan yeşile).
   ============================================================ */

window.Render = (function () {

  const TARGET    = '2026-12-18';   // Avengers: Doomsday vizyon tarihi (yerel gece yarısı)
  const ANNOUNCED = '2024-07-27';   // SDCC 2024 — ad + RDJ'nin Doctor Doom olduğu duyuruldu

  let all = [];
  let listEl, emptyEl;
  const state = { group: 'hepsi' };

  /* ---------- filtre tanımları ---------- */
  const FILTERS = [
    { id: 'hepsi', label: 'Hepsi' },
    { id: 'film',  label: 'Filmler' },
    { id: 'dizi',  label: 'Diziler' }
  ];

  function match(it) {
    switch (state.group) {
      case 'film': return it.k === 'film';
      case 'dizi': return it.k === 'dizi' || it.k === 'ozel';   // özel yapımlar dizilerle
      default:     return true;
    }
  }

  /* ---------- kart ---------- */
  function card(it) {
    const seen = Store.isWatched(it.id);
    const when = Store.dateOf(it.id);

    const el = document.createElement('article');
    el.className = 'card' + (seen ? ' is-seen' : '');
    el.dataset.id = it.id;

    /* --- tıklanabilir yüz --- */
    const face = document.createElement('button');
    face.type = 'button';
    face.className = 'card-face';
    face.setAttribute('aria-expanded', 'false');

    face.appendChild(Posters.build(it));

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.innerHTML =
      `<h3>${Util.escapeHTML(it.t)}${it.ess ? '<span class="badge-ess">RESMÎ</span>' : ''}</h3>` +
      `<p class="line">${it.y} · ${Util.kindLabel(it.k)} · ${Util.escapeHTML(it.u)} · ${Util.escapeHTML(it.ph)}` +
      (it.soon ? ' · <i>henüz çıkmadı</i>' : '') + `</p>` +
      (it.note ? `<p class="note">${Util.escapeHTML(it.note)}</p>` : '');
    face.appendChild(meta);

    const tick = document.createElement('span');
    tick.className = 'tick';
    tick.textContent = '✓';
    face.appendChild(tick);

    const stamp = document.createElement('div');
    stamp.className = 'stamp';
    stamp.innerHTML = `İZLENDİ<b>${when ? Util.fmtTR(when) : ''}</b>`;
    face.appendChild(stamp);

    el.appendChild(face);

    /* --- açılır panel --- */
    const panel = document.createElement('div');
    panel.className = 'panel';
    panel.innerHTML = `<div><div class="panel-inner">
        <p class="panel-date"></p>
        <div class="panel-actions"></div>
      </div></div>`;
    el.appendChild(panel);

    face.addEventListener('click', () => toggle(el, it));
    return el;
  }

  function toggle(el, it) {
    const open = el.classList.contains('is-open');
    document.querySelectorAll('.card.is-open').forEach(c => {
      c.classList.remove('is-open');
      c.querySelector('.card-face').setAttribute('aria-expanded', 'false');
    });
    if (open) return;
    fillPanel(el, it);
    el.classList.add('is-open');
    el.querySelector('.card-face').setAttribute('aria-expanded', 'true');
  }

  function fillPanel(el, it) {
    const seen = Store.isWatched(it.id);
    const when = Store.dateOf(it.id);
    const today = Util.todayISO();

    el.querySelector('.panel-date').innerHTML = seen
      ? `İzlendi olarak kayıtlı: <b>${Util.fmtTR(when)}</b>`
      : `Bugün: <b>${Util.fmtTR(today)}</b> — çıkış: ${Util.fmtTR(it.d)}`;

    const acts = el.querySelector('.panel-actions');
    acts.innerHTML = '';

    if (!seen) {
      acts.appendChild(btn('act act-primary', `Bugün izledim (${Util.fmtTR(today)})`, () => {
        setWatched(el, it, today, true);
      }));
      acts.appendChild(dateBtn('Başka tarih', today, v => setWatched(el, it, v, true)));
    } else {
      acts.appendChild(dateBtn('Tarihi düzelt', when, v => setWatched(el, it, v, false)));
      acts.appendChild(btn('act', 'İşareti kaldır', () => {
        Store.unmark(it.id);
        el.classList.remove('is-seen', 'just-stamped');
        el.querySelector('.stamp b').textContent = '';
        fillPanel(el, it);
        refreshStats();
        Util.toast('İşaret kaldırıldı');
      }));
    }
  }

  function btn(cls, label, fn) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = cls; b.textContent = label;
    b.addEventListener('click', fn);
    return b;
  }

  function dateBtn(label, value, fn) {
    const b = document.createElement('span');
    b.className = 'act act-date';
    b.textContent = label;
    const inp = document.createElement('input');
    inp.type = 'date';
    inp.value = value;
    inp.max = Util.todayISO();
    inp.setAttribute('aria-label', label);
    inp.addEventListener('change', () => { if (inp.value) fn(inp.value); });
    b.appendChild(inp);
    return b;
  }

  function setWatched(el, it, dateStr, animate) {
    Store.mark(it.id, dateStr);
    el.classList.add('is-seen');
    el.querySelector('.stamp b').textContent = Util.fmtTR(dateStr);
    if (animate) {
      el.classList.remove('just-stamped');
      void el.offsetWidth;              // animasyonu yeniden tetikle
      el.classList.add('just-stamped');
    }
    fillPanel(el, it);
    refreshStats();
    Util.toast(`Damgalandı · ${Util.fmtTR(dateStr)}`);
  }

  /* ---------- liste ---------- */
  function apply() {
    const rows = all.filter(match);
    listEl.innerHTML = '';

    if (!rows.length) {
      emptyEl.hidden = false;
      refreshStats();
      return;
    }
    emptyEl.hidden = true;

    let currentYear = null, yearBox = null;
    rows.forEach(it => {
      if (it.y !== currentYear) {
        currentYear = it.y;
        yearBox = document.createElement('section');
        yearBox.className = 'year';
        const inYear = rows.filter(r => r.y === currentYear);
        const seen = inYear.filter(r => Store.isWatched(r.id)).length;
        const mark = document.createElement('h2');
        mark.className = 'year-mark mono' + (seen === inYear.length ? ' is-full' : '');
        mark.innerHTML = `${currentYear}<span>${seen}/${inYear.length}</span>`;
        yearBox.appendChild(mark);
        listEl.appendChild(yearBox);
      }
      yearBox.appendChild(card(it));
    });

    refreshStats();
  }

  /* ---------- istatistik ---------- */
  function refreshStats() {
    const total = all.length;
    const seen = all.filter(it => Store.isWatched(it.id)).length;
    const pct = total ? Math.round(seen / total * 100) : 0;

    document.getElementById('count').innerHTML = `<b>${seen}</b> / ${total} izlendi`;
    document.getElementById('bar-fill').style.width = pct + '%';

    tick();
  }

  /* ---------- geri sayım sayacı ---------- */
  // Saniyede bir çalışır ama DOM'a yalnızca değişen şey yazılır:
  // sayaç saatte bir, şerit ve tema günde bir tazelenir.
  let lastCd = '', lastDays = null;

  /** Sayaç + zaman şeridi + tema. Saniyede bir çağrılır. */
  function tick() {
    const now = new Date();
    const target = new Date(TARGET + 'T00:00:00');
    const p = Util.countdownParts(now, target);

    const html = p
      ? `<span class="cd">` +
        seg(p.ay, 'ay') + seg(p.gun, 'gün') + seg(p.saat, 'saat') +
        `</span><small>Doomsday'e kaldı</small>`
      : `<span class="cd-done">ÇIKTI</span><small>Doomsday</small>`;

    if (html !== lastCd) {
      document.getElementById('days').innerHTML = html;
      lastCd = html;
    }

    const today = Util.todayISO();
    const daysLeft = Util.daysBetween(today, TARGET);
    if (daysLeft !== lastDays) {
      lastDays = daysLeft;
      strip(today, daysLeft);
    }
  }

  function seg(n, label) {
    return `<span class="cd-seg"><b>${n}</b><i>${label}</i></span>`;
  }

  /* Duyurudan vizyona uzanan zaman şeridi. Toplam süre sabit;
     bugünün o aralıkta nerede durduğunu gösterir. */
  function strip(today, daysLeft) {

    const span = Util.daysBetween(ANNOUNCED, TARGET);          // toplam gün
    const gone = Math.min(Math.max(Util.daysBetween(ANNOUNCED, today), 0), span);
    const pct = span > 0 ? Math.round(gone / span * 100) : 100;

    document.getElementById('time-fill').style.width = pct + '%';
    document.getElementById('since-pct').textContent = '%' + pct;
    document.getElementById('since-text').textContent = daysLeft >= 0
      ? `${Util.fmtShortTR(ANNOUNCED)} duyuruldu · ${gone}. gün / ${span}`
      : `${Util.fmtShortTR(ANNOUNCED)} duyuruldu · ${Util.fmtShortTR(TARGET)} çıktı`;

    if (window.Theme) Theme.apply(daysLeft);
  }

  /* ---------- kurulum ---------- */
  function init(items) {
    all = items.slice().sort((a, b) => a.d.localeCompare(b.d));
    listEl = document.getElementById('list');
    emptyEl = document.getElementById('empty');

    const bar = document.getElementById('filters');
    FILTERS.forEach(f => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip' + (f.cls ? ' ' + f.cls : '');
      b.textContent = f.label;
      b.dataset.f = f.id;
      b.setAttribute('aria-pressed', String(state.group === f.id));
      b.addEventListener('click', () => {
        state.group = f.id;
        bar.querySelectorAll('.chip[data-f]').forEach(c =>
          c.setAttribute('aria-pressed', String(c.dataset.f === f.id)));
        apply();
      });
      bar.appendChild(b);
    });

    apply();
    setInterval(tick, 1000);   // sayaç + tema canlı kalsın
  }

  return { init, apply, refreshStats, tick, all: () => all, TARGET, ANNOUNCED };
})();
