import { useEffect, useState } from "react";
import { PROJECT_PHONE_DISPLAY, PROJECT_PHONE_TEL } from "@/data/content";

// 작업지시서 16-2: 오피스텔·상업시설 안내는 공식 팝업 디자인(soon-popups.tsx 와 같은 마크업·스타일)을 그대로 쓴다.
// 새 디자인을 만들지 않는다. 바뀌는 것은 놓이는 자리뿐이다 (홈 구역 / 첫 화면 팝업).

type Kind = "officetel" | "commercial";

function SoonCard({ kind, portrait, headingId }: { kind: Kind; portrait?: boolean; headingId: string }) {
  const ot = kind === "officetel";
  const bg = ot ? "officetel_bg" : "commercial_bg";
  return (
    <div className={`popup_soon popup_soon--${kind}`}>
      <div className="popup_soon__dialog">
        <div className="popup_soon__bg">
          {portrait ? (
            <img src={`/official/soon/${bg}_m.png`} alt="" />
          ) : (
            <picture>
              <source media="(max-width: 1024px)" srcSet={`/official/soon/${bg}_m.png`} />
              <img src={`/official/soon/${bg}.png`} alt="" loading="lazy" />
            </picture>
          )}
        </div>
        <div className="popup_soon__content">
          <p className="popup_soon__logo"><img src="/official/soon/logo.svg" alt="PRUGIO" width={257} height={45} /></p>
          <div className="popup_soon__heading">
            <h2 id={headingId} className="popup_soon__title">
              <span className="popup_soon__brand">청라 아크원 푸르지오</span>
              <span className="popup_soon__type">{ot ? "오피스텔" : "상업시설"}</span>
            </h2>
            {ot ? null : (
              <>
                <p className="popup_soon__english" lang="en">CHEONGNA ARCONE PRUGIO <br className="m-only" />COMMERCIAL FACILITIES</p>
                <p className="popup_soon__coming" lang="en">COMING<br />SOON</p>
              </>
            )}
          </div>
        </div>
        {ot ? (
          <>
            <p className="popup_soon__lead">청라가 기다리던<br />또하나의 찬란한 순간</p>
            <div className="popup_soon__message">
              <p className="popup_soon__tagline">멀티 발코니 오피스텔</p>
              <p className="popup_soon__coming" lang="en">COMING<br className="m-only" /> SOON</p>
            </div>
          </>
        ) : null}
        <a className="popup_soon__cta" href={PROJECT_PHONE_TEL}>
          <span className="popup_soon__cta_text"><strong>전화로 방문예약</strong></span>
          <i className="popup_soon__cta_arrow" aria-hidden="true" />
        </a>
        <p className="popup_soon__note">※본 홈페이지에 사용된 CG 및 일러스트, 이미지 등은 소비자의 이해를 돕기 위한 것으로 실제와 다를 수 있습니다.</p>
      </div>
    </div>
  );
}

/** 작업지시서 17-1 (2026-11-13): 103㎡B 선착순 공급 참여의향서 접수 안내 카드. 공식 CG를 쓰지 않는 글자 카드(공식 녹색 바탕)다. 문구는 /103b 원장과 같다. */
function B103Card() {
  return (
    <div className="popup_soon otp-b103">
      <div className="otp-b103__dialog">
        <p className="otp-b103__logo"><img src="/official/soon/logo.svg" alt="PRUGIO" width={257} height={45} /></p>
        <h2 id="otp-b103-title" className="otp-b103__title">
          <span className="otp-b103__brand">청라 아크원 푸르지오</span>
          <span className="otp-b103__type">103㎡B</span>
          <span className="otp-b103__kind">선착순 공급</span>
        </h2>
        <p className="otp-b103__label">선착순 공급</p>
        <p className="otp-b103__date">11.28</p>
        <p className="otp-b103__when">2026년 11월 28일(토) 진행 예정</p>
        <p className="otp-b103__cond">참여의향서는 11.17(화)부터 견본주택</p>
        <a className="otp-b103__cta" href="/103b"><strong>접수 안내</strong> 보기 ›</a>
        <p className="otp-b103__note">※ 시간·장소 등 세부 사항은 참여의향서를 접수한 고객에게 문자·전화로 개별 안내합니다.</p>
      </div>
    </div>
  );
}


