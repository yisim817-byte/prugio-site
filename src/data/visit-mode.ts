import { PROJECT_PHONE_DISPLAY } from "@/data/content";

/**
 * PM 지시 2026-11-18: 직원 사이트 견본주택 방문예약 온라인 접수 일시 폐쇄 → 전화 예약.
 * false: /visit 입력 폼을 닫고 전화 예약 안내만 보인다. /api/visit 도 접수를 받지 않는다.
 * 다시 열 때는 이 값만 true 로 바꾼다. 폼 코드·DB·관리 화면·기존 접수 건은 그대로 남아 있다.
 */
export const VISIT_ONLINE = false;

/** 닫혀 있는 동안 /api/visit 가 돌려주는 안내 (예전 화면이 열린 채 남아 전송한 경우). */
export const VISIT_CLOSED_MESSAGE = `현재 견본주택 방문예약은 전화로만 접수합니다. 대표번호 ${PROJECT_PHONE_DISPLAY}로 전화 주세요.`;

/** 전화 예약 안내 문구. 사이트마다 번호만 다르다. */
export const VISIT_PHONE_INTRO = "청라 아크원 푸르지오 견본주택은 사전 예약제로 운영합니다. 방문 전 반드시 대표번호로 전화 예약해 주세요.";
export const VISIT_PHONE_LEAD = "견본주택 방문예약은 전화로만 접수합니다.";
export const VISIT_PHONE_STRONG = "예약 없이 방문하시면 입장·상담이 제한될 수 있습니다.";
export const VISIT_PHONE_NOTES = [
  "대표번호로 전화 주시면 담당자가 방문 날짜와 시간을 확인해 예약해 드립니다.",
  "전화하실 때 성함·휴대전화·방문 희망일·관심 상품(아파트·오피스텔·상가)을 확인합니다.",
  "홈페이지 온라인 방문예약은 일시 중단되었습니다. 이미 홈페이지로 신청하신 분은 다시 신청하지 않으셔도 됩니다.",
  "방문예약은 청약 신청이 아니며, 청약 자격·순위와 관계없습니다.",
  "방문예약은 사전고객등록과 별개입니다. 사전고객등록도 대표번호로 접수합니다.",
] as const;
