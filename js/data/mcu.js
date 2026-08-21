/* ============================================================
   js/data/mcu.js
   Marvel Cinematic Universe — filmler, diziler, özel yapımlar
   ------------------------------------------------------------
   Alanlar:
     id    : benzersiz anahtar (localStorage'da bu kullanılır — ASLA değiştirme)
     t     : başlık (TMDB aramasında da bu kullanılır)
     y     : yıl (gruplama için)
     d     : çıkış tarihi YYYY-MM-DD (sıralama için)
     k     : 'film' | 'dizi' | 'ozel'
     u     : evren etiketi
     ph    : faz / dönem
     ess   : true ise Disney+'ın resmî "Doomsday öncesi" listesinde
     tv    : true ise TMDB'de dizi olarak aranır
     soon  : true ise henüz çıkmadı (tarih tahmini olabilir)
     note  : kart altında görünen kısa not (opsiyonel)
   ============================================================ */

window.DATA_MCU = [
  // ---------- Faz 1 ----------
  { id:'mcu-iron-man',            t:'Iron Man',                                    y:2008, d:'2008-05-02', k:'film', u:'MCU', ph:'Faz 1' },
  { id:'mcu-incredible-hulk',     t:'The Incredible Hulk',                         y:2008, d:'2008-06-13', k:'film', u:'MCU', ph:'Faz 1' },
  { id:'mcu-iron-man-2',          t:'Iron Man 2',                                  y:2010, d:'2010-05-07', k:'film', u:'MCU', ph:'Faz 1' },
  { id:'mcu-thor',                t:'Thor',                                        y:2011, d:'2011-05-06', k:'film', u:'MCU', ph:'Faz 1' },
  { id:'mcu-cap-first-avenger',   t:'Captain America: The First Avenger',          y:2011, d:'2011-07-22', k:'film', u:'MCU', ph:'Faz 1', ess:true, note:'Steve Rogers\'ın geçmişe dönüşü Doomsday için kritik' },
  { id:'mcu-avengers',            t:'The Avengers',                                y:2012, d:'2012-05-04', k:'film', u:'MCU', ph:'Faz 1', ess:true },

  // ---------- Faz 2 ----------
  { id:'mcu-iron-man-3',          t:'Iron Man 3',                                  y:2013, d:'2013-05-03', k:'film', u:'MCU', ph:'Faz 2' },
  { id:'mcu-thor-dark-world',     t:'Thor: The Dark World',                        y:2013, d:'2013-11-08', k:'film', u:'MCU', ph:'Faz 2' },
  { id:'mcu-cap-winter-soldier',  t:'Captain America: The Winter Soldier',         y:2014, d:'2014-04-04', k:'film', u:'MCU', ph:'Faz 2' },
  { id:'mcu-gotg',                t:'Guardians of the Galaxy',                     y:2014, d:'2014-08-01', k:'film', u:'MCU', ph:'Faz 2' },
  { id:'mcu-age-of-ultron',       t:'Avengers: Age of Ultron',                     y:2015, d:'2015-05-01', k:'film', u:'MCU', ph:'Faz 2' },
  { id:'mcu-ant-man',             t:'Ant-Man',                                     y:2015, d:'2015-07-17', k:'film', u:'MCU', ph:'Faz 2' },

  // ---------- Faz 3 ----------
  { id:'mcu-civil-war',           t:'Captain America: Civil War',                  y:2016, d:'2016-05-06', k:'film', u:'MCU', ph:'Faz 3' },
  { id:'mcu-doctor-strange',      t:'Doctor Strange',                              y:2016, d:'2016-11-04', k:'film', u:'MCU', ph:'Faz 3' },
  { id:'mcu-gotg-2',              t:'Guardians of the Galaxy Vol. 2',              y:2017, d:'2017-05-05', k:'film', u:'MCU', ph:'Faz 3' },
  { id:'mcu-spider-homecoming',   t:'Spider-Man: Homecoming',                      y:2017, d:'2017-07-07', k:'film', u:'MCU', ph:'Faz 3' },
  { id:'mcu-thor-ragnarok',       t:'Thor: Ragnarok',                              y:2017, d:'2017-11-03', k:'film', u:'MCU', ph:'Faz 3' },
  { id:'mcu-black-panther',       t:'Black Panther',                               y:2018, d:'2018-02-16', k:'film', u:'MCU', ph:'Faz 3' },
  { id:'mcu-infinity-war',        t:'Avengers: Infinity War',                      y:2018, d:'2018-04-27', k:'film', u:'MCU', ph:'Faz 3', ess:true },
  { id:'mcu-ant-man-wasp',        t:'Ant-Man and the Wasp',                        y:2018, d:'2018-07-06', k:'film', u:'MCU', ph:'Faz 3' },
  { id:'mcu-captain-marvel',      t:'Captain Marvel',                              y:2019, d:'2019-03-08', k:'film', u:'MCU', ph:'Faz 3' },
  { id:'mcu-endgame',             t:'Avengers: Endgame',                           y:2019, d:'2019-04-26', k:'film', u:'MCU', ph:'Faz 3', ess:true },
  { id:'mcu-spider-far-from-home',t:'Spider-Man: Far From Home',                   y:2019, d:'2019-07-02', k:'film', u:'MCU', ph:'Faz 3' },

  // ---------- Faz 4 ----------
  { id:'mcu-wandavision',         t:'WandaVision',                                 y:2021, d:'2021-01-15', k:'dizi', u:'MCU', ph:'Faz 4', tv:true },
  { id:'mcu-tfatws',              t:'The Falcon and the Winter Soldier',           y:2021, d:'2021-03-19', k:'dizi', u:'MCU', ph:'Faz 4', tv:true },
  { id:'mcu-loki-s1',             t:'Loki',                                        y:2021, d:'2021-06-09', k:'dizi', u:'MCU', ph:'Faz 4', tv:true, ess:true, note:'1. Sezon — TVA ve Kutsal Zaman Çizgisi' },
  { id:'mcu-black-widow',         t:'Black Widow',                                 y:2021, d:'2021-07-09', k:'film', u:'MCU', ph:'Faz 4' },
  { id:'mcu-what-if-s1',          t:'What If...?',                                 y:2021, d:'2021-08-11', k:'dizi', u:'MCU', ph:'Faz 4', tv:true, note:'1. Sezon' },
  { id:'mcu-shang-chi',           t:'Shang-Chi and the Legend of the Ten Rings',   y:2021, d:'2021-09-03', k:'film', u:'MCU', ph:'Faz 4', ess:true },
  { id:'mcu-eternals',            t:'Eternals',                                    y:2021, d:'2021-11-05', k:'film', u:'MCU', ph:'Faz 4' },
  { id:'mcu-hawkeye',             t:'Hawkeye',                                     y:2021, d:'2021-11-24', k:'dizi', u:'MCU', ph:'Faz 4', tv:true },
  { id:'mcu-no-way-home',         t:'Spider-Man: No Way Home',                     y:2021, d:'2021-12-17', k:'film', u:'MCU', ph:'Faz 4', ess:true },
  { id:'mcu-moon-knight',         t:'Moon Knight',                                 y:2022, d:'2022-03-30', k:'dizi', u:'MCU', ph:'Faz 4', tv:true },
  { id:'mcu-multiverse-madness',  t:'Doctor Strange in the Multiverse of Madness', y:2022, d:'2022-05-06', k:'film', u:'MCU', ph:'Faz 4', ess:true, note:'Incursion kavramı ve Illuminati' },
  { id:'mcu-ms-marvel',           t:'Ms. Marvel',                                  y:2022, d:'2022-06-08', k:'dizi', u:'MCU', ph:'Faz 4', tv:true },
  { id:'mcu-love-and-thunder',    t:'Thor: Love and Thunder',                      y:2022, d:'2022-07-08', k:'film', u:'MCU', ph:'Faz 4' },
  { id:'mcu-i-am-groot-s1',       t:'I Am Groot',                                  y:2022, d:'2022-08-10', k:'ozel', u:'MCU', ph:'Faz 4', tv:true, note:'1. Sezon — kısa filmler' },
  { id:'mcu-she-hulk',            t:'She-Hulk: Attorney at Law',                   y:2022, d:'2022-08-18', k:'dizi', u:'MCU', ph:'Faz 4', tv:true },
  { id:'mcu-werewolf-by-night',   t:'Werewolf by Night',                           y:2022, d:'2022-10-07', k:'ozel', u:'MCU', ph:'Faz 4' },
  { id:'mcu-wakanda-forever',     t:'Black Panther: Wakanda Forever',              y:2022, d:'2022-11-11', k:'film', u:'MCU', ph:'Faz 4', ess:true },
  { id:'mcu-gotg-holiday',        t:'The Guardians of the Galaxy Holiday Special', y:2022, d:'2022-11-25', k:'ozel', u:'MCU', ph:'Faz 4' },

  // ---------- Faz 5 ----------
  { id:'mcu-quantumania',         t:'Ant-Man and the Wasp: Quantumania',           y:2023, d:'2023-02-17', k:'film', u:'MCU', ph:'Faz 5' },
  { id:'mcu-gotg-3',              t:'Guardians of the Galaxy Vol. 3',              y:2023, d:'2023-05-05', k:'film', u:'MCU', ph:'Faz 5' },
  { id:'mcu-secret-invasion',     t:'Secret Invasion',                             y:2023, d:'2023-06-21', k:'dizi', u:'MCU', ph:'Faz 5', tv:true },
  { id:'mcu-i-am-groot-s2',       t:'I Am Groot',                                  y:2023, d:'2023-09-06', k:'ozel', u:'MCU', ph:'Faz 5', tv:true, note:'2. Sezon' },
  { id:'mcu-loki-s2',             t:'Loki',                                        y:2023, d:'2023-10-05', k:'dizi', u:'MCU', ph:'Faz 5', tv:true, ess:true, note:'2. Sezon' },
  { id:'mcu-the-marvels',         t:'The Marvels',                                 y:2023, d:'2023-11-10', k:'film', u:'MCU', ph:'Faz 5', note:'Resmî listede yok ama jenerik sonrası sahnesi X-Men bağlantısı kuruyor' },
  { id:'mcu-what-if-s2',          t:'What If...?',                                 y:2023, d:'2023-12-22', k:'dizi', u:'MCU', ph:'Faz 5', tv:true, note:'2. Sezon' },
  { id:'mcu-echo',                t:'Echo',                                        y:2024, d:'2024-01-09', k:'dizi', u:'MCU', ph:'Faz 5', tv:true },
  { id:'mcu-xmen-97-s1',          t:"X-Men '97",                                   y:2024, d:'2024-03-20', k:'dizi', u:'MCU', ph:'Faz 5', tv:true, note:'1. Sezon — animasyon' },
  { id:'mcu-deadpool-wolverine',  t:'Deadpool & Wolverine',                        y:2024, d:'2024-07-26', k:'film', u:'MCU', ph:'Faz 5', ess:true, note:'Boşluk (Void) ve TVA köprüsü' },
  { id:'mcu-agatha-all-along',    t:'Agatha All Along',                            y:2024, d:'2024-09-18', k:'dizi', u:'MCU', ph:'Faz 5', tv:true },
  { id:'mcu-what-if-s3',          t:'What If...?',                                 y:2024, d:'2024-12-22', k:'dizi', u:'MCU', ph:'Faz 5', tv:true, note:'3. Sezon' },
  { id:'mcu-yfns-s1',             t:'Your Friendly Neighborhood Spider-Man',       y:2025, d:'2025-01-29', k:'dizi', u:'MCU', ph:'Faz 5', tv:true, note:'1. Sezon — ayrı evren, kanon değil' },
  { id:'mcu-brave-new-world',     t:'Captain America: Brave New World',            y:2025, d:'2025-02-14', k:'film', u:'MCU', ph:'Faz 5', ess:true },
  { id:'mcu-daredevil-ba-s1',     t:'Daredevil: Born Again',                       y:2025, d:'2025-03-04', k:'dizi', u:'MCU', ph:'Faz 5', tv:true, note:'1. Sezon' },
  { id:'mcu-thunderbolts',        t:'Thunderbolts*',                               y:2025, d:'2025-05-02', k:'film', u:'MCU', ph:'Faz 5', ess:true, note:'Doomsday olayları bunun 14 ay sonrasında geçiyor' },
  { id:'mcu-ironheart',           t:'Ironheart',                                   y:2025, d:'2025-06-24', k:'dizi', u:'MCU', ph:'Faz 5', tv:true },
  { id:'mcu-fantastic-four',      t:'The Fantastic Four: First Steps',             y:2025, d:'2025-07-25', k:'film', u:'MCU', ph:'Faz 6', ess:true },
  { id:'mcu-eyes-of-wakanda',     t:'Eyes of Wakanda',                             y:2025, d:'2025-08-06', k:'dizi', u:'MCU', ph:'Faz 6', tv:true },
  { id:'mcu-marvel-zombies',      t:'Marvel Zombies',                              y:2025, d:'2025-09-24', k:'dizi', u:'MCU', ph:'Faz 6', tv:true },

  // ---------- Faz 6 ----------
  { id:'mcu-wonder-man',          t:'Wonder Man',                                  y:2026, d:'2026-01-27', k:'dizi', u:'MCU', ph:'Faz 6', tv:true },
  { id:'mcu-daredevil-ba-s2',     t:'Daredevil: Born Again',                       y:2026, d:'2026-03-24', k:'dizi', u:'MCU', ph:'Faz 6', tv:true, note:'2. Sezon' },
  { id:'mcu-punisher-special',    t:'Punisher: One Last Kill',                     y:2026, d:'2026-05-12', k:'ozel', u:'MCU', ph:'Faz 6' },
  { id:'mcu-xmen-97-s2',          t:"X-Men '97",                                   y:2026, d:'2026-06-15', k:'dizi', u:'MCU', ph:'Faz 6', tv:true, note:'2. Sezon — tarih kesin değil' },
  { id:'mcu-brand-new-day',       t:'Spider-Man: Brand New Day',                   y:2026, d:'2026-07-31', k:'film', u:'MCU', ph:'Faz 6' },
  { id:'mcu-yfns-s2',             t:'Your Friendly Neighborhood Spider-Man',       y:2026, d:'2026-10-01', k:'dizi', u:'MCU', ph:'Faz 6', tv:true, soon:true, note:'2. Sezon — güz 2026, tarih kesin değil' },
  { id:'mcu-doomsday',            t:'Avengers: Doomsday',                          y:2026, d:'2026-12-18', k:'film', u:'MCU', ph:'Faz 6', soon:true, note:'HEDEF — 18 Aralık 2026, 2s 45dk' },
  { id:'mcu-secret-wars',         t:'Avengers: Secret Wars',                       y:2027, d:'2027-12-17', k:'film', u:'MCU', ph:'Faz 6', soon:true }
];
