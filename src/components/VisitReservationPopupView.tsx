// @ts-nocheck
// 모델하우스 방문예약 팝업 (작업지시서 9) — 기존 팝업 2종과 겹치지 않게 배치하는 신규 팝업. 기존 팝업 파일은 바꾸지 않는다.
import { useEffect } from "react";

  /* 모델하우스 방문예약 팝업 (작업지시서 9, 2026-10-19)
     - arkone-visit-config 의 enabled=true 일 때만 띄운다(호출 실패 시 띄우지 않음 = 공개 스위치 겸 비상 정지).
     - 기존 팝업 2종(30만원·코스트코)은 선택자로 열림 여부만 읽는다. 그 파일·문구·저장 키는 건드리지 않는다.
     - 겹치지 않게 배치(PM 지시 2026-10-19): 기존 팝업이 열려 있고 화면 폭이 넉넉하면(PC) 기존 카드들과 한 줄로 나란히,
       폭이 모자라면(휴대폰·좁은 PC) 기존 팝업이 모두 닫힌 뒤에 띄운다. 나란히 놓는 동안만 기존 카드 위치(transform)를
       잠시 옮기고 닫히면 되돌린다. 기존이 모달 <dialog> 면 그 안에 카드를 붙인다(코스트코 팝업과 같은 방식).
     - 혼자 뜰 때: z-index = 기존 두 팝업 중 큰 값 + 1, 기존이 <dialog> 인 사이트는 이것도 <dialog>(top layer).
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
    var GAP = 16; // 작업지시서 13: 팝업 간격 16px
    var dead = false, closed = false, timers = [], mode = "", root = null, panel = null, prevFocus = null, watch = 0, focused = false;
    var shifts = [];
    var useDialog = !!cfg.dialog && typeof HTMLDialogElement === "function" && typeof HTMLDialogElement.prototype.showModal === "function";
    function later(fn, ms) { var t = window.setTimeout(fn, ms); timers.push(t); return t; }
    function norm(path) {
      var p = (path || "/").replace(/\/index\.html$/, "/").replace(/\.html$/, "");
      if (p.length > 1 && p.charAt(p.length - 1) === "/") p = p.slice(0, -1);
      return p || "/";
    }
    function skip() {
      var p = norm(location.pathname);
      return p === norm(cfg.register) || p === "/register" || p === norm(cfg.visit || "/visit") || p === "/privacy" || p === "/terms" || p === "/agreement" || p === "/policy";
    }
    function hidden() {
      try { var u = localStorage.getItem(VISIT_HIDE_KEY); return !!(u && Date.now() < Number(u)); } catch (e) { return false; }
    }
    function nextKstMidnight() {
      var d = new Date(Date.now() + 9 * 3600000);
      return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1) - 9 * 3600000;
    }
    // 지금 화면에 보이는 기존 팝업 카드(읽기만)
    function cards() {
      var out = [];
      (cfg.cards || []).forEach(function (sel) {
        var list = document.querySelectorAll(sel);
        for (var i = 0; i < list.length; i++) {
          var el = list[i];
          if (!el.isConnected || (panel && (el === panel || panel.contains(el)))) continue;
          var dlg = el.closest ? el.closest("dialog") : null;
          if (dlg && !dlg.open) continue;
          var r = el.getBoundingClientRect();
          if (r.width < 2 || r.height < 2) continue;
          try { var s = window.getComputedStyle(el); if (s.visibility === "hidden" || s.display === "none") continue; } catch (e) {}
          if (out.indexOf(el) < 0) out.push(el);
        }
      });
      return out;
    }
    var CSS = ""
      + ".visit-pop{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;background:rgba(3,43,32,.6);font-family:inherit;color:#032B20}"
      + "dialog.visit-pop{width:100%;height:100%;max-width:none;max-height:none;margin:0;border:0;overflow:auto}"
      + "dialog.visit-pop::backdrop{background:rgba(3,43,32,.6)}"
      + ".visit-pop--side{background:transparent;pointer-events:none}"
      + ".visit-pop--side .visit-pop__panel,.visit-pop__panel--side{position:absolute;pointer-events:auto;margin:0}"
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
        + '<p class="visit-pop__desc">방문 희망 날짜를 남겨 주시면, 담당자가 확인 후 방문 시간을 안내해 드립니다.</p>'
        + '<p class="visit-pop__loc"><span>견본주택 위치</span>인천광역시 서해구 청라동 87-1</p>'
        + '<p class="visit-pop__loc"><span>운영 기간</span>10.30(금) · 10.31(토) · 11.01(일) 3일간</p>'
        + '<a class="visit-pop__go" href="' + (cfg.visit || "/visit") + '">방문 날짜 선택하고 예약하기</a>'
        + '<a class="visit-pop__tel" href="' + (cfg.tel || "tel:15339014") + '">전화 예약 ' + (cfg.phone || "1533-9014") + '</a>'
        + '<p class="visit-pop__note">※ 방문예약 신청은 담당자 확인 후 확정됩니다. 희망 일정이 어려운 경우 다른 일정으로 안내드릴 수 있습니다.</p>'
        + '<p class="visit-pop__note">※ 견본주택 운영 일정은 사업주체 사정에 따라 변경될 수 있습니다.</p>'
        + '<p class="visit-pop__note">※ 방문예약은 청약 신청이 아니며, 청약 자격·순위와 관계없습니다.</p>'
        + '</div>'
        + '<div class="visit-pop__foot"><button type="button" data-visit-today="1">오늘 하루 보지 않기</button><button type="button" data-visit-close="1" aria-label="닫기">닫기</button></div>';
      return p;
    }
    function shiftOf(el) {
      for (var i = 0; i < shifts.length; i++) if (shifts[i].el === el) return shifts[i];
      var s = { el: el, base: el.style.transform || "", wrote: null, dx: 0 };
      shifts.push(s); return s;
    }
    function setShift(el, dx) {
      var s = shiftOf(el);
      if (s.wrote !== null && el.style.transform !== s.wrote) { s.base = el.style.transform || ""; s.dx = 0; } // 다른 코드가 바꿨으면 그 값을 기준으로
      dx = Math.round(dx);
      var v = dx ? (s.base ? s.base + " " : "") + "translateX(" + dx + "px)" : s.base;
      if (el.style.transform !== v) el.style.transform = v;
      s.wrote = el.style.transform; s.dx = dx;
    }
    function naturalLeft(el) {
      var s = shiftOf(el);
      var cur = s.wrote !== null && el.style.transform === s.wrote ? s.dx : 0;
      return el.getBoundingClientRect().left - cur;
    }
    function clearShifts() {
      shifts.forEach(function (s) { if (s.wrote !== null && s.el.style.transform === s.wrote) s.el.style.transform = s.base; });
      shifts = [];
    }
    function panelWidth() { return Math.min(420, window.innerWidth - 32); }
    function fits(cs) {
      if (window.innerWidth < 768) return false;
      var total = panelWidth();
      cs.forEach(function (el) { total += el.getBoundingClientRect().width + GAP; });
      return total + 32 <= window.innerWidth;
    }
    function detach() {
      if (panel && panel.parentNode) panel.parentNode.removeChild(panel);
      if (root) { if (useDialog && root.open) { try { root.close(); } catch (e) {} } if (root.parentNode) root.parentNode.removeChild(root); root = null; }
      document.removeEventListener("focusin", onFocusIn, true);
    }
    function focusGo() {
      if (focused || !panel) return;
      focused = true;
      var go = panel.querySelector(".visit-pop__go"); if (go) go.focus({ preventScroll: true });
    }
    function toSolo() {
      detach(); clearShifts();
      root = document.createElement(useDialog ? "dialog" : "div");
      root.className = "visit-pop";
      root.style.zIndex = String(cfg.z || 1102);
      panel.className = "visit-pop__panel";
      panel.style.left = ""; panel.style.top = ""; panel.style.width = "";
      root.appendChild(panel);
      root.addEventListener("click", function (e) { if (e.target === root) close(false); });
      if (useDialog) root.addEventListener("cancel", function (e) { e.preventDefault(); close(false); });
      document.body.appendChild(root);
      if (useDialog) root.showModal(); else document.addEventListener("focusin", onFocusIn, true);
      mode = "solo"; focused = false; focusGo();
    }
    function toWait() { detach(); clearShifts(); mode = "wait"; }
    function toSide(cs) {
      var dlg = null;
      for (var i = 0; i < cs.length; i++) { var d = cs[i].closest ? cs[i].closest("dialog") : null; if (d && d.open) { dlg = d; break; } }
      var host = dlg;
      if (!host) {
        if (!root || root.className.indexOf("visit-pop--side") < 0) {
          detach();
          root = document.createElement("div");
          root.className = "visit-pop visit-pop--side";
          root.style.zIndex = String(cfg.z || 1102);
          document.body.appendChild(root);
        }
        host = root;
      } else if (root) { detach(); }
      panel.className = "visit-pop__panel visit-pop__panel--side";
      if (panel.parentNode !== host) host.appendChild(panel);
      mode = "side"; focusGo();
      return host;
    }
    function arrange(cs, host) {
      var list = cs.map(function (el) { return { el: el, left: naturalLeft(el), r: el.getBoundingClientRect() }; });
      list.sort(function (a, b) { return a.left - b.left; });
      var pw = panelWidth(), total = pw;
      list.forEach(function (c) { total += c.r.width + GAP; });
      var x = Math.round((window.innerWidth - total) / 2), top = Infinity;
      list.forEach(function (c) { setShift(c.el, x - c.left); x += c.r.width + GAP; top = Math.min(top, c.r.top); });
      panel.style.width = pw + "px";
      var ph = panel.offsetHeight || 460;
      top = Math.max(16, Math.min(top, window.innerHeight - ph - 16));
      var hr = host === root ? { left: 0, top: 0 } : host.getBoundingClientRect();
      var bl = host === root ? 0 : (host.clientLeft || 0), bt = host === root ? 0 : (host.clientTop || 0);
      panel.style.left = Math.round(x - hr.left - bl) + "px";
      panel.style.top = Math.round(top - hr.top - bt) + "px";
    }
    function tick() {
      if (dead || closed || !panel) return;
      var cs = cards();
      if (!cs.length) { if (mode !== "solo" || !panel.isConnected) toSolo(); return; }
      if (!fits(cs)) { if (mode !== "wait") toWait(); return; }
      var host = toSide(cs);
      arrange(cs, host);
    }
    function focusables() {
      return panel ? Array.prototype.slice.call(panel.querySelectorAll("a[href], button")) : [];
    }
    function onKey(e) {
      if (!panel || mode === "wait" || !panel.isConnected) return;
      if (e.key === "Escape") { e.preventDefault(); e.stopImmediatePropagation(); close(false); return; }
      if (e.key !== "Tab" || mode !== "solo") return;
      var items = focusables(); if (!items.length) return;
      e.preventDefault(); e.stopImmediatePropagation();
      var i = items.indexOf(document.activeElement);
      var n = e.shiftKey ? (i <= 0 ? items.length - 1 : i - 1) : (i < 0 || i === items.length - 1 ? 0 : i + 1);
      items[n].focus();
    }
    function onFocusIn(e) {
      if (mode !== "solo" || !panel || panel.contains(e.target)) return;
      var go = panel.querySelector(".visit-pop__go"); if (go) go.focus();
    }
    function close(today) {
      if (today) { try { localStorage.setItem(VISIT_HIDE_KEY, String(nextKstMidnight())); } catch (e) {} }
      if (closed) return;
      closed = true;
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("resize", tick);
      if (watch) { window.clearInterval(watch); watch = 0; }
      detach(); clearShifts();
      panel = null; mode = "closed";
      if (prevFocus && prevFocus.isConnected && prevFocus.focus && prevFocus !== document.body) { try { prevFocus.focus({ preventScroll: true }); } catch (e) {} }
    }
    function open() {
      if (dead || panel || hidden() || skip()) return;
      css();
      prevFocus = document.activeElement;
      panel = build();
      panel.addEventListener("click", function (e) {
        var t = e.target;
        if (!t || !t.closest) return;
        if (t.closest(".visit-pop__go")) {
          e.preventDefault(); e.stopPropagation();
          close(false);
          location.assign(cfg.visit || "/visit");
          return;
        }
        if (t.closest("[data-visit-today]")) { e.stopPropagation(); close(true); }
        else if (t.closest("[data-visit-close]")) { e.stopPropagation(); close(false); }
      });
      window.addEventListener("keydown", onKey, true);
      window.addEventListener("resize", tick);
      tick();
      watch = window.setInterval(tick, 250);
    }
    function whenReady(fn) {
      // 인트로가 도는 동안에는 띄우지 않는다(official-main 의 data-om-intro / om:intro-done, 또는 사이트 인트로 요소).
      // 기존 팝업들이 자리를 잡은 뒤(cfg.delay) 배치를 정한다.
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
      cards: [".prereg-pop__panel", ".costco-pop__panel"],
      visit: "/visit",
      delay: 2600,
      z: 1102,
    });
  }, []);
  return null;
}
