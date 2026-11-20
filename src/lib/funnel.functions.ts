import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { SITE_ID } from "@/data/content";
import { dbSource, getSql } from "@/lib/db";

const NAMES = ["page_view", "phone_click", "form_start", "form_complete"] as const;

const eventSchema = z.object({
  name: z.enum(NAMES),
  form: z.enum(["", "register", "visit"]).optional(),
  path: z.string().trim().max(120).optional(),
});

export const recordFunnel = createServerFn({ method: "POST" })
  .validator((raw: unknown) => eventSchema.parse(raw))
  .handler(async ({ data }) => {
    if (process.env.VERCEL_ENV === "preview") return { ok: false as const, stored: false as const };
    if (dbSource !== "neon") return { ok: false as const, stored: false as const };
    const path = (data.path && data.path.startsWith("/") && !data.path.includes("://") ? data.path : "/").slice(0, 120);
    try {
      const sql = await getSql();
      await sql`
        insert into funnel_events (site_id, name, form, path)
        values (${SITE_ID}, ${data.name}, ${data.form ?? ""}, ${path})
      `;
      return { ok: true as const, stored: true as const };
    } catch (error) {
      console.error("[funnel] save failed", error instanceof Error ? error.message : "error");
      return { ok: false as const, stored: false as const };
    }
  });
