import { SITE_ID } from "@/data/content";
import { missingSmsEnv, sendSms } from "@/lib/sms.server";

const SITE_HOST = "https://xn--2w2b25ugxct7o.site";
const SITE_LABEL = "청라 아크원 푸르지오";
const TELEGRAM_API = "https://api.telegram.org";

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

export type AlertChannel = "telegram" | "kakao" | "sms";

export function missingKakaoEnv(): string[] {
  const need = ["KAKAO_ALIMTALK_ENDPOINT", "KAKAO_ALIMTALK_AUTHORIZATION", "KAKAO_TEMPLATE_CODE"];
  return need.filter((key) => !process.env[key]?.trim());
}

// Free channel: a Telegram bot chat. Both values live only in this Vercel
// project's Sensitive env. The message carries no customer name or phone.
export function missingTelegramEnv(): string[] {
  const need = ["TELEGRAM_BOT_TOKEN", "TELEGRAM_CHAT_ID"];
  return need.filter((key) => !process.env[key]?.trim());
}

function phoneChannel(): "kakao" | "sms" | null {
  if (!missingKakaoEnv().length) return "kakao";
  if (!missingSmsEnv().length) return "sms";
  return null;
}

// The only recipient is this Vercel project's server env. No DB row, admin form or source default can redirect it.
export function staffRecipient(): string | null {
  const phone = process.env.KAKAO_ALERT_RECIPIENT?.replace(/\D/g, "") ?? "";
  return /^010\d{8}$/.test(phone) ? phone : null;
}

// Telegram (free) first; then Alimtalk when its three values exist, otherwise a
// text message when SOLAPI is set up.
export function alertChannel(): AlertChannel | null {
  if (!missingTelegramEnv().length) return "telegram";
  return phoneChannel();
}

export function alertSetup() {
  return {
    recipient: staffRecipient() !== null,
    channel: alertChannel(),
    telegram: missingTelegramEnv().length === 0,
    missingTelegram: missingTelegramEnv(),
    missingKakao: missingKakaoEnv(),
    missingSms: missingSmsEnv(),
  };
}

export function telegramText(input: Pick<AlertInput, "receiptNo" | "createdAt">): string {
  return [
    `[${SITE_LABEL}] 새 관심고객 접수`,
    `접수번호 ${input.receiptNo}`,
    input.createdAt,
    `관리화면 ${SITE_HOST}/admin?receipt=${encodeURIComponent(input.receiptNo)}`,
  ].join("\n");
}

async function sendTelegram(input: AlertInput): Promise<AlertResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN!.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID!.trim();
  // TELEGRAM_API_BASE is a local-test hook only; production always uses Telegram.
  const override = process.env.NODE_ENV !== "production" ? process.env.TELEGRAM_API_BASE?.trim() : "";
  const base = (override || TELEGRAM_API).replace(/\/+$/, "");
  try {
    const res = await fetch(`${base}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: telegramText(input), disable_web_page_preview: true }),
      signal: AbortSignal.timeout(8000),
    });
    const body = (await res.json().catch(() => null)) as { ok?: boolean } | null;
    if (!res.ok || !body?.ok) return { status: "failed", detail: `telegram http ${res.status}` };
    return { status: "accepted", detail: "telegram api accepted; handset not verified" };
  } catch {
    return { status: "failed", detail: "telegram network" };
  }
}

export async function sendStaffAlert(input: AlertInput): Promise<AlertResult> {
  let telegramDetail = "";
  if (!missingTelegramEnv().length) {
    const tg = await sendTelegram(input);
    if (tg.status === "accepted") return tg;
    telegramDetail = `${tg.detail}; `;
  }
  const recipient = staffRecipient();
  const channel = phoneChannel();
  if (!recipient || !channel) {
    if (telegramDetail) return { status: "failed", detail: telegramDetail.replace(/; $/, "") };
    if (!recipient) return { status: "not_configured", detail: "missing KAKAO_ALERT_RECIPIENT" };
    return {
      status: "not_configured",
      detail: `missing telegram(${missingTelegramEnv().join(",")}), kakao(${missingKakaoEnv().join(",")}) and sms(${missingSmsEnv().join(",")})`,
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
    return { status: sms.ok ? "accepted" : "failed", detail: `${telegramDetail}${sms.detail}` };
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
    if (!res.ok) return { status: "failed", detail: `${telegramDetail}http ${res.status}` };
    return { status: "accepted", detail: `${telegramDetail}api accepted; handset not verified` };
  } catch {
    return { status: "failed", detail: `${telegramDetail}network` };
  }
}
