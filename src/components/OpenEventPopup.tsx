import { useEffect } from "react";
import { EVENT_DAYS } from "@/lib/open-event";
import { PROJECT_PHONE_DISPLAY, PROJECT_PHONE_TEL } from "@/data/content";

// 작업지시서 14: 3번째 팝업 자리. 방문예약 팝업 파일은 남기고 여기서는 띄우지 않는다.
export function OpenEventPopup() {
  useEffect(() => {
    const w = window as Window & {
      ARKONE_EVENT_POP?: Record<string, unknown>;
      ArkoneOpenEvent?: { start: () => void };
    };
    w.ARKONE_EVENT_POP = {
      phone: PROJECT_PHONE_DISPLAY,
      tel: PROJECT_PHONE_TEL,
      days: [...EVENT_DAYS],
      cards: [".prereg-pop__panel", ".costco-pop__panel"],
      delay: 2600,
      z: 1102,
      register: "/register",
      visit: "/visit",
      event: "/event",
    };
    const id = "arkone-event-pop-js";
    if (document.getElementById(id)) {
      w.ArkoneOpenEvent?.start();
      return;
    }
    const s = document.createElement("script");
    s.id = id;
    s.src = "/event-pop.js";
    document.body.appendChild(s);
  }, []);
  return null;
}
