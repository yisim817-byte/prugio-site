import { PROJECT_PHONE_DISPLAY, PROJECT_PHONE_TEL } from "@/data/content";
import { VISIT_PHONE_LEAD, VISIT_PHONE_NOTES, VISIT_PHONE_STRONG } from "@/data/visit-mode";

/** PM 지시 2026-11-18: 견본주택 방문예약 전화 접수 안내. 입력 칸이 없다. */
export function PhoneVisitPanel() {
  return (
    <div className="vp" role="region" aria-labelledby="vp-title" data-visit="phone">
      <p className="vp__kicker">견본주택 방문예약 · 전화 접수</p>
      <h2 id="vp-title" className="vp__title">{VISIT_PHONE_LEAD}</h2>
      <p className="vp__strong">{VISIT_PHONE_STRONG}</p>
      <a className="vp__call" href={PROJECT_PHONE_TEL}>
        전화로 방문예약 {PROJECT_PHONE_DISPLAY}
      </a>
      <ul className="vp__notes">
        {VISIT_PHONE_NOTES.map((text) => (
          <li key={text}>{text}</li>
        ))}
      </ul>
    </div>
  );
}