/** 작업지시서 26: 첫 화면은 쿠폰 카드 1장. 전화 등록만. */
function VisitCard() {
  return (
    <div className="popup_soon otp-b103 otp-starbucks">
      <div className="otp-b103__dialog">
        <svg className="otp-starbucks__cup" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
          <path d="M14 20h18v8a7 7 0 0 1-7 7h-4a7 7 0 0 1-7-7v-8z" />
          <path d="M32 22h3.5a4.5 4.5 0 0 1 0 9H32" />
          <path d="M18 16c0-1.6 1.4-1.6 1.4-3.2M23 16c0-1.6 1.4-1.6 1.4-3.2M28 16c0-1.6 1.4-1.6 1.4-3.2" />
        </svg>
        <p className="otp-b103__label">방문 혜택</p>
        <p className="otp-starbucks__line">전화로 방문고객등록 후 모델하우스 방문 시</p>
        <p className="otp-starbucks__coupon">스타벅스 커피 쿠폰 증정</p>
        <p className="otp-starbucks__body">견본주택 방문은 사전 예약제입니다. 대표번호로 전화해 방문고객등록을 해 주세요.</p>
        <a className="otp-b103__cta" href={PROJECT_PHONE_TEL}>전화로 방문고객등록 {PROJECT_PHONE_DISPLAY}</a>
        <p className="otp-b103__note">
          ※ 쿠폰 지급 기준·기간은 {PROJECT_PHONE_DISPLAY}로 확인해 주세요. 사전 공지 후 변경·조기 종료될 수 있습니다.
          <br />
          ※ 방문고객등록은 청약 신청이 아니며, 청약 자격·순위와 관계없습니다.
        </p>
      </div>
    </div>
  );
}

/** 홈 히어로 바로 아래: 공식 오피스텔·상업시설 안내 화면 2장을 구역으로 놓는다. */
export function OtFeature() {
  return (
    <section id="officetel" className="otf" aria-label="오피스텔 · 상업시설 안내">
      <SoonCard kind="officetel" headingId="otf-officetel-title" />
      <div id="commercial">
        <SoonCard kind="commercial" headingId="otf-commercial-title" />
      </div>
    </section>
  );
}

// 17-1: 카드 구성이 바뀌어 키를 새로 쓴다(전에 「오늘 하루 보지 않기」를 누른 방문자에게도 한 번 보인다).
const KEY = "popup_20261128";

/** 첫 화면 팝업: 스타벅스 커피 쿠폰 카드 1장. */
export function OtPopups() {
  const [open, setOpen] = useState(false);
  const [today, setToday] = useState(false);

  useEffect(() => {
    let hide = false;
    try {
      hide = Number(localStorage.getItem(KEY) || 0) > Date.now();
    } catch {
      /* ignore */
    }
    setOpen(!hide);
  }, []);

  function close() {
    if (today) {
      try {
        localStorage.setItem(KEY, String(Date.now() + 24 * 60 * 60 * 1000));
      } catch {
        /* ignore */
      }
    }
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, today]);

  if (!open) return null;

  return (
    <div className="otp" role="dialog" aria-modal="true" aria-label="방문 혜택" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="otp__wrap">
        <button type="button" className="otp__close" onClick={close}>팝업닫기 ✕</button>
        <div className="otp-row otp-row--one">
          <VisitCard />
          {false ? <B103Card /> : null}
        </div>
        <label className="otp__today">
          <input type="checkbox" checked={today} onChange={(e) => setToday(e.target.checked)} />
          오늘 하루 보지 않기
        </label>
      </div>
    </div>
  );
}
