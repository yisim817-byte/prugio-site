/* 상단 배너 3줄 (작업지시서 25 · 2026-11-25). 파일 이름·요소 id 는 유지. */
(function () {
  'use strict';
  if (window.__planOpenBar) return;
  window.__planOpenBar = 1;
  if (/\/admin|\/login/i.test(location.pathname)) return;
  var KEY = 'topBar_20261125';
  try { if (sessionStorage.getItem(KEY)) return; } catch (e) {}
  var s = document.currentScript;
  var MODE = (s && s.getAttribute('data-mode')) || 'hq';
  var PHONE = (s && s.getAttribute('data-phone')) || '';
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
    if (p !== '/visit') {
      if (MODE === 'staff') {
        rows.push({ cls: 'pob-lg', href: TEL, text: '방문예약은 전화로만 · 방문 시 스타벅스 커피 쿠폰 2장 · ' + PHONE + ' ›' });
      } else {
        rows.push({ cls: 'pob-lg', href: '/visit', text: '방문고객등록 · 방문예약 후 모델하우스 방문 시 스타벅스 커피 쿠폰 2장 · 등록하기 ›' });
      }
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
      + '#plan-open-bar{position:fixed;top:0;left:0;right:0;z-index:2147482000;display:flex;flex-direction:column;background:#032B20;color:#fff;font-family:"Pretendard","Noto Sans KR","Apple SD Gothic Neo",sans-serif;box-shadow:0 1px 0 rgba(0,0,0,.12)}'
      + '#plan-open-bar a{color:#fff;text-decoration:none;display:flex;align-items:center;justify-content:center;text-align:center;padding:0 44px;box-sizing:border-box;width:100%}'
      + '#plan-open-bar a.pob-lg{min-height:64px;height:64px;font-size:20px;font-weight:700;letter-spacing:-.3px;line-height:1.25;background:#032B20}'
      + '#plan-open-bar a.pob-sm{min-height:38px;height:38px;font-size:14px;font-weight:600;letter-spacing:-.2px;line-height:1.3;background:#0b3a32}'
      + '#plan-open-bar a.pob-sm + a.pob-sm{background:#08302a}'
      + '#plan-open-bar button{position:absolute;right:6px;top:16px;background:none;border:0;color:#fff;font-size:22px;line-height:1;width:36px;height:36px;cursor:pointer}'
      + '@media(max-width:767px){#plan-open-bar a.pob-lg{height:auto;min-height:56px;font-size:16px;font-weight:700;padding:8px 40px;white-space:normal}#plan-open-bar a.pob-sm{height:auto;min-height:34px;font-size:12.5px;padding:6px 36px 6px 10px;white-space:normal}}'
      + 'html.pob-on body{padding-top:var(--pob-h,140px)!important}';
    document.head.appendChild(css);
    var bar = document.createElement('div');
    bar.id = 'plan-open-bar';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', '방문·일정·비교 안내');
    bar.innerHTML = rows.map(function (r) {
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
