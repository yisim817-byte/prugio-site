// 모델하우스 방문 희망일 설정(arkone-visit-config) — 작업지시서 9. 팝업(VisitReservationPopupView)과 같은 캐시를 쓴다.
export type VisitOption = { value: string; label: string };
export type VisitConfig = { enabled: true; dates: VisitOption[]; slots: VisitOption[] };

const URL = "https://jzmktahlrwtrtejjflrw.supabase.co/functions/v1/arkone-visit-config";
export const VISIT_SLOT_LABEL: Record<string, string> = { AM: "오전", PM: "오후", ANY: "시간 상관없음" };

type VisitWindow = Window & { __arkoneVisitCfg?: Promise<VisitConfig | null> };

/** 설정 함수가 실패하거나 enabled=false 면 null. */
export function loadVisitConfig(): Promise<VisitConfig | null> {
  const w = window as VisitWindow;
  if (!w.__arkoneVisitCfg) {
    w.__arkoneVisitCfg = fetch(URL, { method: "GET", credentials: "omit" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => (d && d.enabled === true && Array.isArray(d.dates) && d.dates.length ? (d as VisitConfig) : null))
      .catch(() => null);
  }
  return w.__arkoneVisitCfg;
}
