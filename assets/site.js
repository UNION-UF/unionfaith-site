/* Union Faith 株式会社 — 全ページ共通の動き（トップ・下層ページ）
   要素がないページでは、その部分は何もしない。 */
(function(){
  var root = document.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function clamp(v,a,b){ return v < a ? a : (v > b ? b : v); }
  function $(id){ return document.getElementById(id); }

  /* 見出しの書体が読み込まれてから動き始める（最長1.8秒で開始） */
  var started = false;
  function go(){ if(started) return; started = true; requestAnimationFrame(function(){ requestAnimationFrame(function(){ root.classList.add('is-ready'); if(field) field.start(); }); }); }

  /* ----- hero (top page only): a field of fine lines. each line is one person; together they lift the floor (= 底上げ) ----- */
  var field = !$('field') ? null : (function(){
    var cv = $('field'), box = $('art'), cx = cv.getContext('2d');
    var W = 0, H = 0, dpr = 1, lines = [], t0 = 0, running = false, visible = true, lift = 0, liftAim = 0, px = -1e4, pxAim = -1e4, last = 0;
    function rnd(i, k){ var x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); }
    function build(){
      var r = box.getBoundingClientRect(); dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      var gap = W < 500 ? 5 : 6, n = Math.floor((W - gap) / gap); lines = [];
      for(var i = 0; i < n; i++){
        var u = i / n;
        /* soft island-like ridges, drawn with fine vertical hatching (like an etching) */
        var g = function(c, w){ return Math.exp(-Math.pow((u - c) / w, 2)); };
        var hill = .1 + .44 * g(.27, .15) + .3 * g(.68, .13) + .12 * g(.9, .06) + .02 * Math.sin(u * 31) + .018 * (rnd(i, 1) - .5);
        var green = rnd(i, 2) > .955;
        lines.push({x: gap + i * gap + .5, h: clamp(hill + (green ? .05 : 0), .06, .8), green: green, ph: u * 9 + rnd(i, 3) * .6, d: u * 1.1 + rnd(i, 4) * .2});
      }
    }
    function draw(now){
      var t = (now - t0) / 1000;
      lift += (liftAim - lift) * .08; px += (pxAim - px) * .12;
      cx.setTransform(dpr, 0, 0, dpr, 0, 0); cx.clearRect(0, 0, W, H);
      var floor = H * (.86 - lift * .12), room = H * .74;
      var gInk = cx.createLinearGradient(0, floor, 0, floor - room); gInk.addColorStop(0, 'rgba(28,28,27,.34)'); gInk.addColorStop(.7, 'rgba(28,28,27,.1)'); gInk.addColorStop(1, 'rgba(28,28,27,0)');
      var gGrn = cx.createLinearGradient(0, floor, 0, floor - room); gGrn.addColorStop(0, 'rgba(40,132,101,.95)'); gGrn.addColorStop(1, 'rgba(40,132,101,.05)');
      cx.lineWidth = 1;
      for(var pass = 0; pass < 2; pass++){
        cx.strokeStyle = pass ? gGrn : gInk; cx.beginPath();
        for(var i = 0; i < lines.length; i++){
          var L = lines[i]; if(L.green !== !!pass) continue;
          var grow = reduce ? 1 : clamp((t - L.d) / 1.6, 0, 1); grow = 1 - Math.pow(1 - grow, 3);
          var sway = reduce ? 0 : .02 * Math.sin(t * .6 + L.ph);
          var near = Math.exp(-Math.pow((L.x - px) / 90, 2)) * .1;
          var h = room * (L.h + sway + near) * grow;
          if(h < .5) continue;
          cx.moveTo(L.x, floor); cx.lineTo(L.x, floor - h);
        }
        cx.stroke();
      }
      /* the floor line: grey, with a green part that grows as the page lifts */
      cx.fillStyle = 'rgba(28,28,27,.28)'; cx.fillRect(0, floor, W, 1);
      var gw = W * clamp(reduce ? .35 : (t - .4) / 2.4, 0, 1) * (.35 + .65 * lift);
      cx.fillStyle = '#288465'; cx.fillRect(0, floor - .5, gw, 2);
    }
    function loop(now){
      if(!visible || document.hidden){ running = false; return; }
      if(now - last > 30){ last = now; draw(now); }
      requestAnimationFrame(loop);
    }
    function start(){ if(!t0) t0 = performance.now(); if(reduce){ draw(performance.now()); return; } if(!running){ running = true; requestAnimationFrame(loop); } }
    build(); draw(performance.now());
    window.addEventListener('resize', function(){ build(); draw(performance.now()); });
    box.addEventListener('pointermove', function(e){ var r = box.getBoundingClientRect(); pxAim = e.clientX - r.left; });
    box.addEventListener('pointerleave', function(){ pxAim = -1e4; });
    if('IntersectionObserver' in window){ new IntersectionObserver(function(es){ visible = es[0].isIntersecting; if(visible && t0) start(); }).observe(box); }
    document.addEventListener('visibilitychange', function(){ if(!document.hidden && t0) start(); });
    return { start: start, setLift: function(v){ liftAim = v; if(reduce){ lift = v; draw(performance.now()); } } };
  })();
  if(document.fonts && document.fonts.ready){ document.fonts.ready.then(go); setTimeout(go, 1800); } else { go(); }

  /* ----- header + menu ----- */
  var hd = $('hd'), menu = $('menu'), openBtn = $('menu-btn'), closeBtn = $('menu-close');
  function setMenu(o){ menu.hidden = !o; openBtn.setAttribute('aria-expanded', o ? 'true' : 'false'); document.body.style.overflow = o ? 'hidden' : ''; if(o) closeBtn.focus(); }
  openBtn.addEventListener('click', function(){ setMenu(true); });
  closeBtn.addEventListener('click', function(){ setMenu(false); openBtn.focus(); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && !menu.hidden){ setMenu(false); openBtn.focus(); } });

  /* ----- contact form presets (used by in-page links and by /contact/?topic=job&ask=casual) ----- */
  function preset(topic, ask){
    var r = topic ? $('topic-' + topic) : null;
    if(r){ r.checked = true; r.dispatchEvent(new Event('change', {bubbles:true})); }
    var chip = ask ? document.querySelector('.ask__chips [data-ask="' + ask + '"]') : null;
    if(chip && chip.getAttribute('aria-pressed') !== 'true') chip.click();
  }

  /* ----- in-page links ----- */
  document.addEventListener('click', function(e){
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if(!a) return;
    var id = a.getAttribute('href').slice(1), t = id ? $(id) : null;
    if(!t) return;
    e.preventDefault();
    if(!menu.hidden) setMenu(false);
    if(a.getAttribute('data-topic')) preset(a.getAttribute('data-topic'), a.getAttribute('data-ask'));
    var y = t.getBoundingClientRect().top + window.scrollY - (id === 'top' ? 0 : 8);
    window.scrollTo({top: Math.max(0, y), behavior: reduce ? 'auto' : 'smooth'});
  });

  /* ----- reveal on scroll ----- */
  var targets = [].slice.call(document.querySelectorAll('[data-rv], .art, .band'));
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); if(en.target.querySelector('[data-n]')) countUp(en.target); } });
    }, {rootMargin:'0px 0px -12% 0px', threshold:.15});
    targets.forEach(function(t){ io.observe(t); });
  } else { targets.forEach(function(t){ t.classList.add('in'); }); }
  /* the line drawings use pathLength so they can draw themselves */
  [].slice.call(document.querySelectorAll('.art svg *')).forEach(function(el){ el.setAttribute('pathLength', '1'); });

  function countUp(box){
    if(reduce) return;
    [].slice.call(box.querySelectorAll('[data-n]')).forEach(function(el){
      var to = +el.getAttribute('data-n'), t0 = performance.now(), dur = 1800;
      (function f(now){ var p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 4); el.textContent = Math.round(to * e).toLocaleString('ja-JP'); if(p < 1) requestAnimationFrame(f); })(t0);
    });
  }

  /* ----- voices: one at a time ----- */
  var vo = $('vo');
  if(vo){
    var vs = [].slice.call(vo.querySelectorAll('figure')), vn = $('vo-no'), vb = $('vo-bar'), vi = 0, vt = null;
    var show = function(i){ vs[vi].classList.remove('is-on'); vi = (i + vs.length) % vs.length; vs[vi].classList.add('is-on'); vn.textContent = '0' + (vi + 1); run(); };
    var run = function(){ clearTimeout(vt); vb.classList.remove('run'); if(reduce) return; void vb.offsetWidth; vb.classList.add('run'); vt = setTimeout(function(){ show(vi + 1); }, 7000); };
    $('vo-prev').addEventListener('click', function(){ show(vi - 1); });
    $('vo-next').addEventListener('click', function(){ show(vi + 1); });
    var tx = null;
    vo.addEventListener('touchstart', function(e){ tx = e.touches[0].clientX; }, {passive:true});
    vo.addEventListener('touchend', function(e){ if(tx === null) return; var dx = e.changedTouches[0].clientX - tx; if(Math.abs(dx) > 40) show(vi + (dx < 0 ? 1 : -1)); tx = null; });
    if('IntersectionObserver' in window){ new IntersectionObserver(function(es){ if(es[0].isIntersecting) run(); else { clearTimeout(vt); vb.classList.remove('run'); } }).observe(vo); }
  }

  /* ----- scroll: header, the floor lifts, slow drift of the brush mark and the sea ----- */
  var band = $('band'), bimg = band ? band.querySelector('img') : null, mark = $('mark'), ticking = false, lastY = 0;
  function drift(box, el, k, vh){ var r = box.getBoundingClientRect(); if(r.bottom > 0 && r.top < vh){ var p = ((r.top + r.height / 2) - vh / 2) / (vh / 2 + r.height / 2); el.style.setProperty('--py', (p * -k * r.height).toFixed(1) + 'px'); } }
  function frame(){
    ticking = false;
    var sy = window.scrollY, vh = window.innerHeight;
    hd.classList.toggle('is-scrolled', sy > 8);
    if(Math.abs(sy - lastY) > 6){ hd.classList.toggle('hd--up', sy > lastY && sy > 600 && menu.hidden); lastY = sy; }
    if(field) field.setLift(clamp(sy / (vh * .7), 0, 1));
    if(reduce) return;
    if(band) drift(band, bimg, .08, vh);
    if(mark) drift(mark.parentNode, mark, .18, vh);
  }
  window.addEventListener('scroll', function(){ if(!ticking){ ticking = true; requestAnimationFrame(frame); } }, {passive:true});
  frame();

  /* ----- contact form (Web3Forms) ----- */
  var form = $('contact-form');
  if(form){
    var status = $('form-status'), sendBtn = form.querySelector('button[type=submit]');
    var KEY = '83aebbd1-5cfd-49c7-a9f6-3945ddcf65cb';
    var names = {biz:'企業としての相談', job:'採用への応募・質問', etc:'その他'};
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var fd = new FormData(form); if(fd.get('botcheck')) return;
      var topic = names[fd.get('topic')] || 'お問い合わせ';
      sendBtn.disabled = true; status.textContent = '送信しています…';
      fetch('https://api.web3forms.com/submit', {method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'}, body: JSON.stringify({
        access_key: KEY, subject: '【ホームページ】' + topic + '（' + (fd.get('name') || '') + ' 様）', from_name: 'Union Faith株式会社 ホームページ', replyto: fd.get('email'),
        'ご用件': topic, 'お名前': fd.get('name'), '会社名': fd.get('company') || '', 'メールアドレス': fd.get('email'), '電話番号': fd.get('tel') || '', 'お問い合わせ内容': fd.get('body')
      })}).then(function(r){ return r.json().then(function(j){ return r.ok && j && j.success; }); })
        .then(function(ok){ if(ok){ form.reset(); status.textContent = '送信しました。内容を確認のうえ、担当者からご連絡します。'; } else { status.textContent = '送信できませんでした。時間をおいて、もう一度お試しください。'; } })
        .catch(function(){ status.textContent = '送信できませんでした。通信状況を確認して、もう一度お試しください。'; })
        .then(function(){ sendBtn.disabled = false; });
    });
    var askBox = $('ask'), cf = $('company-field'), body = $('f-body'), chips = [].slice.call(form.querySelectorAll('.ask__chips button'));
    var hints = {biz:'例）山口県内の家電量販店の携帯売場について、販売の体制を相談したい。', job:'例）未経験ですが、まずは話を聞いてみたいです。', etc:''};
    var sync = function(){ var c = form.querySelector('input[name=topic]:checked'), t = c ? c.value : 'biz'; askBox.hidden = t !== 'job'; cf.hidden = t === 'job'; body.placeholder = hints[t] || ''; };
    form.addEventListener('change', function(e){ if(e.target.name === 'topic') sync(); });
    chips.forEach(function(c){ c.addEventListener('click', function(){
      var line = '・' + c.textContent.trim(), on = c.getAttribute('aria-pressed') !== 'true', lines = body.value ? body.value.split('\n') : [];
      c.setAttribute('aria-pressed', on ? 'true' : 'false');
      if(on){ if(lines.indexOf(line) < 0){ var at = 0; while(at < lines.length && lines[at].indexOf('・') === 0) at++; lines.splice(at, 0, line); } }
      else { lines = lines.filter(function(l){ return l !== line; }); }
      body.value = lines.join('\n');
    }); });
    form.addEventListener('reset', function(){ setTimeout(function(){ chips.forEach(function(c){ c.setAttribute('aria-pressed','false'); }); sync(); }, 0); });
    sync();
    /* /contact/?topic=job&ask=casual で、ご用件を選んだ状態で開く */
    if(window.URLSearchParams){ var q = new URLSearchParams(location.search); if(q.get('topic')) preset(q.get('topic'), q.get('ask')); }
  }
})();
