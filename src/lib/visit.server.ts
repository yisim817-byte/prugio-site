import { getRequest } from "@tanstack/react-start/server";

// 모델하우스 방문 희망일 검증(작업지시서 9). 기준은 Supabase arkone-visit-config 와 같다.
// 설정 함수 호출이 실패하거나 범위 밖이면 null — 방문 값만 버리고 등록은 그대로 진행한다.
const CONFIG_URL = "https://jzmktahlrwtrtejjflrw.supabase.co/functions/v1/arkone-visit-config";
const SLOT_LABEL: Record<string, string> = { AM: "오전", PM: "오후", ANY: "시간 상관없음" };

export type VisitPick = { date: string; slot: "AM" | "PM" | "ANY"; label: string };

export async function checkVisit(date: string | undefined, slot: string | undefined): Promise<VisitPick | null> {
  if (!date) return null;
  const s = slot || "ANY";
  if (s !== "AM" && s !== "PM" && s !== "ANY") return null;
  let origin = "";
  try {
    const host = getRequest()?.headers.get("host");
    if (host) origin = `https://${host}`;
  } catch {
    origin = "";
  }
  try {
    const res = await fetch(CONFIG_URL, { headers: origin ? { origin } : {}, signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const body = (await res.json()) as { enabled?: boolean; dates?: { value: string; label: string }[] };
    if (body?.enabled !== true || !Array.isArray(body.dates)) return null;
    const hit = body.dates.find((item) => item?.value === date);
    return hit ? { date, slot: s, label: `${hit.label} ${SLOT_LABEL[s]}` } : null;
  } catch {
    return null;
  }
}
