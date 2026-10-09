import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { PROJECT_PHONE_DISPLAY } from "@/data/content";

const HIDE_DAY = "arkone-staff-apt-event-day";
const SEEN = "arkone-staff-apt-event-seen";

export function AptEventPopup() {
  const [open, setOpen] = useState(false);
  const [hideToday, setHideToday] = useState(false);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const hideTodayRef = useRef(false);
  hideTodayRef.current = hideToday;

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SEEN) === "1") return;
      if (localStorage.getItem(HIDE_DAY) === new Date().toISOString().slice(0, 10)) return;
    } catch {
      /* 저장을 못 해도 팝업은 연다 */
    }
    // 홈의 인트로(공식 메인 복제)가 도는 동안에는 열지 않고, 끝난 뒤에 연다. 인트로가 없으면(「동작 줄이기」 등) 바로 연다.
    const introAhead =
      Boolean(document.querySelector("[data-official-main]")) &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!introAhead) {
      setOpen(true);
      return;
    }
    let done = false;
    const show = () => {
      if (done) return;
      done = true;
      setOpen(true);
    };
    window.addEventListener("om:intro-done", show, { once: true });
    const fallback = window.setTimeout(show, 9000);
    return () => {
      window.removeEventListener("om:intro-done", show);
      window.clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeBtn.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const root = dialogRef.current;
      if (!root) return;
      const items = [...root.querySelectorAll<HTMLElement>("button, a[href], input, select, textarea")].filter(
        (el) => !el.hasAttribute("disabled"),
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !root.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !root.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      returnFocus.current?.focus();
    };
  }, [open]);

  function close() {
    if (hideTodayRef.current) {
      try {
        localStorage.setItem(HIDE_DAY, new Date().toISOString().slice(0, 10));
      } catch {
        /* ignore */
      }
    }
    try {
      sessionStorage.setItem(SEEN, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div ref={dialogRef} className="fixed inset-0 z-50 grid place-items-center bg-ink/70 p-4" role="dialog" aria-modal="true" aria-labelledby="apt-event-pop-title">
      <button type="button" className="absolute inset-0" aria-label="닫기" onClick={close} />
      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto bg-paper">
        <div className="flex items-center justify-between bg-forest px-5 py-4 text-paper">
          <p className="text-xs tracking-[0.18em]">CHEONGNA ARK-ONE PRUGIO</p>
          <button ref={closeBtn} type="button" className="grid h-11 w-11 place-items-center border border-paper/40 text-lg" aria-label="닫기" onClick={close}>
            ×
          </button>
        </div>
        <div className="space-y-4 px-5 py-6">
          <p className="text-sm text-forest">아파트 이벤트</p>
          <h2 id="apt-event-pop-title" className="font-serif text-3xl leading-snug">
            아파트 사전고객등록 이벤트
          </h2>
          <p className="font-serif text-4xl text-forest">백화점 상품권 30만원</p>
          <p className="text-sm tracking-wide text-bronze">롯데 · 현대 · 신세계 중 선택</p>
          <p className="border border-line bg-paper p-4 text-sm leading-6">
            사전고객등록 후 청약 당첨 및 MGM 인정조건을 충족하고 계약하신 고객 대상
          </p>
          <p className="text-sm leading-6">※ 사전고객등록은 공식 청약 신청이 아닙니다. 등록만으로 지급되지 않습니다. 10월 중 OPEN 예정 · 일정 문의 {PROJECT_PHONE_DISPLAY}</p>
          <Link
            to="/event/apt"
            className="grid h-12 place-items-center bg-forest text-sm text-paper"
            onClick={close}
          >
            이벤트 자세히 보기
          </Link>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={hideToday} onChange={(e) => setHideToday(e.target.checked)} />
            오늘 하루 보지 않기
          </label>
        </div>
      </div>
    </div>
  );
}
