/**
 * Staff login rules shared by the login form (browser) and server functions.
 *
 * Accounts are issued by the operator only (public sign-up is off). A login id
 * such as `arkone1` maps to a synthetic email under a reserved `.invalid`
 * domain, because Better Auth's email/password sign-in keys users by email.
 * The email is never shown or used to send mail.
 */
export const LOGIN_EMAIL_DOMAIN = "login.invalid";

/** Lowercase letter first, then letters/digits, 3–20 chars. */
export const LOGIN_ID_PATTERN = /^[a-z][a-z0-9]{2,19}$/;

export const PASSWORD_MIN = 10;
export const PASSWORD_MAX = 128;

export function normalizeLoginId(value: string): string {
  return value.trim().toLowerCase();
}

export function loginEmail(loginId: string): string {
  return `${normalizeLoginId(loginId)}@${LOGIN_EMAIL_DOMAIN}`;
}

/** Returns a Korean error message, or null when the new password is acceptable. */
export function passwordProblem(next: string, loginId?: string): string | null {
  if (next.length < PASSWORD_MIN) return `비밀번호는 ${PASSWORD_MIN}자 이상입니다.`;
  if (next.length > PASSWORD_MAX) return `비밀번호는 ${PASSWORD_MAX}자 이하입니다.`;
  if (!/[A-Za-z]/.test(next) || !/\d/.test(next)) return "영문과 숫자를 모두 넣어 주세요.";
  if (loginId && next.toLowerCase().includes(normalizeLoginId(loginId))) {
    return "비밀번호에 아이디를 넣을 수 없습니다.";
  }
  return null;
}
