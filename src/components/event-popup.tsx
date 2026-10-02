import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

const HIDE_DAY = "arkone-staff-apt-event-day";
const SEEN = "arkone-staff-apt-event-seen";

export function AptEventPopup() {
  const [open, setOpen] = useState(false);
  const [hideToday, setHideToday] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SEEN) === "1") return;
      if (localStorage.getItem(HIDE_DAY) === new Date().toISOString().slice(0, 10)) return;
    } catch {
      /* 저장을 못 해도 팝업은 연다 */
    }
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, hideToday]);

  function close() {
    if (hideToday) {
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
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/70 p-4" role="dialog" aria-modal="true" aria-labelledby="apt-event-pop-title">
      <button type="button" className="absolute inset-0" aria-label="닫기" onClick={close} />
      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto bg-paper">
        <div className="flex items-center justify-between bg-forest px-5 py-4 text-paper">
          <p className="text-xs tracking-[0.18em]">CHEONGNA ARK-ONE PRUGIO</p>
          <button type="button" className="grid h-11 w-11 place-items-center border border-paper/40 text-lg" aria-label="닫기" onClick={close}>
            ×
          </button>
        </div>
        <div className="space-y-4 px-5 py-6">
          <p className="text-sm text-forest">아파트 이벤트</p>
          <h2 id="apt-event-pop-title" className="font-serif text-3xl leading-snug">
            아파트 사전고객등록 이벤트
          </h2>
          <p className="font-serif text-4xl text-forest">백화점 상품권 30만원</p>
          <p className="text-sm tracking-wide text-sand">롯데 · 현대 · 신세계 중 선택</p>
          <p className="border border-line bg-paper p-4 text-sm leading-6">
            사전고객등록 후 청약 당첨 및 MGM 인정조건을 충족하고 계약하신 고객 대상
          </p>
          <p className="text-sm leading-6">※ 사전고객등록은 공식 청약 신청이 아닙니다. 등록만으로 지급되지 않습니다.</p>
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
