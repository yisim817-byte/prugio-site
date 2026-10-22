import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { PROJECT_PHONE_DISPLAY } from "@/data/content";

// 아파트 사전고객등록 이벤트(백화점 상품권 30만원) 팝업.
// 작업지시서 13 (2026-10-22): 모양·배치를 아크원푸르지오.site(A)의 30만원 팝업(prereg-popup)과 같게 바꿨다. 문구와 「오늘 하루 보지 않기」 저장 키는 그대로.
// 휴대폰(767px 이하)은 A와 같이 자동으로 열지 않고 하단 띠를 두며, 「자세히」를 누르면 팝업을 연다.
const HIDE_DAY = "arkone-staff-apt-event-day";
const MOBILE_QUERY = "(max-width: 767px)";
const STRIP_CLOSED = "prereg_strip_closed";

function isMobileView() {
  try { return window.matchMedia(MOBILE_QUERY).matches; } catch { return false; }
}
function hiddenToday() {
  try { return localStorage.getItem(HIDE_DAY) === new Date().toISOString().slice(0, 10); } catch { return false; }
}

export function AptEventPopup() {
  const [open, setOpen] = useState(false);
  const [strip, setStrip] = useState(false);

  useEffect(() => {
    if (hiddenToday()) return;
    if (isMobileView()) {
      try { sessionStorage.removeItem(STRIP_CLOSED); } catch { /* ignore */ }
      setStrip(true);
      return;
    }
    setOpen(true);
    document.body.classList.add("prereg-lock");
  }, []);

  function openFromStrip() {
    setStrip(false);
    setOpen(true);
    document.body.classList.add("prereg-lock");
  }

  function closeStrip() {
    try { sessionStorage.setItem(STRIP_CLOSED, "1"); } catch { /* ignore */ }
    setStrip(false);
  }

  function close(today = false) {
    if (today) {
      try { localStorage.setItem(HIDE_DAY, new Date().toISOString().slice(0, 10)); } catch { /* ignore */ }
    }
    document.body.classList.remove("prereg-lock");
    setOpen(false);
    if (!today && isMobileView()) {
      let closedStrip = false;
      try { closedStrip = sessionStorage.getItem(STRIP_CLOSED) === "1"; } catch { /* ignore */ }
      if (!closedStrip) setStrip(true);
    }
  }

  useEffect(() => {
    if (!open) return;
    const panel = document.querySelector<HTMLElement>(".prereg-pop__panel");
    const returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    panel?.querySelector<HTMLElement>("button, a[href]")?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key === "Tab") {
        const items = panel?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])');
        if (!items?.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("prereg-lock");
      returnFocus?.focus();
    };
  }, [open]);

  if (!open) {
    if (!strip) return null;
    return (
      <div className="prereg-strip" role="region" aria-label="사전고객등록 이벤트 안내">
        <span className="prereg-strip__txt">EVENT · 사전고객등록 백화점 상품권 30만원</span>
        <button type="button" className="prereg-strip__more" onClick={openFromStrip}>자세히</button>
        <button type="button" className="prereg-strip__x" aria-label="닫기" onClick={closeStrip}>✕</button>
      </div>
    );
  }
  return (
    <div className="prereg-pop is-in" role="dialog" aria-modal="true" aria-labelledby="apt-event-pop-title">
      <button type="button" className="prereg-pop__bg" aria-label="닫기" onClick={() => close()} />
      <div className="prereg-pop__panel">
        <button type="button" className="prereg-pop__x" aria-label="닫기" onClick={() => close()}>✕</button>
        <p>아파트 이벤트</p>
        <p>아파트 사전고객등록 이벤트</p>
        <h2 id="apt-event-pop-title">백화점 상품권 30만원</h2>
        <p>롯데 · 현대 · 신세계 중 선택</p>
        <p>사전고객등록 후 청약 당첨 및 지급 조건을 충족하고 계약하신 고객 대상</p>
        <Link className="reg__submit" to="/event/apt" onClick={() => close()}>이벤트 자세히 보기</Link>
        <p className="prereg-fine">※ 사전고객등록은 공식 청약 신청이 아닙니다. 등록만으로 지급되지 않습니다. <span className="whitespace-nowrap">입주자모집공고 게시 2026.10.22(목) · 견본주택 GRAND OPEN 10.30(금)</span> · <span className="whitespace-nowrap">일정 문의 {PROJECT_PHONE_DISPLAY}</span></p>
        <p className="prereg-fine">※ 동일 현장의 다른 홈페이지·분양 채널에 중복으로 등록하신 경우, 상품권 지급이 제한될 수 있습니다.</p>
        <div className="prereg-pop__actions">
          <button type="button" onClick={() => close(true)}>오늘 하루 보지 않기</button>
          <button type="button" onClick={() => close()}>닫기</button>
        </div>
      </div>
    </div>
  );
}
