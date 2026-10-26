/* 견본주택 오픈 이벤트 팝업 (작업지시서 14)
   방문예약 팝업(visit-pop)과 같은 자리·크기·정렬. 방문예약 팝업 파일은 남기고 이 팝업만 띄운다.
   설정: window.ARKONE_EVENT_POP = { phone, tel, days, cards, dialog, delay, z, intro, register, visit, event }
   days 는 사이트 설정 EVENT_DAYS 한 곳에서 넣어 준다. */
(function () {
  var HIDE_KEY = "arkone_event_pop_hide_until";
  var PHASE_URL = "https://jzmktahlrwtrtejjflrw.supabase.co/functions/v1/arkone-site-phase";
  var started = false;

  function norm(path) {
    var p = (path || "/").replace(/\/index\.html$/, "/").replace(/\.html$/, "");
    if (p.length > 1 && p.charAt(p.length - 1) === "/") p = p.slice(0, -1);
    return p || "/";
  }
  function nextKstMidnight() {
    var d = new Date(Date.now() + 9 * 3600000);
    return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1) - 9 * 3600000;
  }
  function hidden() {
    try { var u = localStorage.getItem(HIDE_KEY); return !!(u && Date.now() < Number(u)); } catch (e) { return false; }
  }
  function skip(cfg) {
    var p = norm(location.pathname);
    return p === "/register" || p === norm(cfg.register || "/register") || p === "/visit" || p === norm(cfg.visit || "/visit") || p === "/event" || p === norm(cfg.event || "/event") || p === "/privacy" || p === "/terms" || p === "/agreement" || p === "/policy";
  }
  function previewPhase() {
    if (!/\.vercel\.app$/.test(location.hostname)) return null;
    var m = /[?&]phase_preview=([0-5])(?:&|$)/.exec(location.search);
    return m ? Number(m[1]) : null;
  }
  function openByDate() {
    var d = new Date(Date.now() + 9 * 3600000);
    var y = d.getUTCFullYear(), m = d.getUTCMonth() + 1, day = d.getUTCDate();
    if (y < 2026) return true;
    if (y > 2026) return false;
    if (m < 11) return true;
    if (m > 11) return false;
    return day <= 1;
  }
  function loadPhase() {
    var pv = previewPhase();
    if (pv !== null) return Promise.resolve(pv);
    if (!window.fetch) return Promise.resolve(null);
    var ctl = typeof AbortController === "function" ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 3000);
    return fetch(PHASE_URL, { cache: "no-store", signal: ctl ? ctl.signal : undefined })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        var n = Number(j && j.phase);
        return (n >= 0 && n <= 5 && n === Math.floor(n)) ? n : null;
      })
      .catch(function () { return null; })
      .then(function (n) { clearTimeout(timer); return n; });
  }

  function start(cfg) {
    cfg = cfg || window.ARKONE_EVENT_POP || {};
    if (skip(cfg) || hidden()) return function () {};
    var GAP = 16;
    var dead = false, closed = false, timers = [], mode = "", root = null, panel = null, prevFocus = null, watch = 0, focused = false, variant = "open";
    var shifts = [];
    var useDialog = !!cfg.dialog && typeof HTMLDialogElement === "function" && typeof HTMLDialogElement.prototype.showModal === "function";
    var days = Array.isArray(cfg.days) && cfg.days.length >= 3 ? cfg.days : [];
    var phone = cfg.phone || "";
    var tel = cfg.tel || (phone ? "tel:" + String(phone).replace(/\D/g, "") : "");
    function later(fn, ms) { var t = window.setTimeout(fn, ms); timers.push(t); return t; }
    function cards() {
      var out = [];
      (cfg.cards || [".prereg-pop__panel", ".costco-pop__panel"]).forEach(function (sel) {
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
      + ".oe-pop{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;background:rgba(3,43,32,.6);font-family:inherit;color:#032B20}"
      + "dialog.oe-pop{width:100%;height:100%;max-width:none;max-height:none;margin:0;border:0;overflow:auto;background:transparent}"
      + "dialog.oe-pop::backdrop{background:rgba(3,43,32,.6)}"
      + ".oe-pop--side{background:transparent;pointer-events:none}"
      + ".oe-pop--side .oe-pop__panel,.oe-pop__panel.oe-pop__panel--side{position:absolute;pointer-events:auto;margin:0}"
      + ".oe-pop__panel{position:relative;width:min(420px,calc(100vw - 32px));max-height:calc(100vh - 32px);overflow:auto;box-sizing:border-box;border:1px solid #B5853A;border-radius:16px;background:#F7F3EA;color:#032B20;text-align:left;font-family:inherit;animation:oePopIn .25s ease-out both}"
      + ".oe-pop__panel *{box-sizing:border-box}"
      + ".oe-pop__band{display:flex;align-items:center;height:36px;margin:0;padding:0 18px;background:#032B20;color:#E2B565;font-size:12px;line-height:1.2;font-weight:700}"
      + ".oe-pop__body{padding:12px 18px 8px}"
      + ".oe-pop__chip{display:inline-flex;align-items:center;height:26px;margin:0 0 10px;padding:0 12px;border:1px solid #B5853A;border-radius:999px;color:#032B20;font-size:13px;font-weight:700;line-height:1}"
      + ".oe-pop__title{margin:0;font-size:34px;line-height:1.2;font-weight:700;letter-spacing:-.03em;color:#032B20}"
      + ".oe-pop__list{list-style:none;margin:12px 0 0;padding:0}"
      + ".oe-pop__list li{display:flex;align-items:flex-start;gap:10px;margin:0 0 12px}"
      + ".oe-pop__list li:last-child{margin-bottom:0}"
      + ".oe-pop__n{flex:0 0 22px;width:22px;height:22px;border-radius:50%;background:#032B20;color:#fff;font-size:12px;font-weight:700;line-height:22px;text-align:center}"
      + ".oe-pop__list b{display:block;font-size:16px;line-height:1.35;font-weight:700}"
      + ".oe-pop__list small{display:block;margin-top:2px;font-size:13px;line-height:1.4;font-weight:400;color:rgba(3,43,32,.7)}"
      + ".oe-pop__rule{height:0;margin:14px 0;border:0;border-top:1px solid rgba(3,43,32,.12)}"
      + ".oe-pop__go,.oe-pop__sub{display:flex;align-items:center;justify-content:center;width:100%;border-radius:10px;text-decoration:none;font-family:inherit;cursor:pointer;font-weight:700}"
      + ".oe-pop__go{height:50px;border:0;background:#032B20;color:#fff;font-size:16px}"
      + ".oe-pop__sub{margin-top:8px;height:44px;border:1px solid #032B20;background:transparent;color:#032B20;font-size:15px;border-radius:10px}"
      + ".oe-pop__note{margin:6px 0 0;font-size:12px;line-height:1.45;color:rgba(3,43,32,.7)}"
      + ".oe-pop__note:first-of-type{margin-top:10px}"
      + ".oe-pop__foot{display:flex;justify-content:space-between;gap:8px;padding:4px 18px 8px;border-top:1px solid rgba(181,133,58,.45)}"
      + ".oe-pop__foot button{min-height:40px;padding:0;border:0;background:transparent;color:#032B20;font-family:inherit;font-size:13px;cursor:pointer}"
      + "@media(max-width:767px){.oe-pop__title{font-size:30px}.oe-pop__list b{font-size:16px}.oe-pop__note{font-size:11.5px}.oe-pop__body{padding:10px 14px 6px}.oe-pop__band{padding:0 14px}}"
      + "@keyframes oePopIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}"
      + "@media(prefers-reduced-motion:reduce){.oe-pop__panel{animation:none}}";

    function css() {
      if (document.getElementById("oe-pop-style")) return;
      var s = document.createElement("style"); s.id = "oe-pop-style"; s.textContent = CSS;
      document.head.appendChild(s);
    }
    function row(n, title, sub) {
      return '<li><span class="oe-pop__n">' + n + '</span><span><b>' + title + '</b><small>' + sub + '</small></span></li>';
    }
    function build() {
      var p = document.createElement("div");
      p.className = "oe-pop__panel";
      p.setAttribute("role", "dialog");
      p.setAttribute("aria-modal", "true");
      p.setAttribute("aria-labelledby", "oe-pop-title");
      var chip = days.length >= 3 ? '<p class="oe-pop__chip">' + days[0] + " ~ " + days[2] + "</p>" : "";
      var openHtml = ""
        + '<p class="oe-pop__band">청라 아크원 푸르지오 · 견본주택 GRAND OPEN</p>'
        + '<div class="oe-pop__body">'
        + chip
        + '<h2 id="oe-pop-title" class="oe-pop__title">견본주택 오픈 3일 이벤트</h2>'
        + '<ul class="oe-pop__list">'
        + row("1", "방문 고객 선착순 사은품", "일차별 300명")
        + row("2", "매일 16시 경품 추첨", "1등 LG 트롬 세탁기 · LG 디오스 인덕션 · 아이패드 에어")
        + row("3", "상담 고객 GS 선택형 쿠폰", "일차별 선착순 500명")
        + "</ul>"
        + '<hr class="oe-pop__rule">'
        + '<a class="oe-pop__go" href="/event">이벤트 자세히 보기</a>'
        + '<a class="oe-pop__sub" href="/visit">방문예약</a>'
        + '<p class="oe-pop__note">※ 선착순 사은품은 일차별 수량 소진 시 종료됩니다.</p>'
        + '<p class="oe-pop__note">※ 견본주택 현장 이벤트로, 홈페이지 사전고객등록 이벤트와는 별개입니다.</p>'
        + "</div>";
      var afterHtml = ""
        + '<p class="oe-pop__band">청라 아크원 푸르지오 · 청약·당첨 고객 이벤트</p>'
        + '<div class="oe-pop__body">'
        + '<h2 id="oe-pop-title" class="oe-pop__title">청약·당첨 고객 이벤트</h2>'
        + '<ul class="oe-pop__list">'
        + row("1", "청약 인증 고객", "코스트코 골드스타 연간 회원권 (수량 한정)")
        + row("2", "당첨자 서류접수 고객", "현대명품 금쌀")
        + "</ul>"
        + '<hr class="oe-pop__rule">'
        + '<a class="oe-pop__go" href="/event#after">이벤트 자세히 보기</a>'
        + '<a class="oe-pop__sub" href="' + (tel || "#") + '">전화 문의 ' + phone + "</a>"
        + '<p class="oe-pop__note">※ 인증 기간: 당첨자 서류접수 기간 11.12(목)~11.16(월) · 인증 방법은 견본주택에서 안내합니다.</p>'
        + '<p class="oe-pop__note">※ 견본주택 현장 이벤트로, 홈페이지 사전고객등록 이벤트와는 별개입니다.</p>'
        + "</div>";
      p.innerHTML = (variant === "after" ? afterHtml : openHtml)
        + '<div class="oe-pop__foot"><button type="button" data-oe-today="1">오늘 하루 보지 않기</button><button type="button" data-oe-close="1" aria-label="닫기">닫기</button></div>';
      return p;
    }
    function shiftOf(el) {
      for (var i = 0; i < shifts.length; i++) if (shifts[i].el === el) return shifts[i];
      var s = { el: el, base: el.style.transform || "", wrote: null, dx: 0 };
      shifts.push(s); return s;
    }
    function setShift(el, dx) {
      var s = shiftOf(el);
      if (s.wrote !== null && el.style.transform !== s.wrote) { s.base = el.style.transform || ""; s.dx = 0; }
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
      var go = panel.querySelector(".oe-pop__go"); if (go) go.focus({ preventScroll: true });
    }
    function soloPad() {
      if (window.innerWidth >= 768) return 16;
      var band = document.querySelector(".ak-phase-band");
      if (!band) return 16;
      var b = band.getBoundingClientRect().bottom;
      return b > 8 ? Math.round(b + 8) : 16;
    }
    function toSolo() {
      detach(); clearShifts();
      root = document.createElement(useDialog ? "dialog" : "div");
      root.className = "oe-pop";
      root.style.zIndex = String(cfg.z || 1102);
      if (window.innerWidth < 768) {
        root.style.alignItems = "flex-start";
        root.style.paddingTop = soloPad() + "px";
      }
      panel.className = "oe-pop__panel";
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
        if (!root || root.className.indexOf("oe-pop--side") < 0) {
          detach();
          root = document.createElement("div");
          root.className = "oe-pop oe-pop--side";
          root.style.zIndex = String(cfg.z || 1102);
          document.body.appendChild(root);
        }
        host = root;
      } else if (root) { detach(); }
      panel.className = "oe-pop__panel oe-pop__panel--side";
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
      if (!isFinite(top)) top = 16;
      top = Math.max(16, top);
      panel.style.maxHeight = Math.max(240, window.innerHeight - top - 16) + "px";
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
      var go = panel.querySelector(".oe-pop__go"); if (go) go.focus();
    }
    function close(today) {
      if (today) { try { localStorage.setItem(HIDE_KEY, String(nextKstMidnight())); } catch (e) {} }
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
      if (dead || panel || hidden() || skip(cfg)) return;
      css();
      prevFocus = document.activeElement;
      panel = build();
      panel.addEventListener("click", function (e) {
        var t = e.target;
        if (!t || !t.closest) return;
        var go = t.closest(".oe-pop__go");
        var sub = t.closest(".oe-pop__sub");
        if (go) {
          e.preventDefault(); e.stopPropagation();
          var href = go.getAttribute("href") || "/event";
          close(false);
          location.assign(href);
          return;
        }
        if (sub && sub.getAttribute("href") && sub.getAttribute("href").charAt(0) === "/") {
          e.preventDefault(); e.stopPropagation();
          var vh = sub.getAttribute("href");
          close(false);
          location.assign(vh);
          return;
        }
        if (t.closest("[data-oe-today]")) { e.stopPropagation(); close(true); }
        else if (t.closest("[data-oe-close]")) { e.stopPropagation(); close(false); }
      });
      window.addEventListener("keydown", onKey, true);
      window.addEventListener("resize", tick);
      tick();
      watch = window.setInterval(tick, 250);
    }
    function whenReady(fn) {
      var t0 = Date.now();
      function step() {
        if (dead) return;
        var busy = document.documentElement.hasAttribute("data-om-intro") || (cfg.intro && document.querySelector(cfg.intro));
        if (busy && Date.now() - t0 < 20000) { later(step, 200); return; }
        later(fn, cfg.delay || 0);
      }
      step();
    }
    loadPhase().then(function (ph) {
      if (dead) return;
      if (ph === null) variant = openByDate() ? "open" : "after";
      else if (ph === 5) return;
      else if (ph >= 2) variant = "after";
      else variant = "open";
      whenReady(open);
    });
    return function stop() { dead = true; timers.forEach(function (t) { window.clearTimeout(t); }); close(false); };
  }

  function boot() {
    if (started) return;
    started = true;
    start(window.ARKONE_EVENT_POP || {});
  }
  window.ArkoneOpenEvent = { start: function () { started = false; boot(); } };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
