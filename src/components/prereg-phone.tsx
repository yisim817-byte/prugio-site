import { Link } from "@tanstack/react-router";
import { PROJECT_PHONE_DISPLAY, PROJECT_PHONE_TEL } from "@/data/content";
import { PREREG_PHONE_LEAD, PREREG_PHONE_NOTES } from "@/data/prereg-mode";

/** 작업지시서 18: 사전고객등록 전화 접수 안내. 입력 칸이 없다. */
export function PhoneRegisterPanel() {
  return (
    <div className="reg-gate reg-phone" role="region" aria-labelledby="reg-phone-title" data-prereg="phone">
      <img className="reg-gate__poster" src="/official/register/register-poster.jpg" width={590} height={842} alt="" />
      <h2 id="reg-phone-title" className="reg-gate__title">청라 아크원 푸르지오 사전고객등록 · 전화 접수</h2>
      <p className="reg-phone__lead">{PREREG_PHONE_LEAD}</p>
      <a className="reg-gate__open reg-phone__call" href={PROJECT_PHONE_TEL}>
        전화로 사전고객등록 {PROJECT_PHONE_DISPLAY}
      </a>
      <ul className="reg-phone__notes">
        {PREREG_PHONE_NOTES.map((text) => (
          <li key={text}>{text}</li>
        ))}
      </ul>
      <p className="reg-phone__visit">
        <Link className="ak-link" to="/visit">견본주택 방문예약 안내 (전화 접수)</Link>
      </p>
    </div>
  );
}
