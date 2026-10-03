/**
 * Local email/password sign-in (this app's Better Auth DB — not the broker).
 *
 * ON (2026-10-03): operator-issued id/password logins for the admin screen.
 * Public sign-up stays disabled in `server.ts` (`disableSignUp`); accounts are
 * created only by `scripts/seed-admins.mjs` and the owner reset in /admin.

 */
export const emailAndPasswordEnabled = true;
