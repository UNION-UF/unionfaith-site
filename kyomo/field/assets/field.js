/* SATTO 外回り版 共通データ。すべて架空のサンプルで、保存先はこの端末のブラウザのみ。
   本番ではサーバーに置き換え、誰が何を見られるかもサーバー側で分ける。 */
(function () {
  'use strict';
  const KEY = 'kyomo-field-v1';
  const d0 = new Date();
  const YEAR = d0.getFullYear(), MONTH = d0.getMonth() + 1, TODAY = d0.getDate();
  const DAY_KEY = YEAR + '-' + MONTH + '-' + TODAY;
  const pad = (n) => String(n).padStart(2, '0');
  const fmt = (m) => { m = Math.max(0, Math.floor(m)); return pad(Math.floor(m / 60) % 24) + ':' + pad(m % 60); };
  const dur = (m) => { m = Math.max(0, Math.round(m)); return m < 60 ? m + '分' : Math.floor(m / 60) + '時間' + (m % 60 ? (m % 60) + '分' : ''); };
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { let a = seed >>> 0; return function () { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const WD = '日月火水木金土';
  const weekday = (d) => WD[new Date(YEAR, MONTH - 1, d).getDay()];
  const dayLabel = (d) => MONTH + '月' + d + '日(' + weekday(d) + ')';

  const AREAS = [{ id: 'chugoku', name: '中国' }, { id: 'kyushu', name: '九州' }, { id: 'okinawa', name: '沖縄' }, { id: 'kansai', name: '関西' }];
  const CITIES = [
    { n: '山口', pref: '山口県', area: 'chugoku', lat: 34.1785, lng: 131.4737, k: 3 },
    { n: '下関', pref: '山口県', area: 'chugoku', lat: 33.9578, lng: 130.9414, k: 2 },
    { n: '宇部', pref: '山口県', area: 'chugoku', lat: 33.9516, lng: 131.2466, k: 2 },
    { n: '周南', pref: '山口県', area: 'chugoku', lat: 34.0553, lng: 131.8063, k: 2 },
    { n: '広島', pref: '広島県', area: 'chugoku', lat: 34.3963, lng: 132.4596, k: 3 },
    { n: '福山', pref: '広島県', area: 'chugoku', lat: 34.4858, lng: 133.3623, k: 2 },
    { n: '岡山', pref: '岡山県', area: 'chugoku', lat: 34.6551, lng: 133.9195, k: 2 },
    { n: '福岡', pref: '福岡県', area: 'kyushu', lat: 33.5902, lng: 130.4017, k: 3 },
    { n: '北九州', pref: '福岡県', area: 'kyushu', lat: 33.8834, lng: 130.8752, k: 2 },
    { n: '久留米', pref: '福岡県', area: 'kyushu', lat: 33.3192, lng: 130.5083, k: 2 },
    { n: '熊本', pref: '熊本県', area: 'kyushu', lat: 32.8032, lng: 130.7079, k: 2 },
    { n: '大分', pref: '大分県', area: 'kyushu', lat: 33.2382, lng: 131.6126, k: 2 },
    { n: '鹿児島', pref: '鹿児島県', area: 'kyushu', lat: 31.5966, lng: 130.5571, k: 2 },
    { n: '那覇', pref: '沖縄県', area: 'okinawa', lat: 26.2124, lng: 127.6809, k: 3 },
    { n: '沖縄', pref: '沖縄県', area: 'okinawa', lat: 26.3344, lng: 127.8056, k: 2 },
    { n: '大阪', pref: '大阪府', area: 'kansai', lat: 34.7025, lng: 135.4959, k: 3 },
    { n: '神戸', pref: '兵庫県', area: 'kansai', lat: 34.6901, lng: 135.1955, k: 2 },
    { n: '京都', pref: '京都府', area: 'kansai', lat: 35.0116, lng: 135.7681, k: 2 }
  ];
  const BASE_STORES = [];
  CITIES.forEach((c, ci) => {
    for (let i = 0; i < c.k; i++) BASE_STORES.push({ id: 's' + ci + '-' + i, name: c.n + 'ABCD'[i] + '店', pref: c.pref, area: c.area, lat: +(c.lat + (i - 1) * 0.0115 + (ci % 3) * 0.0021).toFixed(5), lng: +(c.lng + (((i * 7) % 3) - 1) * 0.0132).toFixed(5) });
  });
  const CENTER = {};
  AREAS.forEach((a) => { const c = CITIES.find((x) => x.area === a.id); CENTER[a.id] = { lat: c.lat, lng: c.lng }; });

  const ORGS = [{ id: 'v', name: '自社' }, { id: 'a', name: '委託先A社' }, { id: 'b', name: '委託先B社' }];
  const orgName = (id) => (ORGS.find((o) => o.id === id) || {}).name || '';
  /* 架空の氏名。実在の人とは関係ありません */
  const SUR = ['佐藤', '鈴木', '高橋', '伊藤', '渡辺', '山本', '中村', '小林', '加藤', '吉田', '山田', '佐々木', '井上', '木村', '林', '清水', '山崎', '森', '池田', '橋本', '阿部', '石川', '前田', '藤井'];
  const GIV = ['大輔', '美咲', '翔太', '彩', '健太', '葵', '拓也', '真由', '亮', '結衣', '直樹', '千尋', '誠', '遥', '悠斗', '七海', '航', '優花', '陸', '莉子', '蓮', '楓', '颯', '明日香'];
  const PEOPLE = [];
  for (let i = 0; i < 24; i++) {
    const org = i < 5 ? 'v' : i < 16 ? 'a' : 'b'; /* 自社の社員は少数で、ほとんどが委託先の人という想定 */
    const area = ['chugoku', 'kyushu', 'chugoku', 'kyushu', 'okinawa', 'kansai'][i % 6];
    const role = org === 'v' ? (i % 5 === 1 ? 'SV（BIGLOBE）' : i % 5 === 3 ? 'ラウンダー' : 'SV') : (i % 2 ? 'ラウンダー' : 'SV');
    PEOPLE.push({ id: 'f' + (i + 1), name: SUR[i] + ' ' + GIV[(i * 7) % GIV.length], org, area, role });
  }
  const byId = {};
  PEOPLE.forEach((p) => { byId[p.id] = p; });
  /* 試作で実際に操作できる2人。f1 は自社のSV、f15 は委託先A社のSV */
  const LIVE = ['f1', 'f15'];

  const DID = ['KSF', 'CTC', '挨拶', '打合せ', '研修・指導', '販促物の設置', '在庫・什器の確認', 'その他'];
  const WHO = ['店長', '副店長', 'スタッフ', '本部・代理店', 'なし'];
  const PLACES = ['カフェ', '自宅', 'オフィス', 'その他'];
  const NOTES = ['新商品の案内と売場の陳列を確認しました。', '今月の目標の進み具合を店長と確認しました。', 'スタッフ向けに提案の練習をしました。', '来週のイベントの段取りを打ち合わせました。', '販促物を入れ替えました。', '在庫と什器の状態を確認しました。', '前回の指摘事項が改善されていることを確認しました。'];
  const WORK = ['報告書の作成', '次の訪問の資料準備', 'オンライン会議', 'メールと電話の対応'];

  function fresh() {
    return { v: 1, day: DAY_KEY, persona: 'f1', viewer: 'v', ev: {}, hist: {}, test: null, extraStores: [], settings: { gps: false, did: DID.slice(), who: WHO.slice() } };
  }
  function load() {
    let s = null;
    try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) { s = null; }
    if (!s || s.v !== 1) return fresh();
    if (s.day !== DAY_KEY) {
      Object.keys(s.ev || {}).forEach((pid) => { if (s.ev[pid] && s.ev[pid].length) { s.hist[s.day] = s.hist[s.day] || {}; s.hist[s.day][pid] = s.ev[pid]; } });
      s.ev = {}; s.day = DAY_KEY; s.test = null;
    }
    const f = fresh();
    return Object.assign(f, s, { settings: Object.assign(f.settings, s.settings || {}) });
  }

  const cache = {};
  const listeners = [];
  const F = {
    YEAR, MONTH, TODAY, DAY_KEY, AREAS, ORGS, PEOPLE, byId, LIVE, PLACES, CENTER,
    fmt, dur, esc, weekday, dayLabel, orgName,
    S: load(),
    save() { try { localStorage.setItem(KEY, JSON.stringify(F.S)); } catch (e) { /* 保存できない環境では画面上だけで動かす */ } },
    reset() { const keep = { persona: F.S.persona, viewer: F.S.viewer }; F.S = Object.assign(fresh(), keep); F.save(); },
    onChange(fn) { listeners.push(fn); },

    /* 時刻。試作の確認用に、時刻を動かせる */
    realMin() { const d = new Date(); return d.getHours() * 60 + d.getMinutes() + d.getSeconds() / 60; },
    now() { const t = F.S.test; return t ? t.m + (Date.now() - t.at) / 60000 : F.realMin(); },
    nowMin() { return Math.floor(F.now()); },
    isTest() { return !!F.S.test; },
    setNow(m) { F.S.test = { m, at: Date.now() }; F.save(); },
    setReal() { F.S.test = null; F.save(); },

    stores() { return BASE_STORES.concat(F.S.extraStores); },
    store(id) { return F.stores().find((s) => s.id === id) || null; },
    areaName(id) { return (AREAS.find((a) => a.id === id) || {}).name || ''; },
    didList() { return F.S.settings.did; },
    whoList() { return F.S.settings.who; },

    /* 見本の一日。実際に操作する2人以外は、この予定から作る */
    plan(p, day) {
      const k = p.id + ':' + MONTH + ':' + day;
      if (k in cache) return cache[k];
      const r = rng(hash(k));
      const wd = new Date(YEAR, MONTH - 1, day).getDay();
      let ev = null;
      if (!((wd === 0 || wd === 6) && r() < 0.55) && r() >= 0.1) {
        ev = [];
        /* 一部の店舗は訪問が少ない想定にして、「店舗の訪問状況」で見つけられるようにする */
        const st = BASE_STORES.filter((s) => s.area === p.area && hash(s.id) % 6 !== 0);
        let t = 500 + Math.floor(r() * 55);
        ev.push({ type: 'start', t });
        t += 15 + Math.floor(r() * 30);
        let worked = 0, guard = 0;
        while (t < 1020 && guard++ < 12) {
          if (worked < 2 && r() < 0.22) {
            const d = 35 + Math.floor(r() * 55), place = ['カフェ', 'カフェ', '自宅', 'オフィス'][Math.floor(r() * 4)];
            ev.push({ type: 'work', t, place });
            ev.push({ type: 'workend', t: t + d, place, memo: WORK[Math.floor(r() * WORK.length)] });
            t += d + 10 + Math.floor(r() * 20); worked++; continue;
          }
          const s = st[Math.floor(r() * st.length)], d = 30 + Math.floor(r() * 70);
          const did = [], n = 1 + Math.floor(r() * 3);
          while (did.length < n) { const x = DID[Math.floor(r() * 7)]; if (!did.includes(x)) did.push(x); }
          ev.push({ type: 'in', t, storeId: s.id });
          ev.push({ type: 'out', t: t + d, storeId: s.id, rep: { did, who: [WHO[Math.floor(r() * 4)]], note: NOTES[Math.floor(r() * NOTES.length)], photos: [] } });
          t += d + 15 + Math.floor(r() * 35);
        }
        ev.push({ type: 'end', t: Math.max(t, 1035) + Math.floor(r() * 25) });
        const c = CENTER[p.area];
        ev.forEach((e) => {
          const s = e.storeId ? BASE_STORES.find((x) => x.id === e.storeId) : null;
          const base = s || { lat: c.lat + (r() - 0.5) * 0.04, lng: c.lng + (r() - 0.5) * 0.04 };
          e.loc = { lat: +(base.lat + (r() - 0.5) * 0.0012).toFixed(6), lng: +(base.lng + (r() - 0.5) * 0.0012).toFixed(6), acc: 12 + Math.floor(r() * 40) };
        });
      }
      cache[k] = ev;
      return ev;
    },
    /* その日の記録。休みの日は null */
    events(p, day) {
      if (day === TODAY) {
        if (LIVE.includes(p.id)) return F.S.ev[p.id] || [];
        const pl = F.plan(p, TODAY);
        if (!pl) return null;
        const n = F.nowMin();
        return pl.filter((e) => e.t <= n);
      }
      const h = F.S.hist[YEAR + '-' + MONTH + '-' + day];
      if (h && h[p.id]) return h[p.id];
      return F.plan(p, day);
    },
    status(p) {
      const ev = F.events(p, TODAY);
      if (ev === null) return { key: 'off', label: '休み', pill: 'idle' };
      const last = ev[ev.length - 1];
      if (!last) return { key: 'before', label: '稼働前', pill: 'idle' };
      if (last.type === 'in') return { key: 'in', label: '入店中', pill: 'in', since: last.t, storeId: last.storeId };
      if (last.type === 'work') return { key: 'work', label: '作業中', pill: 'warn', since: last.t, place: last.place };
      if (last.type === 'end') return { key: 'end', label: '稼働終了', pill: 'idle', since: last.t };
      return { key: 'active', label: '稼働中', pill: 'ok', since: last.t };
    },
    visits(ev) {
      const out = []; let cur = null;
      (ev || []).forEach((e) => {
        if (e.type === 'in') { cur = { storeId: e.storeId, tin: e.t, tout: null, rep: null, locIn: e.loc }; out.push(cur); }
        else if (e.type === 'out' && cur) { cur.tout = e.t; cur.rep = e.rep; cur.locOut = e.loc; cur = null; }
      });
      return out;
    },
    works(ev) {
      const out = []; let cur = null;
      (ev || []).forEach((e) => {
        if (e.type === 'work') { cur = { place: e.place, tin: e.t, tout: null, memo: '' }; out.push(cur); }
        else if (e.type === 'workend' && cur) { cur.tout = e.t; cur.memo = e.memo || ''; cur = null; }
      });
      return out;
    },
    span(ev, isToday) {
      const s = (ev || []).find((e) => e.type === 'start'), e = (ev || []).slice().reverse().find((x) => x.type === 'end');
      if (!s) return null;
      return { from: s.t, to: e ? e.t : (isToday ? F.nowMin() : null) };
    },

    /* 見られる範囲。時刻や位置は所属先の管理者だけ。自社の管理者は、委託先の人については訪問報告だけを見る */
    detail(p) { return F.S.viewer === p.org; },
    reportsOK(p) { return F.S.viewer === p.org || F.S.viewer === 'v'; },

    /* 予定にない記録を足す（実際に操作する2人用） */
    push(pid, e) { F.S.ev[pid] = F.S.ev[pid] || []; F.S.ev[pid].push(e); F.save(); return e; },

    distanceM(a, b) {
      const R = 6371000, toR = (x) => x * Math.PI / 180;
      const dLat = toR(b.lat - a.lat), dLng = toR(b.lng - a.lng);
      const h = Math.sin(dLat / 2) ** 2 + Math.cos(toR(a.lat)) * Math.cos(toR(b.lat)) * Math.sin(dLng / 2) ** 2;
      return 2 * R * Math.asin(Math.sqrt(h));
    },

    /* 写真。端末の中にだけ保存する */
    db: null,
    openDb() {
      if (F.db) return F.db;
      F.db = new Promise((res, rej) => {
        try {
          const q = indexedDB.open('kyomo-field-photos', 1);
          q.onupgradeneeded = () => q.result.createObjectStore('p');
          q.onsuccess = () => res(q.result);
          q.onerror = () => rej(q.error);
        } catch (e) { rej(e); }
      });
      return F.db;
    },
    async photoPut(id, url) { const db = await F.openDb(); return new Promise((res, rej) => { const tx = db.transaction('p', 'readwrite'); tx.objectStore('p').put(url, id); tx.oncomplete = res; tx.onerror = () => rej(tx.error); }); },
    async photoGet(id) { try { const db = await F.openDb(); return await new Promise((res) => { const q = db.transaction('p').objectStore('p').get(id); q.onsuccess = () => res(q.result || null); q.onerror = () => res(null); }); } catch (e) { return null; } },
    hydratePhotos(root) { root.querySelectorAll('img[data-photo]').forEach(async (img) => { const u = await F.photoGet(img.dataset.photo); if (u) img.src = u; else img.closest('.ph') && img.closest('.ph').remove(); }); },
    shrinkImage(file, max, q) {
      return new Promise((res, rej) => {
        const url = URL.createObjectURL(file), im = new Image();
        im.onload = () => {
          const k = Math.min(1, max / Math.max(im.width, im.height)), c = document.createElement('canvas');
          c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
          c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
          URL.revokeObjectURL(url); res(c.toDataURL('image/jpeg', q));
        };
        im.onerror = () => { URL.revokeObjectURL(url); rej(new Error('image')); };
        im.src = url;
      });
    },

    /* 一日の記録の表示。本人の画面と管理画面で共通 */
    placeOf(e) { const s = e.storeId ? F.store(e.storeId) : null; return s ? s.name : (e.place || ''); },
    locText(e) {
      if (!F.S.settings.gps || !e.loc) return '';
      if (e.loc.pending) return '<span class="loc">位置を取得中</span>';
      if (e.loc.err) return '<span class="loc">位置を取得できず</span>';
      return '<span class="loc">位置を記録（誤差' + e.loc.acc + 'm）</span>';
    },
    timeline(ev, opt) {
      opt = opt || {};
      if (!ev || !ev.length) return '<p class="empty">まだ記録はありません。</p>';
      const vs = F.visits(ev);
      return '<ol class="tl">' + ev.map((e) => {
        let what = '', d = '';
        if (e.type === 'start') what = '稼働スタート';
        if (e.type === 'end') what = '稼働終了';
        if (e.type === 'in') { what = '入店　' + F.esc(F.placeOf(e)); }
        if (e.type === 'work') { what = '作業開始　' + F.esc(e.place); }
        if (e.type === 'workend') { what = '作業終了'; if (e.memo) d += '<div class="d">' + F.esc(e.memo) + '</div>'; }
        if (e.type === 'out') {
          const v = vs.find((x) => x.tout === e.t && x.storeId === e.storeId);
          what = '退店　' + F.esc(F.placeOf(e)) + (v ? '<span class="stay">滞在 ' + F.dur(v.tout - v.tin) + '</span>' : '');
          d += F.repHtml(e.rep, opt);
        }
        return '<li><span class="t num">' + F.fmt(e.t) + '</span><div><div class="what">' + what + '</div>' + d + F.locText(e) + '</div></li>';
      }).join('') + '</ol>';
    },
    repHtml(rep, opt) {
      if (!rep) return '';
      let h = '<div class="tags">' + (rep.did || []).map((x) => '<span class="tag">' + F.esc(x) + '</span>').join('') + '</div>';
      if (rep.who && rep.who.length) h += '<div class="d">だれと：' + F.esc(rep.who.join('、')) + '</div>';
      if (rep.note) h += '<div class="d note-body">' + F.esc(rep.note) + '</div>';
      if (rep.photos && rep.photos.length && !(opt && opt.noPhoto)) h += '<div class="thumbs">' + rep.photos.map((id) => '<span class="ph"><img data-photo="' + F.esc(id) + '" alt="報告の写真"></span>').join('') + '</div>';
      return h;
    },
    csvDownload(name, rows) {
      const body = rows.map((r) => r.map((x) => { const s = String(x == null ? '' : x); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }).join(',')).join('\r\n');
      const blob = new Blob(['﻿' + body], { type: 'text/csv;charset=utf-8' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    },

    icon(name, size) {
      const P = {
        play: '<path d="M8 5v14l11-7z"/>',
        store: '<path d="M4 10v10h16V10"/><path d="M3 4h18l-1.5 6h-15z"/><path d="M10 20v-5h4v5"/>',
        cafe: '<path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17"/><path d="M8 3v3M12 3v3"/>',
        stop: '<rect x="6" y="6" width="12" height="12" rx="1"/>',
        doc: '<path d="M6 3h9l4 4v14H6z"/><path d="M9 12h7M9 16h7M9 8h3"/>',
        check: '<path d="M5 12l4 4 10-10"/>',
        home: '<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-6h4v6"/>',
        list: '<path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
        hist: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v4h4"/><path d="M12 8v4l3 2"/>',
        pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
        users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 4.5a3 3 0 0 1 0 6M18 14c2 .8 3 2.8 3 6"/>',
        sliders: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
        dl: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
        alert: '<path d="M12 3l9 16H3z"/><path d="M12 10v4M12 17v.5"/>',
        x: '<path d="M6 6l12 12M18 6L6 18"/>'
      };
      const s = size || 20;
      return '<svg class="ic" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[name] || '') + '</svg>';
    }
  };
  window.addEventListener('storage', (e) => { if (e.key === KEY) { F.S = load(); listeners.forEach((fn) => fn()); } });
  F.save();
  window.Field = F;
})();
