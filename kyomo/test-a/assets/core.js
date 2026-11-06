/* キョウモ 試作版の共通データ。すべて架空のサンプルで、保存先はこの端末のブラウザのみ。
   本番ではこのファイルをサーバー接続に置き換える。 */
(function () {
  'use strict';
  const KEY = 'kyomo-proto-v6';
  const C = (n, pref, lat, lng) => ({ n, pref, lat, lng });
  const AREAS = [
    { id: 'hokkaido', name: '北海道', field: 15, sv: 1, cities: [C('札幌', '北海道', 43.062, 141.354), C('旭川', '北海道', 43.77, 142.365), C('帯広', '北海道', 42.923, 143.196)] },
    { id: 'tohoku', name: '東北', field: 5, sv: 0, cities: [C('仙台', '宮城県', 38.268, 140.869), C('郡山', '福島県', 37.4, 140.36)] },
    { id: 'kanto', name: '関東', field: 0, sv: 0, cities: [] },
    { id: 'chubu', name: '中部', field: 29, sv: 5, cities: [C('名古屋', '愛知県', 35.17, 136.906), C('岐阜', '岐阜県', 35.423, 136.76), C('岡崎', '愛知県', 34.954, 137.174), C('津', '三重県', 34.718, 136.505)] },
    { id: 'hokuriku', name: '北陸', field: 12, sv: 2, cities: [C('金沢', '石川県', 36.561, 136.656), C('富山', '富山県', 36.695, 137.213), C('福井', '福井県', 36.064, 136.219)] },
    { id: 'kansai', name: '関西', field: 79, sv: 11, cities: [C('大阪', '大阪府', 34.693, 135.502), C('京都', '京都府', 35.011, 135.768), C('神戸', '兵庫県', 34.69, 135.196), C('奈良', '奈良県', 34.685, 135.805), C('堺', '大阪府', 34.573, 135.483), C('姫路', '兵庫県', 34.815, 134.685)] },
    { id: 'chugoku', name: '中国', field: 30, sv: 8, cities: [C('山口', '山口県', 34.1785, 131.4737), C('下関', '山口県', 33.958, 130.941), C('広島', '広島県', 34.396, 132.459), C('岡山', '岡山県', 34.655, 133.919), C('周南', '山口県', 34.055, 131.806)] },
    { id: 'shikoku', name: '四国', field: 4, sv: 1, cities: [C('松山', '愛媛県', 33.839, 132.765), C('高松', '香川県', 34.34, 134.043)] },
    { id: 'kyushu', name: '九州', field: 3, sv: 1, cities: [C('福岡', '福岡県', 33.59, 130.401), C('熊本', '熊本県', 32.803, 130.707)] }
  ];
  const PREF_AREA = {};
  [['hokkaido', '北海道'], ['tohoku', '青森県 岩手県 宮城県 秋田県 山形県 福島県'], ['kanto', '茨城県 栃木県 群馬県 埼玉県 千葉県 東京都 神奈川県'], ['chubu', '山梨県 長野県 岐阜県 静岡県 愛知県 三重県'], ['hokuriku', '新潟県 富山県 石川県 福井県'], ['kansai', '滋賀県 京都府 大阪府 兵庫県 奈良県 和歌山県'], ['chugoku', '鳥取県 島根県 岡山県 広島県 山口県'], ['shikoku', '徳島県 香川県 愛媛県 高知県'], ['kyushu', '福岡県 佐賀県 長崎県 熊本県 大分県 宮崎県 鹿児島県 沖縄県']].forEach((x) => x[1].split(' ').forEach((p) => { PREF_AREA[p] = x[0]; }));
  /* 棚卸しは制服とインカムで別物。写真は1点ずつ、識別できる印が見えるように撮る */
  const KINDS = {
    uniform: {
      id: 'uniform', name: '制服', title: '制服棚卸し', mark: 'バーコード',
      hint: 'バーコードが読めるように撮影してください',
      units: [
        { k: 'jacket-1', n: '制服ジャケット' },
        { k: 'polo-1', n: 'ポロシャツ 1枚目' },
        { k: 'polo-2', n: 'ポロシャツ 2枚目' }
      ],
      counts: []
    },
    incam: {
      id: 'incam', name: 'インカム', title: 'インカム棚卸し', mark: 'スタッフコード',
      hint: 'スタッフコードが読めるように撮影してください',
      units: [{ k: 'body-1', n: 'インカム本体' }],
      counts: [
        { k: 'ear', n: 'イヤホンマイク', u: '個', lent: 1 },
        { k: 'chg', n: 'インカム充電器', u: '個', lent: 1 }
      ]
    }
  };
  const INV_STATUS = { wait: { label: '確認待ち', pill: 'warn' }, ok: { label: '確認済み', pill: 'ok' }, back: { label: '差し戻し', pill: 'bad' } };
  const MARKS = { '〇': '全日稼働', '休': '休み', '研': '研修', 'M': 'ミーティング', '在': '在宅' };
  const D0 = new Date();
  const YEAR = D0.getFullYear(), MONTH = D0.getMonth() + 1, TODAY = D0.getDate();
  const DAYS = new Date(YEAR, MONTH, 0).getDate();
  const DAY_KEY = YEAR + '-' + MONTH + '-' + TODAY;
  const WEEK = ['日', '月', '火', '水', '木', '金', '土'];
  const weekday = (d) => WEEK[new Date(YEAR, MONTH - 1, d).getDay()];
  const md = (offset) => { const d = new Date(YEAR, MONTH - 1, TODAY + offset); return (d.getMonth() + 1) + '/' + d.getDate(); };
  const monthKey = (back) => { const d = new Date(YEAR, MONTH - 1 - (back || 0), 1); return d.getFullYear() + '-' + (d.getMonth() + 1); };
  const monthLabel = (mk) => { const a = mk.split('-'); return (+a[0] === YEAR ? '' : a[0] + '年') + a[1] + '月'; };
  const CUR_MONTH = monthKey(0);
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

  const BASE_STORES = [];
  AREAS.forEach((a) => {
    if (!a.cities.length) return;
    const n = Math.max(2, Math.ceil(a.field / 2.4));
    for (let i = 0; i < n; i++) {
      const c = a.cities[i % a.cities.length], round = Math.floor(i / a.cities.length);
      BASE_STORES.push({ id: 'st-' + a.id + '-' + i, name: c.n + 'ABCDEFGHJK'[round] + '店', area: a.id, pref: c.pref, lat: c.lat + round * 0.012, lng: c.lng + round * 0.015, sample: true });
    }
  });
  const baseOf = (area) => BASE_STORES.filter((s) => s.area === area);

  function marksFor(p, r) {
    const out = [];
    for (let d = 1; d <= 31; d++) {
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
  PEOPLE.push({ id: 'me1', name: '森下 陽子', area: 'chugoku', pref: '山口県', role: 'スタッフ', type: '常勤', storeId: 'st-chugoku-0', sample: true });
  PEOPLE.push({ id: 'me2', name: '南 蒼', area: 'chugoku', pref: '山口県', role: 'ラウンダー', type: '移動型', storeId: null, sample: true });
  AREAS.forEach((a) => {
    const field = a.field - (a.id === 'chugoku' ? 2 : 0);
    const rounders = Math.round(field * 0.1);
    const st = baseOf(a.id);
    for (let i = 0; i < field; i++) {
      const mobile = i < rounders || master() < 0.22;
      const home = st[i % st.length];
      PEOPLE.push({ id: a.id + '-f' + i, name: pickName(master), area: a.id, pref: home.pref, role: i < rounders ? 'ラウンダー' : 'スタッフ', type: mobile ? '移動型' : '常勤', storeId: mobile ? null : home.id });
    }
    for (let i = 0; i < a.sv; i++) {
      PEOPLE.push({ id: a.id + '-s' + i, name: pickName(master), area: a.id, pref: st[i % st.length].pref, role: 'SV', type: '移動型', storeId: null });
    }
  });
  PEOPLE.forEach((p) => {
    const r = rng(hash(p.id));
    p.marks = marksFor(p, r);
    if (p.sample) p.marks[TODAY - 1] = '〇';
    const mark = p.marks[TODAY - 1];
    p.today = mark;
    if (p.sample || mark === '休' || mark === '在') return;
    const st = baseOf(p.area);
    const x = r();
    let inAt = 570 + Math.floor(r() * 36);
    if (x < 0.03) inAt = 628 + Math.floor(r() * 30);
    if (x > 0.975) inAt = null;
    const locX = r();
    const loc = locX < 0.025 ? 'out' : locX < 0.06 ? 'none' : 'in';
    let site = p.storeId || st[Math.floor(r() * st.length)].id;
    if (p.storeId && st.length > 1 && r() < 0.045) { const o = st.filter((s) => s.id !== p.storeId); site = o[Math.floor(r() * o.length)].id; }
    if (inAt !== null) p.seed = { in: inAt, loc, storeId: site, dist: loc === 'in' ? 12 + Math.floor(r() * 150) : (loc === 'out' ? 900 + Math.floor(r() * 4000) : null), out: 1135 + Math.floor(r() * 40) };
  });
  const byId = Object.fromEntries(PEOPLE.map((p) => [p.id, p]));

  const BASE_TASKS = [
    { id: 't1', title: '来月のシフト希望', body: '希望休を含めて入力し、提出してください。', due: md(9), ratio: 58, placeholder: '例: 24日 希望休、31日 午前のみ' },
    { id: 't2', title: '先月分の稼働報告', body: '稼働日数を確認し、気づいた点があれば書いて提出してください。', due: md(4), ratio: 83, placeholder: '例: 18日のイベント分を含みます' }
  ];
  const BASE_NOTICES = [
    { id: 'n1', title: '集合研修のご案内', body: '来月の集合研修の日程を担当SVから連絡します。', date: md(-1), ratio: 71, important: true },
    { id: 'n2', title: '年末年始の営業時間', body: '店舗ごとの営業時間を一覧にしました。担当店舗を確認してください。', date: md(-4), ratio: 88, important: false },
    { id: 'n3', title: '欠勤連絡の手順', body: '欠勤するときは、担当SVと事務局の両方に連絡してください。', date: md(-9), ratio: 94, important: false }
  ];

  function fresh() {
    return {
      v: 6,
      day: DAY_KEY,
      clock: null,
      persona: 'me1',
      gps: 'real',
      gpsOk: false,
      punches: {},
      storesAdded: [],
      storeOver: {},
      storeHidden: {},
      homeOver: {},
      contacted: {},
      reminded: {},
      done: {},
      notes: {},
      counts: {},
      invDraft: {},
      inv: {},
      stockTargets: {},
      storeRequests: [],
      session: null,
      auth: { accounts: {}, fails: {} },
      fixes: [
        { id: 'fx1', pid: PEOPLE[12].id, date: md(-1), kind: '退勤の打刻忘れ', detail: '19:05 に退勤しました', state: 'open' },
        { id: 'fx2', pid: PEOPLE[40].id, date: md(-2), kind: '出勤の打刻忘れ', detail: '09:50 に入店しました', state: 'open' }
      ],
      posted: { tasks: [], notices: [] },
      settings: {
        company: 'サンプル株式会社',
        deadline: 615,
        target: 'both',
        radius: 200,
        inner: '導入時に設定します',
        outer: '導入時に設定します',
        teams: { channel: '棚卸し確認', stock: true, diff: true, alert: true }
      }
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s.v === 6 && s.day === DAY_KEY) {
          if (s.clock && Date.now() - s.clock.at > 30 * 60000) s.clock = null;
          return s;
        }
        if (s.v === 6) {
          const f = fresh();
          ['settings', 'storesAdded', 'storeOver', 'storeHidden', 'homeOver', 'gpsOk', 'gps', 'persona', 'inv', 'stockTargets', 'counts', 'invDraft', 'storeRequests', 'session', 'auth'].forEach((k) => { f[k] = s[k]; });
          return f;
        }
      }
    } catch (e) { /* ブラウザ保存が使えなくても動かす */ }
    return fresh();
  }

  /* 写真はこの端末のIndexedDBに保存する。使えない環境ではメモリに置く。 */
  const memPhotos = {};
  let dbp = null;
  function photoDb() {
    if (dbp) return dbp;
    dbp = new Promise((res) => {
      try {
        const q = indexedDB.open('kyomo-photos', 1);
        q.onupgradeneeded = () => q.result.createObjectStore('p');
        q.onsuccess = () => res(q.result);
        q.onerror = () => res(null);
      } catch (e) { res(null); }
    });
    return dbp;
  }
  function samplePhoto(id, label) {
    const c = ['#3E6B5C', '#4A5C86', '#7A5C3E', '#5F6B7A'][hash(id) % 4];
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="' + c + '"/><rect x="70" y="60" width="260" height="180" rx="14" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="4" stroke-dasharray="10 8"/><text x="200" y="124" text-anchor="middle" font-size="24" font-family="sans-serif" fill="#fff">' + label + '</text><g fill="#fff"><rect x="130" y="142" width="4" height="40"/><rect x="138" y="142" width="2" height="40"/><rect x="144" y="142" width="6" height="40"/><rect x="154" y="142" width="2" height="40"/><rect x="160" y="142" width="4" height="40"/><rect x="170" y="142" width="8" height="40"/><rect x="182" y="142" width="2" height="40"/><rect x="188" y="142" width="4" height="40"/><rect x="198" y="142" width="2" height="40"/><rect x="204" y="142" width="6" height="40"/><rect x="214" y="142" width="4" height="40"/><rect x="222" y="142" width="2" height="40"/><rect x="228" y="142" width="8" height="40"/><rect x="240" y="142" width="2" height="40"/><rect x="246" y="142" width="4" height="40"/><rect x="254" y="142" width="6" height="40"/><rect x="264" y="142" width="4" height="40"/></g><text x="200" y="210" text-anchor="middle" font-size="17" font-family="sans-serif" fill="#fff" fill-opacity=".85">サンプル写真</text></svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  const listeners = [];
  const K = {
    AREAS, KINDS, INV_STATUS, MARKS, PREF_AREA, YEAR, MONTH, TODAY, DAYS, PEOPLE, byId, weekday, md, monthKey, monthLabel, CUR_MONTH,
    stockDue: md(4),
    dayLabel: (d) => MONTH + '/' + d,
    S: load(),
    save() { try { localStorage.setItem(KEY, JSON.stringify(K.S)); } catch (e) { /* 無視 */ } },
    reset() { const keep = K.S.persona, session = K.S.session, auth = K.S.auth; K.S = fresh(); K.S.persona = keep; K.S.session = session; K.S.auth = auth; K.save(); },
    onChange(fn) { listeners.push(fn); },
    now() {
      const c = K.S.clock;
      if (c) return Math.min(1439.99, c.base + (Date.now() - c.at) / 60000);
      const d = new Date();
      return d.getHours() * 60 + d.getMinutes() + d.getSeconds() / 60;
    },
    nowMin() { return Math.floor(K.now()); },
    setNow(m) { K.S.clock = { base: m, at: Date.now() }; K.save(); },
    setReal() { K.S.clock = null; K.save(); },
    isTest() { return !!K.S.clock; },
    fmt(m) { return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(Math.floor(m % 60)).padStart(2, '0'); },
    esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); },
    parseTime(v) { const m = /^(\d{1,2}):(\d{2})$/.exec(v || ''); return m ? (+m[1]) * 60 + (+m[2]) : null; },
    area(id) { return AREAS.find((a) => a.id === id); },
    areasInUse() { const st = K.stores(); return AREAS.filter((a) => a.field + a.sv > 0 || st.some((s) => s.area === a.id)); },
    prefsOf(area) {
      const set = new Set();
      K.stores().forEach((s) => { if (area === 'all' || s.area === area) set.add(s.pref); });
      PEOPLE.forEach((p) => { if (area === 'all' || p.area === area) set.add(p.pref); });
      return Object.keys(PREF_AREA).filter((p) => set.has(p));
    },
    me() { return byId[K.S.persona]; },

    /* 店舗 */
    stores() {
      return BASE_STORES.concat(K.S.storesAdded).filter((s) => !K.S.storeHidden[s.id]).map((s) => {
        const o = K.S.storeOver[s.id];
        return o ? Object.assign({}, s, o) : s;
      });
    },
    store(id) { return K.stores().find((s) => s.id === id) || null; },
    homeStore(p) { const id = K.S.homeOver[p.id] !== undefined ? K.S.homeOver[p.id] : p.storeId; return id ? K.store(id) : null; },
    matchStores(lat, lng, radius) {
      const r = radius == null ? K.S.settings.radius : radius;
      return K.stores().map((s) => ({ store: s, dist: K.distanceM(lat, lng, s.lat, s.lng) })).filter((x) => x.dist <= r).sort((a, b) => a.dist - b.dist);
    },
    nearestStores(lat, lng, n) {
      return K.stores().map((s) => ({ store: s, dist: K.distanceM(lat, lng, s.lat, s.lng) })).sort((a, b) => a.dist - b.dist).slice(0, n || 5);
    },
    addStore(s) { const id = 'st-u' + Date.now(); K.S.storesAdded.push(Object.assign({ id }, s)); K.save(); return id; },
    updateStore(id, patch) {
      const i = K.S.storesAdded.findIndex((s) => s.id === id);
      if (i >= 0) Object.assign(K.S.storesAdded[i], patch);
      else K.S.storeOver[id] = Object.assign(K.S.storeOver[id] || {}, patch);
      K.save();
    },
    removeStore(id) {
      const i = K.S.storesAdded.findIndex((s) => s.id === id);
      if (i >= 0) K.S.storesAdded.splice(i, 1); else K.S.storeHidden[id] = true;
      Object.keys(K.S.homeOver).forEach((k) => { if (K.S.homeOver[k] === id) K.S.homeOver[k] = null; });
      K.save();
    },
    /* Googleマップのリンクや「34.17, 131.47」の形から緯度経度を取り出す */
    parseLatLng(text) {
      const t = String(text || '');
      if (/(^|\/\/)(maps\.app\.goo\.gl|goo\.gl\/maps)/.test(t)) return { short: true };
      const pats = [/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/, /@(-?\d+\.\d+),(-?\d+\.\d+)/, /[?&](?:q|ll|query|destination)=(-?\d+\.\d+)(?:,|%2C)(-?\d+\.\d+)/i, /^\s*(-?\d{1,2}\.\d+)\s*[,、 ]\s*(-?\d{2,3}\.\d+)\s*$/];
      for (const p of pats) { const m = p.exec(t); if (m) return { lat: +m[1], lng: +m[2] }; }
      return null;
    },
    cleanStoreName(name) {
      return String(name || '').normalize('NFKC').replace(/[(（][^)）]*[)）]/g, '').replace(/\s*\d{3,}\s*$/, '').replace(/\s+/g, ' ').trim();
    },
    prefFromText(text) { return Object.keys(PREF_AREA).find((p) => String(text || '').includes(p)) || ''; },

    rec(p) {
      const u = K.S.punches[p.id], now = K.nowMin();
      if (u) {
        /* テスト時刻より後の記録は隠すだけで消さない。実際の時刻に戻すと元に戻る */
        if (u.in > now) return { in: null, loc: null, out: null };
        const showOut = u.out != null && u.out <= now;
        return { in: u.in, loc: u.loc, dist: u.dist, acc: u.acc, storeId: u.storeId, out: showOut ? u.out : null, outLoc: showOut ? u.outLoc : null, outDist: showOut ? u.outDist : null };
      }
      const d = p.seed;
      if (!d || now < d.in) return { in: null, loc: null, out: null };
      return { in: d.in, loc: d.loc, dist: d.dist, storeId: d.storeId, out: now >= d.out ? d.out : null };
    },
    siteOf(p) { const r = K.rec(p); return (r.storeId && K.store(r.storeId)) || K.homeStore(p); },
    isHelp(p) { const r = K.rec(p), h = K.homeStore(p); return !!(r.in != null && r.storeId && h && r.storeId !== h.id); },
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
      if (loc === 'in') return { pill: 'ok', short: '範囲内', detail: km ? '店舗から ' + km : '範囲内' };
      if (loc === 'out') return { pill: 'warn', short: '要確認（店舗外）', detail: km ? '登録店舗から ' + km : '登録店舗の外' };
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

    /* 棚卸し。対象者は月ごと、種類ごとに変わる */
    isTarget(kind, mk, pid) {
      const o = K.S.stockTargets[mk + ':' + kind];
      if (o && o[pid] !== undefined) return o[pid];
      if (byId[pid].sample) return mk === CUR_MONTH;
      return hash('tg' + kind + mk + pid) % 100 < 45;
    },
    setTarget(kind, mk, pid, on) { const k = mk + ':' + kind; (K.S.stockTargets[k] = K.S.stockTargets[k] || {})[pid] = !!on; K.save(); },
    invOf(kind, mk, pid) {
      const key = kind + ':' + mk + ':' + pid;
      if (K.S.inv[key]) return K.S.inv[key];
      if (byId[pid].sample || !K.isTarget(kind, mk, pid)) return null;
      const def = KINDS[kind], h = hash('inv' + key) % 100, cur = mk === CUR_MONTH;
      if (cur && h >= 58) return null;
      if (!cur && h >= 96) return null;
      const photos = {}, missing = [], counts = {};
      def.units.forEach((u) => { photos[u.k] = 'sample'; });
      def.counts.forEach((c) => { counts[c.k] = c.lent; });
      if (h % 23 === 0) {
        if (kind === 'uniform') { const u = def.units[def.units.length - 1]; missing.push(u.k); delete photos[u.k]; } else counts.ear = 0;
      }
      const status = cur ? (h < 26 ? 'ok' : (h % 17 === 0 ? 'back' : 'wait')) : 'ok';
      const day = cur ? md(-(1 + h % 5)) : mk.split('-')[1] + '/' + (3 + h % 7);
      return { date: day, status, photos, missing, counts, backNote: status === 'back' ? def.mark + 'が読めません。撮り直してください。' : '' };
    },
    setInv(kind, mk, pid, inv) { K.S.inv[kind + ':' + mk + ':' + pid] = inv; K.save(); },
    /* 貸与数との差を文章にする */
    invDiffs(kind, inv) {
      if (!inv) return [];
      const def = KINDS[kind], out = [];
      def.units.forEach((u) => { if ((inv.missing || []).includes(u.k)) out.push(u.n + ' が手元にない'); });
      def.counts.forEach((c) => { const v = (inv.counts || {})[c.k]; if (v !== undefined && v !== c.lent) out.push(c.n + ' ' + c.lent + '→' + v + c.u); });
      return out;
    },
    draftOf(kind, pid) {
      const key = kind + ':' + pid;
      if (!K.S.invDraft[key]) {
        const counts = {};
        KINDS[kind].counts.forEach((c) => { counts[c.k] = c.lent; });
        K.S.invDraft[key] = { photos: {}, missing: {}, counts };
      }
      return K.S.invDraft[key];
    },
    async photoPut(id, dataUrl) {
      const d = await photoDb();
      if (!d) { memPhotos[id] = dataUrl; return; }
      await new Promise((res) => { const t = d.transaction('p', 'readwrite'); t.objectStore('p').put(dataUrl, id); t.oncomplete = res; t.onerror = () => { memPhotos[id] = dataUrl; res(); }; });
    },
    async photoGet(id) {
      if (memPhotos[id]) return memPhotos[id];
      const d = await photoDb();
      if (!d) return null;
      return new Promise((res) => { const q = d.transaction('p').objectStore('p').get(id); q.onsuccess = () => res(q.result || null); q.onerror = () => res(null); });
    },
    samplePhoto,
    /* 撮った写真を縮小して保存用にする。描き直すので撮影場所などの付加情報も残らない */
    shrinkImage(file, max, quality) {
      return new Promise((res, rej) => {
        const url = URL.createObjectURL(file), img = new Image();
        img.onload = () => {
          const k = Math.min(1, (max || 1280) / Math.max(img.naturalWidth, img.naturalHeight));
          const c = document.createElement('canvas');
          c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
          c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
          URL.revokeObjectURL(url);
          res(c.toDataURL('image/jpeg', quality || 0.72));
        };
        img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('image')); };
        img.src = url;
      });
    },
    /* 画面内の写真枠に画像を入れる */
    hydratePhotos(root) {
      (root || document).querySelectorAll('img[data-photo]').forEach(async (el) => {
        const id = el.dataset.photo;
        if (id === 'sample') { el.src = samplePhoto(el.dataset.key || 'x', el.dataset.label || ''); return; }
        const u = await K.photoGet(id);
        if (u) el.src = u;
      });
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
        chev: '<path d="m9 5.5 6.5 6.5L9 18.5"/>',
        back: '<path d="M15 5.5 8.5 12l6.5 6.5"/>',
        sliders: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
        grid: '<rect x="4" y="4" width="16" height="16" rx="2.5"/><path d="M4 10h16M10 4v16"/>',
        box: '<path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5z"/><path d="m4 8.5 8 4.5 8-4.5M12 13v7"/>',
        users: '<circle cx="9" cy="8.5" r="3.3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 5.5a3.2 3.2 0 0 1 0 6.3M17.5 14.5a5 5 0 0 1 3 4.5"/>',
        check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
        alert: '<path d="M12 4 2.8 19.5h18.4zM12 10v4.5M12 17.2v.1"/>',
        camera: '<path d="M4 8.5h3.5L9 6h6l1.5 2.5H20V19H4z"/><circle cx="12" cy="13.2" r="3.2"/>',
        store: '<path d="M4.5 10v9.5h15V10M3 10l2-5.5h14l2 5.5a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0z"/><path d="M10 19.5v-5h4v5"/>'
      };
      return '<svg class="ic" viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[name] || '') + '</svg>';
    }
  };
  /* 開いたまま日付が変わったら、その日の状態で開き直す */
  setInterval(() => { if (new Date().getDate() !== TODAY) location.reload(); }, 30000);
  window.addEventListener('storage', (e) => {
    if (e.key !== KEY || !e.newValue) return;
    try { K.S = JSON.parse(e.newValue); listeners.forEach((fn) => fn()); } catch (err) { /* 無視 */ }
  });
  K.save();
  window.Kyomo = K;
})();
