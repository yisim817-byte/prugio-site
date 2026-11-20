import { z } from "zod";

/** Product and six birth digits are required; the new registration form makes address optional. */
export const leadSchema = z.object({
  mode: z.enum(["full", "prereg"]).default("full"),
  product: z.enum(["apt", "officetel", "commercial"]),
  name: z.string().trim().min(2).max(20),
  phone: z.string().trim(),
  birth6: z.string().trim().refine(validBirth, "생년월일은 앞 6자리(YYMMDD)만 입력합니다."),
  sido: z.string().trim().max(20).default(""),
  sigungu: z.string().trim().max(20).default(""),
  dong: z.string().trim().max(20).default(""),
  consent: z.literal(true),
  age14: z.literal(true).optional(),
  entry: z.string().trim().max(80).optional(),
  visit_date: z.string().trim().max(10).optional(),
  visit_slot: z.string().trim().max(3).optional(),
}).superRefine((data, ctx) => {
  if (data.mode === "prereg" && data.age14 !== true) ctx.addIssue({ code: "custom", path: ["age14"], message: "만 14세 이상만 등록할 수 있습니다." });
  if (data.mode === "full" && (data.sido.length < 2 || data.sigungu.length < 2 || data.dong.length < 1)) ctx.addIssue({ code: "custom", path: ["sido"], message: "주소를 확인해 주세요." });
});
export type LeadInput = z.infer<typeof leadSchema>;
export function validBirth(value: string) {
  if (!/^\d{6}$/.test(value)) return false;
  const month = Number(value.slice(2, 4));
  const day = Number(value.slice(4, 6));
  return month >= 1 && month <= 12 && day >= 1 && day <= 31;
}
