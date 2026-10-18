// @ts-nocheck
// 코스트코 선착순 1,000명 이벤트 팝업 v2 — 기존 팝업과 겹치지 않게 (PC 나란히 / 휴대폰 차례로)
import { useEffect } from "react";

  /* 코스트코 선착순 1,000명 이벤트 팝업 v2 — 기존 팝업과 겹치지 않게 배치
     PC(넓은 화면): 기존 팝업을 왼쪽으로 옮기고 오른쪽에 나란히 표시
     휴대폰(좁은 화면): 기존 팝업을 닫은 뒤에 이어서 표시
     기존 팝업 파일은 바꾸지 않는다. 나란히 놓는 동안만 기존 카드 위치(transform)를 잠시 옮기고, 닫으면 원래대로 되돌린다. */
  var HIDE_KEY = "arkone_costco_pop_hide_until";
  var W = 400, GAP = 24, SHIFT = (W + GAP) / 2;

  function norm(path) {
    var p = path || "/";
    p = p.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
    if (p.length > 1 && p.charAt(p.length - 1) === "/") p = p.slice(0, -1);
    return p || "/";
  }
  function skip() {
    var p = norm(location.pathname);
    return p === "/register" || p === "/privacy" || p === "/terms" || p === "/agreement" || p === "/policy";
  }
  function hidden() {
    try { var u = localStorage.getItem(HIDE_KEY); return !!(u && Date.now() < Number(u)); } catch (e) { return false; }
  }
  function nextKstMidnight() {
    var kst = Date.now() + 9 * 3600000, d = new Date(kst);
    return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1) - 9 * 3600000;
  }

  var CSS = ""
    + ".costco-pop{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;background:rgba(0,0,0,.55);color:#fff;font-family:inherit}"
    + ".costco-pop--side{display:block;padding:0;background:transparent;pointer-events:none}"
    + ".costco-pop--side .costco-pop__panel{position:absolute;pointer-events:auto}"
    + ".costco-pop__panel--in{position:absolute;left:calc(100% + " + GAP + "px);top:0;pointer-events:auto;text-align:left}"
    + ".costco-pop__panel{width:min(" + W + "px,calc(100vw - 32px));box-sizing:border-box;padding:14px 16px 10px;border:1px solid #B5853A;border-radius:16px;background:linear-gradient(180deg,#032B20 0%,#0A3D2D 100%);color:#fff;font-family:inherit;animation:costcoIn .25s ease;box-shadow:0 18px 48px rgba(0,0,0,.28)}"
    + ".costco-pop__panel *{box-sizing:border-box}"
    + ".costco-pop__band{margin:0 0 8px;padding-bottom:8px;border-bottom:1px solid #B5853A;font-size:12px;line-height:1.35;color:#fff}"
    + ".costco-pop__title{margin:0;color:#E2B565;font-weight:700;font-size:44px;line-height:1.1;letter-spacing:-.03em}"
    + ".costco-pop__benefit{margin:6px 0 0;font-size:22px;line-height:1.3;font-weight:700;color:#fff}"
    + ".costco-pop__target{margin:6px 0 0;font-size:15px;line-height:1.4;color:#fff}"
    + ".costco-pop__go,.costco-pop__tel{display:flex;align-items:center;justify-content:center;width:100%;text-decoration:none;border-radius:8px}"
    + ".costco-pop__go{margin-top:12px;height:48px;background:#E2B565;color:#032B20;font-weight:700;font-size:16px;border:0}"
    + ".costco-pop__tel{margin-top:8px;height:44px;background:transparent;color:#fff;border:1px solid #B5853A;font-size:15px}"
    + ".costco-pop__note{margin:4px 0 0;color:rgba(255,255,255,.75);font-size:12px;line-height:1.35}"
    + ".costco-pop__foot{display:flex;justify-content:space-between;gap:8px;margin-top:8px}"
    + ".costco-pop__foot button{background:transparent;border:0;color:rgba(255,255,255,.9);font:inherit;font-size:13px;min-height:36px;padding:0;cursor:pointer}"
    + "@media(max-width:767px){.costco-pop__title{font-size:36px}.costco-pop__benefit{font-size:19px}.costco-pop__target{font-size:14px}.costco-pop__note{font-size:11.5px}.costco-pop__panel{padding:12px 14px 8px}}"
    + "@keyframes costcoIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}"
    + "@media(prefers-reduced-motion:reduce){.costco-pop__panel{animation:none}}";

  function startCostcoPopup(cfg) {
    if (typeof window === "undefined" || skip() || hidden()) return function () {};
    var PHONE = cfg.phone, TEL = cfg.tel, REGISTER = cfg.register || "/register";
    var dead = false, timers = [], panel = null, root = null, mode = "", restore = null, prevFocus = null;

    function later(fn, ms) { var t = window.setTimeout(fn, ms); timers.push(t); return t; }
    function existingEl() { return document.querySelector(cfg.existing); }
    function existingOpen() {
      var el = existingEl();
      if (!el) return false;
      if (el.tagName === "DIALOG") return !!el.open;
      var cs = window.getComputedStyle(el);
      return !(cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0");
    }
    function cardEl() {
      var ex = existingEl();
      if (ex && ex.tagName === "DIALOG") return ex;
      return document.querySelector(cfg.card) || ex;
    }
    function zOf(el, fb) {
      var n = el ? parseInt(window.getComputedStyle(el).zIndex, 10) : NaN;
      return (isFinite(n) ? n : fb) + 1;
    }
    function canSide() {
      var c = cardEl();
      if (!c) return false;
      var w = c.getBoundingClientRect().width;
      return window.innerWidth >= 900 && window.innerWidth >= w + GAP + W + 32;
    }
    function css() {
      if (document.getElementById("costco-pop-style")) return;
      var s = document.createElement("style"); s.id = "costco-pop-style"; s.textContent = CSS;
      document.head.appendChild(s);
    }
    function build() {
      var p = document.createElement("div");
      p.className = "costco-pop__panel";
      p.setAttribute("role", "dialog");
      p.setAttribute("aria-labelledby", "costco-pop-title");
      p.innerHTML = ''
        + '<p class="costco-pop__band">청라 아크원 푸르지오 · 사전고객등록 EVENT</p>'
        + '<h2 id="costco-pop-title" class="costco-pop__title">선착순 1,000명</h2>'
        + '<p class="costco-pop__benefit">코스트코 1년 회원권 증정</p>'
        + '<p class="costco-pop__target">홈페이지 사전고객등록 후 청약하신 고객 · 청약 당첨 여부와 관계없이</p>'
        + '<a class="costco-pop__go" href="' + REGISTER + '">사전고객등록하기</a>'
        + '<a class="costco-pop__tel" href="' + TEL + '">전화 문의 ' + PHONE + '</a>'
        + '<p class="costco-pop__note">※ 선착순 1,000명 마감 시 조기 종료됩니다.</p>'
        + '<p class="costco-pop__note">※ 선착순 기준·지급 시기·방법은 담당자가 개별 안내합니다.</p>'
        + '<p class="costco-pop__note">※ 사전고객등록은 공식 청약 신청이 아니며, 등록만으로는 증정되지 않습니다.</p>'
        + '<p class="costco-pop__note">※ 홈페이지 운영자가 진행하는 이벤트로, 시행·시공사 및 코스트코가 제공하는 혜택이 아닙니다.</p>'
        + '<div class="costco-pop__foot"><button type="button" data-today="1">오늘 하루 보지 않기</button><button type="button" data-close="1" aria-label="닫기">닫기</button></div>';
      p.addEventListener("click", function (e) {
        var t = e.target;
        if (!t || !t.closest) return;
        if (t.closest(".costco-pop__go")) {
          e.preventDefault(); e.stopPropagation();
          close(false);
          var form = document.getElementById("prereg-form");
          if (form && norm(location.pathname) === REGISTER) { form.scrollIntoView({ block: "start" }); return; }
          location.assign(REGISTER);
          return;
        }
        if (t.closest("[data-today]")) { e.stopPropagation(); close(true); }
        else if (t.closest("[data-close]")) { e.stopPropagation(); close(false); }
      });
      return p;
    }
    function teardown() {
      if (restore) { restore(); restore = null; }
      if (panel && panel.parentNode) panel.parentNode.removeChild(panel);
      if (root && root.parentNode) root.parentNode.removeChild(root);
      panel = null; root = null;
      document.removeEventListener("keydown", onKey, true);
      window.removeEventListener("resize", place);
    }
    function close(today) {
      if (today) { try { localStorage.setItem(HIDE_KEY, String(nextKstMidnight())); } catch (e) {} }
      var wasSolo = mode === "solo";
      teardown(); mode = "closed";
      if (wasSolo && prevFocus && prevFocus.focus) { try { prevFocus.focus(); } catch (e) {} }
    }
    function onKey(e) {
      if (mode === "solo" && e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(false); }
    }
    function place() {
      if (mode !== "side" || !panel || panel.classList.contains("costco-pop__panel--in")) return;
      var c = cardEl(); if (!c) return;
      var r = c.getBoundingClientRect();
      var h = panel.offsetHeight || 460;
      var top = Math.max(16, Math.min(r.top, window.innerHeight - h - 16));
      panel.style.left = Math.round(r.right + GAP) + "px";
      panel.style.top = Math.round(top) + "px";
    }
    function openSolo() {
      if (dead || mode === "solo" || mode === "closed" || hidden()) return;
      teardown(); css();
      prevFocus = document.activeElement;
      root = document.createElement("div");
      root.className = "costco-pop";
      root.style.zIndex = String(cfg.z || 1101);
      panel = build();
      panel.setAttribute("aria-modal", "true");
      root.appendChild(panel);
      root.addEventListener("click", function (e) { if (e.target === root) close(false); });
      document.body.appendChild(root);
      mode = "solo";
      document.addEventListener("keydown", onKey, true);
      var go = panel.querySelector(".costco-pop__go"); if (go && go.focus) go.focus();
    }
    function openSide() {
      css();
      var ex = existingEl(), c = cardEl();
      panel = build();
      if (ex.tagName === "DIALOG") {
        var old = ex.style.transform;
        ex.style.transform = "translate(calc(-50% - " + SHIFT + "px), -50%)";
        restore = function () { ex.style.transform = old; };
        panel.classList.add("costco-pop__panel--in");
        ex.appendChild(panel);
      } else {
        var oldT = c.style.transform;
        c.style.transform = (oldT ? oldT + " " : "") + "translateX(-" + SHIFT + "px)";
        restore = function () { c.style.transform = oldT; };
        root = document.createElement("div");
        root.className = "costco-pop costco-pop--side";
        root.style.zIndex = String(zOf(ex, cfg.z || 1100));
        root.appendChild(panel);
        document.body.appendChild(root);
      }
      mode = "side";
      place();
      later(place, 60);
      window.addEventListener("resize", place);
      watchSide();
    }
    function watchSide() {
      later(function () {
        if (dead || mode !== "side") return;
        if (!existingOpen()) { teardown(); mode = ""; openSolo(); return; }
        watchSide();
      }, 250);
    }
    function waitThenSolo(deadline) {
      later(function () {
        if (dead || mode) return;
        if (!existingOpen()) { openSolo(); return; }
        if (Date.now() < deadline) waitThenSolo(deadline);
      }, 300);
    }
    function decide() {
      if (dead || mode || hidden()) return;
      if (!existingOpen()) { openSolo(); return; }
      if (canSide()) { openSide(); return; }
      waitThenSolo(Date.now() + 30 * 60000);
    }
    function boot() {
      var intro = document.documentElement.hasAttribute("data-om-intro");
      var t0 = Date.now(), cap = intro ? 15000 : 2000;
      function tick() {
        if (dead || mode) return;
        if (existingOpen()) { later(decide, 120); return; }
        if (Date.now() - t0 >= cap) { decide(); return; }
        later(tick, 60);
      }
      if (intro) {
        var onIntro = function () { t0 = Date.now(); cap = 2000; tick(); };
        window.addEventListener("om:intro-done", onIntro, { once: true });
        later(function () { if (!mode) decide(); }, 15000);
        return;
      }
      tick();
    }
    boot();
    return function stop() { dead = true; timers.forEach(function (t) { window.clearTimeout(t); }); teardown(); };
  }

export function CostcoEventPopupView() {
  useEffect(() => {
    const w = window;
    return startCostcoPopup({
      phone: w.__arkoneCostcoPhone || "1533-9014",
      tel: w.__arkoneCostcoTel || "tel:15339014",
      register: "/register",
      existing: '[aria-labelledby="apt-event-pop-title"]',
      card: '[aria-labelledby="apt-event-pop-title"] > div.relative',
      z: 51,
    });
  }, []);
  return null;
}
