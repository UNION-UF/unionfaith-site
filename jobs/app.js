(function () {
  'use strict';
  var PREFS = {
    '北海道': ['北海道'],
    '東北': ['青森', '岩手', '宮城', '秋田', '山形', '福島'],
    '関東': ['茨城', '栃木', '群馬', '埼玉', '千葉', '東京', '神奈川'],
    '中部': ['新潟', '富山', '石川', '福井', '山梨', '長野', '岐阜', '静岡', '愛知'],
    '近畿': ['三重', '滋賀', '京都', '大阪', '兵庫', '奈良', '和歌山'],
    '中国': ['鳥取', '島根', '岡山', '広島', '山口'],
    '四国': ['徳島', '香川', '愛媛', '高知'],
    '九州・沖縄': ['福岡', '佐賀', '長崎', '熊本', '大分', '宮崎', '鹿児島', '沖縄']
  };
  var JOBS = [{
    tag: '募集中',
    title: '量販店の携帯販売スタッフ',
    region: '中国', pref: '山口', place: '山口県山口市',
    shop: '家電量販店 / au・UQ mobile',
    styles: ['業務委託', '契約社員', 'アルバイト'],
    pay: '業務委託 日額13,000円〜25,000円',
    href: 'job-yamaguchi.html'
  }];
  var STYLES = ['すべて', '業務委託', '契約社員', 'アルバイト'];

  var params = new URLSearchParams(location.search);
  var state = { area: '全国', pref: 'すべて', style: 'すべて' };
  if (PREFS[params.get('area')]) state.area = params.get('area');
  if (state.area !== '全国' && PREFS[state.area].indexOf(params.get('pref')) >= 0) state.pref = params.get('pref');
  if (STYLES.indexOf(params.get('style')) >= 0) state.style = params.get('style');

  function chip(label, on, pick) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'chip'; b.textContent = label;
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
    b.addEventListener('click', pick);
    return b;
  }
  function fill(el, nodes) { el.textContent = ''; nodes.forEach(function (n) { el.appendChild(n); }); }
  function query() {
    var q = new URLSearchParams();
    if (state.area !== '全国') q.set('area', state.area);
    if (state.pref !== 'すべて') q.set('pref', state.pref);
    if (state.style !== 'すべて') q.set('style', state.style);
    var s = q.toString();
    return s ? '?' + s : '';
  }
  function matches(j) {
    return (state.area === '全国' || j.region === state.area) &&
      (state.pref === 'すべて' || j.pref === state.pref) &&
      (state.style === 'すべて' || j.styles.indexOf(state.style) >= 0);
  }
  function jobRow(j) {
    var a = document.createElement('a'); a.className = 'job'; a.href = j.href;
    var main = document.createElement('span'); main.className = 'job__main';
    var tag = document.createElement('span'); tag.className = 'job__tag'; tag.textContent = j.tag;
    var title = document.createElement('span'); title.className = 'job__title'; title.textContent = j.title;
    main.appendChild(tag); main.appendChild(title);
    var meta = document.createElement('span'); meta.className = 'job__meta';
    [j.place, j.shop, j.styles.join('・')].forEach(function (t) { var s = document.createElement('span'); s.textContent = t; meta.appendChild(s); });
    var pay = document.createElement('span'); pay.className = 'job__pay'; pay.textContent = j.pay;
    var arrow = document.createElement('span'); arrow.setAttribute('aria-hidden', 'true'); arrow.textContent = '→';
    [main, meta, pay, arrow].forEach(function (n) { a.appendChild(n); });
    return a;
  }

  var areasEl = document.getElementById('areas'), prefsBox = document.getElementById('prefs-box'), prefsEl = document.getElementById('prefs');
  var stylesEl = document.getElementById('styles'), majorsEl = document.getElementById('majors'), listEl = document.getElementById('job-list');
  var countEl = document.getElementById('count'), emptyEl = document.getElementById('empty'), goEl = document.getElementById('go');

  function render() {
    if (areasEl) fill(areasEl, ['全国'].concat(Object.keys(PREFS)).map(function (l) {
      return chip(l, state.area === l, function () { state.area = l; state.pref = 'すべて'; render(); });
    }));
    if (prefsBox) {
      var showPrefs = state.area !== '全国' && state.area !== '北海道';
      prefsBox.hidden = !showPrefs;
      if (showPrefs) fill(prefsEl, ['すべて'].concat(PREFS[state.area]).map(function (l) {
        return chip(l, state.pref === l, function () { state.pref = l; render(); });
      }));
    }
    if (stylesEl) fill(stylesEl, STYLES.map(function (l) {
      return chip(l, state.style === l, function () { state.style = l; render(); });
    }));
    if (majorsEl) fill(majorsEl, [['東京', '関東', '東京'], ['名古屋', '中部', '愛知'], ['大阪', '近畿', '大阪'], ['山口', '中国', '山口'], ['福岡', '九州・沖縄', '福岡'], ['九州・沖縄', '九州・沖縄', 'すべて'], ['沖縄', '九州・沖縄', '沖縄']].map(function (m) {
      if (majorsEl.dataset.link) {
        var a = document.createElement('a');
        var q = new URLSearchParams({ area: m[1] });
        if (m[2] !== 'すべて') q.set('pref', m[2]);
        a.href = 'search.html?' + q.toString(); a.textContent = m[0] + ' →';
        return a;
      }
      return chip(m[0], state.area === m[1] && state.pref === m[2], function () { state.area = m[1]; state.pref = m[2]; render(); });
    }));
    var latestEl = document.getElementById('latest');
    if (latestEl) fill(latestEl, JOBS.map(jobRow));
    if (goEl) goEl.href = 'search.html' + query();
    if (listEl) {
      var results = JOBS.filter(matches);
      fill(listEl, results.map(jobRow));
      if (countEl) countEl.textContent = String(results.length);
      if (emptyEl) emptyEl.hidden = results.length > 0;
      if (document.getElementById('jobs-page')) history.replaceState(null, '', location.pathname + query());
    }
  }
  var resetEl = document.getElementById('reset');
  if (resetEl) resetEl.addEventListener('click', function () { state = { area: '全国', pref: 'すべて', style: 'すべて' }; render(); });
  render();

  /* フォーム(Web3Forms。会社ホームページと同じ受付先) */
  var KEY = '83aebbd1-5cfd-49c7-a9f6-3945ddcf65cb';
  [].forEach.call(document.querySelectorAll('form[data-subject]'), function (form) {
    var status = form.querySelector('.status'), btn = form.querySelector('button[type=submit]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      if (fd.get('botcheck')) return;
      var payload = { access_key: KEY, subject: '【携帯販売ワーク】' + form.dataset.subject + '(' + (fd.get('お名前') || fd.get('担当者名') || '') + ' 様)', from_name: '携帯販売ワーク(Union Faith株式会社)' };
      if (fd.get('メールアドレス')) payload.replyto = fd.get('メールアドレス');
      fd.forEach(function (v, k) { if (k !== 'botcheck') payload[k] = v; });
      btn.disabled = true; status.textContent = '送信しています…';
      fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(payload) })
        .then(function (r) { return r.json().then(function (j) { return r.ok && j && j.success; }); })
        .then(function (ok) {
          if (ok) { form.reset(); status.textContent = '送信しました。内容を確認のうえ、運営からご連絡します。'; }
          else { status.textContent = '送信できませんでした。時間をおいて、もう一度お試しください。'; }
        })
        .catch(function () { status.textContent = '送信できませんでした。通信状況を確認して、もう一度お試しください。'; })
        .then(function () { btn.disabled = false; });
    });
  });
})();
