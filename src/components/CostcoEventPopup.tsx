import { useEffect, useState, type ComponentType } from "react";
import { PROJECT_PHONE_DISPLAY, PROJECT_PHONE_TEL } from "@/data/content";

type CostcoWindow = Window & { __arkoneCostcoPhone?: string; __arkoneCostcoTel?: string };

export function CostcoEventPopup() {
  const [View, setView] = useState<ComponentType | null>(null);
  useEffect(() => {
    const w = window as CostcoWindow;
    w.__arkoneCostcoPhone = PROJECT_PHONE_DISPLAY;
    w.__arkoneCostcoTel = PROJECT_PHONE_TEL;
    let live = true;
    import("./CostcoEventPopupView").then((mod) => {
      if (live) setView(() => mod.CostcoEventPopupView);
    });
    return () => { live = false; };
  }, []);
  return View ? <View /> : null;
}
