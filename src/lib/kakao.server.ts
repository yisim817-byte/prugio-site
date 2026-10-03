import { SITE_ID } from "@/data/content";
import { missingSmsEnv, sendSms } from "@/lib/sms.server";

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

export type AlertChannel = "kakao" | "sms";

export function missingKakaoEnv(): string[] {
  const need = ["KAKAO_ALIMTALK_ENDPOINT", "KAKAO_ALIMTALK_AUTHORIZATION", "KAKAO_TEMPLATE_CODE"];
  return need.filter((key) => !process.env[key]?.trim());
}

// The only recipient is this Vercel project's server env. No DB row, admin form or source default can redirect it.
export function staffRecipient(): string | null {
  const phone = process.env.KAKAO_ALERT_RECIPIENT?.replace(/\D/g, "") ?? "";
  return /^010\d{8}$/.test(phone) ? phone : null;
}

// Alimtalk when its three values exist, otherwise a text message when SOLAPI is set up.
export function alertChannel(): AlertChannel | null {
  if (!missingKakaoEnv().length) return "kakao";
  if (!missingSmsEnv().length) return "sms";
  return null;
}

export function alertSetup() {
  return {
    recipient: staffRecipient() !== null,
    channel: alertChannel(),
    missingKakao: missingKakaoEnv(),
    missingSms: missingSmsEnv(),
  };
}

export async function sendStaffAlert(input: AlertInput): Promise<AlertResult> {
  const recipient = staffRecipient();
  if (!recipient) return { status: "not_configured", detail: "missing KAKAO_ALERT_RECIPIENT" };
  const channel = alertChannel();
  if (!channel) {
    return {
      status: "not_configured",
      detail: `missing kakao(${missingKakaoEnv().join(",")}) and sms(${missingSmsEnv().join(",")})`,
    };
  }
  const text = [
    "[청라 아크원 푸르지오 직원배포]",
    `접수번호 ${input.receiptNo}`,
    input.createdAt,
    `${input.name} / ${input.phone}`,
    `상세 ${SITE_HOST}/admin?receipt=${encodeURIComponent(input.receiptNo)}`,
  ].join("\n");
  if (channel === "sms") {
    const sms = await sendSms(recipient, text);
    return { status: sms.ok ? "accepted" : "failed", detail: sms.detail };
  }
  const endpoint = process.env.KAKAO_ALIMTALK_ENDPOINT!.trim();
  const authorization = process.env.KAKAO_ALIMTALK_AUTHORIZATION!.trim();
  const template = process.env.KAKAO_TEMPLATE_CODE!.trim();
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
