/* 평면도 공개 상단 띠 (2026-10-31, t244u 전 타입 갱신) */
(function () {
  'use strict';
  if (window.__planOpenBar) return; window.__planOpenBar = 1;
  if (/register|prereg|admin|login/i.test(location.pathname)) return;
  var KEY = 'planOpenBarClosed_20261031b';
  try { if (sessionStorage.getItem(KEY)) return; } catch (e) {}
  var s = document.currentScript;
  var HREF = (s && s.getAttribute('data-href')) || '/plans';
  var H = 38;
  function run() {
    if (document.getElementById('plan-open-bar')) return;
    var css = document.createElement('style');
    css.textContent =
      '#plan-open-bar{position:fixed;top:0;left:0;right:0;height:' + H + 'px;z-index:2147482000;display:flex;align-items:center;justify-content:center;gap:10px;background:#0b2a4a;color:#fff;font:600 14px/1.2 "Pretendard","Noto Sans KR","Apple SD Gothic Neo",sans-serif;letter-spacing:-.2px;box-shadow:0 1px 0 rgba(255,255,255,.08)}' +
      '#plan-open-bar a.pob-link{color:#fff;text-decoration:none;display:flex;align-items:center;gap:8px;padding:0 44px;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
      '#plan-open-bar .pob-tag{background:#c9a35b;color:#0b2a4a;border-radius:3px;padding:3px 7px;font-size:12px;font-weight:800}' +
      '#plan-open-bar .pob-go{text-decoration:underline;text-underline-offset:3px}' +
      '#plan-open-bar button{position:absolute;right:6px;top:50%;transform:translateY(-50%);background:none;border:0;color:#fff;font-size:20px;line-height:1;width:32px;height:32px;cursor:pointer;opacity:.8}' +
      '@media(max-width:480px){#plan-open-bar{font-size:12.5px}#plan-open-bar .pob-tag{font-size:11px;padding:2px 5px}#plan-open-bar a.pob-link{padding:0 36px 0 10px}#plan-open-bar .pob-types{display:none}}' +
      'html.pob-on body{padding-top:' + H + 'px!important}';
    document.head.appendChild(css);
    var bar = document.createElement('div');
    bar.id = 'plan-open-bar'; bar.setAttribute('role', 'region'); bar.setAttribute('aria-label', '평면도 공개 안내');
    bar.innerHTML = '<a class="pob-link" href="' + HREF + '"><span class="pob-tag">평면도 공개</span><span class="pob-types">84㎡A·B·C·D · 103㎡A·B 전 타입</span><span class="pob-go">평면도·분양가 보기 ›</span></a><button type="button" aria-label="닫기">×</button>';
    document.documentElement.appendChild(bar);
    document.documentElement.classList.add('pob-on');
    var moved = [];
    function shift() {
      var els = document.body.querySelectorAll('header,body>*,body>*>*,[class*=header],[class*=Header],[id*=header]');
      for (var i = 0; i < els.length; i++) {
        var el = els[i]; if (el === bar || el.__pob) continue;
        var cs = getComputedStyle(el);
        if ((cs.position === 'fixed' || cs.position === 'sticky') && parseFloat(cs.top) === 0 && el.offsetHeight > 0 && el.offsetHeight < 200) {
          el.__pob = 1; el.style.setProperty('top', H + 'px', 'important'); moved.push(el);
        }
      }
    }
    shift(); setTimeout(shift, 800); setTimeout(shift, 2500);
    bar.querySelector('button').onclick = function () {
      try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
      bar.remove(); document.documentElement.classList.remove('pob-on');
      moved.forEach(function (el) { el.style.removeProperty('top'); });
    };
  }
  if (document.readyState === 'complete') setTimeout(run, 300); else window.addEventListener('load', function () { setTimeout(run, 300); });
})();
