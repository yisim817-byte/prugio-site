#!/usr/bin/env node
/**
 * Deploy-time account seeding (runs in `npm run build`, right after migrate).
 *
 * Reads ADMIN_ACCOUNTS — a Sensitive, Production-only Vercel variable holding a
 * JSON array of { id, role, hash } where `hash` is a Better Auth password hash
 * (never a plain password). For each entry it creates the login if it does not
 * exist yet, with must_change_password = true. Existing logins are NEVER
 * changed, so passwords people have already changed survive every redeploy.
 *
 * Output names ids and counts only — never hashes, emails of customers, or
 * connection strings.
 */
import { readFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";

const LOGIN_EMAIL_DOMAIN = "login.invalid";
const ID_PATTERN = /^[a-z][a-z0-9]{2,19}$/;
const HASH_PATTERN = /^[0-9a-f]{32}:[0-9a-f]{128}$/;
const ROLES = new Set(["owner", "staff"]);

export function parseAccounts(raw) {
  let list;
  try {
    list = JSON.parse(raw);
  } catch {
    throw new Error("ADMIN_ACCOUNTS is not valid JSON");
  }
  if (!Array.isArray(list) || list.length === 0) throw new Error("ADMIN_ACCOUNTS must be a non-empty array");
  const seen = new Set();
  return list.map((entry, index) => {
    const id = typeof entry?.id === "string" ? entry.id.trim().toLowerCase() : "";
    const role = entry?.role;
    const hash = entry?.hash;
    if (!ID_PATTERN.test(id)) throw new Error(`ADMIN_ACCOUNTS[${index}].id is invalid`);
    if (!ROLES.has(role)) throw new Error(`ADMIN_ACCOUNTS[${index}].role must be owner or staff`);
    if (typeof hash !== "string" || !HASH_PATTERN.test(hash)) {
      throw new Error(`ADMIN_ACCOUNTS[${index}].hash is not a password hash`);
    }
    if (seen.has(id)) throw new Error(`ADMIN_ACCOUNTS has duplicate id ${id}`);
    seen.add(id);
    return { id, role, hash };
  });
}

export async function readSiteId(root) {
  const text = await readFile(join(root, "src", "data", "content.ts"), "utf8");
  const match = text.match(/export const SITE_ID = "([^"]+)"/);
  if (!match) throw new Error("SITE_ID not found in src/data/content.ts");
  return match[1];
}

function newId() {
  return randomBytes(16).toString("hex");
}

/** Create missing logins. `client` is a connected pg client. Returns per-id results. */
export async function seedAccounts(client, siteId, accounts) {
  const results = [];
  await client.query("BEGIN");
  try {
    for (const { id, role, hash } of accounts) {
      const email = `${id}@${LOGIN_EMAIL_DOMAIN}`;
      const existing = await client.query('select "id" from "user" where "email" = $1', [email]);
      if (existing.rows[0]) {
        const userId = existing.rows[0].id;
        // Re-attach a missing site row (e.g. a manual fix), but never touch the password.
        const attached = await client.query(
          `insert into site_admins (site_id, user_id, role, login_id, must_change_password)
           values ($1, $2, $3, $4, true)
           on conflict (site_id, user_id) do nothing`,
          [siteId, userId, role, id],
        );
        results.push({ id, role, action: attached.rowCount ? "attached" : "exists" });
        continue;
      }
      const userId = newId();
      await client.query(
        `insert into "user" ("id", "name", "email", "emailVerified", "createdAt", "updatedAt")
         values ($1, $2, $3, true, now(), now())`,
        [userId, id, email],
      );
      await client.query(
        `insert into "account" ("id", "accountId", "providerId", "userId", "password", "createdAt", "updatedAt")
         values ($1, $2, 'credential', $2, $3, now(), now())`,
        [newId(), userId, hash],
      );
      await client.query(
        `insert into site_admins (site_id, user_id, role, login_id, must_change_password)
         values ($1, $2, $3, $4, true)`,
        [siteId, userId, role, id],
      );
      results.push({ id, role, action: "created" });
    }
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    throw err;
  }
  return results;
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.log("[seed] DATABASE_URL not set — skipping.");
    return;
  }
  const raw = process.env.ADMIN_ACCOUNTS?.trim();
  if (!raw) {
    console.log("[seed] ADMIN_ACCOUNTS not set — skipping.");
    return;
  }
  const accounts = parseAccounts(raw);
  const root = join(dirname(fileURLToPath(import.meta.url)), "..");
  const siteId = await readSiteId(root);
  const pool = new pg.Pool({ connectionString: databaseUrl, max: 1 });
  const client = await pool.connect();
  try {
    const results = await seedAccounts(client, siteId, accounts);
    for (const r of results) console.log(`[seed] ${r.action} ${r.id} (${r.role})`);
    const legacy = await client.query(
      "select count(*)::int as n from site_admins where site_id = $1 and login_id is null",
      [siteId],
    );
    console.log(`[seed] legacy admin rows without login id (no access): ${legacy.rows[0].n}`);
  } finally {
    client.release();
    await pool.end();
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((err) => {
    console.error(`[seed] failed: ${err.message}`);
    process.exit(1);
  });
}
