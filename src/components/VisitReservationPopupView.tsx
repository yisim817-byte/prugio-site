// @ts-nocheck
// 모델하우스 방문예약 팝업 (작업지시서 9) — 기존 팝업 2종 위에 뜨는 신규 팝업. 기존 팝업 파일은 바꾸지 않는다.
import { useEffect } from "react";

  /* 모델하우스 방문예약 팝업 (작업지시서 9, 2026-10-19)
     - arkone-visit-config 의 enabled=true 일 때만 띄운다(호출 실패 시 띄우지 않음 = 공개 스위치 겸 비상 정지).
     - 기존 팝업 2종(30만원·코스트코)은 선택자로 열림 여부만 읽는다. 그 파일·문구·저장 키는 건드리지 않는다.
     - 가장 위 레이어: z-index = 기존 두 팝업 중 큰 값 + 1. 기존이 <dialog> 인 사이트는 이것도 <dialog>(top layer)로 띄운다.
     - 「오늘 하루 보지 않기」 = localStorage arkone_visit_pop_hide_until 에 한국시간 다음 날 0시. 「닫기」·딤·Esc = 이번만. */
  var VISIT_CONFIG_URL = "https://jzmktahlrwtrtejjflrw.supabase.co/functions/v1/arkone-visit-config";
  var VISIT_HIDE_KEY = "arkone_visit_pop_hide_until";

  function visitConfig() {
    var w = window;
    if (!w.__arkoneVisitCfg) {
      w.__arkoneVisitCfg = fetch(VISIT_CONFIG_URL, { method: "GET", credentials: "omit" })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) { return d && d.enabled === true && Array.isArray(d.dates) && d.dates.length ? d : null; })
        .catch(function () { return null; });
    }
    return w.__arkoneVisitCfg;
  }

  function startVisitPopup(cfg) {
    var dead = false, timers = [], root = null, panel = null, prevFocus = null, watch = 0, seen = [];
    var useDialog = !!cfg.dialog && typeof HTMLDialogElement === "function" && typeof HTMLDialogElement.prototype.showModal === "function";
    function later(fn, ms) { var t = window.setTimeout(fn, ms); timers.push(t); return t; }
    function norm(path) {
      var p = (path || "/").replace(/\/index\.html$/, "/").replace(/\.html$/, "");
      if (p.length > 1 && p.charAt(p.length - 1) === "/") p = p.slice(0, -1);
      return p || "/";
    }
    function skip() {
      var p = norm(location.pathname);
      return p === norm(cfg.register) || p === "/register" || p === "/privacy" || p === "/terms" || p === "/agreement" || p === "/policy";
    }
    function hidden() {
      try { var u = localStorage.getItem(VISIT_HIDE_KEY); return !!(u && Date.now() < Number(u)); } catch (e) { return false; }
    }
    function nextKstMidnight() {
      var d = new Date(Date.now() + 9 * 3600000);
      return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1) - 9 * 3600000;
    }
    function isOpen(el) {
      if (!el || !el.isConnected) return false;
      if (el.tagName === "DIALOG" && !el.open) return false;
      try { var s = window.getComputedStyle(el); return s.display !== "none" && s.visibility !== "hidden"; } catch (e) { return true; }
    }
    function openExisting() {
      var out = [];
      (cfg.existing || []).forEach(function (sel) {
        var list = document.querySelectorAll(sel);
        for (var i = 0; i < list.length; i++) if (list[i] !== root && isOpen(list[i])) out.push(list[i]);
      });
      return out;
    }

    var CSS = ""
      + ".visit-pop{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;background:rgba(3,43,32,.6);font-family:inherit;color:#032B20}"
      + "dialog.visit-pop{width:100%;height:100%;max-width:none;max-height:none;margin:0;border:0;overflow:auto}"
      + "dialog.visit-pop::backdrop{background:rgba(3,43,32,.6)}"
      + ".visit-pop--stacked{background:transparent}"
      + "dialog.visit-pop--stacked::backdrop{background:transparent}"
      + "dialog.visit-pop{background:transparent}"
      + ".visit-pop__panel{position:relative;width:min(420px,calc(100vw - 32px));max-height:calc(100vh - 32px);overflow:auto;box-sizing:border-box;border:1px solid #B5853A;border-radius:16px;background:#F7F3EA;color:#032B20;text-align:left;font-family:inherit;animation:visitPopIn .25s ease-out both}"
      + ".visit-pop__panel *{box-sizing:border-box}"
      + ".visit-pop__band{margin:0;padding:10px 18px;background:#032B20;color:#E2B565;font-size:13px;line-height:1.4;font-weight:700}"
      + ".visit-pop__body{padding:16px 18px 10px}"
      + ".visit-pop__title{margin:0;font-size:38px;line-height:1.15;font-weight:700;letter-spacing:-.03em;color:#032B20}"
      + ".visit-pop__desc{margin:10px 0 0;font-size:16px;line-height:1.5;color:#032B20}"
      + ".visit-pop__loc{margin:10px 0 0;font-size:15px;line-height:1.45;font-weight:700;color:#032B20}"
      + ".visit-pop__loc span{margin-right:8px}"
      + ".visit-pop__go,.visit-pop__tel{display:flex;align-items:center;justify-content:center;width:100%;border-radius:8px;text-decoration:none;font-family:inherit;cursor:pointer}"
      + ".visit-pop__go{margin-top:14px;height:50px;border:0;background:#032B20;color:#fff;font-size:16px;font-weight:700}"
      + ".visit-pop__tel{margin-top:8px;height:44px;border:1px solid #032B20;background:transparent;color:#032B20;font-size:15px;font-weight:700}"
      + ".visit-pop__note{margin:6px 0 0;font-size:12px;line-height:1.45;color:rgba(3,43,32,.7)}"
      + ".visit-pop__note:first-of-type{margin-top:12px}"
      + ".visit-pop__foot{display:flex;justify-content:space-between;gap:8px;padding:4px 18px 8px;border-top:1px solid rgba(181,133,58,.45)}"
      + ".visit-pop__foot button{min-height:40px;padding:0;border:0;background:transparent;color:#032B20;font-family:inherit;font-size:13px;cursor:pointer}"
      + "@media(max-width:767px){.visit-pop__title{font-size:32px}.visit-pop__desc{font-size:15px}.visit-pop__loc{font-size:14px}.visit-pop__note{font-size:11.5px}}"
      + "@keyframes visitPopIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}"
      + "@media(prefers-reduced-motion:reduce){.visit-pop__panel{animation:none}}";

    function css() {
      if (document.getElementById("visit-pop-style")) return;
      var s = document.createElement("style"); s.id = "visit-pop-style"; s.textContent = CSS;
      document.head.appendChild(s);
    }
    function build() {
      var p = document.createElement("div");
      p.className = "visit-pop__panel";
      p.setAttribute("role", "dialog");
      p.setAttribute("aria-modal", "true");
      p.setAttribute("aria-labelledby", "visit-pop-title");
      p.innerHTML = ""
        + '<p class="visit-pop__band">청라 아크원 푸르지오 · 견본주택 방문예약</p>'
        + '<div class="visit-pop__body">'
        + '<h2 id="visit-pop-title" class="visit-pop__title">모델하우스 방문예약</h2>'
        + '<p class="visit-pop__desc">사전고객등록과 함께 방문 희망 날짜를 남겨 주시면, 담당자가 확인 후 방문 시간을 안내해 드립니다.</p>'
        + '<p class="visit-pop__loc"><span>견본주택 위치</span>인천광역시 서해구 청라동 87-1</p>'
        + '<a class="visit-pop__go" href="' + cfg.register + '?visit=1#visit">방문 날짜 선택하고 예약하기</a>'
        + '<a class="visit-pop__tel" href="' + (cfg.tel || "tel:15339014") + '">전화 예약 ' + (cfg.phone || "1533-9014") + '</a>'
        + '<p class="visit-pop__note">※ 방문예약 신청은 담당자 확인 후 확정됩니다. 희망 일정이 어려운 경우 다른 일정으로 안내드릴 수 있습니다.</p>'
        + '<p class="visit-pop__note">※ 견본주택 운영 일정은 사업주체 사정에 따라 변경될 수 있습니다.</p>'
        + '<p class="visit-pop__note">※ 방문예약은 청약 신청이 아니며, 청약 자격·순위와 관계없습니다.</p>'
        + '</div>'
        + '<div class="visit-pop__foot"><button type="button" data-visit-today="1">오늘 하루 보지 않기</button><button type="button" data-visit-close="1" aria-label="닫기">닫기</button></div>';
      return p;
    }
    function focusables() {
      return panel ? Array.prototype.slice.call(panel.querySelectorAll("a[href], button")) : [];
    }
    function onKey(e) {
      if (!root) return;
      if (e.key === "Escape") { e.preventDefault(); e.stopImmediatePropagation(); close(false); return; }
      if (e.key !== "Tab") return;
      var items = focusables(); if (!items.length) return;
      e.preventDefault(); e.stopImmediatePropagation();
      var i = items.indexOf(document.activeElement);
      var n = e.shiftKey ? (i <= 0 ? items.length - 1 : i - 1) : (i < 0 || i === items.length - 1 ? 0 : i + 1);
      items[n].focus();
    }
    function onFocusIn(e) {
      if (!panel || panel.contains(e.target)) return;
      var go = panel.querySelector(".visit-pop__go"); if (go) go.focus();
    }
    function tick() {
      if (!root) return;
      var ex = openExisting();
      root.classList.toggle("visit-pop--stacked", ex.length > 0);
      if (useDialog) {
        // 기존 <dialog> 가 이 팝업보다 늦게 열리면 그쪽이 맨 위가 된다. 다시 열어 맨 위로 올린다(기존 dialog 는 건드리지 않음).
        var fresh = ex.some(function (el) { return el.tagName === "DIALOG" && seen.indexOf(el) < 0; });
        seen = ex.slice();
        if (fresh && root.open) { root.close(); root.showModal(); var go = panel.querySelector(".visit-pop__go"); if (go) go.focus(); }
      }
    }
    function close(today) {
      if (today) { try { localStorage.setItem(VISIT_HIDE_KEY, String(nextKstMidnight())); } catch (e) {} }
      if (!root) return;
      window.removeEventListener("keydown", onKey, true);
      document.removeEventListener("focusin", onFocusIn, true);
      if (watch) { window.clearInterval(watch); watch = 0; }
      if (useDialog && root.open) { try { root.close(); } catch (e) {} }
      if (root.parentNode) root.parentNode.removeChild(root);
      root = null; panel = null;
      if (prevFocus && prevFocus.isConnected && prevFocus.focus && prevFocus !== document.body) { try { prevFocus.focus(); } catch (e) {} }
    }
    function open() {
      if (dead || root || hidden() || skip()) return;
      css();
      prevFocus = document.activeElement;
      root = document.createElement(useDialog ? "dialog" : "div");
      root.className = "visit-pop";
      root.style.zIndex = String(cfg.z || 1102);
      panel = build();
      root.appendChild(panel);
      root.addEventListener("click", function (e) {
        var t = e.target;
        if (t === root) { close(false); return; }
        if (!t || !t.closest) return;
        if (t.closest(".visit-pop__go")) {
          e.preventDefault(); e.stopPropagation();
          close(false);
          location.assign(cfg.register + "?visit=1#visit");
          return;
        }
        if (t.closest("[data-visit-today]")) { e.stopPropagation(); close(true); }
        else if (t.closest("[data-visit-close]")) { e.stopPropagation(); close(false); }
      });
      if (useDialog) root.addEventListener("cancel", function (e) { e.preventDefault(); close(false); });
      document.body.appendChild(root);
      if (useDialog) root.showModal();
      seen = openExisting();
      tick();
      window.addEventListener("keydown", onKey, true);
      if (!useDialog) document.addEventListener("focusin", onFocusIn, true);
      watch = window.setInterval(tick, 300);
      var go = panel.querySelector(".visit-pop__go"); if (go) go.focus();
    }
    function whenReady(fn) {
      // 인트로가 도는 동안에는 띄우지 않는다(official-main 의 data-om-intro / om:intro-done, 또는 사이트 인트로 요소).
      var t0 = Date.now();
      function step() {
        if (dead) return;
        var busy = document.documentElement.hasAttribute("data-om-intro") || (cfg.intro && document.querySelector(cfg.intro));
        if (busy && Date.now() - t0 < 20000) { later(step, 200); return; }
        later(fn, cfg.delay || 0);
      }
      step();
    }
    if (skip() || hidden()) return function stop() { dead = true; };
    visitConfig().then(function (d) { if (d && !dead) whenReady(open); });
    return function stop() { dead = true; timers.forEach(function (t) { window.clearTimeout(t); }); close(false); };
  }

export function VisitReservationPopupView() {
  useEffect(() => {
    const w = window;
    return startVisitPopup({
      phone: w.__arkoneVisitPhone || "1533-9014",
      tel: w.__arkoneVisitTel || "tel:15339014",
      register: "/register",
      existing: ['[aria-labelledby="apt-event-pop-title"]', ".costco-pop"],
      delay: 300,
      z: 52,
    });
  }, []);
  return null;
}
