import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql, dbSource } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { SITE_ID } from "@/data/content";
import { LOGIN_ID_PATTERN, PASSWORD_MAX, passwordProblem } from "@/lib/staff-login";

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

type Access = { role: "owner" | "staff"; loginId: string; mustChange: boolean };

// Only operator-issued logins (login_id set) open the admin screen. Rows left by
// the retired first-sign-in bootstrap have no login_id and grant nothing.
async function accessOf(userId: string): Promise<Access | null> {
  const sql = await getSql();
  const rows = await sql<{ role: string; login_id: string; must_change_password: boolean }>`
    select role, login_id, must_change_password
    from site_admins
    where site_id = ${SITE} and user_id = ${userId} and login_id is not null
    limit 1
  `;
  const row = rows[0];
  if (!row || (row.role !== "owner" && row.role !== "staff")) return null;
  return { role: row.role, loginId: row.login_id, mustChange: Boolean(row.must_change_password) };
}

/** Access that may see leads: a valid login whose temporary password was replaced. */
async function readyAccess(userId: string): Promise<Access | null> {
  const access = await accessOf(userId);
  return access && !access.mustChange ? access : null;
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
    let sql;
    let receipt = "";
    try {
      sql = await getSql();
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
      receipt = receiptNo();
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
    } catch {
      console.error("[leads] save failed");
      return { ok: false as const, error: "저장하지 못했습니다. 잠시 후 다시 시도해 주세요." };
    }
    let notifyStatus: "accepted" | "failed" | "not_configured" = "failed";
    try {
      const { sendStaffAlert } = await import("./kakao.server");
      const createdAt = new Date().toISOString();
      const alert = await sendStaffAlert({ receiptNo: receipt, createdAt, name: data.name, phone });
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
    return { ok: true as const, duplicate: false, receiptNo: receipt, notifyStatus };
  });

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(PASSWORD_MAX),
  newPassword: z.string().min(1).max(PASSWORD_MAX),
});

// Replace the signed-in user's own password (also clears must_change_password).
// Every session of this user is revoked afterwards, so the client signs in again.
export const changeOwnPassword = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((raw: unknown) => changePasswordSchema.parse(raw))
  .handler(async ({ context, data }) => {
    const access = await accessOf(context.userId);
    if (!access) return { ok: false as const, error: "이 사이트의 관리 권한이 없습니다." };
    const problem = passwordProblem(data.newPassword, access.loginId);
    if (problem) return { ok: false as const, error: problem };
    if (data.newPassword === data.currentPassword) {
      return { ok: false as const, error: "지금 비밀번호와 다른 비밀번호를 정해 주세요." };
    }
    const sql = await getSql();
    const rows = await sql<{ password: string | null }>`
      select "password" from "account"
      where "userId" = ${context.userId} and "providerId" = 'credential'
      limit 1
    `;
    const hash = rows[0]?.password;
    const { hashPassword, verifyPassword } = await import("better-auth/crypto");
    if (!hash || !(await verifyPassword({ hash, password: data.currentPassword }))) {
      return { ok: false as const, error: "지금 비밀번호가 맞지 않습니다." };
    }
    const next = await hashPassword(data.newPassword);
    await sql`
      update "account" set "password" = ${next}, "updatedAt" = now()
      where "userId" = ${context.userId} and "providerId" = 'credential'
    `;
    await sql`
      update site_admins set must_change_password = false
      where site_id = ${SITE} and user_id = ${context.userId}
    `;
    await sql`delete from "session" where "userId" = ${context.userId}`;
    return { ok: true as const };
  });

const resetSchema = z.object({ loginId: z.string().trim().toLowerCase().regex(LOGIN_ID_PATTERN) });

function tempPassword(randomInt: (max: number) => number) {
  const letters = "abcdefghjkmnpqrstuvwxyz";
  const digits = "23456789";
  const all = letters + digits;
  for (;;) {
    let out = "";
    for (let i = 0; i < 12; i++) out += all[randomInt(all.length)];
    if (/[a-z]/.test(out) && /\d/.test(out)) return out;
  }
}

// Owner-only: give a staff login a new temporary password (shown once) and force
// a change at its next sign-in. The staff member's sessions are revoked.
export const resetStaffPassword = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((raw: unknown) => resetSchema.parse(raw))
  .handler(async ({ context, data }) => {
    const access = await readyAccess(context.userId);
    if (access?.role !== "owner") return { ok: false as const, error: "운영자만 초기화합니다." };
    const sql = await getSql();
    const targets = await sql<{ user_id: string }>`
      select user_id from site_admins
      where site_id = ${SITE} and login_id = ${data.loginId} and role = 'staff'
      limit 1
    `;
    const target = targets[0];
    if (!target) return { ok: false as const, error: "이 사이트의 직원 아이디가 아닙니다." };
    const { randomInt } = await import("node:crypto");
    const { hashPassword } = await import("better-auth/crypto");
    const temp = tempPassword((max) => randomInt(max));
    const hash = await hashPassword(temp);
    await sql`
      update "account" set "password" = ${hash}, "updatedAt" = now()
      where "userId" = ${target.user_id} and "providerId" = 'credential'
    `;
    await sql`
      update site_admins set must_change_password = true
      where site_id = ${SITE} and user_id = ${target.user_id}
    `;
    await sql`delete from "session" where "userId" = ${target.user_id}`;
    return { ok: true as const, loginId: data.loginId, tempPassword: temp };
  });

export const adminSnapshot = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const access = await accessOf(context.userId);
    if (!access) return { ok: false as const, error: "forbidden" as const };
    if (access.mustChange) {
      return { ok: false as const, error: "must_change_password" as const, loginId: access.loginId };
    }
    const sql = await getSql();
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
    const accounts =
      access.role === "owner"
        ? await sql<{ login_id: string; role: string; must_change_password: boolean }>`
            select login_id, role, must_change_password
            from site_admins
            where site_id = ${SITE} and login_id is not null
            order by role, login_id
          `
        : [];
    const { alertSetup } = await import("./kakao.server");
    return {
      ok: true as const,
      role: access.role,
      loginId: access.loginId,
      alert: alertSetup(),
      leads,
      accounts,
    };
  });

const receiptSchema = z.object({ receiptNo: z.string().trim().min(4).max(40) });

export const retryNotify = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((raw: unknown) => receiptSchema.parse(raw))
  .handler(async ({ context, data }) => {
    const access = await readyAccess(context.userId);
    if (!access) return { ok: false as const, error: "forbidden" };
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
    const access = await readyAccess(context.userId);
    if (access?.role !== "owner") return { ok: false as const, error: "운영자만 삭제합니다." };
    const sql = await getSql();
    await sql`delete from leads where site_id = ${SITE} and receipt_no = ${data.receiptNo}`;
    return { ok: true as const };
  });
