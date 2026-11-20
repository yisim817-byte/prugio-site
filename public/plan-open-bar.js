/* 상단 띠(배너) 2항목:
   ① 방문고객등록 → /visit (2026-11-21 작업지시서 22)
   ② 103㎡B 선착순 참여의향서 접수 안내 → /103b (2026-11-13 작업지시서 17, 문구 그대로)
   PC 는 한 줄에 나란히, 900px 미만은 두 줄. /visit 화면에서는 ①을 빼고 ②만 보인다.
   파일 이름·요소 id(plan-open-bar)는 그대로 둔다. */
(function () {
  'use strict';
  if (window.__planOpenBar) return; window.__planOpenBar = 1;
  if (/register|prereg|admin|login/i.test(location.pathname)) return;
  var KEY = 'topBarClosed_20261121';
  try { if (sessionStorage.getItem(KEY)) return; } catch (e) {}
  var s = document.currentScript;
  var B103 = (s && s.getAttribute('data-b103-href')) || '/103b';
  var VISIT = (s && s.getAttribute('data-visit-href')) || '/visit';
  var onVisit = /^\/visit(\/|$)/.test(location.pathname);
  var items = [];
  if (!onVisit) {
    items.push('<a class="pob-link pob-visit" href="' + VISIT + '" aria-label="방문고객등록 · 견본주택 방문은 사전 예약제 · 방문 전 등록하기 ›"><span class="pob-tag pob-tag-visit">방문고객등록</span><span class="pob-types"> · 견본주택 방문은 사전 예약제</span> · <span class="pob-go">방문 전 등록하기 ›</span></a>');
  }
  items.push('<a class="pob-link pob-b103" href="' + B103 + '" aria-label="103㎡B 선착순 · 참여의향서 11.17(화)부터 견본주택 접수 · 접수 안내 보기 ›"><span class="pob-tag">103㎡B 선착순</span><span class="pob-types"> · 참여의향서 11.17(화)부터 견본주택 접수</span> · <span class="pob-go">접수 안내 보기 ›</span></a>');
  var twoRows = items.length > 1 && window.matchMedia('(max-width:899px)').matches;
  var ROW = twoRows ? 30 : 38;
  var H = twoRows ? 60 : 38;
  function run() {
    if (document.getElementById('plan-open-bar')) return;
    var css = document.createElement('style');
    css.textContent =
      '#plan-open-bar{position:fixed;top:0;left:0;right:0;height:' + H + 'px;z-index:2147482000;box-sizing:border-box;padding:0 44px;display:flex;align-items:center;justify-content:center;background:#0b2a4a;color:#fff;font:600 14px/1.2 "Pretendard","Noto Sans KR","Apple SD Gothic Neo",sans-serif;letter-spacing:-.2px;box-shadow:0 1px 0 rgba(255,255,255,.08)}' +
      '#plan-open-bar .pob-rows{display:flex;align-items:center;justify-content:center;max-width:100%;min-width:0}' +
      '#plan-open-bar a.pob-link{display:block;color:#fff;text-decoration:none;height:' + ROW + 'px;line-height:' + ROW + 'px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}' +
      '#plan-open-bar .pob-sep{flex:0 0 1px;width:1px;height:16px;margin:0 20px;background:rgba(255,255,255,.32)}' +
      '#plan-open-bar .pob-tag{display:inline-block;vertical-align:middle;line-height:1.2;background:#c9a35b;color:#0b2a4a;border-radius:3px;padding:3px 7px;font-size:12px;font-weight:800;margin-top:-2px}' +
      '#plan-open-bar .pob-tag-visit{background:#fff}' +
      '#plan-open-bar .pob-go{text-decoration:underline;text-underline-offset:3px}' +
      '#plan-open-bar button{position:absolute;right:6px;top:50%;transform:translateY(-50%);background:none;border:0;color:#fff;font-size:20px;line-height:1;width:32px;height:32px;cursor:pointer;opacity:.8}' +
      '@media(max-width:1199px){#plan-open-bar .pob-b103 .pob-types{display:none}}' +
      '@media(max-width:899px){#plan-open-bar{padding:0 36px 0 10px;font-size:12.5px}#plan-open-bar .pob-rows{flex-direction:column;align-items:stretch;width:100%}#plan-open-bar a.pob-link{text-align:center}#plan-open-bar .pob-sep{display:none}#plan-open-bar .pob-tag{font-size:11px;padding:2px 5px}}' +
      '@media(max-width:599px){#plan-open-bar .pob-types{display:none}}' +
      'html.pob-on body{padding-top:' + H + 'px!important}';
    document.head.appendChild(css);
    var bar = document.createElement('div');
    bar.id = 'plan-open-bar'; bar.dataset.rows = String(twoRows ? 2 : 1); bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', onVisit ? '103㎡B 선착순 참여의향서 접수 안내' : '방문고객등록과 103㎡B 선착순 안내');
    bar.innerHTML = '<div class="pob-rows">' + items.join('<span class="pob-sep" aria-hidden="true"></span>') + '</div><button type="button" aria-label="닫기">×</button>';
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
