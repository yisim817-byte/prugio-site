/* 상단 배너 (작업지시서 27 · 2026-11-27). 파일 이름·요소 id 는 유지. */
(function () {
  'use strict';
  if (window.__planOpenBar) return;
  window.__planOpenBar = 1;
  if (/\/admin|\/login/i.test(location.pathname)) return;
  var KEY = 'topBar_20261128';
  try { if (sessionStorage.getItem(KEY)) return; } catch (e) {}
  var s = document.currentScript;
  var MODE = (s && s.getAttribute('data-mode')) || 'hq';
  var PHONE = (s && s.getAttribute('data-phone')) || '1833-3872';
  var TEL = 'tel:' + String(PHONE).replace(/\D/g, '');
  function path() {
    var p = location.pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
    if (p.length > 1 && p.charAt(p.length - 1) === '/') p = p.slice(0, -1);
    return p || '/';
  }
  function hideLine2() {
    return Date.now() >= Date.UTC(2026, 10, 28, 15, 0, 0);
  }
  function run() {
    if (document.getElementById('plan-open-bar')) return;
    var p = path();
    var rows = [];
    if (MODE === 'staff') {
      if (p !== '/visit') {
        rows.push({ cls: 'pob-lg', href: TEL, text: '전화로 방문고객등록 후 모델하우스 방문 시 스타벅스 커피 쿠폰 증정 · ' + PHONE + ' ›' });
      }
    } else {
      rows.push({
        cls: 'pob-lg pob-lg--split',
        html: '<span class="pob-lg__txt">사전고객등록·방문예약 후 모델하우스 방문 시 스타벅스 커피 쿠폰 증정</span>'
          + '<span class="pob-lg__btns"><a class="pob-btn" href="/register">사전고객등록 ›</a><a class="pob-btn" href="/visit">방문예약 ›</a></span>'
      });
    }
    if (p !== '/103b' && !hideLine2()) {
      rows.push({ cls: 'pob-sm', href: '/103b', text: '11.28(토) 103㎡B 선착순 · 예비당첨자 추첨 예정 · 안내 보기 ›' });
    }
    if (p !== '/compare') {
      rows.push({ cls: 'pob-sm', href: '/compare', text: '아파트 vs 오피스텔 비교 · 가격·넓이·청약자격·전매 한눈에 ›' });
    }
    if (!rows.length) return;
    var css = document.createElement('style');
    css.textContent = ''
      + '#plan-open-bar{position:fixed;top:0;left:0;right:0;z-index:2147482000;display:flex;flex-direction:column;background:#032B20;color:#fff;font-family:"Pretendard","Noto Sans KR","Apple SD Gothic Neo",sans-serif;box-shadow:0 1px 0 rgba(0,0,0,.12);max-width:100%}'
      + '#plan-open-bar a{color:#fff;text-decoration:none;display:flex;align-items:center;justify-content:center;text-align:center;padding:0 44px;box-sizing:border-box;width:100%}'
      + '#plan-open-bar a.pob-lg{min-height:64px;height:64px;font-size:20px;font-weight:700;letter-spacing:-.3px;line-height:1.25;background:#032B20}'
      + '#plan-open-bar a.pob-sm{min-height:38px;height:38px;font-size:14px;font-weight:600;letter-spacing:-.2px;line-height:1.3;background:#0b3a32}'
      + '#plan-open-bar a.pob-sm + a.pob-sm{background:#08302a}'
      + '#plan-open-bar .pob-lg--split{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px 14px;box-sizing:border-box;width:100%;max-width:100%;min-height:64px;height:auto;padding:6px 48px;background:#032B20;font-size:20px;font-weight:700;letter-spacing:-.3px;line-height:1.25;text-align:center}'
      + '#plan-open-bar .pob-lg__txt{min-width:0;max-width:100%}'
      + '#plan-open-bar .pob-lg__btns{display:flex;flex:none;gap:8px;max-width:100%}'
      + '#plan-open-bar a.pob-btn{display:inline-flex;align-items:center;justify-content:center;width:auto;height:34px;min-height:34px;padding:0 12px;border-radius:999px;background:#fff;color:#032B20;font-size:15px;font-weight:800;letter-spacing:-.2px;white-space:nowrap;line-height:1}'
      + '#plan-open-bar button{position:absolute;right:6px;top:16px;background:none;border:0;color:#fff;font-size:22px;line-height:1;width:36px;height:36px;cursor:pointer}'
      + '@media(max-width:767px){#plan-open-bar a.pob-lg{height:auto;min-height:56px;font-size:15px;font-weight:700;padding:8px 40px;white-space:normal}#plan-open-bar a.pob-sm{height:auto;min-height:34px;font-size:12.5px;padding:6px 36px 6px 10px;white-space:normal}#plan-open-bar .pob-lg--split{flex-direction:column;min-height:56px;padding:8px 40px 8px 10px;gap:6px;font-size:15px;line-height:1.3}#plan-open-bar .pob-lg__btns{justify-content:center}#plan-open-bar a.pob-btn{height:32px;min-height:32px;font-size:14px;padding:0 10px}}'
      + 'html.pob-on body{padding-top:var(--pob-h,140px)!important}';
    document.head.appendChild(css);
    var bar = document.createElement('div');
    bar.id = 'plan-open-bar';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', '방문·일정·비교 안내');
    bar.innerHTML = rows.map(function (r) {
      if (r.html) return '<div class="' + r.cls + '">' + r.html + '</div>';
      return '<a class="' + r.cls + '" href="' + r.href + '">' + r.text + '</a>';
    }).join('') + '<button type="button" aria-label="닫기">×</button>';
    document.documentElement.appendChild(bar);
    document.documentElement.classList.add('pob-on');
    var moved = [];
    function shift() {
      var h = bar.offsetHeight || 0;
      document.documentElement.style.setProperty('--pob-h', h + 'px');
      var els = document.body.querySelectorAll('header,[class*=header],[class*=Header],[id*=header]');
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if (el === bar || el.__pob) continue;
        var cs = getComputedStyle(el);
        if ((cs.position === 'fixed' || cs.position === 'sticky') && (parseFloat(cs.top) === 0 || cs.top === '0px') && el.offsetHeight > 0 && el.offsetHeight < 220) {
          el.__pob = 1;
          el.style.setProperty('top', h + 'px', 'important');
          moved.push(el);
        }
      }
    }
    shift();
    setTimeout(shift, 400);
    setTimeout(shift, 1600);
    window.addEventListener('resize', shift);
    bar.querySelector('button').onclick = function () {
      try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
      bar.remove();
      document.documentElement.classList.remove('pob-on');
      document.documentElement.style.removeProperty('--pob-h');
      moved.forEach(function (el) { el.style.removeProperty('top'); });
    };
  }
  if (document.readyState === 'complete') setTimeout(run, 50);
  else window.addEventListener('load', function () { setTimeout(run, 50); });
})();
