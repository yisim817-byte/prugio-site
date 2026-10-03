import { getSql } from "@/lib/db";
import { SITE_ID } from "@/data/content";

const SITE_HOST = "https://xn--2w2b25ugxct7o.site";

export type AlertInput = {
  receiptNo: string;
  createdAt: string;
  name: string;
  phone: string;
};

export type AlertResult = {
  status: "accepted" | "failed" | "not_configured";
  detail: string;
};

export function missingKakaoEnv(): string[] {
  const need = ["KAKAO_ALIMTALK_ENDPOINT", "KAKAO_ALIMTALK_AUTHORIZATION", "KAKAO_TEMPLATE_CODE"];
  return need.filter((key) => !process.env[key]?.trim());
}

export async function staffRecipient(): Promise<string | null> {
  const sql = await getSql();
  const rows = await sql<{ phone: string }>`
    select phone from notify_settings where site_id = ${SITE_ID} limit 1
  `;
  const phone = rows[0]?.phone?.replace(/\D/g, "");
  return phone && phone.length >= 10 ? phone : null;
}

export async function sendStaffAlert(input: AlertInput): Promise<AlertResult> {
  const missing = missingKakaoEnv();
  if (missing.length) {
    return { status: "not_configured", detail: `missing ${missing.join(",")}` };
  }
  let recipient: string | null;
  try {
    recipient = await staffRecipient();
  } catch {
    return { status: "failed", detail: "notify exception" };
  }
  if (!recipient) {
    return { status: "not_configured", detail: "no site recipient" };
  }
  const endpoint = process.env.KAKAO_ALIMTALK_ENDPOINT!.trim();
  const authorization = process.env.KAKAO_ALIMTALK_AUTHORIZATION!.trim();
  const template = process.env.KAKAO_TEMPLATE_CODE!.trim();
  const text = [
    "[청라 아크원 푸르지오 직원배포]",
    `접수번호 ${input.receiptNo}`,
    input.createdAt,
    `${input.name} / ${input.phone}`,
    `상세 ${SITE_HOST}/admin?receipt=${encodeURIComponent(input.receiptNo)}`,
  ].join("\n");
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        authorization: `Bearer ${authorization}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        templateCode: template,
        recipient,
        siteId: SITE_ID,
        text,
      }),
    });
    if (!res.ok) return { status: "failed", detail: `http ${res.status}` };
    return { status: "accepted", detail: "api accepted; handset not verified" };
  } catch {
    return { status: "failed", detail: "network" };
  }
}
