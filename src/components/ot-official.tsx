import { useEffect, useState } from "react";

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
        <a className="popup_soon__cta" href={`/register?product=${kind}`}>
          <span className="popup_soon__cta_text"><strong>사전고객등록</strong> 바로가기</span>
          <i className="popup_soon__cta_arrow" aria-hidden="true" />
        </a>
        <p className="popup_soon__note">※본 홈페이지에 사용된 CG 및 일러스트, 이미지 등은 소비자의 이해를 돕기 위한 것으로 실제와 다를 수 있습니다.</p>
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

const KEY = "ot_cm_pop_hide_until";

/** 첫 화면 팝업: 공식 오피스텔·상업시설 팝업(세로) 2장만 띄운다. */
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
    <div className="otp" role="dialog" aria-modal="true" aria-label="오피스텔 · 상업시설 사전고객등록 안내" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="otp__wrap">
        <button type="button" className="otp__close" onClick={close}>팝업닫기 ✕</button>
        <div className="otp-row">
          <SoonCard kind="officetel" portrait headingId="otp-officetel-title" />
          <SoonCard kind="commercial" portrait headingId="otp-commercial-title" />
        </div>
        <label className="otp__today">
          <input type="checkbox" checked={today} onChange={(e) => setToday(e.target.checked)} />
          오늘 하루동안 보지 않기
        </label>
      </div>
    </div>
  );
}
