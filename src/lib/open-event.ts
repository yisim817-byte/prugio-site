// 작업지시서 14 · 확정 전 값. PM 확정 후 이 파일만 고친다.
export const EVENT_DAYS = ["10.30(금)", "10.31(토)", "11.01(일)"] as const;
export const EVENT_DRAW_TIME = "16시";

export const EVENT_RANGE = `${EVENT_DAYS[0]} ~ ${EVENT_DAYS[2]}`;

export const VISIT_GIFTS = [
  { day: "1일차", date: EVENT_DAYS[0], limit: "선착순 300명", gift: "극세사 행주 4종" },
  { day: "2일차", date: EVENT_DAYS[1], limit: "선착순 300명", gift: "주방타올 + 핸드워시 세트" },
  { day: "3일차", date: EVENT_DAYS[2], limit: "선착순 300명", gift: "락앤락 도자기 밥용기" },
] as const;

export const VISIT_BASIC =
  "직사각 갑티슈 1개 + 물티슈 80P 1개 + 인터넷 청약안내문 1장 + 공급안내문(분양가) 1부";

export const DRAW_DAYS = [
  {
    id: "day1",
    label: "1일차 · 대디 DAY",
    date: EVENT_DAYS[0],
    prizes: [
      { rank: "1등", count: "1명", name: "LG 트롬 세탁기" },
      { rank: "2등", count: "1명", name: "로보락 로봇청소기" },
      { rank: "3등", count: "1명", name: "다이슨 디지털 슬림 청소기" },
      { rank: "4등", count: "3명", name: "미닉스 음식물 처리기" },
      { rank: "5등", count: "5명", name: "LG 엑스붐 미니" },
    ],
  },
  {
    id: "day2",
    label: "2일차 · 맘 DAY",
    date: EVENT_DAYS[1],
    prizes: [
      { rank: "1등", count: "1명", name: "LG 디오스 인덕션" },
      { rank: "2등", count: "1명", name: "다이슨 에어랩" },
      { rank: "3등", count: "1명", name: "쿠쿠 사일런스 큐브" },
      { rank: "4등", count: "3명", name: "스타우브 꼬꼬떼" },
      { rank: "5등", count: "5명", name: "모도리 깔끔도마" },
    ],
  },
  {
    id: "day3",
    label: "3일차 · 키즈 DAY",
    date: EVENT_DAYS[2],
    prizes: [
      { rank: "1등", count: "1명", name: "아이패드 에어" },
      { rank: "2등", count: "1명", name: "DJI 오즈모 포켓" },
      { rank: "3등", count: "1명", name: "갤럭시 워치" },
      { rank: "4등", count: "3명", name: "캐논 포토프린터" },
      { rank: "5등", count: "5명", name: "갤럭시 버즈3" },
    ],
  },
] as const;

export function defaultDrawIndex() {
  const d = new Date(Date.now() + 9 * 3600000);
  const key = `${String(d.getUTCMonth() + 1).padStart(2, "0")}.${String(d.getUTCDate()).padStart(2, "0")}`;
  const idx = EVENT_DAYS.findIndex((day) => day.startsWith(key));
  return idx >= 0 ? idx : 0;
}
