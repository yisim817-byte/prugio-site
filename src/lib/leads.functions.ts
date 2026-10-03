import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql, dbSource } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { SITE_ID } from "@/data/content";

const SITE = SITE_ID;

const leadSchema = z.object({
  name: z.string().trim().min(2).max(20),
  phone: z.string().trim(),
  birth6: z.string().trim(),
  sido: z.string().trim().min(2).max(20),
  sigungu: z.string().trim().min(2).max(20),
  dong: z.string().trim().min(1).max(20),
  consent: z.literal(true),
  entry: z.string().trim().max(80).optional(),
});

function digits(value: string) {
  return value.replace(/\D/g, "");
}

function validPhone(value: string) {
  return /^010\d{8}$/.test(value);
}

function validBirth(value: string) {
  if (!/^\d{6}$/.test(value)) return false;
  const month = Number(value.slice(2, 4));
  const day = Number(value.slice(4, 6));
  return month >= 1 && month <= 12 && day >= 1 && day <= 31;
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

async function roleOf(userId: string) {
  const sql = await getSql();
  const rows = await sql<{ role: string }>`
    select role from site_admins where site_id = ${SITE} and user_id = ${userId} limit 1
  `;
  return rows[0]?.role ?? null;
}

export const submitLead = createServerFn({ method: "POST" })
  .validator((raw: unknown) => leadSchema.parse(raw))
  .handler(async ({ data }) => {
    const phone = digits(data.phone);
    if (!validPhone(phone)) return { ok: false as const, error: "휴대전화는 010으로 시작하는 11자리입니다." };
    if (!validBirth(data.birth6)) return { ok: false as const, error: "생년월일은 앞 6자리(YYMMDD)만 입력합니다." };
    if (dbSource !== "neon") {
      console.error("[leads] durable store unavailable");
      if (process.env.VERCEL_ENV === "production") {
        return { ok: false as const, error: "지금은 접수를 저장할 수 없습니다. 잠시 후 다시 시도해 주세요." };
      }
      return { ok: false as const, error: "테스트 환경입니다. 접수는 저장되지 않았고 접수번호는 발급되지 않습니다." };
    }
    try {
    const sql = await getSql();
    const existing = await sql<{ receipt_no: string }>`
      select receipt_no from leads where site_id = ${SITE} and phone = ${phone} limit 1
    `;
    if (existing[0]) {
      return {
        ok: true as const,
        duplicate: true,
        receiptNo: existing[0].receipt_no,
        notifyStatus: "skipped_duplicate",
      };
    }
    let receipt = receiptNo();
    for (let i = 0; i < 4; i++) {
      const clash = await sql<{ id: number }>`select id from leads where receipt_no = ${receipt} limit 1`;
      if (!clash[0]) break;
      receipt = receiptNo();
    }
    const entry = entryPath(data.entry);
    await sql`
      insert into leads (site_id, receipt_no, name, phone, birth6, sido, sigungu, dong, entry_path, notify_status)
      values (${SITE}, ${receipt}, ${data.name}, ${phone}, ${data.birth6}, ${data.sido}, ${data.sigungu}, ${data.dong}, ${entry}, 'pending')
    `;
    const { sendStaffAlert } = await import("./kakao.server");
    const createdAt = new Date().toISOString();
    const alert = await sendStaffAlert({ receiptNo: receipt, createdAt, name: data.name, phone });
    await sql`
      update leads
      set notify_status = ${alert.status}, notify_detail = ${alert.detail}, notify_at = now()
      where site_id = ${SITE} and receipt_no = ${receipt}
    `;
    return { ok: true as const, duplicate: false, receiptNo: receipt, notifyStatus: alert.status };
    } catch {
      console.error("[leads] save failed");
      return { ok: false as const, error: "저장하지 못했습니다. 잠시 후 다시 시도해 주세요." };
    }
  });

export const bootstrapOwner = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await sql`
      insert into site_admins (site_id, user_id, role)
      select ${SITE}, ${context.userId}, 'owner'
      where not exists (select 1 from site_admins where site_id = ${SITE})
    `;
    const role = await roleOf(context.userId);
    return { role };
  });

