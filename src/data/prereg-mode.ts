import { PROJECT_PHONE_DISPLAY } from "@/data/content";

/**
 * 작업지시서 18 (PM 지시 2026-11-17): 직원 사이트 사전고객등록 일시 폐쇄 → 전화 등록.
 * false: 홈페이지 입력 폼을 닫고 전화 등록 안내만 보인다. 서버 함수도 접수를 받지 않는다.
 * 다시 열 때는 이 값만 true 로 바꾼다. 폼 코드·DB·관리 화면·기존 접수 건은 그대로 남아 있다.
 */
export const PREREG_ONLINE = false;

/** 작업지시서 25: 직원 사이트는 방문예약 입력 폼을 닫고 전화로만 받는다. */
export const VISIT_ONLINE = false;

/** 닫혀 있는 동안 서버 함수가 돌려주는 안내 (예전 화면이 열린 채 남아 전송한 경우). */
export const PREREG_CLOSED_MESSAGE = `현재 사전고객등록은 전화로만 접수합니다. 대표번호 ${PROJECT_PHONE_DISPLAY}로 전화 주세요.`;

/** 전화 등록 안내 문구. 사이트마다 번호만 다르다. */
export const PREREG_PHONE_LEAD = "현재 사전고객등록은 전화로만 접수합니다.";
export const PREREG_PHONE_NOTES = [
  "대표번호로 전화 주시면 담당자가 직접 등록해 드립니다.",
  "등록할 때 성함·휴대전화·생년월일 앞 6자리·관심 상품(아파트·오피스텔·상가)을 확인합니다.",
  "홈페이지 온라인 등록은 일시 중단되었습니다. 이미 홈페이지로 등록하신 분은 다시 등록하지 않으셔도 됩니다.",
  `사전고객등록 확인도 대표번호 ${PROJECT_PHONE_DISPLAY}로 하실 수 있습니다.`,
] as const;
