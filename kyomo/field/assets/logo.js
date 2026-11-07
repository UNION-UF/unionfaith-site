/* SATTO のロゴ（文字のロゴ：2つのTを1本の線でつなぎ、端に点）とアイコン。色は会社の緑 */
(function () {
  'use strict';
  var G = '#288465';
  function tt(fs) {
    return '<svg class="tt" viewBox="0 0 158 78" width="' + (fs * 1.41).toFixed(1) + '" height="' + (fs * 0.696).toFixed(1) + '" aria-hidden="true">' +
      '<rect x="0" y="0" width="134" height="15" fill="' + G + '"/><rect x="24" y="0" width="17" height="78" fill="' + G + '"/>' +
      '<rect x="92" y="0" width="17" height="78" fill="' + G + '"/><circle cx="148" cy="7.5" r="8.5" fill="' + G + '"/></svg>';
  }
  function tile(px) {
    var g = Math.round(px * 0.66);
    return '<span class="tile" style="width:' + px + 'px;height:' + px + 'px;border-radius:' + Math.round(px * 0.236) + 'px">' +
      '<svg viewBox="0 0 160 80" width="' + g + '" height="' + Math.round(g / 2) + '" aria-hidden="true">' +
      '<rect x="0" y="0" width="132" height="22" fill="' + G + '"/><rect x="21" y="0" width="22" height="80" fill="' + G + '"/>' +
      '<rect x="87" y="0" width="22" height="80" fill="' + G + '"/><circle cx="149" cy="11" r="11" fill="' + G + '"/></svg></span>';
  }
  window.SATTO = {
    logo: function (fs, opt) {
      opt = opt || {}; fs = fs || 20;
      return '<span class="logo" role="img" aria-label="SATTO' + (opt.sub ? ' ' + opt.sub : '') + '">' +
        (opt.icon === false ? '' : tile(Math.round(fs * 1.45))) +
        '<span class="wm" style="font-size:' + fs + 'px" aria-hidden="true">SA' + tt(fs) + 'O</span>' +
        (opt.sub ? '<span class="sub">' + opt.sub + '</span>' : '') + '</span>';
    }
  };
})();