export const adminSnapshot = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const role = await roleOf(context.userId);
    if (!role) return { ok: false as const, error: "forbidden" as const };
    const sql = await getSql();
    const settings = await sql<{ phone: string }>`
      select phone from notify_settings where site_id = ${SITE} limit 1
    `;
    const leads = await sql<{
      receipt_no: string;
      name: string;
      phone: string;
      birth6: string;
      sido: string;
      sigungu: string;
      dong: string;
      created_at: string;
      entry_path: string;
      notify_status: string;
      notify_detail: string | null;
    }>`
      select receipt_no, name, phone, birth6, sido, sigungu, dong,
             created_at::text as created_at, entry_path, notify_status, notify_detail
      from leads
      where site_id = ${SITE}
      order by id desc
      limit 200
    `;
    const { missingKakaoEnv } = await import("./kakao.server");
    const log = role === "owner"
      ? await sql<{ old_phone: string | null; new_phone: string; actor_id: string; created_at: string }>`
          select old_phone, new_phone, actor_id, created_at::text as created_at
          from notify_recipient_log
          where site_id = ${SITE}
          order by id desc
          limit 20
        `
      : [];
    return {
      ok: true as const,
      role,
      notifyPhone: settings[0]?.phone ?? "",
      missingKakao: missingKakaoEnv(),
      leads,
      recipientLog: log,
    };
  });

const phoneSchema = z.object({ phone: z.string() });

export const updateNotifyPhone = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((raw: unknown) => phoneSchema.parse(raw))
  .handler(async ({ context, data }) => {
    const role = await roleOf(context.userId);
    if (role !== "owner") return { ok: false as const, error: "운영자만 수신번호를 바꿉니다." };
    const phone = digits(data.phone);
    if (!validPhone(phone)) return { ok: false as const, error: "010으로 시작하는 11자리만 가능합니다." };
    const sql = await getSql();
    const prev = await sql<{ phone: string }>`select phone from notify_settings where site_id = ${SITE}`;
    await sql`
      insert into notify_recipient_log (site_id, old_phone, new_phone, actor_id)
      values (${SITE}, ${prev[0]?.phone ?? null}, ${phone}, ${context.userId})
    `;
    await sql`
      insert into notify_settings (site_id, phone, updated_at, updated_by)
      values (${SITE}, ${phone}, now(), ${context.userId})
      on conflict (site_id) do update
      set phone = excluded.phone, updated_at = now(), updated_by = excluded.updated_by
    `;
    return { ok: true as const, phone };
  });

const receiptSchema = z.object({ receiptNo: z.string().trim().min(4).max(40) });

export const retryNotify = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((raw: unknown) => receiptSchema.parse(raw))
  .handler(async ({ context, data }) => {
    const role = await roleOf(context.userId);
    if (!role) return { ok: false as const, error: "forbidden" };
    const sql = await getSql();
    const rows = await sql<{
      receipt_no: string;
      name: string;
      phone: string;
      created_at: string;
      notify_status: string;
    }>`
      select receipt_no, name, phone, created_at::text as created_at, notify_status
      from leads
      where site_id = ${SITE} and receipt_no = ${data.receiptNo}
      limit 1
    `;
    const lead = rows[0];
    if (!lead) return { ok: false as const, error: "없는 접수입니다." };
    if (lead.notify_status === "accepted") return { ok: false as const, error: "이미 API 접수된 알림은 다시 보내지 않습니다." };
    const { sendStaffAlert } = await import("./kakao.server");
    const alert = await sendStaffAlert({
      receiptNo: lead.receipt_no,
      createdAt: lead.created_at,
      name: lead.name,
      phone: lead.phone,
    });
    await sql`
      update leads
      set notify_status = ${alert.status}, notify_detail = ${alert.detail}, notify_at = now()
      where site_id = ${SITE} and receipt_no = ${lead.receipt_no} and notify_status <> 'accepted'
    `;
    return { ok: true as const, notifyStatus: alert.status, detail: alert.detail };
  });

export const deleteLead = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((raw: unknown) => receiptSchema.parse(raw))
  .handler(async ({ context, data }) => {
    const role = await roleOf(context.userId);
    if (role !== "owner") return { ok: false as const, error: "운영자만 삭제합니다." };
    const sql = await getSql();
    await sql`delete from leads where site_id = ${SITE} and receipt_no = ${data.receiptNo}`;
    return { ok: true as const };
  });
