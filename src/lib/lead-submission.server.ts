import { leadSchema } from "./lead-input.ts";
import type { Sql, DbSource } from "./db";
import type { checkVisit as CheckVisit } from "./visit.server";
import type { sendStaffAlert as SendStaffAlert } from "./kakao.server";

/** Server-only persistence boundary. Tests supply an isolated database and a notification spy. */
export type LeadDependencies = {
  siteId: string;
  dbSource: DbSource;
  env: { vercelEnv?: string; nodeEnv?: string };
  getSql: () => Promise<Sql>;
  checkVisit: typeof CheckVisit;
  sendStaffAlert: typeof SendStaffAlert;
};

function digits(value: string) {
  return value.replace(/\D/g, "");
}

function validPhone(value: string) {
  return /^010\d{8}$/.test(value);
}


function entryPath(value: string | undefined) {
  if (!value || !value.startsWith("/") || value.includes("://") || value.includes("\\")) return "/register";
  return value.slice(0, 80);
}

function receiptNo() {
  const d = new Date();
  const y = String(d.getFullYear()).slice(2);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const n = Math.floor(Math.random() * 9000 + 1000);
  return `AC${y}${m}${day}-${n}`;
}

export async function submitLeadRecord(raw: unknown, deps: LeadDependencies) {
  const data = leadSchema.parse(raw);
  const { siteId: SITE, dbSource, env, getSql, checkVisit, sendStaffAlert } = deps;
    const phone = digits(data.phone);
    if (!validPhone(phone)) return { ok: false as const, error: "휴대전화는 010으로 시작하는 11자리입니다." };
    // Preview requests must never write to the live store or send staff notifications.
    if ((env.vercelEnv === "preview" || (dbSource !== "neon" && env.nodeEnv !== "production"))) {
      return { ok: false as const, preview: true as const, error: "프리뷰 전송 검증을 마쳤습니다. 실제 접수 저장·접수번호 발급·알림 발송은 하지 않았습니다." };
    }
    if (dbSource !== "neon") {
      console.error("[leads] durable store unavailable");
      if (env.vercelEnv === "production") {
        return { ok: false as const, error: "지금은 접수를 저장할 수 없습니다. 잠시 후 다시 시도해 주세요." };
      }
      return { ok: false as const, error: "테스트 환경입니다. 접수는 저장되지 않았고 접수번호는 발급되지 않습니다." };
    }
    const visit = await checkVisit(data.visit_date, data.visit_slot);
    let visitSaved = false;
    async function saveVisit(db: Sql): Promise<boolean> {
      if (!visit) return false;
      try {
        await db`
          update leads set visit_date = ${visit.date}, visit_slot = ${visit.slot}, visit_updated_at = now()
          where site_id = ${SITE} and phone = ${phone}
        `;
        return true;
      } catch {
        console.error("[leads] visit save failed");
        return false;
      }
    }
    let sql;
    let receipt = "";
    try {
      sql = await getSql();
      const existing = await sql<{ receipt_no: string }>`
        select receipt_no from leads where site_id = ${SITE} and phone = ${phone} limit 1
      `;
      if (existing[0]) {
        // R21: 같은 번호 재접수 시 등록 상품만 최신 값으로 갱신(나머지 항목·접수번호 불변)
        if (data.product) await sql`update leads set product = ${data.product} where site_id = ${SITE} and phone = ${phone}`;
        visitSaved = await saveVisit(sql);
        return {
          ok: true as const,
          duplicate: true,
          receiptNo: existing[0].receipt_no,
          notifyStatus: "skipped_duplicate",
          visitSaved,
        };
      }
      receipt = receiptNo();
      for (let i = 0; i < 4; i++) {
        const clash = await sql<{ id: number }>`select id from leads where receipt_no = ${receipt} limit 1`;
        if (!clash[0]) break;
        receipt = receiptNo();
      }
      const entry = entryPath(data.entry);
      await sql`
        insert into leads (site_id, receipt_no, name, phone, birth6, sido, sigungu, dong, entry_path, notify_status, product)
        values (${SITE}, ${receipt}, ${data.name}, ${phone}, ${data.birth6}, ${data.sido}, ${data.sigungu}, ${data.dong}, ${entry}, 'pending', ${data.product ?? null})
      `;
      visitSaved = await saveVisit(sql);
    } catch {
      console.error("[leads] save failed");
      return { ok: false as const, error: "저장하지 못했습니다. 잠시 후 다시 시도해 주세요." };
    }
    let notifyStatus: "accepted" | "failed" | "not_configured" = "failed";
    try {
      const createdAt = new Date().toISOString();
      const alert = await sendStaffAlert({ receiptNo: receipt, createdAt, name: data.name, phone, product: data.product, visit: visitSaved && visit ? visit.label : null });
      notifyStatus = alert.status;
      try {
        await sql`
          update leads
          set notify_status = ${alert.status}, notify_detail = ${alert.detail}, notify_at = now()
          where site_id = ${SITE} and receipt_no = ${receipt}
        `;
      } catch {
        console.error("[leads] notify status update failed", receipt);
      }
    } catch {
      console.error("[leads] notify failed after save", receipt);
      try {
        await sql`
          update leads
          set notify_status = 'failed', notify_detail = 'notify exception', notify_at = now()
          where site_id = ${SITE} and receipt_no = ${receipt}
        `;
      } catch {
        console.error("[leads] notify status update failed", receipt);
      }
    }
    return { ok: true as const, duplicate: false, receiptNo: receipt, notifyStatus, visitSaved };
}
