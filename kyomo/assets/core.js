/* キョウモ 試作版の共通データ。すべて架空のサンプルで、保存先はこの端末のブラウザのみ。
   本番ではこのファイルをサーバー接続に置き換える。 */
(function () {
  'use strict';
  const KEY = 'kyomo-proto-v2';
  const AREAS = [
    { id: 'hokkaido', name: '北海道', field: 15, sv: 1, cities: ['札幌', '旭川', '帯広'] },
    { id: 'tohoku', name: '東北', field: 5, sv: 0, cities: ['仙台', '郡山'] },
    { id: 'chubu', name: '中部', field: 29, sv: 5, cities: ['名古屋', '岐阜', '岡崎', '津'] },
    { id: 'hokuriku', name: '北陸', field: 12, sv: 2, cities: ['金沢', '富山', '福井'] },
    { id: 'kansai', name: '関西', field: 79, sv: 11, cities: ['大阪', '京都', '神戸', '奈良', '堺', '姫路'] },
    { id: 'chugoku', name: '中国', field: 30, sv: 8, cities: ['山口', '下関', '広島', '岡山', '周南'] },
    { id: 'shikoku', name: '四国', field: 4, sv: 1, cities: ['松山', '高松'] },
    { id: 'kyushu', name: '九州', field: 3, sv: 1, cities: ['福岡', '熊本'] }
  ];
  const ITEMS = [
    { k: 'jacket', n: '制服ジャケット', u: '着', lent: 1 },
    { k: 'polo', n: 'ポロシャツ', u: '枚', lent: 2 },
    { k: 'incam', n: 'インカム本体', u: '台', lent: 1 },
    { k: 'ear', n: 'イヤホンマイク', u: '個', lent: 1 },
    { k: 'chg', n: 'インカム充電器', u: '個', lent: 1 }
  ];
  const MARKS = { '〇': '全日稼働', '休': '休み', '研': '研修', 'M': 'ミーティング', '在': '在宅' };
  const TODAY = 6;
  const DAYS = 30;
  const WEEK = ['日', '月', '火', '水', '木', '金', '土'];
  const weekday = (d) => WEEK[new Date(2026, 10, d).getDay()];
  const FAMILY = ['青山', '朝倉', '有村', '飯塚', '石黒', '市川', '今井', '岩崎', '上田', '江口', '遠藤', '大沢', '大西', '岡田', '荻野', '小野寺', '香川', '笠原', '片岡', '川村', '北野', '木下', '久保', '黒田', '小池', '小林', '斎藤', '桜井', '柴田', '島村', '白石', '杉本', '関口', '高木', '滝沢', '竹内', '千葉', '塚本', '辻', '寺田', '中島', '長谷川', '西村', '野口', '橋本', '林', '平野', '福島', '藤本', '堀', '前川', '松井', '三浦', '水野', '宮本', '村田', '森', '矢野', '山崎', '吉川'];
  const GIVEN = ['あかり', '葵', '明日香', '彩', '和真', '楓', '奏太', '香織', '健太', '浩二', '颯太', '沙希', '栞', '翔平', '大輝', '拓海', '千尋', '智也', '直樹', '菜月', '遥', '光', '尚人', '真央', '美月', '結衣', '悠人', '陽菜', '蓮', '涼'];

  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hash(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  const stores = {};
  AREAS.forEach((a) => {
    const n = Math.max(2, Math.ceil(a.field / 2.4));
    stores[a.id] = Array.from({ length: n }, (_, i) => a.cities[i % a.cities.length] + 'ABCDEFGHJK'[Math.floor(i / a.cities.length)] + '店');
  });

  function marksFor(p, r) {
    const out = [];
    for (let d = 1; d <= DAYS; d++) {
      let m = r() < 0.29 ? '休' : '〇';
      if (m === '〇' && d === 12) m = p.role === 'SV' ? 'M' : (r() < 0.12 ? '研' : '〇');
      if (m === '〇' && p.role === 'SV' && r() < 0.08) m = '在';
      out.push(m);
    }
    return out;
  }

  const PEOPLE = [];
  const usedNames = {};
  function pickName(r) {
    for (;;) {
      const n = FAMILY[Math.floor(r() * FAMILY.length)] + ' ' + GIVEN[Math.floor(r() * GIVEN.length)];
      if (!usedNames[n]) { usedNames[n] = 1; return n; }
    }
  }
  const master = rng(20261106);
  PEOPLE.push({ id: 'me1', name: '森下 陽子', area: 'chugoku', role: 'スタッフ', type: '常勤', store: '山口A店', sample: true });
  PEOPLE.push({ id: 'me2', name: '南 蒼', area: 'chugoku', role: 'ラウンダー', type: '移動型', store: null, sample: true });
  AREAS.forEach((a) => {
    let field = a.field - (a.id === 'chugoku' ? 2 : 0);
    const rounders = Math.round(field * 0.1);
    for (let i = 0; i < field; i++) {
      const mobile = i < rounders || master() < 0.22;
      PEOPLE.push({
        id: a.id + '-f' + i, name: pickName(master), area: a.id,
        role: i < rounders ? 'ラウンダー' : 'スタッフ', type: mobile ? '移動型' : '常勤',
        store: mobile ? null : stores[a.id][i % stores[a.id].length]
      });
    }
    for (let i = 0; i < a.sv; i++) {
      PEOPLE.push({ id: a.id + '-s' + i, name: pickName(master), area: a.id, role: 'SV', type: '移動型', store: null });
    }
  });
  PEOPLE.forEach((p) => {
    const r = rng(hash(p.id));
    p.marks = marksFor(p, r);
    if (p.sample) { p.marks[TODAY - 1] = '〇'; }
    const mark = p.marks[TODAY - 1];
    p.today = mark;
    if (p.sample || mark === '休' || mark === '在') return;
    if (!p.store) p.todayStore = stores[p.area][Math.floor(r() * stores[p.area].length)];
    const x = r();
    let inAt = 570 + Math.floor(r() * 36);
    if (x < 0.03) inAt = 628 + Math.floor(r() * 30);
    if (x > 0.975) inAt = null;
    const locX = r();
    const loc = locX < 0.025 ? 'out' : locX < 0.06 ? 'none' : 'in';
    if (inAt !== null) p.seed = { in: inAt, loc, dist: loc === 'in' ? 12 + Math.floor(r() * 150) : (loc === 'out' ? 900 + Math.floor(r() * 4000) : null), out: 1135 + Math.floor(r() * 40) };
  });
  const byId = Object.fromEntries(PEOPLE.map((p) => [p.id, p]));

  const BASE_TASKS = [
    { id: 't1', title: '12月のシフト希望', body: '希望休を含めて入力し、提出してください。', due: '11/15', ratio: 58, needsNote: true, placeholder: '例: 12/24 希望休、12/31 午前のみ' },
    { id: 't2', title: '10月分の稼働報告', body: '稼働日数を確認し、気づいた点があれば書いて提出してください。', due: '11/10', ratio: 83, needsNote: true, placeholder: '例: 10/18 のイベント分を含みます' }
  ];
  const BASE_NOTICES = [
    { id: 'n1', title: '12月の集合研修のご案内', body: '12月8日(火) 10:00から実施します。会場は担当SVから連絡します。', date: '11/5', ratio: 71, important: true },
    { id: 'n2', title: '年末年始の営業時間', body: '店舗ごとの営業時間を一覧にしました。担当店舗を確認してください。', date: '11/2', ratio: 88, important: false },
    { id: 'n3', title: '欠勤連絡の手順', body: '欠勤するときは、担当SVと事務局の両方に連絡してください。', date: '10/28', ratio: 94, important: false }
  ];

  function fresh() {
    return {
      v: 2,
      touched: Date.now(),
      clock: { base: 592, at: Date.now() },
      persona: 'me1',
      gps: 'real',
      gpsOk: false,
      punches: {},
      storeGeo: { lat: 34.1785, lng: 131.4737 },
      todayStore: {},
      contacted: {},
      reminded: {},
      done: {},
      notes: {},
      counts: {},
      inv: {},
      fixes: [
        { id: 'fx1', pid: PEOPLE[12].id, date: '11/5', kind: '退勤の打刻忘れ', detail: '19:05 に退勤しました', state: 'open' },
        { id: 'fx2', pid: PEOPLE[40].id, date: '11/4', kind: '出勤の打刻忘れ', detail: '09:50 に入店しました', state: 'open' }
      ],
      posted: { tasks: [], notices: [] },
      settings: {
        company: 'サンプル株式会社',
        deadline: 615,
        target: 'both',
        radius: 200,
        inner: '導入時に設定します',
        outer: '導入時に設定します'
      }
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s.v === 2 && Date.now() - (s.touched || 0) < 45 * 60000) return s;
      }
    } catch (e) { /* ブラウザ保存が使えなくても動かす */ }
    return fresh();
  }
  const listeners = [];
  const K = {
    AREAS, ITEMS, MARKS, TODAY, DAYS, PEOPLE, byId, stores, weekday,
    S: load(),
    save() {
      K.S.touched = Date.now();
      try { localStorage.setItem(KEY, JSON.stringify(K.S)); } catch (e) { /* 無視 */ }
    },
    reset() {
      const keep = K.S.persona;
      K.S = fresh();
      K.S.persona = keep;
      K.save();
    },
    onChange(fn) { listeners.push(fn); },
    now() {
      const c = K.S.clock;
      return Math.min(1439, c.base + (Date.now() - c.at) / 60000);
    },
    nowMin() { return Math.floor(K.now()); },
    setNow(m) { K.S.clock = { base: m, at: Date.now() }; K.clearFuture(m); K.save(); },
    clearFuture(m) {
      Object.keys(K.S.punches).forEach((id) => {
        const p = K.S.punches[id];
        if (p.out != null && p.out > m) { p.out = null; p.outLoc = null; }
        if (p.in != null && p.in > m) delete K.S.punches[id];
      });
    },
    fmt(m) { return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(Math.floor(m % 60)).padStart(2, '0'); },
    esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); },
    parseTime(v) { const m = /^(\d{1,2}):(\d{2})$/.exec(v || ''); return m ? (+m[1]) * 60 + (+m[2]) : null; },
    area(id) { return AREAS.find((a) => a.id === id); },
    me() { return byId[K.S.persona]; },
    storeOf(p) { return p.store || K.S.todayStore[p.id] || p.todayStore || null; },
    rec(p) {
      const u = K.S.punches[p.id];
      if (u) return { in: u.in, loc: u.loc, dist: u.dist, acc: u.acc, out: u.out == null ? null : u.out, outLoc: u.outLoc, outDist: u.outDist };
      const d = p.seed, now = K.nowMin();
      if (!d || now < d.in) return { in: null, loc: null, out: null };
      return { in: d.in, loc: d.loc, dist: d.dist, out: now >= d.out ? d.out : null };
    },
    /* シフト表に開始時刻がないため、判定は一律の時刻で行う */
    needsPunch(p) { return p.today === '〇' || p.today === '研' || p.today === 'M'; },
    status(p) {
      const r = K.rec(p), dl = K.S.settings.deadline;
      if (!K.needsPunch(p)) return { key: 'off', label: MARKS[p.today], pill: 'idle' };
      if (r.out != null) return { key: 'left', label: '退勤済み', pill: 'idle' };
      if (r.in != null) return r.in >= dl ? { key: 'late', label: '遅れて出勤', pill: 'warn' } : { key: 'in', label: '勤務中', pill: 'ok' };
      if (K.nowMin() < dl) return { key: 'before', label: '出勤前', pill: 'idle' };
      return { key: 'over', label: '未出勤', pill: 'bad' };
    },
    locInfo(loc, dist, acc) {
      const km = dist == null ? '' : (dist >= 1000 ? (dist / 1000).toFixed(1) + 'km' : Math.round(dist) + 'm');
      if (loc === 'in') return { pill: 'ok', short: '範囲内', detail: km ? '現場から ' + km : '範囲内' };
      if (loc === 'out') return { pill: 'warn', short: '要確認（現場外）', detail: km ? '現場から ' + km : '現場の外' };
      if (loc === 'low') return { pill: 'warn', short: '要確認（精度低）', detail: '位置の精度が低い状態です' + (acc ? '（±' + Math.round(acc) + 'm）' : '') };
      return { pill: 'warn', short: '要確認（取得不可）', detail: '位置を取得できませんでした' };
    },
    tasks() { return K.S.posted.tasks.concat(BASE_TASKS); },
    notices() { return K.S.posted.notices.concat(BASE_NOTICES); },
    isDone(id, pid, ratio) {
      const d = K.S.done[id];
      if (d && d[pid]) return true;
      if (byId[pid] && byId[pid].sample) return false;
      return ratio ? hash(id + pid) % 100 < ratio : false;
    },
    setDone(id, pid) { (K.S.done[id] = K.S.done[id] || {})[pid] = true; K.save(); },
    invOf(pid) {
      if (K.S.inv[pid]) return K.S.inv[pid];
      if (byId[pid].sample) return null;
      const h = hash('inv' + pid) % 100;
      if (h >= 62) return null;
      const miss = h < 3 ? [{ k: ITEMS[h % ITEMS.length].k, count: ITEMS[h % ITEMS.length].lent - 1 }] : [];
      return { date: '11/' + (1 + h % 5), miss };
    },
    countsOf(pid) {
      if (!K.S.counts[pid]) K.S.counts[pid] = Object.fromEntries(ITEMS.map((i) => [i.k, i.lent]));
      return K.S.counts[pid];
    },
    historyOf(p) {
      const r = rng(hash('hist' + p.id)), rows = [];
      for (let d = 1; d <= TODAY; d++) {
        const mark = p.marks[d - 1];
        if (d === TODAY) { const t = K.rec(p); rows.push({ d, mark, in: t.in, out: t.out, today: true }); continue; }
        const work = mark === '〇' || mark === '研' || mark === 'M';
        rows.push({ d, mark, in: work ? 575 + Math.floor(r() * 26) : null, out: work ? 1140 + Math.floor(r() * 20) : null });
      }
      return rows.reverse();
    },
    distanceM(aLat, aLng, bLat, bLng) {
      const R = 6371000, t = Math.PI / 180;
      const dLat = (bLat - aLat) * t, dLng = (bLng - aLng) * t;
      const h = Math.sin(dLat / 2) ** 2 + Math.cos(aLat * t) * Math.cos(bLat * t) * Math.sin(dLng / 2) ** 2;
      return 2 * R * Math.asin(Math.sqrt(h));
    },
    icon(name, size) {
      const s = size || 22;
      const P = {
        clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
        list: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 5.5l1 1 1.5-2M4 11.5l1 1 1.5-2M4 17.5l1 1 1.5-2"/>',
        hist: '<rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M4 10h16M8.5 3v4M15.5 3v4"/>',
        bell: '<path d="M6 16.5V11a6 6 0 1 1 12 0v5.5l1.5 1.5h-15zM10 20.5a2 2 0 0 0 4 0"/>',
        help: '<path d="M12 21s-7.5-4.3-7.5-10.3A4.2 4.2 0 0 1 12 8a4.2 4.2 0 0 1 7.5 2.7C19.5 16.7 12 21 12 21z"/>',
        pin: '<path d="M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 1 1 13 0c0 4.9-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
        login: '<path d="M10 4H6.5A2.5 2.5 0 0 0 4 6.5v11A2.5 2.5 0 0 0 6.5 20H10"/><path d="M11 12h9M16.5 8.5 20 12l-3.5 3.5"/>',
        logout: '<path d="M14 4h3.5A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5H14"/><path d="M15 12H4M7.5 8.5 4 12l3.5 3.5"/>',
        chev: '<path d="m9 5.5 6.5 6.5L9 18.5"/>',
        back: '<path d="M15 5.5 8.5 12l6.5 6.5"/>',
        sliders: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
        grid: '<rect x="4" y="4" width="16" height="16" rx="2.5"/><path d="M4 10h16M10 4v16"/>',
        box: '<path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5z"/><path d="m4 8.5 8 4.5 8-4.5M12 13v7"/>',
        users: '<circle cx="9" cy="8.5" r="3.3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 5.5a3.2 3.2 0 0 1 0 6.3M17.5 14.5a5 5 0 0 1 3 4.5"/>',
        check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
        alert: '<path d="M12 4 2.8 19.5h18.4zM12 10v4.5M12 17.2v.1"/>',
        camera: '<path d="M4 8.5h3.5L9 6h6l1.5 2.5H20V19H4z"/><circle cx="12" cy="13.2" r="3.2"/>'
      };
      return '<svg class="ic" viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[name] || '') + '</svg>';
    }
  };
  window.addEventListener('storage', (e) => {
    if (e.key !== KEY || !e.newValue) return;
    try { K.S = JSON.parse(e.newValue); listeners.forEach((fn) => fn()); } catch (err) { /* 無視 */ }
  });
  K.save();
  window.Kyomo = K;
})();
