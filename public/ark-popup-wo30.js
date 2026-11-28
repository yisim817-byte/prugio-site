/* 작업지시서 31 · 직원 팝업 5장. 번호·방문 연결만 data-phone / data-visit. 파일은 두고 예전 .otp 는 렌더하지 않는다. */
(function () {
  "use strict";
  if (window.__akpWO30) return;
  window.__akpWO30 = 1;

  var s = document.currentScript || document.querySelector("script[src*='ark-popup-wo30']");
  var PHONE = (s && s.getAttribute("data-phone")) || "";
  var DIGITS = String(PHONE).replace(/\D/g, "");
  var TEL = "tel:" + DIGITS;
  var VISIT = (s && s.getAttribute("data-visit")) === "on";
  var GO = VISIT ? "/visit" : TEL;
  var C1 = VISIT ? "방문예약 안내 보기" : "전화로 방문고객등록";
  var C3 = VISIT ? "방문예약 안내 보기" : "전화로 방문예약";

  function path() {
    var p = location.pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
    if (p.length > 1 && p.charAt(p.length - 1) === "/") p = p.slice(0, -1);
    return p || "/";
  }
  if (/^\/(register|visit|privacy|admin)(\/|$)/.test(path())) return;

  function past(y, m, d, hh, mm, ss) {
    return Date.now() > Date.UTC(y, m - 1, d, hh - 9, mm, ss);
  }
  try {
    var until = Number(localStorage.getItem("akp_wo30_hide_until") || 0);
    if (until && Date.now() < until) return;
  } catch (e) {}

  var LOGO = '<img class="logo" src="/official/soon/logo.svg" alt="PRUGIO">';
  var cards = [];
  if (!past(2026, 12, 5, 23, 59, 59)) {
    cards.push(
      '<a class="card c1" href="' + GO + '">' + LOGO +
      '<p class="k">청라 아크원 푸르지오</p><p class="h">방문 고객 이벤트</p>' +
      '<svg class="cup" viewBox="0 0 64 64" fill="none" stroke="#e8c98f" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 22h30l-3 30a4 4 0 0 1-4 3.6H21a4 4 0 0 1-4-3.6z"/><path d="M44 28h4a6 6 0 0 1 0 12h-5"/><path d="M22 8c0 4 4 4 4 8M30 8c0 4 4 4 4 8"/></svg>' +
      '<p class="sub">스타벅스 커피 쿠폰 증정</p><span class="chip">~ 12월 5일(토)까지</span>' +
      '<div class="tbl"><div class="tr"><b class="c-sand">STEP 1</b><span>전화로 방문고객등록</span></div>' +
      '<div class="tr"><b class="c-mint">STEP 2</b><span>모델하우스 방문</span></div></div>' +
      '<p class="note">※ 쿠폰 지급 기준·기간은 ' + PHONE + '로 확인해 주세요. 사전 공지 후 변경·조기 종료될 수 있습니다.</p>' +
      '<span class="cta">' + C1 + ' <i></i></span></a>'
    );
  }
  if (!past(2026, 12, 13, 23, 59, 59)) {
    cards.push(
      '<a class="card c2" href="' + TEL + '">' + LOGO +
      '<p class="k">청라 아크원 푸르지오</p><p class="h">오피스텔<br>사전고객등록</p>' +
      '<div class="tbl" style="margin-top:18cqw">' +
      '<div class="tr"><b class="c-sand">견본주택</b><span>12월 4일<small>(금) 오픈 예정</small></span></div>' +
      '<div class="tr"><b class="c-peach">청약 접수</b><span>12월 7일<small>(월)</small></span></div>' +
      '<div class="tr"><b class="c-rose">당첨자 발표</b><span>12월 11일<small>(금)</small></span></div>' +
      '<div class="tr"><b class="c-mint">정당 계약</b><span>12월 12일<small>(토)</small>~13일<small>(일)</small></span></div></div>' +
      '<p class="disc">※ 본 홈페이지에 사용된 CG 및 이미지는 실제와 다를 수 있습니다.</p>' +
      '<span class="cta">전화로 오피스텔 사전고객등록 <i></i></span></a>'
    );
  }
  cards.push(
    '<a class="card c3" href="' + GO + '">' + LOGO +
    '<p class="k">청라 아크원 푸르지오</p><p class="h">모델하우스<br>방문예약</p>' +
    '<span class="chip">견본주택 방문은 사전 예약제입니다</span>' +
    '<div class="steps"><div class="st"><b>01</b><span>전화로 방문예약</span></div>' +
    '<div class="st"><b>02</b><span>방문 일시 안내</span></div>' +
    '<div class="st"><b>03</b><span>예약 시간에 모델하우스 방문</span></div></div>' +
    '<p class="tel">' + PHONE + '</p><span class="cta">' + C3 + ' <i></i></span></a>'
  );
  cards.push(
    '<a class="card c4" href="' + TEL + '">' + LOGO +
    '<p class="k">청라 아크원 푸르지오</p><p class="h">상업시설<br>사전고객등록</p>' +
    '<div class="tbl" style="margin-top:24cqw">' +
    '<div class="tr"><b class="c-sand">구분</b><span>단지 내 근린생활시설</span></div>' +
    '<div class="tr"><b class="c-rose">일정</b><span>분양 예정</span></div></div>' +
    '<p class="disc">※ 본 홈페이지에 사용된 CG 및 이미지는 실제와 다를 수 있습니다.</p>' +
    '<span class="cta">전화로 상가 사전고객등록 <i></i></span></a>'
  );
  if (!past(2026, 12, 26, 23, 59, 59)) {
    cards.push(
      '<a class="card c5" href="' + TEL + '">' + LOGO +
      '<p class="k">청라 아크원 푸르지오 아파트</p><p class="h">선착순 계약</p>' +
      '<p class="big">12.26<small>(토)</small></p><span class="chip">예정</span><div class="line"></div>' +
      '<p class="sub" style="margin-top:4cqw">선착순 고객등록</p>' +
      '<p class="note" style="text-align:center">전화로 아파트 사전고객등록으로 접수됩니다.<br>※ 대상 세대·조건은 사업주체 공지에 따릅니다. 고객등록은 계약이 아닙니다.</p>' +
      '<span class="cta">전화로 선착순 고객등록 <i></i></span></a>'
    );
  }
  if (!cards.length) return;

  if (!document.querySelector("link[data-akp-css]")) {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/ark-popup-wo30.css";
    link.setAttribute("data-akp-css", "1");
    document.head.appendChild(link);
  }

  var root, bg, lastFocus = null, opened = false;

  function nodes() {
    return Array.prototype.slice.call(root.querySelectorAll("button, a, input"));
  }
  function close() {
    if (!opened) return;
    opened = false;
    if (root) root.remove();
    if (bg) bg.remove();
    document.documentElement.classList.remove("akp-open");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  window.ArkPopupWO30 = { close: close };

  function kstEndOfDay() {
    var d = new Date(Date.now() + 9 * 3600000);
    return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 15, 0, 0);
  }
  function open() {
    if (opened || document.getElementById("akp-wo30")) return;
    opened = true;
    lastFocus = document.activeElement;
    bg = document.createElement("div");
    bg.className = "akp-bg";
    bg.addEventListener("click", function () { finish(false); });
    root = document.createElement("div");
    root.id = "akp-wo30";
    root.className = "akp";
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-label", "청라 아크원 푸르지오 안내");
    var dots = cards.map(function (_, i) { return '<button type="button" data-dot="' + i + '" aria-label="' + (i + 1) + "번 카드" + '"></button>'; }).join("");
    root.innerHTML =
      '<button type="button" class="akp-close">팝업닫기 <i>✕</i></button>' +
      '<div class="akp-stage"><button type="button" class="akp-nav akp-prev" aria-label="이전 카드">‹</button>' +
      '<ul class="akp-list">' + cards.map(function (html) { return "<li>" + html + "</li>"; }).join("") + "</ul>" +
      '<button type="button" class="akp-nav akp-next" aria-label="다음 카드">›</button></div>' +
      '<label class="akp-today"><input type="checkbox">오늘 하루동안 보지 않기</label>' +
      '<div class="akp-dots">' + dots + "</div>";
    document.body.appendChild(bg);
    document.body.appendChild(root);
    document.documentElement.classList.add("akp-open");
    var list = root.querySelector(".akp-list");
    var closeBtn = root.querySelector(".akp-close");
    function step() {
      var card = list.querySelector(".card");
      if (!card) return 304;
      var gap = parseFloat(getComputedStyle(list).columnGap || getComputedStyle(list).gap) || 4;
      return card.getBoundingClientRect().width + gap;
    }
    function sync() {
      var all = list.querySelectorAll(".card");
      if (!all.length) return;
      var mid = list.scrollLeft + list.clientWidth / 2;
      var best = 0, bestD = 1e9;
      all.forEach(function (card, i) {
        var c = card.offsetLeft + card.offsetWidth / 2 - list.offsetLeft;
        var d = Math.abs(c - mid);
        if (d < bestD) { bestD = d; best = i; }
      });
      root.querySelectorAll("[data-dot]").forEach(function (dot, i) { dot.classList.toggle("is-on", i === best); });
    }
    root.querySelector(".akp-prev").addEventListener("click", function () { list.scrollBy({ left: -step(), behavior: "smooth" }); });
    root.querySelector(".akp-next").addEventListener("click", function () { list.scrollBy({ left: step(), behavior: "smooth" }); });
    root.querySelectorAll("[data-dot]").forEach(function (dot) {
      dot.addEventListener("click", function () {
        var card = list.querySelectorAll(".card")[Number(dot.getAttribute("data-dot"))];
        if (card) card.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      });
    });
    list.addEventListener("scroll", sync, { passive: true });
    setTimeout(sync, 50);
    function finish(today) {
      if (today) {
        try { localStorage.setItem("akp_wo30_hide_until", String(kstEndOfDay())); } catch (e) {}
      }
      close();
    }
    closeBtn.addEventListener("click", function () { finish(root.querySelector(".akp-today input").checked); });
    root.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { e.preventDefault(); finish(root.querySelector(".akp-today input").checked); return; }
      if (e.key !== "Tab") return;
      var f = nodes();
      if (!f.length) return;
      var i = f.indexOf(document.activeElement);
      if (e.shiftKey && (i <= 0)) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && (i === f.length - 1 || i < 0)) { e.preventDefault(); f[0].focus(); }
    });
    closeBtn.focus();
  }
  setTimeout(open, 1200);
})();
