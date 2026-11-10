import { createFileRoute } from "@tanstack/react-router";
import { Shell, pageHead } from "@/components/layout";
import { OtPopups } from "@/components/ot-official";
import { RoleHome } from "@/components/role";

export const Route = createFileRoute("/")({
  head: () => pageHead("청라 아크원 푸르지오", "/"),
  component: Home,
});

/** 홈 화면. 사이트마다 다른 내용은 src/data/role.ts 에서 온다. */
function Home() {
  return (
    <Shell>
      {/* 2026-11-10 PM 지시: 첫 화면 팝업은 공식 오피스텔·상업시설 팝업 2장만. 기존 팝업(event-popup.tsx)은 파일을 두고 렌더만 끈다. */}
      <OtPopups />
      <RoleHome />
    </Shell>
  );
}
