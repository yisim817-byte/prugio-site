import { createFileRoute } from "@tanstack/react-router";
import { getSql, dbSource } from "@/lib/db";
import { SITE_ID } from "@/data/content";
import { checkVisitDate, VISIT_SLOT_TEXT } from "@/lib/visit.server";

// 작업지시서 13 (2026-10-22): 모델하우스 방문예약 접수 API. 사전고객등록(leads)과 별도 표 visit_reservations 에만 쓴다.
// - 휴대폰 010 형식 검사, 방문 희망일은 arkone-visit-config 목록 안의 날짜만(아니면 날짜만 비우고 접수)
// - 같은 번호·같은 날짜를 10분 안에 다시 보내면 새로 쓰지 않고 「이미 접수」로 응답
// - Preview(*.vercel.app)·운영 외 환경은 is_test=true. 고객 문자는 보내지 않는다.
const INTEREST = new Set(["", "아파트", "오피스텔", "상가"]);
const RRN = /(\d{6}\s*-?\s*[1-8]\d{6})|(\d{13})/;

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
}

const text = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/[<>]/g, "").trim().slice(0, max) : "");

function receiptNo() {
  const d = new Date(Date.now() + 9 * 3600 * 1000);
  const y = String(d.getUTCFullYear()).slice(2);
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `VS${y}${m}${day}-${Math.floor(Math.random() * 9000 + 1000)}`;
}

async function handle(request: Request): Promise<Response> {
  const raw = await request.text();
  if (raw.length > 4000) return json(413, { ok: false, error: "too_large" });
  let b: Record<string, unknown>;
  try {
    b = JSON.parse(raw);
  } catch {
    return json(400, { ok: false, error: "형식이 맞지 않습니다." });
  }
  if (typeof b.hp === "string" && b.hp.length > 0) return json(400, { ok: false, error: "접수하지 못했습니다." });
  const name = text(b.name, 20);
  if (!name) return json(400, { ok: false, error: "이름을 입력해 주세요." });
  if (RRN.test(String(b.name ?? ""))) return json(400, { ok: false, error: "주민등록번호는 받지 않습니다." });
  const phone = typeof b.phone === "string" ? b.phone.replace(/\D/g, "") : "";
  if (!/^010\d{8}$/.test(phone)) return json(400, { ok: false, error: "휴대폰번호는 010으로 시작하는 11자리입니다." });
  if (b.consent_privacy !== true) return json(400, { ok: false, error: "개인정보 수집·이용에 동의해야 신청할 수 있습니다." });
  const slot = b.visit_slot === "AM" || b.visit_slot === "PM" ? b.visit_slot : "ANY";
  const interest = text(b.interest, 10);
  if (!INTEREST.has(interest)) return json(400, { ok: false, error: "관심 상품을 다시 선택해 주세요." });

  const url = new URL(request.url);
  const host = request.headers.get("host") || url.host;
  const test = /\.vercel\.app$/.test(host) || process.env.VERCEL_ENV !== "production";
  if (dbSource !== "neon" && process.env.VERCEL_ENV === "production") {
    console.error("[visit] durable store unavailable");
    return json(503, { ok: false, error: "지금은 접수를 저장할 수 없습니다. 잠시 후 다시 시도해 주세요." });
  }
  const picked = await checkVisitDate(typeof b.visit_date === "string" ? b.visit_date.trim() : undefined, `https://${host}`);
  const visitDate = picked ? picked.value : null;
  const label = `${picked ? picked.label : "날짜 미선택(전화 확인)"} · ${VISIT_SLOT_TEXT[slot]}`;

  let sql;
  let receipt = "";
  let createdAt = new Date().toISOString();
  try {
    sql = await getSql();
    const dup = await sql<{ receipt_no: string }>`
      select receipt_no from visit_reservations
      where site_id = ${SITE_ID} and phone = ${phone} and is_test = ${test}
        and visit_date is not distinct from ${visitDate}::date
        and created_at > now() - interval '10 minutes'
      order by created_at desc limit 1
    `;
    if (dup[0]) {
      return json(200, { ok: true, duplicate: true, receiptNo: dup[0].receipt_no, visitDate, visitSlot: slot, dateLabel: picked?.label ?? "", slotLabel: VISIT_SLOT_TEXT[slot] });
    }
    receipt = receiptNo();
    for (let i = 0; i < 4; i++) {
      const clash = await sql<{ id: number }>`select id from visit_reservations where receipt_no = ${receipt} limit 1`;
      if (!clash[0]) break;
      receipt = receiptNo();
    }
    const rows = await sql<{ created_at: string }>`
      insert into visit_reservations
        (site_id, receipt_no, site_host, page, name, phone, visit_date, visit_slot, interest, consent_privacy, consent_version, utm_source, utm_medium, utm_campaign, is_test)
      values
        (${SITE_ID}, ${receipt}, ${host}, ${text(b.page, 100) || "/visit"}, ${name}, ${phone}, ${visitDate}::date, ${slot}, ${interest || null}, true,
         ${text(b.consent_version, 60) || null}, ${text(b.utm_source, 60) || null}, ${text(b.utm_medium, 60) || null}, ${text(b.utm_campaign, 80) || null}, ${test})
      returning created_at
    `;
    if (rows[0]?.created_at) createdAt = new Date(rows[0].created_at).toISOString();
  } catch {
    console.error("[visit] save failed");
    return json(500, { ok: false, error: "저장하지 못했습니다. 잠시 후 다시 시도해 주세요." });
  }
  try {
    const { sendVisitAlert } = await import("@/lib/kakao.server");
    const alert = await sendVisitAlert({ receiptNo: receipt, createdAt, name, phone: `${phone.slice(0, 3)}-${phone.slice(3, 7)}-${phone.slice(7)}`, visit: label, interest: interest || null, test });
    await sql`update visit_reservations set notify_status = ${alert.status}, notify_detail = ${alert.detail}, notify_at = now() where receipt_no = ${receipt}`;
  } catch {
    console.error("[visit] notify failed after save", receipt);
  }
  return json(200, {
    ok: true,
    duplicate: false,
    receiptNo: receipt,
    visitDate,
    visitSlot: slot,
    dateLabel: picked?.label ?? "",
    slotLabel: VISIT_SLOT_TEXT[slot],
    dateDropped: Boolean(typeof b.visit_date === "string" && b.visit_date && !picked),
  });
}

export const Route = createFileRoute("/api/visit")({
  server: {
    handlers: {
      POST: ({ request }) => handle(request),
    },
  },
});
