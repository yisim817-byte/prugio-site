import { recordFunnel } from "@/lib/funnel.functions";

const once = new Set<string>();

export function trackFunnel(name: "page_view" | "phone_click" | "form_start" | "form_complete", form: "" | "register" | "visit" = "") {
  if (typeof window === "undefined") return;
  const path = `${window.location.pathname}${window.location.search}`.slice(0, 120);
  if (name === "page_view" || name === "form_start") {
    const key = `${name}|${form}|${path}`;
    if (once.has(key)) return;
    once.add(key);
  }
  void recordFunnel({ data: { name, form, path } }).catch(() => {});
}
