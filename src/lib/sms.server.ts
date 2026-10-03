import { createHmac, randomBytes } from "node:crypto";

// SOLAPI text message (SMS/LMS picked by length). Signature per the official SDK:
// HMAC-SHA256 of date + salt with the API secret, hex encoded.
const SOLAPI_SEND = "https://api.solapi.com/messages/v4/send-many/detail";

export const SMS_ENV = ["SOLAPI_API_KEY", "SOLAPI_API_SECRET", "SMS_SENDER"];

export type SmsResult = { ok: boolean; detail: string };

/** Pre-registered sender number, digits only, or null when unusable. */
export function smsSender(): string | null {
  const sender = process.env.SMS_SENDER?.replace(/\D/g, "") ?? "";
  return /^0\d{7,10}$/.test(sender) || /^1\d{7}$/.test(sender) ? sender : null;
}

export function missingSmsEnv(): string[] {
  const missing = SMS_ENV.filter((key) => !process.env[key]?.trim());
  if (!missing.includes("SMS_SENDER") && !smsSender()) missing.push("SMS_SENDER");
  return missing;
}

function authorization(apiKey: string, apiSecret: string) {
  const date = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
  const salt = randomBytes(16).toString("hex");
  const signature = createHmac("sha256", apiSecret).update(date + salt).digest("hex");
  return `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`;
}

export async function sendSms(to: string, text: string): Promise<SmsResult> {
  const apiKey = process.env.SOLAPI_API_KEY!.trim();
  const apiSecret = process.env.SOLAPI_API_SECRET!.trim();
  const from = smsSender()!;
  try {
    const res = await fetch(SOLAPI_SEND, {
      method: "POST",
      headers: {
        authorization: authorization(apiKey, apiSecret),
        "content-type": "application/json",
      },
      body: JSON.stringify({ messages: [{ to, from, text }] }),
    });
    if (!res.ok) return { ok: false, detail: `sms http ${res.status}` };
    const body = (await res.json().catch(() => null)) as { failedMessageList?: { statusCode?: unknown }[] } | null;
    const failed = body?.failedMessageList ?? [];
    if (failed.length) {
      const code = String(failed[0]?.statusCode ?? "").replace(/[^\w-]/g, "").slice(0, 12);
      return { ok: false, detail: `sms rejected ${code}`.trim() };
    }
    return { ok: true, detail: "sms api accepted; handset not verified" };
  } catch {
    return { ok: false, detail: "sms network" };
  }
}
