import { useEffect, useState, type ComponentType } from "react";
import { PROJECT_PHONE_DISPLAY, PROJECT_PHONE_TEL } from "@/data/content";

type VisitWindow = Window & { __arkoneVisitPhone?: string; __arkoneVisitTel?: string };

// 모델하우스 방문예약 팝업(작업지시서 9). 첫 화면을 그린 뒤에 불러온다.
export function VisitReservationPopup() {
  const [View, setView] = useState<ComponentType | null>(null);
  useEffect(() => {
    const w = window as VisitWindow;
    w.__arkoneVisitPhone = PROJECT_PHONE_DISPLAY;
    w.__arkoneVisitTel = PROJECT_PHONE_TEL;
    let live = true;
    import("./VisitReservationPopupView").then((mod) => {
      if (live) setView(() => mod.VisitReservationPopupView);
    });
    return () => { live = false; };
  }, []);
  return View ? <View /> : null;
}
