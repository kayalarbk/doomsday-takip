/* ============================================================
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

   Üretim: 2026-08-21 · 84 kayıt
   ============================================================ */

window.DATA_POSTERS = {
  'mcu-iron-man':            '/78lPtwv72eTNqFW9COBYI0dWDJa.jpg',
  'mcu-incredible-hulk':     '/gKzYx79y0AQTL4UAk1cBQJ3nvrm.jpg',
  'mcu-iron-man-2':          '/6WBeq4fCfn7AN0o21W9qNcRF2l9.jpg',
  'mcu-thor':                '/prSfAi1xGrhLQNxVSUFh61xQ4Qy.jpg',
  'mcu-cap-first-avenger':   '/vSNxAJTlD0r02V9sPYpOjqDZXUK.jpg',
  'mcu-avengers':            '/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg',
  'mcu-iron-man-3':          '/qhPtAc1TKbMPqNvcdXSOn9Bn7hZ.jpg',
  'mcu-thor-dark-world':     '/wp6OxE4poJ4G7c0U2ZIXasTSMR7.jpg',
  'mcu-cap-winter-soldier':  '/tVFRpFw3xTedgPGqxW0AOI8Qhh0.jpg',
  'mcu-gotg':                '/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg',
  'mcu-age-of-ultron':       '/4ssDuvEDkSArWEdyBl2X5EHvYKU.jpg',
  'mcu-ant-man':             '/rQRnQfUl3kfp78nCWq8Ks04vnq1.jpg',
  'mcu-civil-war':           '/rAGiXaUfPzY7CDEyNKUofk3Kw2e.jpg',
  'mcu-doctor-strange':      '/uGBVj3bEbCoZbDjjl9wTxcygko1.jpg',
  'mcu-gotg-2':              '/y4MBh0EjBlMuOzv9axM4qJlmhzz.jpg',
  'mcu-spider-homecoming':   '/c24sv2weTHPsmDa7jEMN0m2P3RT.jpg',
  'mcu-thor-ragnarok':       '/rzRwTcFvttcN1ZpX2xv4j3tSdJu.jpg',
  'mcu-black-panther':       '/uxzzxijgPIY7slzFvMotPv8wjKA.jpg',
  'mcu-infinity-war':        '/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg',
  'mcu-ant-man-wasp':        '/cFQEO687n1K6umXbInzocxcnAQz.jpg',
  'mcu-captain-marvel':      '/AtsgWhDnHTq68L0lLsUrCnM7TjG.jpg',
  'mcu-endgame':             '/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg',
  'mcu-spider-far-from-home':'/4q2NNj4S5dG2RLF9CpXsej7yXl.jpg',
  'mcu-wandavision':         '/8BSVNGpZwZDScVv8e5S1c8XIjeJ.jpg',
  'mcu-tfatws':              '/6kbAMLteGO8yyewYau6bJ683sw7.jpg',
  'mcu-loki-s1':             '/8uVqe9ThcuYVNdh4O0kuijIWMLL.jpg',
  'mcu-black-widow':         '/qAZ0pzat24kLdO3o8ejmbLxyOac.jpg',
  'mcu-what-if-s1':          '/lztz5XBMG1x6Y5ubz7CxfPFsAcW.jpg',
  'mcu-shang-chi':           '/9f2Q0U3IOsLgrI2HkvldwSABZy5.jpg',
  'mcu-eternals':            '/lFByFSLV5WDJEv3KabbdAF959F2.jpg',
  'mcu-hawkeye':             '/nGcqeKieycPFvsxOeLJssCTt3mL.jpg',
  'mcu-no-way-home':         '/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
  'mcu-moon-knight':         '/zPFm8ZbvdzoViRHnLi8cH7TBS1B.jpg',
  'mcu-multiverse-madness':  '/ddJcSKbcp4rKZTmuyWaMhuwcfMz.jpg',
  'mcu-ms-marvel':           '/4qoFtoPvFGjlIXYfFVNKhOwZ6zD.jpg',
  'mcu-love-and-thunder':    '/pIkRyD18kl4FhoCNQuWxWu5cBLM.jpg',
  'mcu-i-am-groot-s1':       '/oZmqHnWJVQLOKOibDa34W4iGBZU.jpg',
  'mcu-she-hulk':            '/41Iekrap0j80u808Z2004t88r6o.jpg',
  'mcu-werewolf-by-night':   '/mvIvNKRIJPPS7WSFarFhOAGIVnU.jpg',
  'mcu-wakanda-forever':     '/sv1xJUazXeYqALzczSZ3O6nkH75.jpg',
  'mcu-gotg-holiday':        '/8dqXyslZ2hv49Oiob9UjlGSHSTR.jpg',
  'mcu-quantumania':         '/qnqGbB22YJ7dSs4o6M7exTpNxPz.jpg',
  'mcu-gotg-3':              '/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg',
  'mcu-secret-invasion':     '/8fQckSuTR8NEN3mXeledSQCISZJ.jpg',
  'mcu-i-am-groot-s2':       '/7b4qBnExIjuANVDKWyVN8gVVOXS.jpg',
  'mcu-loki-s2':             '/oJdVHUYrjdS2IqiNztVIP4GPB1p.jpg',
  'mcu-the-marvels':         '/9GBhzXMFjgcZ3FdR9w3bUMMTps5.jpg',
  'mcu-what-if-s2':          '/3yhoq5LVMgKy9rEriH6ytq9BoJV.jpg',
  'mcu-echo':                '/eVqz9zgvGYVqvHOg1QlHWrGTpz3.jpg',
  'mcu-xmen-97-s1':          '/383PV0WolYYQvTriH0NfvMUA28R.jpg',
  'mcu-deadpool-wolverine':  '/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
  'mcu-agatha-all-along':    '/cXEE6EsLJNwEwOCedX04Uixfq5O.jpg',
  'mcu-what-if-s3':          '/bbGeKXKoualYRYqvFYiv8fPZK0d.jpg',
  'mcu-yfns-s1':             '/bifTEU63VFt2ugUte9LqNBb1Dno.jpg',
  'mcu-brave-new-world':     '/pzIddUEMWhWzfvLI3TwxUG2wGoi.jpg',
  'mcu-daredevil-ba-s1':     '/9lLuhV703HGCbnz6FxnqCwIwzAZ.jpg',
  'mcu-thunderbolts':        '/hqcexYHbiTBfDIdDWxrxPtVndBX.jpg',
  'mcu-ironheart':           '/1V4rcxP9Dk0TKHkVAc2sigcdDXc.jpg',
  'mcu-fantastic-four':      '/nf5qaSEvyYSNeFH0YhSs5EsBLX9.jpg',
  'mcu-eyes-of-wakanda':     '/64RsvJMVUfhs5CDV7xXRjiLK4w6.jpg',
  'mcu-marvel-zombies':      '/wofiHMsXxmp0lTafcBrgciSxBVx.jpg',
  'mcu-wonder-man':          '/z5xlxga7oc2eGVpS9vw38ULA9nr.jpg',
  'mcu-daredevil-ba-s2':     '/timvsedxh5ce795tsv6EDTZmmXW.jpg',
  'mcu-punisher-special':    '/qQclTgLMDvGBuUBFGHRipxkEwWR.jpg',
  'mcu-xmen-97-s2':          '/2HKBc5UiFw8JrruHq8S1Y7TnlW0.jpg',
  'mcu-brand-new-day':       '/iPOn6DinuVyLY17YM9mKuPofV08.jpg',
  'mcu-yfns-s2':             '/kjcsNeqF52YUQ2rUBGLMHwLkxvR.jpg',
  'mcu-doomsday':            '/jzPwsojjFStf5lR5Nm07w2hH56G.jpg',
  'mcu-secret-wars':         '/f0YBuh4hyiAheXhh4JnJWoKi9g5.jpg',
  'fox-x-men':               '/bRDAc4GogyS9ci3ow7UnInOcriN.jpg',
  'fox-x2':                  '/bst4alFUXCxISwdRUKSMhhkrX1M.jpg',
  'fox-last-stand':          '/a2xicU8DpKtRizOHjQLC1JyCSRS.jpg',
  'fox-origins-wolverine':   '/yj8LbTju1p7CUJg7US2unSBk33s.jpg',
  'fox-first-class':         '/hNEokmUke0dazoBhttFN0o3L7Xv.jpg',
  'fox-the-wolverine':       '/t2wVAcoRlKvEIVSbiYDb8d0QqqS.jpg',
  'fox-days-future-past':    '/tYfijzolzgoMOtegh1Y7j2Enorg.jpg',
  'fox-deadpool':            '/3E53WEZJqP6aM84D8CckXx4pIHw.jpg',
  'fox-apocalypse':          '/ikA8UhYdTGpqbatFa93nIf6noSr.jpg',
  'fox-logan':               '/fnbjcRDYn6YviCcePDnGdyAkYsB.jpg',
  'fox-legion':              '/au5hsZ20QzOVXSOWgx7umAhHC6A.jpg',
  'fox-the-gifted':          '/nYkGYVzn4Df3V5fZS9xYyKZn551.jpg',
  'fox-deadpool-2':          '/to0spRl1CMDvyUbOnbb4fTk3VAd.jpg',
  'fox-dark-phoenix':        '/cCTJPelKGLhALq3r51A9uMonxKj.jpg',
  'fox-new-mutants':         '/xiDGcXJTvu1lazFRYip6g1eLt9c.jpg'
};
