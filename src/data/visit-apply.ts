/** 작업지시서 32: 푸르지오.site 방문예약 신청 동의 버전. */
export const VISIT_CONSENT_VERSION = "s2-visit-2026-11-28-v1";

/**
 * 운영 저장소. Vercel 프로젝트 prugio-site 의 Neon 연동(DATABASE_URL, NEON_PROJECT_ID).
 * 호스트 리전은 비밀 환경변수라 이 문구에 국가를 추정해 넣지 않는다.
 */
export const VISIT_STORAGE_LABEL = "Neon PostgreSQL (이 사이트 운영 데이터베이스)";

/** 푸터 「개인정보 처리자」 표기와 같다. 새 이름을 만들지 않는다. */
export const VISIT_PROCESSOR = "HUMANE KOREA";

export function visitMarketingLabel(marketing: boolean, call: boolean, sms: boolean) {
  if (!marketing) return "미동의";
  const parts: string[] = [];
  if (call) parts.push("전화");
  if (sms) parts.push("문자");
  return parts.length ? `동의(${parts.join("·")})` : "미동의";
}
