/* 작업지시서 10 · 단계 띠 공통 참조 구현 (vanilla, 외부 패키지 없음)
   사용: window.ARKONE_PHASE_CFG 설정 후 이 파일을 defer로 불러오고
         정적 사이트  → ArkonePhaseBand.mountAfter('header 선택자')
         React        → useEffect(() => { ArkonePhaseBand.mountInto(ref.current) }, [])  (헤더 아래 빈 div)
   문구는 고치지 않는다. 금액·카운트다운·깜빡임 없음. */
(function () {
  'use strict';
  var CFG = window.ARKONE_PHASE_CFG || {};
  var FN_URL = CFG.fnUrl || '';                 // https://jzmktahlrwtrtejjflrw.supabase.co/functions/v1/arkone-site-phase
  var FN_HEADERS = CFG.fnHeaders || {};         // arkone-visit-config 호출과 같은 헤더(anon 키 방식 그대로)
  var REG = CFG.registerPath || '/register';
  var VISIT = CFG.visitPath || '/visit';           // 작업지시서 13: 방문예약 전용 페이지
  var SCHEDULE = CFG.scheduleHref || '/#schedule';
  var NOTICE = CFG.noticeUrl || 'https://www.applyhome.co.kr';
  var APPLY = 'https://www.applyhome.co.kr';
  var PREVIEW_HOST = CFG.previewHost || /\.vercel\.app$/;
  var HIDE = CFG.hidePaths || ['/privacy', '/terms'];
  var PHASES = {
    0: { t: '입주자모집공고 게시 2026.10.22(목) · 특별공급 11.02(월) · 1순위 11.03(화) · 2순위 11.04(수)', b: '청약 일정 보기', h: SCHEDULE, x: false },
    1: { t: '견본주택 GRAND OPEN 10.30(금) · 특별공급 접수 11.02(월)', b: '방문 상담 예약', h: VISIT, x: false },
    2: { t: '청약 접수 기간 · 특별공급 11.02(월) · 1순위 11.03(화) · 2순위 11.04(수)', b: '청약홈 바로가기', h: APPLY, x: true },
    3: { t: '당첨자 발표 11.10(화) · 청약홈에서 확인할 수 있습니다', b: '청약홈 바로가기', h: APPLY, x: true },
    4: { t: '당첨자 서류접수 11.12(목)~11.16(월) · 계약 11.22(일)~11.24(화)', b: '공고문 보기', h: NOTICE, x: true }
  };
  var TODAY = { '2026-11-02': '오늘 특별공급 접수 · ', '2026-11-03': '오늘 1순위 접수 · ', '2026-11-04': '오늘 2순위 접수 · ' };

  function kstDate() { return new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10); }
  function hidden() { var p = location.pathname.replace(/\/$/, ''); return HIDE.some(function (h) { return p === h || p.indexOf(h + '/') === 0; }); }
  function previewPhase() {
    if (!PREVIEW_HOST.test(location.hostname)) return null;            // 운영 도메인은 phase_preview 무시
    var m = /[?&]phase_preview=([0-5])(?:&|$)/.exec(location.search);
    return m ? Number(m[1]) : null;
  }
  function getPhase() {
    var pv = previewPhase();
    if (pv !== null) return Promise.resolve(pv);
    if (!FN_URL || !window.fetch) return Promise.resolve(0);
    var ctl = typeof AbortController === 'function' ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 3000);
    return fetch(FN_URL, { headers: FN_HEADERS, signal: ctl ? ctl.signal : undefined, cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { var n = Number(j && j.phase); return (n >= 0 && n <= 5 && n === Math.floor(n)) ? n : 0; })
      .catch(function () { return 0; })                                  // 실패 시 단계 0 (사실 문구만)
      .then(function (n) { clearTimeout(timer); return n; });
  }
  function build(phase) {
    var p = PHASES[phase];
    if (!p) return null;                                                 // 단계 5 = 띠 숨김
    var el = document.createElement('div');
    el.className = 'ak-phase-band';
    el.setAttribute('role', 'region');
    el.setAttribute('aria-label', '분양 일정 안내');
    el.setAttribute('data-phase', String(phase));
    var s = document.createElement('span');
    s.className = 'ak-phase-band__t';
    s.textContent = (phase === 2 && TODAY[kstDate()] ? TODAY[kstDate()] : '') + p.t;
    var a = document.createElement('a');
    a.className = 'ak-phase-band__b';
    a.href = p.h;
    a.textContent = p.b;
    if (p.x) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    el.appendChild(s); el.appendChild(a);
    return el;
  }
  function mountInto(container) {
    if (!container || hidden()) return Promise.resolve(null);
    return getPhase().then(function (ph) {
      var el = build(ph);
      while (container.firstChild) container.removeChild(container.firstChild);
      if (el) container.appendChild(el);
      return ph;
    });
  }
  function mountAfter(selector) {
    var anchor = document.querySelector(selector);
    if (!anchor || hidden() || document.querySelector('.ak-phase-band-slot')) return Promise.resolve(null);
    var slot = document.createElement('div');
    slot.className = 'ak-phase-band-slot';
    anchor.insertAdjacentElement('afterend', slot);
    return mountInto(slot);
  }
  window.ArkonePhaseBand = { mountInto: mountInto, mountAfter: mountAfter, _phases: PHASES };
})();
