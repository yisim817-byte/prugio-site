/* 상단 배너. 작업지시서 31: 직원(staff)은 전화 버튼 하나. 9014만 방문예약 안내 링크. */
(function () {
  "use strict";
  if (window.__planOpenBar) return;
  window.__planOpenBar = 1;
  if (/\/admin|\/login/i.test(location.pathname)) return;
  var KEY = "topBar_20261128";
  try { if (sessionStorage.getItem(KEY)) return; } catch (e) {}
  var s = document.currentScript;
  var PHONE = (s && s.getAttribute("data-phone")) || "";
  var TEL = "tel:" + String(PHONE).replace(/\D/g, "");
  var VISIT = (s && s.getAttribute("data-visit")) === "on";
  function path() {
    var p = location.pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
    if (p.length > 1 && p.charAt(p.length - 1) === "/") p = p.slice(0, -1);
    return p || "/";
  }
  function pastKst(y, m, d, hh, mm, ss) {
    return Date.now() > Date.UTC(y, m - 1, d, hh - 9, mm, ss);
  }
  function run() {
    if (document.getElementById("plan-open-bar")) return;
    var p = path();
    var rows = [];
    var coupon = !pastKst(2026, 12, 5, 23, 59, 59);
    var txt = coupon
      ? '<span class="pc">전화로 방문고객등록 후 모델하우스 방문 시 </span><b>스타벅스 커피 쿠폰 증정</b> (~12.5 토)'
      : '<span class="pc">사전고객등록·방문예약은 전화로 받습니다</span><span class="mo">전화로 등록·예약</span>';
    var visitBtn = VISIT ? '<a class="pob-btn pob-btn--visit" href="/visit">방문예약 안내 ›</a>' : "";
    rows.push({
      cls: "pob-lg pob-lg--split",
      html: '<span class="pob-lg__txt">' + txt + "</span>" +
        '<span class="pob-lg__btns"><a class="pob-btn pob-btn--tel" href="' + TEL + '">전화 등록·예약 ' + PHONE + " ›</a>" + visitBtn + "</span>"
    });
    if (!pastKst(2026, 11, 28, 23, 59, 59) && p !== "/103b") {
      rows.push({ cls: "pob-sm", href: "/103b", text: "11.28(토) 103㎡B 선착순 · 예비당첨자 추첨 예정 · 안내 보기 ›" });
    } else if (!pastKst(2026, 12, 26, 23, 59, 59)) {
      rows.push({
        cls: "pob-sm",
        html: '<a class="pob-sm" href="' + TEL + '"><span class="pc">12.26(토) 아파트 선착순 계약 예정 · 전화로 선착순 고객등록 ' + PHONE + ' ›</span><span class="mo">12.26(토) 선착순 계약 예정 · 전화 등록 ›</span></a>'
      });
    }
    if (p !== "/compare") {
      rows.push({ cls: "pob-sm", href: "/compare", text: "아파트 vs 오피스텔 비교 · 가격·넓이·청약자격·전매 한눈에 ›" });
    }
    if (!rows.length) return;
    var css = document.createElement("style");
    css.textContent = ""
      + "#plan-open-bar{position:fixed;top:0;left:0;right:0;z-index:2147483100;display:flex;flex-direction:column;background:#0f2a26;color:#fff;font-family:Pretendard,'Noto Sans KR','Apple SD Gothic Neo',sans-serif;box-shadow:0 1px 0 rgba(0,0,0,.12);max-width:100%}"
      + "#plan-open-bar a{color:#fff;text-decoration:none}"
      + "#plan-open-bar a.pob-sm{display:flex;align-items:center;justify-content:center;text-align:center;min-height:34px;padding:0 44px;box-sizing:border-box;width:100%;font-size:13px;font-weight:600;background:#173a34;border-top:1px solid rgba(255,255,255,.08)}"
      + "#plan-open-bar .pob-lg--split{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px 14px;box-sizing:border-box;width:100%;min-height:46px;padding:6px 48px;font-size:14px;font-weight:700;line-height:1.3;text-align:center}"
      + "#plan-open-bar .pob-lg__txt{min-width:0;max-width:100%}#plan-open-bar .pob-lg__txt b{color:#e8c98f}"
      + "#plan-open-bar .pob-lg__btns{display:flex;flex:none;gap:8px;align-items:center;max-width:100%}"
      + "#plan-open-bar .pob-btn{display:inline-flex;align-items:center;justify-content:center;width:auto;height:30px;min-height:30px;padding:0 14px;border:0;border-radius:15px;background:#e9e3d6;color:#1c2b28;font-size:13px;font-weight:700;white-space:nowrap;line-height:1;text-decoration:none}"
      + "#plan-open-bar .pob-btn--tel{background:#e8c98f}"
      + "#plan-open-bar .mo{display:none}"
      + "#plan-open-bar .pob-x{position:absolute;right:8px;top:8px;z-index:3;background:none;border:0;color:#fff;font-size:22px;line-height:1;width:36px;height:36px;cursor:pointer}"
      + "@media(max-width:768px){#plan-open-bar .pc{display:none}#plan-open-bar .mo{display:inline}#plan-open-bar .pob-lg--split{justify-content:space-between;gap:8px;padding:8px 40px 8px 12px;font-size:12px}#plan-open-bar .pob-btn{height:28px;min-height:28px;padding:0 10px;font-size:12px}#plan-open-bar a.pob-sm{font-size:12.5px;padding:6px 36px 6px 10px;height:auto}}"
      + "html.pob-on body{padding-top:var(--pob-h,140px)!important}";
    document.head.appendChild(css);
    var bar = document.createElement("div");
    bar.id = "plan-open-bar";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "방문·일정·비교 안내");
    bar.innerHTML = rows.map(function (r) {
      if (r.html && r.cls.indexOf("pob-sm") === 0 && r.html.indexOf("<a") === 0) return r.html;
      if (r.html) return '<div class="' + r.cls + '">' + r.html + "</div>";
      return '<a class="' + r.cls + '" href="' + r.href + '">' + r.text + "</a>";
    }).join("") + '<button type="button" class="pob-x" aria-label="닫기">×</button>';
    document.documentElement.appendChild(bar);
    document.documentElement.classList.add("pob-on");
    var moved = [];
    function shift() {
      var h = bar.offsetHeight || 0;
      document.documentElement.style.setProperty("--pob-h", h + "px");
      var els = document.body.querySelectorAll("header,[class*=header],[class*=Header],[id*=header]");
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if (el === bar || el.__pob) continue;
        var cs = getComputedStyle(el);
        if ((cs.position === "fixed" || cs.position === "sticky") && (parseFloat(cs.top) === 0 || cs.top === "0px") && el.offsetHeight > 0 && el.offsetHeight < 220) {
          el.__pob = 1;
          el.style.setProperty("top", h + "px", "important");
          moved.push(el);
        }
      }
    }
    shift();
    setTimeout(shift, 400);
    setTimeout(shift, 1600);
    window.addEventListener("resize", shift);
    bar.querySelector(".pob-x").onclick = function () {
      try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
      bar.remove();
      document.documentElement.classList.remove("pob-on");
      document.documentElement.style.removeProperty("--pob-h");
      moved.forEach(function (el) { el.style.removeProperty("top"); });
    };
  }
  if (document.readyState === "complete") setTimeout(run, 50);
  else window.addEventListener("load", function () { setTimeout(run, 50); });
})();
