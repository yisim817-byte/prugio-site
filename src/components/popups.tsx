import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PROJECT_PHONE_DISPLAY, PROJECT_PHONE_TEL, img } from "@/data/content";

const KEY = "arkone-staff-popup-day";

const CARDS = [
  {
    src: "/popups/briefing.jpg",
    alt: `아파트 사업설명회. 토·일 14:00, 16:00. 홍보관. 예약 대표번호 ${PROJECT_PHONE_DISPLAY}. 9월 27일은 일요일만.`,
    href: "/contact",
    label: "오시는 길",
    phone: true,
  },
  {
    src: img("/upload/popup/20260921144204_6313.jpg"),
    alt: "관심고객 이벤트. 기간 2026.9.30–11.29.",
    href: "/register",
    label: "관심고객등록",
    phone: false,
  },
  {
    src: "/popups/consult-event.jpg",
    alt: `청약상담센터 이벤트. 문의 대표번호 ${PROJECT_PHONE_DISPLAY}.`,
    href: "/contact",
    label: "홍보관 위치",
    phone: true,
  },
  {
    src: img("/upload/popup/20260921144155_9255.jpg"),
    alt: "청약 체크포인트",
    href: "/docnormal",
    label: "일반공급 안내",
    phone: false,
  },
  {
    src: img("/upload/popup/20260921144213_6678.jpg"),
    alt: "유사 홈페이지 주의. 이 직원용 사이트는 공식 홈페이지가 아닙니다.",
    href: "/privacy",
    label: "안내 보기",
    phone: false,
  },
];

export function HomePopups() {
  const [open, setOpen] = useState(false);
  const [hideToday, setHideToday] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    if (window.localStorage.getItem(KEY) === today) return;
    setOpen(true);
  }, []);

  if (!open) return null;
  const card = CARDS[index];

  function close() {
    if (hideToday) window.localStorage.setItem(KEY, new Date().toISOString().slice(0, 10));
    setOpen(false);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/70 p-4" role="dialog" aria-modal="true" aria-label="안내 팝업">
      <div className="w-full max-w-sm bg-paper">
        <img src={card.src} alt={card.alt} className="aspect-[360/520] w-full object-cover" />
        {card.phone ? (
          <p className="px-3 pt-3 text-sm">
            대표번호{" "}
            <a href={PROJECT_PHONE_TEL} className="font-medium text-forest">
              {PROJECT_PHONE_DISPLAY}
            </a>
          </p>
        ) : null}
        <div className="flex items-center justify-between gap-2 px-3 py-3">
          <button type="button" className="text-sm underline" onClick={() => setIndex((index + CARDS.length - 1) % CARDS.length)}>
            이전
          </button>
          <span className="text-xs text-muted">{index + 1} / {CARDS.length}</span>
          <button type="button" className="text-sm underline" onClick={() => setIndex((index + 1) % CARDS.length)}>
            다음
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 px-3 pb-3">
          <Link to={card.href} className="grid h-11 place-items-center bg-forest text-sm text-paper" onClick={close}>
            {card.label}
          </Link>
          <button type="button" className="h-11 border border-line text-sm" onClick={close}>
            닫기
          </button>
        </div>
        <label className="flex items-center gap-2 px-3 pb-4 text-sm">
          <input type="checkbox" checked={hideToday} onChange={(e) => setHideToday(e.target.checked)} />
          오늘 하루 보지 않기
        </label>
      </div>
    </div>
  );
}
